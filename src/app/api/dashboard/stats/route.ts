import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const today = new Date().toISOString().split("T")[0];

    // 1. Ventas de hoy
    const { data: ventasHoy, error: ventasHoyError } = await supabase
      .from("ventas")
      .select("total, id")
      .eq("fecha", today)
      .gt("total", 0);

    const totalVentasHoy = Array.isArray(ventasHoy)
      ? ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0)
      : 0;
    const cantidadVentasHoy = Array.isArray(ventasHoy) ? ventasHoy.length : 0;

    // 2. Ticket promedio (últimas 25 ventas del mes actual)
    const currentMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
    const { data: ventasDelMes, error: ventasDelMesError } = await supabase
      .from("ventas")
      .select("total")
      .like("fecha", `${currentMonth}%`)
      .gt("total", 0)
      .order("fecha", { ascending: false })
      .limit(25);

    const ticketPromedio =
      Array.isArray(ventasDelMes) && ventasDelMes.length > 0
        ? ventasDelMes.reduce((sum, v) => sum + (v.total || 0), 0) /
          ventasDelMes.length
        : 0;

    // 3. Pedidos pendientes (ventas con estado "pendiente")
    const { data: pedidosPendientes, error: pedidosError } = await supabase
      .from("ventas")
      .select("id")
      .eq("estado", "pendiente");

    const cantidadPedidosPendientes = Array.isArray(pedidosPendientes)
      ? pedidosPendientes.length
      : 0;

    // 4. Stock bajo (productos con stock_actual < stock_min)
    const { data: productosStockBajo, error: stockError } = await supabase
      .from("producto")
      .select("id")
      .lt("stock_actual", "stock_min");

    const cantidadStockBajo = Array.isArray(productosStockBajo)
      ? productosStockBajo.length
      : 0;

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
