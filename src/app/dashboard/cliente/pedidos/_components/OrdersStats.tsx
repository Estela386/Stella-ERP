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
          padding: "20px",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(112,128,144,0.05)",
          border: "1px solid rgba(112,128,144,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "default"
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(140,151,104,0.12)";
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(112,128,144,0.05)";
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: card.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: card.color
          }}>
            {card.icon}
          </div>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              color: "#708090",
              fontWeight: 500
            }}>{card.label}</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#4a5568"
            }}>{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
