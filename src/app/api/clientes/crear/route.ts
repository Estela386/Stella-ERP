import { createClient } from "@/utils/supabase/server";
import { ClienteService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono } = body;

    // Validación básica
    if (!nombre || !telefono) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    if (telefono.length < 10) {
      return NextResponse.json(
        { error: "El teléfono debe tener al menos 10 dígitos" },
        { status: 400 }
      );
    }

    // Crear cliente
    const supabase = await createClient();
    const clienteService = new ClienteService(supabase);

    const { cliente, error } = await clienteService.crear({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });

    if (error || !cliente) {
      return NextResponse.json(
        { error: error || "Error al crear el cliente" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
      },
    });
  } catch (err) {
    console.error("Error creating cliente:", err);
    return NextResponse.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    );
  }
}
