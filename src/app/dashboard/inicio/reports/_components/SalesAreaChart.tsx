"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Venta } from "@/lib/models/Venta";
import { Insumo } from "@/lib/models/Insumo";
import { Producto } from "@/lib/models/Producto";

interface SalesAreaChartProps {
  ventas: Venta[];
  insumos: Insumo[];
  productos: Producto[];
  startDate: string;
  endDate: string;
}

export default function SalesAreaChart({ ventas, insumos }: SalesAreaChartProps) {
  // Compute group array by exact Date chronologically
  const groupedDates: Record<string, { ts: number; ingresos: number; inversion: number }> = {};
  
  ventas.forEach(v => {
    if (v.estado === "aprobada") {
      const dateStr = v.fecha.split("T")[0]; // YYYY-MM-DD
      if (!groupedDates[dateStr]) {
        groupedDates[dateStr] = { ts: new Date(dateStr).getTime(), ingresos: 0, inversion: 0 };
      }
      groupedDates[dateStr].ingresos += v.total;
    }
  });

  insumos.forEach(i => {
    if (i.fecha_registro) {
      const dateStr = i.fecha_registro.split("T")[0];
      if (!groupedDates[dateStr]) {
        groupedDates[dateStr] = { ts: new Date(dateStr).getTime(), ingresos: 0, inversion: 0 };
      }
      // Calculate investment: precio * cantidad
      groupedDates[dateStr].inversion += (i.precio || 0) * (i.cantidad || 0);
    }
  });

  const chartData = Object.values(groupedDates)
    .sort((a, b) => a.ts - b.ts)
    .map(d => {
      // e.g. "25 mar"
      const label = new Date(d.ts + 86400000).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' });
      return { mes: label, Ingresos: d.ingresos, Inversion: d.inversion };
    });

  // Fallback if no specific data exists
  const renderData = chartData.length > 0 ? chartData : [
    { mes: "Sin datos", Ingresos: 0, Inversion: 0 }
  ];

  const totalIngresos = chartData.reduce((acc, d) => acc + d.Ingresos, 0);
  const totalInversion = chartData.reduce((acc, d) => acc + d.Inversion, 0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.03)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.8rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Análisis de Ventas (Completadas)
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.65rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Resumen del periodo seleccionado
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        {/* Left Stats Block */}
        <div style={{ width: 140, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "1.5rem", fontWeight: 800, color: "#2A2E34", margin: 0, lineHeight: 1.1,
            }}>${totalIngresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</h2>
            <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.65rem", color: "#8A94A6", margin: "4px 0 0" }}>
              Ingresos Totales
            </p>
          </div>
          <div>
            <h2 style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "1.5rem", fontWeight: 800, color: "#2A2E34", margin: 0, lineHeight: 1.1,
            }}>${totalInversion.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</h2>
            <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.65rem", color: "#8A94A6", margin: "4px 0 0" }}>
              Costo / Inversión
            </p>
          </div>
        </div>

        {/* Chart Area */}
        <div style={{ flex: 1, minWidth: 0, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={renderData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#708090" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#708090" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B76E79" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#B76E79" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#8A94A6", fontFamily: "var(--font-poppins)" }} dy={10} />
              <YAxis 
                axisLine={false} tickLine={false} 
                tick={{ fontSize: 10, fill: "#8A94A6", fontFamily: "var(--font-poppins)" }}
                tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(val: any, name: any) => [`$${Number(val || 0).toLocaleString("es-MX")}`, name]}
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }} 
              />
              <Area 
                type="monotone" dataKey="Ingresos" 
                stroke="#708090" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" 
                activeDot={{ r: 6, fill: "#708090", strokeWidth: 0 }} 
              />
              <Area 
                type="monotone" dataKey="Inversion" 
                stroke="#B76E79" strokeWidth={3} fillOpacity={1} fill="url(#colorInversion)" 
                activeDot={{ r: 6, fill: "#B76E79", strokeWidth: 0 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
