"use client";

import { useState, useEffect } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import ReportKPIs, { KPI } from "./_components/ReportKPIs";
import ReportFilters, { PeriodoTab } from "./_components/ReportFilters";
import SalesAreaChart from "./_components/SalesAreaChart";
import SalesByProductChart from "./_components/SalesByProductChart";
import SalesStatusChart from "./_components/SalesStatusChart";
import SalesTable from "./_components/SalesTable";
import SalesByCategoryChart from "./_components/SalesByCategoryChart";
import SalesByWholesalerChart from "./_components/SalesByWholesalerChart";
import SalesVsConsignmentChart from "./_components/SalesVsConsignmentChart";
import InventoryReportSection from "./_components/InventoryReportSection";
import SalesGoals from "./_components/SalesGoals";
import WholesalerGoal from "./_components/WholesalerGoal";
import TopProfitProducts from "./_components/TopProfitProducts";
import AverageTicket from "./_components/AverageTicket";
import CollectionGoal from "./_components/CollectionGoal";
import SalesVsCollection from "./_components/SalesVsCollection";
import FinancialSummary from "./_components/FinancialSummary";
import { motion } from "framer-motion";
import Skeleton from "@/app/_components/ui/Skeleton";

import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { IVenta, IDetalleVenta, ICuentasPorCobrar, IConsignacion, ICategoria, IProducto } from "@/lib/models";


export default function ReportsPage() {
  const { usuario, loading: authLoading } = useAuth();
  
  // Custom date formatter: YYYY-MM-DD
  const fmtDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  
  const [activeTab, setActiveTab] = useState<PeriodoTab>("MENSUAL");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return fmtDate(d);
  });
  const [endDate, setEndDate] = useState(fmtDate(today));

  const handleTabChange = (tab: PeriodoTab) => {
    setActiveTab(tab);
    const now = new Date();
    if (tab === "DIARIO") {
      setStartDate(fmtDate(now));
      setEndDate(fmtDate(now));
    } else if (tab === "SEMANAL") {
      const w = new Date();
      w.setDate(w.getDate() - 7);
      setStartDate(fmtDate(w));
      setEndDate(fmtDate(now));
    } else if (tab === "MENSUAL") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(fmtDate(startOfMonth));
      setEndDate(fmtDate(now));
    } else if (tab === "ANUAL") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      setStartDate(fmtDate(startOfYear));
      setEndDate(fmtDate(now));
    }
  };

  const [ventas, setVentas] = useState<IVenta[]>([]);
  const [cuentasPorCobrar, setCuentasPorCobrar] = useState<ICuentasPorCobrar[]>([]);
  const [consignaciones, setConsignaciones] = useState<IConsignacion[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [productosGlob, setProductosGlob] = useState<IProducto[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Role Logic
  const isAdmin = usuario?.id_rol === 1;
  const isMayorista = usuario?.id_rol === 3; // Role 3 is Wholesaler in Stella ERP

  useEffect(() => {
    async function fetchData() {
      if (!usuario) return;
      setLoadingData(true);
      const supabase = createClient();
      
      let query = supabase
        .from('ventas')
        .select(`
          *,
          usuario:id_usuario(*),
          detalles:detallesventas(
            cantidad,
            id_producto,
            producto:id_producto(nombre, id_categoria, precio, costo)
          )
        `)
        .order("fecha", { ascending: false });

      // Apply role filtering
      if (isMayorista && !isAdmin) {
        query = query.eq('id_usuario', usuario.id);
      }

      // Fetch Cuentas por cobrar
      const cuentasQuery = supabase
        .from('cuentasporcobrar')
        .select('monto_pendiente, monto_pagado, fecha_registro, id_venta')
        .gt('monto_inicial', 0); // Corregido: usando monto_inicial según esquema

      // Fetch Consignaciones
      let consigQuery = supabase
        .from('consignacion')
        .select(`
          id_mayorista,
          estado,
          fecha_inicio,
          detalles:consignacion_detalle(
            cantidad,
            cantidad_vendida,
            cantidad_devuelta
          )
        `);
        
      if (isMayorista && !isAdmin) {
        // Asumiendo que id_mayorista coincide con usuario.id o buscamos todos y filtramos en JS local si falla el tipo
        consigQuery = consigQuery.eq('id_mayorista', usuario.id);
      }

      // Fetch Categorías & Productos Generales (para Inventario)
      const catQuery = supabase.from('categoria').select('id, nombre');
      const prodQuery = supabase.from('producto').select('id, nombre, stock_actual, stock_min, precio, costo');

      const [resVentas, resCuentas, resConsig, resCat, resProd] = await Promise.all([
        query,
        cuentasQuery,
        consigQuery,
        catQuery,
        prodQuery
      ]);
      
      if (resVentas.error) console.error("Error fetching ventas:", resVentas.error.message, resVentas.error);
      if (resCuentas.error) console.error("Error fetching cuentas:", resCuentas.error.message, resCuentas.error);
      if (resConsig.error) console.error("Error fetching consignaciones:", resConsig.error.message, resConsig.error);
      if (resCat.error) console.error("Error fetching categorias:", resCat.error.message, resCat.error);
      if (resProd.error) console.error("Error fetching productos:", resProd.error.message, resProd.error);

      if (!resVentas.error && resVentas.data) setVentas(resVentas.data as IVenta[]);
      if (!resCuentas.error && resCuentas.data) setCuentasPorCobrar(resCuentas.data as ICuentasPorCobrar[]);
      if (!resConsig.error && resConsig.data) setConsignaciones(resConsig.data as IConsignacion[]);
      if (!resCat.error && resCat.data) setCategorias(resCat.data as ICategoria[]);
      if (!resProd.error && resProd.data) setProductosGlob(resProd.data as IProducto[]);
      
      setLoadingData(false);
    }
    
    if (!authLoading) {
      fetchData();
    }
  }, [usuario, authLoading, isAdmin, isMayorista]);

  if (authLoading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--beige)" }}>
        <p style={{ fontFamily: "var(--font-sans)", color: "var(--slate-light)" }}>Cargando roles y datos...</p>
      </div>
    );
  }

  // Filter ventas by date range
  const filteredVentas = ventas.filter(v => {
    if (!v.fecha) return false;
    try {
      const vDate = new Date(v.fecha).toISOString().split("T")[0];
      return vDate >= startDate && vDate <= endDate;
    } catch (e) {
      console.warn("Invalid sale date:", v.fecha);
      return false;
    }
  });

  // Approved Sales Data
  const ventasAprobadas = filteredVentas.filter(v => v.estado === "aprobada");

  // Status Metrics
  const aprobadasCount = ventasAprobadas.length;
  const pendientesCount = filteredVentas.filter(v => v.estado === "pendiente").length;
  const canceladasCount = filteredVentas.filter(v => v.estado === "cancelada" || v.estado === "denegada").length;

  const ventasTotales = ventasAprobadas.reduce((acc, v) => acc + (v.total || 0), 0);

  // Product KPIs and Top Products Calculation
  let productosVendidosTotal = 0;
  const productSalesMap: Record<string, { nombre: string; cantidad: number; totalVendido: number }> = {};

  ventasAprobadas.forEach(v => {
    if (v.detalles && Array.isArray(v.detalles)) {
      v.detalles.forEach((det: IDetalleVenta) => {
        const qty = det.cantidad || 0;
        // Subtotal calculation if not present, using product price
        const subtotal = det.subtotal || (qty * (det.producto?.precio || 0));
        productosVendidosTotal += qty;

        const prodName = det.producto?.nombre || "Producto Desconocido";
        if (!productSalesMap[prodName]) {
          productSalesMap[prodName] = { nombre: prodName, cantidad: 0, totalVendido: 0 };
        }
        productSalesMap[prodName].cantidad += qty;
        productSalesMap[prodName].totalVendido += subtotal;
      });
    }
  });

  const topProductsArray = Object.values(productSalesMap);

  // Filter Cuentas Por Cobrar by Date
  const filteredCuentas = cuentasPorCobrar.filter(c => {
    if (!c.fecha_registro) return false;
    try {
      const cDate = new Date(c.fecha_registro).toISOString().split("T")[0];
      return cDate >= startDate && cDate <= endDate;
    } catch (e) {
      console.warn("Invalid account date:", c.fecha_registro);
      return false;
    }
  });

  // Calculate Cuentas Por Cobrar for Admin vs Mayorista
  let cuentasPendientesTotal = 0;
  if (isAdmin) {
    cuentasPendientesTotal = filteredCuentas.reduce((acc, c) => acc + (c.monto_pendiente || 0), 0);
  } else if (isMayorista) {
    const userVentasIds = new Set(filteredVentas.map(v => v.id));
    const userCuentas = filteredCuentas.filter(c => c.id_venta && userVentasIds.has(c.id_venta));
    cuentasPendientesTotal = userCuentas.reduce((acc, c) => acc + (c.monto_pendiente || 0), 0);
  }

  // Calculate Consignment metrics
  let consignacionTotalAsignada = 0;
  let consignacionTotalVendida = 0;
  consignaciones.forEach((c: IConsignacion) => {
    if (c.detalles && Array.isArray(c.detalles)) {
      c.detalles.forEach((det) => {
        consignacionTotalAsignada += (det.cantidad || 0);
        consignacionTotalVendida += (det.cantidad_vendida || 0);
      });
    }
  });

  // Calculate Financial Summary for filtered sales
  let totalCostVentas = 0;
  filteredVentas.forEach(v => {
    v.detalles?.forEach(det => {
      // @ts-ignore
      totalCostVentas += (Number(det.producto?.costo) || 0) * (det.cantidad || 0);
    });
  });
  const totalProfitVentas = ventasTotales - totalCostVentas;

  // Calculate Inventory Value
  const valorTotalInventario = productosGlob.reduce((acc, p) => acc + ((p.stock_actual || 0) * (p.costo || 0)), 0);

  // Build KPI Cards List based on Role
  const kpiList: KPI[] = isAdmin ? [
    { label: "Ventas Totales", value: `$${ventasTotales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, icon: "dollar", bgStart: "#758390", bgEnd: "#6b7a88" },
    { label: "Cuentas por cobrar", value: `$${cuentasPendientesTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, icon: "trending", bgStart: "#D4A5A5", bgEnd: "#C07E88" },
    { label: "Productos Vendidos", value: productosVendidosTotal, icon: "package", bgStart: "#C07E88", bgEnd: "#B76E79" },
    { label: "Items Consignados", value: consignacionTotalAsignada, icon: "package", bgStart: "#758390", bgEnd: "#6b7a88" },
  ] : [
    { label: "Mis Compras Totales", value: `$${ventasTotales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, icon: "dollar", bgStart: "#C07E88", bgEnd: "#B76E79" },
    { label: "Deuda Pendiente", value: `$${cuentasPendientesTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, icon: "trending", bgStart: "#D4A5A5", bgEnd: "#C07E88" },
    { label: "Productos Adquiridos", value: productosVendidosTotal, icon: "package", bgStart: "#758390", bgEnd: "#6b7a88" },
    { label: "Stock Consignado", value: consignacionTotalAsignada, icon: "package", bgStart: "#D4A5A5", bgEnd: "#C07E88" },
  ];
  
  // -- Exportar a Excel (Contador) --
  const exportToExcel = async () => {
    const XLSX = await import("xlsx");
    if (filteredVentas.length === 0) return;
    
    // Preparar datos con estructura contable y de rentabilidad
    const data = filteredVentas.map(v => {
      const subtotalVenta = (v.total || 0) / 1.16;
      const ivaVenta = (v.total || 0) * 0.16;
      
      // Calcular costo total de la venta sumando el costo de cada producto
      const costoTotalVenta = v.detalles?.reduce((acc, det) => {
        // @ts-ignore - el costo viene del fetch de producto
        return acc + ((det.producto?.costo || 0) * (det.cantidad || 0));
      }, 0) || 0;

      const gananciaNeta = (v.total || 0) - costoTotalVenta;

      return {
        "Folio Stella": `V-${v.id}`,
        "Fecha": v.fecha ? new Date(v.fecha).toLocaleDateString('es-MX') : "N/A",
        "Cliente/Mayorista": v.usuario?.nombre || "Venta Directa",
        "Total Bruto (Público)": v.total || 0,
        "IVA (16%)": ivaVenta,
        "Subtotal": subtotalVenta,
        "Costo Total (Insumos/Labor)": costoTotalVenta,
        "Ganancia Neta": gananciaNeta,
        "Margen (%)": costoTotalVenta > 0 ? ((gananciaNeta / costoTotalVenta) * 100).toFixed(2) + "%" : "N/A",
        "Metodo de Pago": (v.metodo_pago || "Efectivo").toUpperCase(),
        "Estado": (v.estado || "Pendiente").toUpperCase(),
        "Productos": v.detalles?.map(d => `${d.producto?.nombre} (x${d.cantidad})`).join(" | ") || "Sin detalle"
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas_Stella_ERP");

    // Estilo de columnas: Añadimos espacio para las nuevas columnas financieras
    worksheet["!cols"] = [
      { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 50 }
    ];

    XLSX.writeFile(workbook, `Stella_Reporte_Rentabilidad_${startDate}_a_${endDate}.xlsx`);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-[1440px] space-y-8"
        >

          <ReportFilters
            activeTab={activeTab} onTabChange={handleTabChange}
            startDate={startDate} endDate={endDate}
            onStartDateChange={setStartDate} onEndDateChange={setEndDate}
            onExport={exportToExcel}
          />

          {!loadingData ? (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              {/* Dynamic KPI Array Grid */}
              <ReportKPIs kpis={kpiList} />

              {/* Middle Row Charts */}
              <div 
                className="reports-charts-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr",
                  gap: 24,
                  width: "100%",
                }} 
              >
                <style>{`
                  @media (max-width: 1100px) { 
                    .reports-charts-row { grid-template-columns: 1fr !important; } 
                  }
                  @media (max-width: 640px) {
                    .reports-charts-row { gap: 16px !important; }
                    main { padding: 16px 12px !important; }
                  }
                `}</style>
                
                <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} style={{ minWidth: 0 }}>
                  <SalesAreaChart 
                    ventas={ventasAprobadas.map(v => ({
                      fecha: v.fecha ? (v.fecha instanceof Date ? v.fecha.toISOString() : v.fecha) : "",
                      total: v.total || 0
                    }))}
                    title={isAdmin ? "Ingresos Globales" : "Mis Gastos / Inversión"}
                    subtitle={`Periodo ${startDate} al ${endDate}`}
                    totalLabel={isAdmin ? "Total Ingresado" : "Total Invertido"}
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0 } }}>
                  <TopProfitProducts productos={productosGlob} />
                </motion.div>
              </div>

              {/* Charts Row - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* Left Column: Top Products & Average Ticket */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} 
                  className="lg:col-span-1 space-y-6"
                >
                  <SalesByProductChart 
                    products={topProductsArray}
                    title={isAdmin ? "Top Productos Vendidos" : "Mis Productos Favoritos"}
                    subtitle={isAdmin ? "Artículos de mayor salida en la tienda" : "Artículos que más has comprado"}
                  />
                  {isAdmin && (
                    <AverageTicket 
                      totalSales={ventasTotales} 
                      orderCount={filteredVentas.length} 
                    />
                  )}
                </motion.div>

                {/* Right Column: Main Sales Table */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} 
                  className="lg:col-span-2"
                >
                  <SalesTable ventas={filteredVentas} loading={loadingData} />
                </motion.div>
              </div>

            {/* Bottom Section: Goals & Intelligence - Responsive */}
            {isAdmin && (
              <div className="space-y-8 mt-4">
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 24
                  }}
                >
                  <SalesGoals currentSales={ventasTotales} target={200000} />
                  <WholesalerGoal currentCount={4} target={10} />
                  <CollectionGoal 
                    currentCollected={filteredCuentas.reduce((acc, c) => acc + (c.monto_pagado || 0), 0)} 
                    totalPending={filteredCuentas.reduce((acc, c) => acc + (c.monto_pendiente || 0), 0)} 
                  />
                  <SalesVsCollection 
                    totalSales={ventasTotales}
                    totalCollected={filteredCuentas.reduce((acc, c) => acc + (c.monto_pagado || 0), 0)}
                  />
                </motion.div>

                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <FinancialSummary 
                    productos={productosGlob}
                  />
                </motion.div>

                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <InventoryReportSection 
                    productos={productosGlob} 
                    ventas={filteredVentas} 
                  />
                </motion.div>
              </div>
            )}

              {/* Extra Analytics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <SalesByCategoryChart 
                  ventas={ventasAprobadas}
                  categorias={categorias}
                  title="Distribución por Categorías"
                  subtitle="Volumen de artículos movilizados"
                />

                <SalesVsConsignmentChart 
                  ventasTotales={productosVendidosTotal}
                  consignacionVendida={consignacionTotalVendida}
                  title="Ventas vs Consignación"
                  subtitle="Distribución del modelo logístico (uds)"
                />

                {isAdmin && (
                  <SalesByWholesalerChart 
                    ventas={ventasAprobadas}
                    title="Top Rendimiento de Mayoristas"
                    subtitle="Comparativo global de usuarios estrella"
                  />
                )}
              </div>


            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                 <Skeleton height={120} borderRadius={20} />
                 <Skeleton height={120} borderRadius={20} />
                 <Skeleton height={120} borderRadius={20} />
                 <Skeleton height={120} borderRadius={20} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
                 <Skeleton height={400} borderRadius={24} />
                 <Skeleton height={400} borderRadius={24} />
              </div>
              <Skeleton height={300} borderRadius={24} />
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
