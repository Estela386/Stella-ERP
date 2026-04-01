"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopProduct {
  id: number;
  nombre: string;
  ventas: number;
}

const formatMoney = (value: number | string | undefined) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "$0";
  return `$${num.toLocaleString("es-MX")}`;
};

const COLORS = ["#708090", "#8a9ab0", "#a4b4c0", "#b07830", "#B76E79"];

export default function TopProductsChart() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopProducts() {
      try {
        const res = await fetch("/api/dashboard/top-products");
        if (!res.ok) throw new Error("No se pudo cargar top products");
        const data: TopProduct[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los productos"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTopProducts();
  }, []);

  const chartData = products.map((p) => ({ nombre: p.nombre, ventas: p.ventas }));

  const displayData = loading || error ? [] : chartData;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(112,128,144,0.11)",
        borderTop: "3px solid #b07830",
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <h3
          style={{
            fontFamily: "var(--font-display, Manrope, sans-serif)",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#1C1C1C",
            margin: 0,
          }}
        >
          Top 5 — Productos más vendidos
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.67rem",
            color: "#8C9796",
            margin: "2px 0 0",
          }}
        >
          Por ingresos generados en el período
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center py-10 text-sm text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            barSize={16}
          >
          <CartesianGrid
            stroke="#F0EDE8"
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            type="number"
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            tick={{
              fontSize: 10,
              fill: "#8C9796",
              fontFamily: "Inter, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            tick={{
              fontSize: 10,
              fill: "#708090",
              fontFamily: "Inter, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
            width={148}
          />
          <Tooltip
            formatter={(value, name) => {
              const typedValue =
                Array.isArray(value) && value.length > 0 ? value[0] : value;
              return [
                formatMoney(typedValue as number | string | undefined),
                name ? String(name) : "Ingresos",
              ];
            }}
            contentStyle={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #F0EDE8",
              boxShadow: "0 4px 14px rgba(112,128,144,0.18)",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
            }}
            labelStyle={{ color: "#708090", fontWeight: 600 }}
          />
          <Bar dataKey="ventas" radius={[0, 5, 5, 0]}>
            {displayData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
