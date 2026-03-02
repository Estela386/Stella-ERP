import { createClient } from "@/utils/supabase/server";
import { ClienteService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const clienteService = new ClienteService(supabase);

    const { clientes, error } = await clienteService.obtenerTodos();

    if (error || !clientes) {
      return NextResponse.json(
        { error: error || "Error al obtener clientes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientes: clientes.map(c => ({
        id: c.id,
        nombre: c.nombre,
        telefono: c.telefono,
      })),
    });
  } catch (err) {
    console.error("Error fetching clientes:", err);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}
