import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    // Si no hay usuario, logueamos pero continuamos para evitar errores de fetch
    if (authError || !authUser) {
      console.warn("Upcoming Events API: No auth user found, defaulting to Admin view.", authError);
    }

    const { data: profile, error: profileError } = await supabase
      .from("usuario")
      .select("id, id_rol")
      .eq("id_auth", authUser?.id || "")
      .maybeSingle();

    if (profileError) {
      console.error("Upcoming Events API: Profile fetch error:", profileError);
    }

    const isWholesaler = profile?.id_rol === 3;
    const userId = profile?.id;
    

    // Traer pedidos con fecha_entrega futura OR recientes pendientes
    let query = supabase
      .from("pedidos")
      .select(
        `
        id,
        fecha_pedido,
        fecha_entrega,
        estado,
        observaciones
      `
      )
      .in("estado", ["PENDIENTE", "EN_PRODUCCION", "EN_TALLER"]);

    if (isWholesaler) {
      query = query.eq("id_usuario", userId);
    }

    const { data: pedidos, error: pedidosErr } = await query
      .order("fecha_entrega", { ascending: true, nullsFirst: false })
      .limit(5);

    if (pedidosErr) {
      console.error("Error fetching upcoming events:", pedidosErr);
    }


    const formatFechaEvento = (isoStr: string | null) => {
      if (!isoStr) return null;
      const fecha = new Date(isoStr);
      const ahora = new Date();
      const diffMs = fecha.getTime() - ahora.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDias < 0) return "Vencido";
      if (diffDias === 0) {
        return `Hoy ${fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (diffDias === 1) {
        return `Mañana ${fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else {
        return fecha.toLocaleDateString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
      }
    };

    const mapEstadoLabel = (estado: string): string => {
      switch (estado) {
        case "PENDIENTE":
          return "Pendiente de producción";
        case "EN_PRODUCCION":
          return "En producción";
        case "EN_TALLER":
          return "En taller";
        default:
          return estado;
      }
    };

    interface PedidoEventRow {
      id: number;
      fecha_pedido: string;
      fecha_entrega: string | null;
      estado: string;
      observaciones: string | null;
    }

    interface PedidoSinFechaRow {
      id: number;
      estado: string;
      fecha_pedido: string;
    }

    const events = (pedidos as PedidoEventRow[] || [])
      .filter((p) => p.fecha_entrega) // Solo los que tienen fecha de entrega
      .map((p) => ({
        date: formatFechaEvento(p.fecha_entrega) || "Sin fecha",
        title: `Entrega PED-${String(p.id).padStart(4, "0")} — ${mapEstadoLabel(p.estado)}`,
        href: "/dashboard/inicio/pedidos",
        pedidoId: p.id,
        estado: p.estado,
        isUrgent: (() => {
          if (!p.fecha_entrega) return false;
          const diffMs =
            new Date(p.fecha_entrega).getTime() - new Date().getTime();
          return diffMs < 24 * 60 * 60 * 1000; // menos de 24h
        })(),
      }));

    // Si no hay eventos con fecha, agregar los pedidos más recientes sin fecha como recordatorios
    if (events.length < 3) {
      let sinFechaQuery = supabase
        .from("pedidos")
        .select("id, estado, fecha_pedido")
        .in("estado", ["PENDIENTE", "EN_PRODUCCION", "EN_TALLER"])
        .is("fecha_entrega", null);

      if (isWholesaler) {
        sinFechaQuery = sinFechaQuery.eq("id_usuario", userId);
      }

      const { data: sinFecha } = await sinFechaQuery
        .order("fecha_pedido", { ascending: false })
        .limit(3 - events.length);

      (sinFecha as PedidoSinFechaRow[] || []).forEach((p) => {
        events.push({
          date: "Sin fecha programada",
          title: `PED-${String(p.id).padStart(4, "0")} — ${mapEstadoLabel(p.estado)}`,
          href: "/dashboard/inicio/pedidos",
          pedidoId: p.id,
          estado: p.estado,
          isUrgent: false,
        });
      });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error in upcoming-events route:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud", events: [] },
      { status: 500 }
    );
  }
}
