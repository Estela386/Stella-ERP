import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

const RATE_LIMIT = 10; // peticiones max por ventana
const RATE_WINDOW_MS = 60_000; // 1 minuto
const rateMap = new Map<string, { count: number; until: number }>();

let storeSummaryCache: string | null = null;
let storeSummaryCacheAt = 0;
const STORE_SUMMARY_TTL = 30_000; // cache 30 segundos

// 1. Resumen General de la Tienda (Se mantiene igual)
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
    const { count: totalCount } = await supabase
      .from("producto")
      .select("id", { count: "exact", head: true });
    const { data: products } = await supabase
      .from("producto")
      .select("nombre, stock_actual, stock_min, precio")
      .order("stock_actual", { ascending: true })
      .limit(20);
    const { count: outOfStockCount } = await supabase
      .from("producto")
      .select("id", { count: "exact", head: true })
      .eq("stock_actual", 0);
    const { data: categories } = await supabase
      .from("categoria")
      .select("id, nombre")
      .limit(20);

    const safeTotal = typeof totalCount === "number" ? totalCount : 0;
    const safeOutOfStock =
      typeof outOfStockCount === "number" ? outOfStockCount : 0;

    const categoryList = Array.isArray(categories)
      ? categories
          .map((c: any) => c.nombre)
          .filter(Boolean)
          .join(", ")
      : "sin categorías";

    const summary =
      `Resumen de catálogo público:\n` +
      `- Total productos: ${safeTotal}\n` +
      `- Productos sin stock: ${safeOutOfStock}\n` +
      `- Categorías presentes: ${categoryList}\n` +
      `\n\n Productos destacados:\n` +
      (Array.isArray(products)
        ? products
            .map(
              p =>
                `- ${p.nombre ?? "N/A"}: stock ${p.stock_actual ?? "?"}, precio $${p.precio ?? "?"}`
            )
            .join("\n")
        : "Catálogo no disponible.");

    storeSummaryCache = summary;
    storeSummaryCacheAt = Date.now();
    return summary;
  } catch (error) {
    console.warn("No se pudo obtener resumen de la DB:", error);
    return "Catálogo general no disponible.";
  }
}

// 🔥 2. NUEVA FUNCIÓN: Resumen Privado del Usuario Logueado
async function buildUserSummary(
  supabase: Awaited<ReturnType<typeof createClient>>,
  usuarioIdAuth: string
) {
  try {
    // 2.1 Buscar el ID interno del usuario
    const { data: usuario } = await supabase
      .from("usuario")
      .select("id, nombre, correo")
      .eq("id_auth", usuarioIdAuth)
      .single();

    if (!usuario) return "Usuario anónimo.";

    // 2.2 Buscar sus últimos pedidos (ventas)
    const { data: pedidos } = await supabase
      .from("ventas")
      .select("id, fecha, total, estado")
      .eq("id_usuario", usuario.id)
      .order("fecha", { ascending: false })
      .limit(3);

    // 2.3 Buscar sus saldos / cuentas por cobrar (Relación con cliente)
    // Primero encontramos si este usuario es un cliente en la tabla cliente
    const { data: cliente } = await supabase
      .from("cliente")
      .select("id")
      .eq("id_usuario", usuario.id)
      .single();

    let saldosPendientes = "";
    if (cliente) {
      const { data: cuentas } = await supabase
        .from("cuentasporcobrar")
        .select("id, concepto, monto_pendiente, estado")
        .eq("id_cliente", cliente.id)
        .eq("estado", "pendiente");

      if (cuentas && cuentas.length > 0) {
        saldosPendientes = cuentas
          .map(c => `- ${c.concepto}: Deuda de $${c.monto_pendiente}`)
          .join("\n");
      } else {
        saldosPendientes = "No tiene saldos pendientes.";
      }
    }

    // 2.4 Armar el contexto privado
    let userContext = `\n--- DATOS PRIVADOS DEL CLIENTE ACTUAL ---\n`;
    userContext += `El cliente con el que estás hablando se llama: ${usuario.nombre} (${usuario.correo}).\n\n`;

    userContext += `ÚLTIMOS PEDIDOS:\n`;
    if (pedidos && pedidos.length > 0) {
      userContext += pedidos
        .map(
          p =>
            `- Pedido #${p.id} (${new Date(p.fecha).toLocaleDateString()}): $${p.total} - Estado: ${p.estado}`
        )
        .join("\n");
    } else {
      userContext += "El cliente aún no tiene pedidos realizados.\n";
    }

    userContext += `\n\nSALDOS PENDIENTES:\n${saldosPendientes || "No tiene deudas ni apartados pendientes."}\n`;
    userContext += `-----------------------------------------\n`;

    return userContext;
  } catch (error) {
    console.error("Error cargando info del usuario:", error);
    return "Error cargando datos del cliente.";
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

  // 1. Autenticación y Cliente de Base de Datos
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;

  // 2. Construcción del conocimiento del Bot
  const storeSummary = await buildStoreSummary(supabase);

  // 🔥 Si el usuario está logueado, traemos su información secreta. Si no, le avisamos a Luna que es anónimo.
  const userSummary = userId
    ? await buildUserSummary(supabase, userId)
    : "\nEl cliente NO ha iniciado sesión. Si te pregunta por sus pedidos o saldos, indícale amablemente que debe iniciar sesión primero.";

  const systemMessage = {
    role: "system",
    content: `Eres Luna, asistente de Stella ERP, una tienda de joyería artesanal. Atiendes con tono amable, claro y experto.\n\n${storeSummary}\n\n${userSummary}\n\nNormas: responde en español; si no sabes un dato exacto, indica que debes verificar; solo responde sobre información de pedidos y saldos del cliente actual, si pregunta por la cuenta de otro, niégate por privacidad.`,
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

  const data = await res.json();
  return NextResponse.json(data);
}
