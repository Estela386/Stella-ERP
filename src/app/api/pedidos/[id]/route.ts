import { createClient } from "@/utils/supabase/server";
import { PedidoService } from "@/lib/services/PedidoService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const pedidoId = parseInt(id);
    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const pedidoService = new PedidoService(supabase);
    const { pedido, error } = await pedidoService.obtenerPorId(pedidoId);

    if (error || !pedido) {
      return NextResponse.json({ error: error || "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ pedido });
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
