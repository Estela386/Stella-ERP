"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface ProductSaleItem {
  nombre: string;
  cantidad: number;
  totalVendido: number;
}

interface SalesByProductChartProps {
  products: ProductSaleItem[];
  title?: string;
  subtitle?: string;
}

export default function SalesByProductChart({ 
  products,
  title = "Top Productos Vendidos",
  subtitle = "Basado en cantidad de piezas"
}: SalesByProductChartProps) {
  
  // Sort by quantity descending and take top 5
  const chartData = [...products]
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)
    .map(p => ({
      name: p.nombre.length > 20 ? p.nombre.substring(0, 20) + "..." : p.nombre,
      Cantidad: p.cantidad,
      Ventas: p.totalVendido
    }));

  const COLORS = ["#B76E79", "#C07E88", "#D4A5A5", "#758390", "#9CA3AF"];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: 600,
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

      <div style={{ flex: 1, minHeight: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A94A6" }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: "#2A2E34", fontFamily: "var(--font-sans)" }} 
              width={100}
            />
            <Tooltip 
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", fontFamily: "var(--font-poppins)", fontSize: "0.85rem" }}
            />
            <Bar dataKey="Cantidad" radius={[0, 4, 4, 0]} barSize={35}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
