import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    // Si no hay usuario, logueamos pero continuamos para evitar errores de fetch
    if (authError || !authUser) {
      console.warn("Recent Orders API: No auth user found, defaulting to Admin view.", authError);
    }

    const { data: profile, error: profileError } = await supabase
      .from("usuario")
      .select("id, id_rol")
      .eq("id_auth", authUser?.id || "")
      .maybeSingle();

    if (profileError) {
      console.error("Recent Orders API: Profile fetch error:", profileError);
    }

    const isWholesaler = profile?.id_rol === 3;
    const userId = profile?.id;

    // Traer los últimos 6 pedidos
    let query = supabase
      .from("pedidos")
      .select(
        `
        id,
        fecha_pedido,
        fecha_entrega,
        estado,
        total_estimado,
        observaciones,
        id_usuario,
        pedido_detalle(id)
      `
      );

    if (isWholesaler) {
      query = query.eq("id_usuario", userId);
    }

    const { data: pedidos, error } = await query
      .order("fecha_pedido", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching recent orders:", error);
      return NextResponse.json(
        { error: "Error al obtener pedidos recientes", pedidos: [] },
        { status: 500 }
      );
    }

    // Mapear los datos al formato que consume el frontend
    const formatFecha = (isoStr: string) => {
      const fecha = new Date(isoStr);
      const ahora = new Date();
      const diffMs = ahora.getTime() - fecha.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDias === 0) {
        return `Hoy ${fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (diffDias === 1) {
        return `Ayer ${fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (diffDias < 7) {
        return fecha.toLocaleDateString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
      } else {
        return fecha.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
        });
      }
    };

    // Mapear estado de pedido al formato del componente
    const mapEstado = (
      estado: string
    ): "pendiente" | "en_proceso" | "completado" | "urgente" => {
      switch (estado) {
        case "PENDIENTE":
          return "pendiente";
        case "EN_PRODUCCION":
          return "en_proceso";
        case "EN_TALLER":
          return "en_proceso";
        case "ENTREGADO":
          return "completado";
        default:
          return "pendiente";
      }
    };

    interface PedidoRow {
      id: number;
      fecha_pedido: string;
      fecha_entrega: string | null;
      estado: string;
      total_estimado: number;
      observaciones: string | null;
      id_usuario: string;
      pedido_detalle: { id: number }[];
    }

    const result = (pedidos as PedidoRow[] || []).map((p) => {
      const items = Array.isArray(p.pedido_detalle)
        ? p.pedido_detalle.length
        : 0;
      // Usar observaciones o "Pedido mayorista" como nombre de cliente
      const cliente =
        p.observaciones && p.observaciones !== "Pedido de mayorista"
          ? p.observaciones
          : `Pedido #${p.id}`;

      return {
        id: `PED-${String(p.id).padStart(4, "0")}`,
        cliente,
        monto: `$${(p.total_estimado || 0).toLocaleString("es-MX", {
          maximumFractionDigits: 0,
        })}`,
        estado: mapEstado(p.estado),
        fecha: formatFecha(p.fecha_pedido),
        items,
        pedidoId: p.id,
      };
    });

    return NextResponse.json({ pedidos: result });
  } catch (error) {
    console.error("Error in recent-orders route:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud", pedidos: [] },
      { status: 500 }
    );
  }
}
