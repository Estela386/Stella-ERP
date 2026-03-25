import { createClient } from "@/utils/supabase/server";
import { ProductoProveedorService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const productoProveedorService = new ProductoProveedorService(supabase);

    const { data: relacion, error } =
      await productoProveedorService.obtenerPorProducto(parseInt(id));

    if (error) {
      return NextResponse.json(
        { error: error || "Error al obtener relación de proveedor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ relacion, success: true });
  } catch (err) {
    console.error("Error obteniendo relación proveedor:", err);
    return NextResponse.json(
      { error: "Error al obtener relación de proveedor" },
      { status: 500 }
    );
  }
}
