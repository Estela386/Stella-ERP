import { createClient } from "@/utils/supabase/server";
import { PedidoService } from "@/lib/services/PedidoService";
import { NextResponse } from "next/server";

/**
 * GET /api/pedidos
 * Obtener historial de pedidos (Filtrado por usuario si es mayorista)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener info del usuario de la tabla usuario
    const { data: usuarioData } = await supabase
      .from("usuario")
      .select("id, id_rol")
      .eq("id_auth", user.id)
      .single();

    const pedidoService = new PedidoService(supabase);
    
    // Si es Mayorista (Rol 3), filtrar por su id
    const idFiltro = usuarioData?.id_rol === 3 ? usuarioData.id : undefined;

    const { pedidos, error } = await pedidoService.obtenerHistorial(idFiltro);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ pedidos });
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/**
 * POST /api/pedidos/crear
 * Levantar un nuevo pedido
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_usuario, detalles, total_estimado, observaciones } = body;

    if (!id_usuario || !detalles || detalles.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createClient();
    const pedidoService = new PedidoService(supabase);

    const { pedido, error } = await pedidoService.levantarPedido({
      id_usuario,
      detalles,
      total_estimado,
      observaciones,
      estado: "PENDIENTE"
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ pedido, success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al procesar el pedido" }, { status: 500 });
  }
}

/**
 * PATCH /api/pedidos (Actualizar estado)
 */
export async function PATCH(request: Request) {
    try {
      const body = await request.json();
      const { id, estado } = body;
  
      if (!id || !estado) {
        return NextResponse.json({ error: "ID y estado requeridos" }, { status: 400 });
      }
  
      const supabase = await createClient();
      const pedidoService = new PedidoService(supabase);
  
      const { success, error } = await pedidoService.actualizarEstado(id, estado);
  
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
    }
  }
