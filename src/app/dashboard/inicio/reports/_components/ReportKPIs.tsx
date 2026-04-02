"use client";

import { DollarSign, Package, AlertTriangle, XOctagon } from "lucide-react";

interface KPI {
  label: string;
  value: string | number;
  bgStart: string;
  bgEnd: string;
}

interface ReportKPIsProps {
  valorInventario: number;
  totalPiezas: number;
  stockBajo: number;
  agotados: number;
}

export default function ReportKPIs({
  valorInventario,
  totalPiezas,
  stockBajo,
  agotados,
}: ReportKPIsProps) {
  const kpis: KPI[] = [
    {
      label: "Valor del Inventario",
      value: `$${valorInventario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      bgStart: "#758390", bgEnd: "#6b7a88" // Slate Gray variant
    },
    {
      label: "Total de Piezas",
      value: totalPiezas,
      bgStart: "#C07E88", bgEnd: "#B76E79" // Muted Rose variant
    },
    {
      label: "Stock Bajo",
      value: stockBajo,
      bgStart: "#758390", bgEnd: "#6b7a88" // Slate Gray
    },
    {
      label: "Agotados",
      value: agotados,
      bgStart: "#C07E88", bgEnd: "#B76E79" // Muted Rose
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20,
      width: "100%",
      boxSizing: "border-box",
    }} className="kpi-grid-flat">
      <style>{`
        @media (max-width: 1100px) { 
          .kpi-grid-flat { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } 
        }
        @media (max-width: 600px)  { 
          .kpi-grid-flat { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important; 
          } 
        }
        
        .kpi-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .kpi-card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
      
      {kpis.map(k => {
        let Icon = Package;
        if (k.label.includes("Valor")) Icon = DollarSign;
        if (k.label.includes("Stock")) Icon = AlertTriangle;
        if (k.label.includes("Agotados")) Icon = XOctagon;

        return (
          <div
            key={k.label}
            className="kpi-card-hover"
            style={{
              background: `linear-gradient(to bottom right, ${k.bgStart}, ${k.bgEnd})`,
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
                {k.label}
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
                {k.value}
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
