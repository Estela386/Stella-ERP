"use client";

import { Package, CheckCircle, XCircle, Clock } from "lucide-react";

interface StatsCardsProps {
  total: number;
  activas: number;
  finalizadas: number;
  canceladas: number;
}

export default function StatsCards(props: StatsCardsProps) {
  const items = [
    { label: "Total Consignaciones", value: props.total, bgStart: "#C07E88", bgEnd: "#B76E79", icon: Package },
    { label: "Consignaciones Activas", value: props.activas, bgStart: "#758390", bgEnd: "#657582", icon: Clock },
    { label: "Ventas Finalizadas", value: props.finalizadas, bgStart: "#C07E88", bgEnd: "#B76E79", icon: CheckCircle },
    { label: "Entregas Canceladas", value: props.canceladas, bgStart: "#758390", bgEnd: "#657582", icon: XCircle },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20,
      width: "100%",
      boxSizing: "border-box",
    }} className="stella-consignaciones-stats">
      <style>{`
        @media (max-width: 1024px) { 
          .stella-consignaciones-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } 
        }
        @media (max-width: 600px)  { 
          .stella-consignaciones-stats { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important; 
          } 
        }
        
        .stat-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
      
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="stat-card-hover"
            style={{
              background: `linear-gradient(to bottom right, ${item.bgStart}, ${item.bgEnd})`,
              borderRadius: 16,
              padding: "clamp(14px, 3.5vw, 24px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
              gap: 16,
              minHeight: "clamp(110px, 15vw, 130px)",
              cursor: "default",
            }}
          >
            {/* Header: Label + Small Icon */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
              <p style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
                margin: 0,
                lineHeight: 1.2,
                maxWidth: "80%",
              }}>
                {item.label}
              </p>
              <div style={{ 
                background: "rgba(255,255,255,0.15)", 
                padding: "clamp(4px, 1.5vw, 8px)", 
                borderRadius: 10, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon size={18} color="#FFFFFF" strokeWidth={2} />
              </div>
            </div>

            {/* Body: Value */}
            <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
              <p style={{
                fontFamily: "var(--font-marcellus, serif)",
                fontSize: "clamp(1.3rem, 4vw, 2.2rem)", 
                fontWeight: 400,
                margin: 0, 
                lineHeight: 1,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {item.value.toLocaleString()}
              </p>
            </div>

            {/* Decorative Background Icon */}
            <div style={{
              position: "absolute",
              right: "-10%",
              bottom: "-15%",
              opacity: 0.1,
              transform: "rotate(-15deg)",
              pointerEvents: "none",
              zIndex: 1
            }}>
              <Icon size={100} color="#FFFFFF" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
