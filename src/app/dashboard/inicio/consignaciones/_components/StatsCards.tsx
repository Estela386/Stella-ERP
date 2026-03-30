"use client";

import { Package, CheckCircle, XCircle, Clock } from "lucide-react";

interface StatsCardsProps {
  total: number;
  activas: number;
  finalizadas: number;
  canceladas: number;
}

const stats = [
  {
    key: "total" as const,
    label: "Total",
    Icon: Package,
    bg: "linear-gradient(135deg,#708090 0%,#5a6a7a 100%)",
    glow: "rgba(112,128,144,0.35)",
  },
  {
    key: "activas" as const,
    label: "Activas",
    Icon: CheckCircle,
    bg: "linear-gradient(135deg,#B76E79 0%,#9d5a64 100%)",
    glow: "rgba(183,110,121,0.35)",
  },
  {
    key: "finalizadas" as const,
    label: "Finalizadas",
    Icon: Clock,
    bg: "linear-gradient(135deg,#8c9796 0%,#707e7d 100%)",
    glow: "rgba(140,151,150,0.35)",
  },
  {
    key: "canceladas" as const,
    label: "Canceladas",
    Icon: XCircle,
    bg: "linear-gradient(135deg,#c0856d 0%,#a56a55 100%)",
    glow: "rgba(192,133,109,0.35)",
  },
];

export default function StatsCards(props: StatsCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 14,
      }}
    >
      {stats.map(({ key, label, Icon, bg, glow }) => (
        <div
          key={key}
          style={{
            background: bg,
            borderRadius: 16,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            boxShadow: `0 8px 24px ${glow}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              top: -16,
              right: -16,
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Icon
            size={20}
            style={{ color: "rgba(255,255,255,0.85)", flexShrink: 0 }}
          />
          <div>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1,
                fontFamily: "Manrope,sans-serif",
              }}
            >
              {props[key]}
            </p>
            <p
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
