"use client";

import { useState, useEffect } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import ReportKPIs from "./_components/ReportKPIs";
import ReportFilters, { PeriodoTab } from "./_components/ReportFilters";
import SalesAreaChart from "./_components/SalesAreaChart";
import AnalyticsDonut from "./_components/AnalyticsDonut";
import RecentActivities from "./_components/RecentActivities";
import ProfitReinvestment from "./_components/ProfitReinvestment";
import SalesTable from "./_components/SalesTable";

import { createClient } from "@/utils/supabase/client";
import { VentaService } from "@/lib/services/VentaService";
import { ProductoService } from "@/lib/services/ProductoService";
import { InsumoService } from "@/lib/services/InsumoService";
import { Venta } from "@/lib/models/Venta";
import { Producto } from "@/lib/models/Producto";
import { Insumo } from "@/lib/models/Insumo";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<PeriodoTab>("MENSUAL");
  
  // Custom date formatter: YYYY-MM-DD
  const fmtDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  
  // Set default to 1st of current month
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return fmtDate(d);
  });
  const [endDate, setEndDate] = useState(fmtDate(today));

  // Update date ranges when activeTab changes
  useEffect(() => {
    const now = new Date();
    if (activeTab === "DIARIO") {
      setStartDate(fmtDate(now));
      setEndDate(fmtDate(now));
    } else if (activeTab === "SEMANAL") {
      const w = new Date();
      w.setDate(w.getDate() - 7);
      setStartDate(fmtDate(w));
      setEndDate(fmtDate(now));
    } else if (activeTab === "MENSUAL") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(fmtDate(startOfMonth));
      setEndDate(fmtDate(now));
    } else if (activeTab === "ANUAL") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      setStartDate(fmtDate(startOfYear));
      setEndDate(fmtDate(now));
    }
  }, [activeTab]);

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Compute KPI metrics from DB data
  const valorInventario = productos.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock_actual || 0)), 0);
  const totalPiezas = productos.reduce((acc, p) => acc + (p.stock_actual || 0), 0);
  const stockBajo = productos.filter(p => (p.stock_actual || 0) <= (p.stock_min || 0) && (p.stock_actual || 0) > 0).length;
  const agotados = productos.filter(p => (p.stock_actual || 0) === 0).length;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();
      const vs = new VentaService(supabase);
      const ps = new ProductoService(supabase);
      const is = new InsumoService(supabase);

      const [resVentas, resProductos, resInsumos] = await Promise.all([
        vs.obtenerTodas(),
        ps.obtenerTodos(),
        is.obtenerTodos()
      ]);

      if (resVentas.ventas) setVentas(resVentas.ventas);
      if (resProductos.productos) setProductos(resProductos.productos);
      if (resInsumos.insumos) setInsumos(resInsumos.insumos);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter ventas by date range
  const filteredVentas = ventas.filter(v => {
    const vDate = new Date(v.fecha).toISOString().split("T")[0];
    return vDate >= startDate && vDate <= endDate;
  });

  // Filter insumos by date range
  const filteredInsumos = insumos.filter(i => {
    if (!i.fecha_registro) return false;
    const iDate = new Date(i.fecha_registro).toISOString().split("T")[0];
    return iDate >= startDate && iDate <= endDate;
  });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F2F4F8" }}>
      <SidebarMenu />

      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] space-y-6">
          
          <ReportFilters
            activeTab={activeTab} onTabChange={setActiveTab}
            startDate={startDate} endDate={endDate}
            onStartDateChange={setStartDate} onEndDateChange={setEndDate}
          />

          <ReportKPIs
            valorInventario={valorInventario}
            totalPiezas={totalPiezas}
            stockBajo={stockBajo}
            agotados={agotados}
          />

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 20,
            width: "100%",
          }} className="reports-row-mid">
            <style>{`
              @media (max-width: 1024px) { .reports-row-mid { grid-template-columns: 1fr !important; } }
            `}</style>
            
            <div style={{ minWidth: 0 }}>
              <SalesAreaChart ventas={filteredVentas} insumos={filteredInsumos} productos={productos} startDate={startDate} endDate={endDate} />
            </div>
            <div>
              <AnalyticsDonut ventas={filteredVentas} />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 20,
            width: "100%",
          }} className="reports-row-bot">
            <style>{`
              @media (max-width: 1024px) { .reports-row-bot { grid-template-columns: 1fr !important; } }
            `}</style>

            {/* Left Sidebar Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <ProfitReinvestment ventas={filteredVentas} productos={productos} />
              <RecentActivities ventas={filteredVentas} />
            </div>

            {/* Main Table Area */}
            <div style={{ minWidth: 0 }}>
              <SalesTable ventas={filteredVentas} loading={loading} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
