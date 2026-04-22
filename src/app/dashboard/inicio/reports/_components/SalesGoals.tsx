"use client";

import { Target, TrendingUp } from "lucide-react";

interface SalesGoalsProps {
  currentSales: number;
  target?: number;
}

export default function SalesGoals({ currentSales, target = 150000 }: SalesGoalsProps) {
  const percentage = Math.min(Math.round((currentSales / target) * 100), 100);
  
  return (
    <div style={{
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      minHeight: 200,
      background: "linear-gradient(135deg, #fff 0%, #F9FAFB 100%)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Target size={18} color="#319795" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Meta de Ventas Mensual
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Progreso del objetivo comercial
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 15, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#718096" }}>Progreso Actual</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#319795" }}>{percentage}%</span>
        </div>
        <div style={{
          width: "100%", height: 10, background: "#EDF2F7", borderRadius: 5, overflow: "hidden"
        }}>
          <div style={{
            width: `${percentage}%`, height: "100%",
            background: "linear-gradient(90deg, #38B2AC 0%, #319795 100%)",
            borderRadius: 5, transition: "width 1s ease-out"
          }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "0.6rem", color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vendido</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2D3748" }}>
            ${currentSales.toLocaleString("es-MX")}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.6rem", color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Objetivo</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#718096" }}>
            ${target.toLocaleString("es-MX")}
          </div>
        </div>
      </div>

      {percentage >= 100 && (
        <div style={{ 
          marginTop: 15, padding: "8px", borderRadius: 8, 
          background: "#E6FFFA", border: "1px solid #B2F5EA",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.65rem", color: "#2C7A7B", fontWeight: 600
        }}>
          <TrendingUp size={14} />
          ¡Objetivo alcanzado! Excelente desempeño.
        </div>
      )}
    </div>
  );
}
