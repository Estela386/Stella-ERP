import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: allProductos, error } = await supabase
      .from("producto")
      .select(
        `
        id,
        nombre,
        stock_actual,
        stock_min,
        categoria:id_categoria(nombre)
      `
      );

    if (error) {
      console.error("Error fetching stock alerts:", error);
      return NextResponse.json(
        { error: "Error al obtener alertas de stock", items: [] },
        { status: 500 }
      );
    }

    const productosStockBajo = (allProductos || [])
      .filter((p: any) => {
        const stockActual = Number(p.stock_actual);
        const stockMin = Number(p.stock_min);
        return (
          Number.isFinite(stockActual) &&
          Number.isFinite(stockMin) &&
          stockActual < stockMin
        );
      })
      .sort((a: any, b: any) => Number(a.stock_actual) - Number(b.stock_actual))
      .slice(0, 10);

    if (error) {
      console.error("Error fetching stock alerts:", error);
      return NextResponse.json(
        { error: "Error al obtener alertas de stock", items: [] },
        { status: 500 }
      );
    }

    const items = (productosStockBajo || []).map((p: any) => ({
      id: p.id,
      nombre: p.nombre || "Producto sin nombre",
      categoria: p.categoria?.nombre || "Sin categoría",
      stock: p.stock_actual || 0,
      minimo: p.stock_min || 0,
      urgencia: (p.stock_actual || 0) === 0 ? "critico" : "bajo",
    }));

    const criticos = items.filter((i: any) => i.urgencia === "critico").length;

    return NextResponse.json({ items, criticos });
  } catch (error) {
    console.error("Error in stock alerts route:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud", items: [], criticos: 0 },
      { status: 500 }
    );
  }
}
