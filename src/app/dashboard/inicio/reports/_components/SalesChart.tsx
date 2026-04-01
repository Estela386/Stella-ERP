"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DATA = [
  { mes: "Oct", ingresos: 95000, costos: 46000 },
  { mes: "Nov", ingresos: 110000, costos: 52000 },
  { mes: "Dic", ingresos: 138000, costos: 64000 },
  { mes: "Ene", ingresos: 102000, costos: 49000 },
  { mes: "Feb", ingresos: 118000, costos: 55000 },
  { mes: "Mar", ingresos: 125000, costos: 61200 },
];

function fmt(v: number) {
  return `$${(v / 1000).toFixed(0)}k`;
}

export default function SalesChart() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(112,128,144,0.11)",
        borderTop: "3px solid #708090",
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <h3 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.9rem", fontWeight: 700, color: "#1C1C1C", margin: 0,
        }}>
          Ingresos vs Costos
        </h3>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
        }}>
          Comparativa mensual — últimos 6 meses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={DATA} barCategoryGap="25%" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#F0EDE8" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "#8C9796", fontFamily: "var(--font-poppins)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: "#8C9796", fontFamily: "var(--font-poppins)" }}
            axisLine={false} tickLine={false} width={42}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              value !== undefined && typeof value === 'number' ? `$${value.toLocaleString("es-MX")}` : "$0",
              name === "ingresos" ? "Ingresos" : "Costos",
            ]}
            contentStyle={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #F0EDE8",
              boxShadow: "0 4px 14px rgba(112,128,144,0.18)",
              fontFamily: "var(--font-poppins)", fontSize: 12,
            }}
            labelStyle={{ color: "#708090", fontWeight: 600, fontFamily: "var(--font-marcellus)" }}
          />
          <Legend
            formatter={v => v === "ingresos" ? "Ingresos" : "Costos"}
            wrapperStyle={{ fontFamily: "var(--font-marcellus)", fontSize: 11, paddingTop: 10 }}
          />
          <Bar dataKey="ingresos" fill="#708090" radius={[5, 5, 0, 0]} />
          <Bar dataKey="costos" fill="#E8C2C7" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
