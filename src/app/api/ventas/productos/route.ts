import { createClient } from "@/utils/supabase/server";
import { ProductoService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos, error } = await productoService.obtenerTodos();

    if (error || !productos) {
      return NextResponse.json(
        { error: error || "Error al obtener productos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      productos: productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        stock: p.stock_actual,
        url_imagen: p.url_imagen,
        categoria_nombre: (p as any).categoria?.nombre || "Sin categoría",
        opciones: (p as any).opciones || [],
      })),
    });
  } catch (err) {
    console.error("Error fetching productos:", err);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
