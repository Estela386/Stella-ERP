"use client";

import { ShoppingBag, Truck, Star, TrendingUp } from "lucide-react";
import type { OrdersStats as IOrdersStats } from "../type";

interface OrdersStatsProps {
  stats: IOrdersStats;
}

export default function OrdersStats({ stats }: OrdersStatsProps) {
  const cards = [
    {
      label: "Pedidos Totales",
      value: stats.totalPedidos,
      icon: <ShoppingBag size={20} />,
      color: "#b76e79",
      bg: "rgba(183,110,121,0.08)"
    },
    {
      label: "En Camino / Enviados",
      value: stats.pedidosEnviados,
      icon: <Truck size={20} />,
      color: "#4a5568",
      bg: "rgba(112,128,144,0.08)"
    },
    {
      label: "Puntos Acumulados",
      value: stats.puntosAcumulados,
      icon: <Star size={20} />,
      color: "#8c9768",
      bg: "rgba(140,151,104,0.08)"
    },
    {
      label: "Nivel de Lealtad",
      value: "Premium",
      icon: <TrendingUp size={20} />,
      color: "#b76e79",
      bg: "rgba(183,110,121,0.08)"
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 16,
      marginBottom: 32
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: "#ffffff",
          padding: "clamp(18px, 2.2vw, 26px)",
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(140,151,104,0.08)",
          border: "1px solid rgba(112,128,144,0.18)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          transition: "all 0.22s ease",
          cursor: "default"
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 18px 40px rgba(140,151,104,0.22)";
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(140,151,104,0.08)";
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgba(112,128,144,0.12)",
            border: "1px solid rgba(112,128,144,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#708090"
          }}>
            {card.icon}
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.68rem",
              color: "#4a5568",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500
            }}>{card.label}</div>
            <div style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "1.52rem",
              fontWeight: 600,
              color: "#b76e79"
            }}>{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
