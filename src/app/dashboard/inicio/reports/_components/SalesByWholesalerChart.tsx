"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface Props {
  ventas: any[];
  title: string;
  subtitle: string;
}

export default function SalesByWholesalerChart({ ventas, title, subtitle }: Props) {
  const data = useMemo(() => {
    // We assume a Mayorista has id_rol = 3 or es_mayorista = true 
    // depending on the loaded user object. Check what exists in `ventas`.
    const map: Record<string, number> = {};

    ventas.forEach((v) => {
      // Filter if needed, but here we can just group by user name
      // Usually "guest" or general client doesn't count as Mayorista for this chart
      // but we will group by user anyway, and filter nulls/guests
      if (!v.usuario || v.usuario.id_rol === 1) return; // ignore admin/guests
      
      const isMayorista = v.usuario.id_rol === 3 || v.usuario.es_mayorista;
      if (!isMayorista) return;

      const userName = v.usuario.nombre || v.usuario.id_auth.substring(0, 8);
      
      if (!map[userName]) map[userName] = 0;
      map[userName] += (v.total || 0);
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // top 6 wholesalers to keep it clean
  }, [ventas]);

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
            Sin datos de mayoristas en el periodo actual
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8A94A6", fontSize: 11, fontFamily: "var(--font-sans)" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8A94A6", fontSize: 11, fontFamily: "var(--font-sans)" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{ fill: "rgba(117, 131, 144, 0.05)" }}
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontFamily: "var(--font-sans)", fontSize: "0.8rem" }}
                itemStyle={{ color: "#2A2E34", fontWeight: 600 }}
                formatter={(value: any) => [`$${(value || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, "Total Comprado"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500} animationEasing="ease-out">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#C07E88" : "#758390"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
