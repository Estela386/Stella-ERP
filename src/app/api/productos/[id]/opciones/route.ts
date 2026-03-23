import { createClient } from "@/utils/supabase/server";
import { ProductoPersonalizacionService } from "@/lib/services";
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
    const personalizacionService = new ProductoPersonalizacionService(supabase);

    const { opciones, error } =
      await personalizacionService.obtenerOpcionesPorProducto(id);

    if (error) {
      return NextResponse.json(
        { error: error || "Error al obtener opciones" },
        { status: 500 }
      );
    }

    return NextResponse.json({ opciones, success: true });
  } catch (err) {
    console.error("Error obteniendo opciones:", err);
    return NextResponse.json(
      { error: "Error al obtener opciones" },
      { status: 500 }
    );
  }
}
