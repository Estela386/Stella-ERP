import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

interface StockItemRaw {
  id: number;
  nombre: string;
  stock: number;
  minimo: number;
  categoria: string;
  tipo: "producto" | "insumo";
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    // Si no hay usuario, logueamos pero continuamos para evitar errores de fetch
    if (authError || !authUser) {
      console.warn("Stock Alerts API: No auth user found, defaulting to Admin view.", authError);
    }

    const { data: profile, error: profileError } = await supabase
      .from("usuario")
      .select("id, id_rol")
      .eq("id_auth", authUser?.id || "")
      .maybeSingle();

    if (profileError) {
      console.error("Stock Alerts API: Profile fetch error:", profileError);
    }

    const isWholesaler = profile?.id_rol === 3;

    if (isWholesaler) {
       // Los mayoristas no ven alertas de stock interno por ahora
       return NextResponse.json({ items: [], criticos: 0, totalProductos: 0, totalInsumos: 0 });
    }

    // ── 1. Productos con stock bajo ──────────────────────────────────
    const { data: allProductos, error: prodError } = await supabase
      .from("producto")
      .select(
        `
        id,
        nombre,
        stock_actual,
        stock_min,
        categoria:id_categoria(nombre)
      `
      )
      .gt("stock_min", 0);

    if (prodError) {
      console.error("Error fetching product stock:", prodError);
    }

    const productosStockBajo: StockItemRaw[] = ((allProductos as unknown as {
      id: number;
      nombre: string;
      stock_actual: number;
      stock_min: number;
      categoria: { nombre: string } | { nombre: string }[] | null;
    }[]) || [])
      .filter((p) => {
        const stockActual = Number(p.stock_actual);
        const stockMin = Number(p.stock_min);
        return (
          Number.isFinite(stockActual) &&
          Number.isFinite(stockMin) &&
          stockActual < stockMin
        );
      })
      .map((p) => {
        // En caso de que Supabase devuelva la categoría en un array
        const categoriaNombre = Array.isArray(p.categoria) 
          ? p.categoria[0]?.nombre 
          : p.categoria?.nombre;

        return {
          id: p.id,
          nombre: p.nombre || "Producto sin nombre",
          categoria: categoriaNombre || "Sin categoría",
          stock: p.stock_actual || 0,
          minimo: p.stock_min || 0,
          tipo: "producto" as const,
        };
      });

    // ── 2. Insumos con stock bajo ────────────────────────────────────
    const { data: allInsumos, error: insumoError } = await supabase
      .from("insumos")
      .select("id, nombre, cantidad, stock_minimo, tipo")
      .eq("activo", true)
      .gt("stock_minimo", 0);

    if (insumoError) {
      console.error("Error fetching insumo stock:", insumoError);
    }

    const insumosStockBajo: StockItemRaw[] = ((allInsumos as unknown as {
      id: number;
      nombre: string;
      cantidad: number;
      stock_minimo: number;
      tipo: string;
    }[]) || [])
      .filter((ins) => {
        const cantActual = Number(ins.cantidad);
        const stockMin = Number(ins.stock_minimo);
        return (
          Number.isFinite(cantActual) &&
          Number.isFinite(stockMin) &&
          cantActual < stockMin
        );
      })
      .map((ins) => ({
        id: ins.id,
        nombre: ins.nombre || "Insumo sin nombre",
        categoria: ins.tipo || "Insumo",
        stock: ins.cantidad || 0,
        minimo: ins.stock_minimo || 0,
        tipo: "insumo" as const,
      }));

    // ── 3. Combinar, ordenar por urgencia y limitar ──────────────────
    const allItems = [...productosStockBajo, ...insumosStockBajo]
      .sort((a, b) => {
        // Primero los críticos (stock=0), luego por % del mínimo ascendente
        const pctA = a.minimo > 0 ? a.stock / a.minimo : 1;
        const pctB = b.minimo > 0 ? b.stock / b.minimo : 1;
        return pctA - pctB;
      })
      .slice(0, 12);

    const items = allItems.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      categoria: i.categoria,
      stock: i.stock,
      minimo: i.minimo,
      tipo: i.tipo,
      urgencia: i.stock === 0 ? "critico" : "bajo",
    }));

    const criticos = items.filter((i) => i.urgencia === "critico").length;
    const totalProductos = productosStockBajo.length;
    const totalInsumos = insumosStockBajo.length;

    return NextResponse.json({ items, criticos, totalProductos, totalInsumos });
  } catch (error) {
    console.error("Error in stock alerts route:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud", items: [], criticos: 0, totalProductos: 0, totalInsumos: 0 },
      { status: 500 }
    );
  }
}
