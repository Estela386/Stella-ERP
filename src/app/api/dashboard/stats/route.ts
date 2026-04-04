import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    // Si no hay usuario, logueamos pero continuamos para evitar errores de fetch
    if (authError || !authUser) {
      console.warn("Dashboard Stats API: No auth user found, defaulting to Admin view.", authError);
    }

    const { data: profile, error: profileError } = await supabase
      .from("usuario")
      .select("id, id_rol")
      .eq("id_auth", authUser?.id || "")
      .maybeSingle();

    if (profileError) {
      console.error("Dashboard Stats API: Profile fetch error:", profileError);
    }

    const isWholesaler = profile?.id_rol === 3;
    const userId = profile?.id;

    const today = new Date().toISOString().split("T")[0];

    // 1. Ventas de hoy
    let ventasQuery = supabase
      .from("ventas")
      .select("total, id")
      .eq("fecha", today)
      .gt("total", 0);

    // Solo filtramos por usuario si es estrictamente un Mayorista
    if (isWholesaler) {
      ventasQuery = ventasQuery.eq("id_usuario", userId);
    }

    const { data: ventasHoy } = await ventasQuery;

    const totalVentasHoy = Array.isArray(ventasHoy)
      ? ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0)
      : 0;
    const cantidadVentasHoy = Array.isArray(ventasHoy) ? ventasHoy.length : 0;

    // 2. Ticket promedio (últimas 25 ventas del mes actual)
    const currentMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
    let tpQuery = supabase
      .from("ventas")
      .select("total")
      .like("fecha", `${currentMonth}%`)
      .gt("total", 0)
      .order("fecha", { ascending: false })
      .limit(25);

    if (isWholesaler) {
      tpQuery = tpQuery.eq("id_usuario", userId);
    }

    const { data: ventasDelMes } = await tpQuery;

    const ticketPromedio =
      Array.isArray(ventasDelMes) && ventasDelMes.length > 0
        ? ventasDelMes.reduce((sum, v) => sum + (v.total || 0), 0) /
          ventasDelMes.length
        : 0;

    // 3. Pedidos pendientes activos
    let pedidosQuery = supabase
      .from("pedidos")
      .select("id")
      .in("estado", ["PENDIENTE", "EN_PRODUCCION", "EN_TALLER"]);

    if (isWholesaler) {
      pedidosQuery = pedidosQuery.eq("id_usuario", userId);
    }

    const { data: pedidosPendientes } = await pedidosQuery;

    const cantidadPedidosPendientes = Array.isArray(pedidosPendientes)
      ? pedidosPendientes.length
      : 0;

    // 4. Stock bajo — Solo para Admin (Cualquier rol que no sea 3)
    let cantidadStockBajo = 0;
    if (!isWholesaler) {
      const { data: productos } = await supabase
        .from("producto")
        .select("stock_actual, stock_min")
        .gt("stock_min", 0);

      const { data: insumos } = await supabase
        .from("insumos")
        .select("cantidad, stock_minimo")
        .eq("activo", true)
        .gt("stock_minimo", 0);

      const pBajo = (productos || []).filter(p => Number(p.stock_actual) < Number(p.stock_min)).length;
      const iBajo = (insumos || []).filter(i => Number(i.cantidad) < Number(i.stock_minimo)).length;

      cantidadStockBajo = pBajo + iBajo;
    }

    return NextResponse.json({
      ventasHoy: {
        total: totalVentasHoy,
        transacciones: cantidadVentasHoy,
      },
      ticketPromedio: {
        valor: ticketPromedio,
        ventasDelMes: Array.isArray(ventasDelMes) ? ventasDelMes.length : 0,
      },
      pedidosPendientes: cantidadPedidosPendientes,
      stockBajo: cantidadStockBajo,
      roleId: profile?.id_rol || 1, // Defaulting to 1 if not found to avoid Wholesaler logic in frontend
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        error: "Error al obtener estadísticas",
        ventasHoy: { total: 0, transacciones: 0 },
        ticketPromedio: { valor: 0, ventasDelMes: 0 },
        pedidosPendientes: 0,
        stockBajo: 0,
      },
      { status: 500 }
    );
  }
}
