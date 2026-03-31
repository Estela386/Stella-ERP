import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

const RATE_LIMIT = 10; // peticiones max por ventana
const RATE_WINDOW_MS = 60_000; // 1 minuto
const rateMap = new Map<string, { count: number; until: number }>();

let storeSummaryCache: string | null = null;
let storeSummaryCacheAt = 0;
const STORE_SUMMARY_TTL = 30_000; // cache 30 segundos

async function buildStoreSummary(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  if (
    Date.now() - storeSummaryCacheAt < STORE_SUMMARY_TTL &&
    storeSummaryCache
  ) {
    return storeSummaryCache;
  }

  try {
    const {
      data: totalCount,
      error: totalError,
      count: total,
    } = await supabase
      .from("producto")
      .select("id", { count: "exact", head: true });

    const { data: products, error: productsError } = await supabase
      .from("producto")
      .select("nombre, stock_actual, stock_min, precio")
      .order("stock_actual", { ascending: true })
      .limit(20);

    const {
      data: outOfStock,
      error: outOfStockError,
      count: outOfStockCount,
    } = await supabase
      .from("producto")
      .select("id", { count: "exact", head: true })
      .eq("stock_actual", 0);

    const { data: lowStock, error: lowStockError } = await supabase
      .from("producto")
      .select("nombre, stock_actual, stock_min, precio")
      .lt("stock_actual", "stock_min")
      .order("stock_actual", { ascending: true })
      .limit(5);

    const { data: categories } = await supabase
      .from("categoria")
      .select("id, nombre")
      .limit(20);

    const timeout = 10000;

    const safeTotal =
      typeof total === "number" ? total : (totalCount?.length ?? 0);
    const safeOutOfStock =
      typeof outOfStockCount === "number" ? outOfStockCount : 0;
    const lowStockItems = Array.isArray(lowStock) ? lowStock : [];

    const lowStockList = lowStockItems
      .map(
        p =>
          `- ${p.nombre ?? "N/A"}: stock ${p.stock_actual ?? "?"} (mínimo ${p.stock_min ?? "?"})`
      )
      .join("\n");

    const categoryList = Array.isArray(categories)
      ? categories
          .map((c: any) => c.nombre)
          .filter(Boolean)
          .join(", ")
      : "sin categorías";

    const summary =
      `Resumen de tienda (actualizado automáticamente):\n` +
      `- Total productos: ${safeTotal}\n` +
      `- Productos sin stock: ${safeOutOfStock}\n` +
      `- Productos con stock bajo (hacia reabastecer): ${lowStockItems.length}\n` +
      `- Categorías presentes: ${categoryList}\n` +
      `- 5 productos con stock más bajo:\n${lowStockList || "  (no hay productos con stock bajo actualmente)."}
      \n\nNota: este resumen se actualiza cada ${STORE_SUMMARY_TTL / 1000} segundos para optimizar rendimiento.` +
      `\n\n Productos destacados (hasta 20, ordenados por menor stock):\n` +
      (Array.isArray(products)
        ? products
            .map(
              p =>
                `- ${p.nombre ?? "N/A"}: stock ${p.stock_actual ?? "?"}, precio $${p.precio ?? "?"}`
            )
            .join("\n")
        : "No se pudieron obtener los productos destacados.");

    storeSummaryCache = summary;
    storeSummaryCacheAt = Date.now();
    return summary;
  } catch (error) {
    console.warn("No se pudo obtener resumen de la DB:", error);
    return "No se pudo generar el resumen de la base de datos en esta consulta.";
  }
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const item = rateMap.get(ip);

  if (!item || now > item.until) {
    rateMap.set(ip, { count: 1, until: now + RATE_WINDOW_MS });
    return true;
  }

  if (item.count >= RATE_LIMIT) {
    return false;
  }

  item.count += 1;
  rateMap.set(ip, item);
  return true;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "El payload debe incluir un array messages" },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes: intenta de nuevo en 60 segundos." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const storeSummary = await buildStoreSummary(supabase);

  const systemMessage = {
    role: "system",
    content: `Eres Luna, asistente de Stella ERP, una tienda de joyería artesanal. Atiendes con tono amable, claro y experto.\n\n${storeSummary}\n\nNormas: responde en español; si no sabes un dato exacto, indica que debes verificar; prioriza la información de inventario y tiempos de envío; evita respuestas genéricas; si el usuario pregunta algo fuera de tu ámbito, indícalo amablemente; no hables explícitamente sobre actualizacion de stock o limmites de peticiones, pero maneja internamente para evitar sobrecarga.`,
  };

  const maxHistory = 8;
  const trimmedMessages = messages.slice(-maxHistory);
  const payloadMessages = [systemMessage, ...trimmedMessages];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct",
      messages: payloadMessages,
    }),
  });

  console.log("OpenRouter response status:", res.status);

  const data = await res.json();
  return NextResponse.json(data);
}
