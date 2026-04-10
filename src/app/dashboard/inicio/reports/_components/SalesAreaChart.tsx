"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

interface LineChartItem {
  fecha: string;
  total: number;
}

interface SalesAreaChartProps {
  ventas: LineChartItem[];
  title?: string;
  subtitle?: string;
  totalLabel?: string;
}

export default function SalesAreaChart({ 
  ventas,
  title = "Análisis de Ventas (Completadas)", 
  subtitle = "Resumen del periodo seleccionado",
  totalLabel = "Ingresos Totales" 
}: SalesAreaChartProps) {
  // Compute group array by exact Date chronologically
  const groupedDates: Record<string, { ts: number; ingresos: number }> = {};
  
  if (ventas && ventas.length > 0) {
    ventas.forEach(v => {
      if (!v.fecha) return; 
      const dateStr = v.fecha.split("T")[0]; // YYYY-MM-DD
      if (!groupedDates[dateStr]) {
        groupedDates[dateStr] = { ts: new Date(dateStr).getTime(), ingresos: 0 };
      }
      groupedDates[dateStr].ingresos += v.total || 0;
    });
  }

  const chartData = Object.values(groupedDates)
    .sort((a, b) => a.ts - b.ts)
    .map(d => {
      // e.g. "25 mar"
      // Added +86400000 to prevent local timezone from shifting it back a day (since dateStr is UTC midnight)
      const label = new Date(d.ts + 86400000).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' });
      return { mes: label, Ingresos: d.ingresos };
    });

  // Fallback if no specific data exists
  const renderData = chartData.length > 0 ? chartData : [
    { mes: "Sin datos", Ingresos: 0 }
  ];

  const totalIngresos = chartData.reduce((acc, d) => acc + d.Ingresos, 0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: "100%",
      minHeight: 320
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "1rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.75rem", color: "#8A94A6", margin: "4px 0 0",
          }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flex: 1, flexDirection: "column" }}>
        {/* Left Stats Block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "2rem", fontWeight: 800, color: "#2A2E34", margin: 0, lineHeight: 1.1,
          }}>${totalIngresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</h2>
          <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.8rem", color: "#8A94A6", margin: "4px 0 0" }}>
            {totalLabel}
          </p>
        </div>

        {/* Chart Area */}
        <div style={{ flex: 1, minWidth: 0, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={renderData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C07E88" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#C07E88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A94A6", fontFamily: "var(--font-poppins)" }} dy={10} />
              <YAxis 
                axisLine={false} tickLine={false} 
                tick={{ fontSize: 11, fill: "#8A94A6", fontFamily: "var(--font-poppins)" }}
                tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(val: any, name: any) => [`$${Number(val || 0).toLocaleString("es-MX")}`, name]}
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", fontFamily: "var(--font-poppins)", fontSize: "0.85rem" }} 
              />
              <Area 
                type="monotone" dataKey="Ingresos" 
                stroke="#C07E88" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" 
                activeDot={{ r: 6, fill: "#C07E88", strokeWidth: 0 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
