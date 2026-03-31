"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";
import { Venta } from "@/lib/models/Venta";

interface AnalyticsDonutProps {
  ventas: Venta[];
}

export default function AnalyticsDonut({ ventas }: AnalyticsDonutProps) {
  // Aggregate sales by estado
  let aprobadas = 0;
  let pendientes = 0;
  let canceladas = 0;

  ventas.forEach(v => {
    if (v.estado === "aprobada") aprobadas++;
    else if (v.estado === "pendiente") pendientes++;
    else if (v.estado === "cancelada" || v.estado === "denegada") canceladas++;
  });

  const DATA = [
    { name: "Completadas", value: aprobadas, color: "#708090" }, // Slate Gray
    { name: "Pendientes",  value: pendientes,color: "#B76E79" }, // Warning Orange 
    { name: "Canceladas",  value: canceladas,color: "#B76E79" }, // Muted Rose
  ].filter(d => d.value > 0);

  const total = ventas.length;
  // Handle empty state securely
  const emptyData = [{ name: "Sin datos", value: 1, color: "#E2E8F0" }];

  const chartData = total > 0 ? DATA : emptyData;

  const percentage = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.9rem", fontWeight: 600, color: "#2A2E34", margin: 0,
        }}>
          Estado de Ventas
        </h3>
        <MoreHorizontal size={18} color="#8A94A6" style={{ cursor: "pointer" }} />
      </div>

      {/* Donut Chart */}
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
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "1.6rem", fontWeight: 800, color: "#2A2E34" }}>
            {percentage}%
          </span>
          <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.65rem", color: "#8A94A6" }}>
            Éxito
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
        {total > 0 ? DATA.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.7rem", color: "#8A94A6" }}>
              {d.name}
            </span>
          </div>
        )) : (
          <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.7rem", color: "#8A94A6" }}>Sin registros en este periodo</span>
        )}
      </div>
    </div>
  );
}
