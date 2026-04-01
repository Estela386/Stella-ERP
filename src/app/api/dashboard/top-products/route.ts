import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

type DashboardTopProduct = {
  id: number;
  nombre: string;
  ventas: number;
  costo?: number | null;
  precio?: number | null;
  stock_actual?: number | null;
  stock_min?: number | null;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("detallesventas")
      .select("cantidad,id_producto,producto:id_producto(*)")
      .gt("cantidad", 0);

    if (error) {
      console.error("Error al obtener top products:", error);
      return NextResponse.json({ error: "Error al obtener top products" }, { status: 500 });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ data: [] });
    }

    const engine = new Map<number, DashboardTopProduct>();

    for (const item of data) {
      if (!item || typeof item.id_producto !== "number") continue;
      const prod = item.producto as any;
      const prodId = item.id_producto;
      const vente = Number(item.cantidad) || 0;

      const existing = engine.get(prodId);

      if (!existing) {
        engine.set(prodId, {
          id: prodId,
          nombre: prod?.nombre || `Producto #${prodId}`,
          ventas: vente,
          costo: prod?.costo ?? null,
          precio: prod?.precio ?? null,
          stock_actual: prod?.stock_actual ?? null,
          stock_min: prod?.stock_min ?? null,
        });
      } else {
        existing.ventas += vente;
      }
    }

    const sorted = Array.from(engine.values())
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 5);

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { error: "Error al obtener top products" },
      { status: 500 }
    );
  }
}
