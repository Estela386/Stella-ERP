"use client";

import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Props {
  ventasTotales: number;
  consignacionVendida: number;
  title: string;
  subtitle: string;
}

export default function SalesVsConsignmentChart({ ventasTotales, consignacionVendida, title, subtitle }: Props) {
  const data = useMemo(() => {
    // If we assume ventasTotales already INCLUDES consignacionVendida money,
    // we should separate them. But if `ventasTotales` is money, and `consignacionVendida` is pieces, we have a mismatch!
    // In our page.tsx however, `consignacionVendida` is units (piezas). 
    // And `productosVendidosTotal` is also units.
    // So let's compare by unit volume here if that's safer, OR by financial value if they pass money.
    // For this generic component, we just take the two numbers and treat them as comparable values.
    
    return [
      { name: "Ventas Directas", value: ventasTotales },
      { name: "Consignación", value: consignacionVendida },
    ].filter(d => d.value > 0); // only show > 0
  }, [ventasTotales, consignacionVendida]);

  const COLORS = ["#758390", "#D4A5A5"];

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
            Sin datos comparativos
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={90}
                dataKey="value"
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontFamily: "var(--font-sans)", fontSize: "0.8rem" }}
                itemStyle={{ color: "#2A2E34", fontWeight: 600 }}
                formatter={(value: any) => [`${value} uds`, "Volumen"]}
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
