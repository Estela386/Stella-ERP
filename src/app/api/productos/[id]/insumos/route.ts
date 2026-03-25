import { createClient } from "@utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("productoinsumo")
      .select("id, id_producto, id_insumo, cantidad_necesaria, id_opcion_valor")
      .eq("id_producto", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ insumos: data ?? [] });
  } catch (error) {
    console.error("Error en API insumos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
