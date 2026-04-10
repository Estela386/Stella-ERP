"use client";

import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Props {
  ventas: any[];
  categorias: any[];
  title: string;
  subtitle: string;
}

export default function SalesByCategoryChart({ ventas, categorias, title, subtitle }: Props) {
  const data = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    ventas.forEach((v) => {
      if (v.detalles && Array.isArray(v.detalles)) {
        v.detalles.forEach((det: any) => {
          const catId = det.producto?.id_categoria;
          const qty = det.cantidad || 0;
          
          let catName = "Sin Categoría";
          if (catId) {
            const found = categorias.find(c => c.id === catId);
            if (found && found.nombre) catName = found.nombre;
          }
          
          if (!categoryMap[catName]) categoryMap[catName] = 0;
          categoryMap[catName] += qty;
        });
      }
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [ventas, categorias]);

  const COLORS = ["#758390", "#C07E88", "#D4A5A5", "#8A94A6", "#B76E79", "#E2E8F0"];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: "100%",
      minHeight: 380
    }}>
      <div style={{ marginBottom: 20 }}>
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

      <div style={{ flex: 1, minHeight: 250 }}>
        {data.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "var(--font-sans)" }}>
            Sin datos suficientes
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontFamily: "var(--font-sans)", fontSize: "0.8rem" }}
                itemStyle={{ color: "#2A2E34", fontWeight: 600 }}
                formatter={(value: any) => [`${value} unidades`, "Cantidad"]}
              />
              <Legend 
                verticalAlign="bottom" height={36} iconType="circle"
                wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#4B5563" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
