"use client";

import { DollarSign, Package, TrendingUp, Users, ShoppingBag, ArrowUpRight, BarChart3, CreditCard } from "lucide-react";

export interface KPI {
  label: string;
  value: string | number;
  icon: string;
  bgStart: string;
  bgEnd: string;
}

interface ReportKPIsProps {
  kpis: KPI[];
}

export default function ReportKPIs({ kpis }: ReportKPIsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dollar": return DollarSign;
      case "package": return Package;
      case "trending": return TrendingUp;
      case "users": return Users;
      case "shopping-bag": return ShoppingBag;
      case "arrow-up": return ArrowUpRight;
      case "bar-chart": return BarChart3;
      case "credit": return CreditCard;
      default: return Package;
    }
  };

  return (
    <>
      <style>{`
        .kpi-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        @media (min-width: 768px) {
          .kpi-card-hover:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
        }
        @media (max-width: 640px) {
          .report-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
      
      <div className="report-kpi-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        width: "100%",
        boxSizing: "border-box",
      }}>
        {kpis.map((k, idx) => {
          const Icon = getIcon(k.icon);

          return (
            <div
              key={`${k.label}-${idx}`}
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
    </>
  );
}
