"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SalesStatusChartProps {
  aprobadas: number;
  pendientes: number;
  canceladas: number;
  title?: string;
  subtitle?: string;
}

export default function SalesStatusChart({ 
  aprobadas, pendientes, canceladas, 
  title = "Estado de Ventas",
  subtitle = "Distribución de estados"
}: SalesStatusChartProps) {
  
  const DATA = [
    { name: "Completadas", value: aprobadas, color: "#758390" }, // Slate Gray
    { name: "Pendientes",  value: pendientes,color: "#D4A5A5" }, // Light Rose 
    { name: "Canceladas / Denegadas",  value: canceladas,color: "#B76E79" }, // Muted Rose
  ].filter(d => d.value > 0);

  const total = aprobadas + pendientes + canceladas;
  const emptyData = [{ name: "Sin datos", value: 1, color: "#E2E8F0" }];
  const chartData = total > 0 ? DATA : emptyData;

  const percentage = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

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
      <div style={{ marginBottom: 10 }}>
        <h3 style={{ fontFamily: "var(--font-marcellus)", fontSize: "1rem", fontWeight: 700, color: "#2A2E34", margin: 0 }}>
          {title}
        </h3>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#8A94A6", margin: "4px 0 0" }}>
          {subtitle}
        </p>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius="65%" outerRadius="85%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", fontFamily: "var(--font-poppins)", fontSize: "0.85rem" }} />
          </PieChart>
        </ResponsiveContainer>
        
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "1.8rem", fontWeight: 800, color: "#2A2E34" }}>
            {percentage}%
          </span>
          <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.75rem", color: "#8A94A6" }}>
            Éxito
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
        {total > 0 ? DATA.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#4B5563" }}>
              {d.name} ({d.value})
            </span>
          </div>
        )) : (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#8A94A6" }}>Sin registros en este periodo</span>
        )}
      </div>
    </div>
  );
}
