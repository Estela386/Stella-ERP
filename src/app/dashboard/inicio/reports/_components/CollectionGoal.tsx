"use client";

import { HandCoins, CheckCircle2 } from "lucide-react";

interface CollectionGoalProps {
  currentCollected: number;
  totalPending: number;
}

export default function CollectionGoal({ currentCollected, totalPending }: CollectionGoalProps) {
  const target = currentCollected + totalPending;
  const percentage = target > 0 ? Math.min(Math.round((currentCollected / target) * 100), 100) : 0;
  
  return (
    <div style={{
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      minHeight: 200,
      background: "linear-gradient(135deg, #fff 0%, #FAFAFA 100%)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#F0FFF4", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <HandCoins size={18} color="#38A169" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Meta de Cobranza
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Efectividad de recuperación
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 15, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#718096" }}>Recuperado</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#38A169" }}>{percentage}%</span>
        </div>
        <div style={{
          width: "100%", height: 10, background: "#EDF2F7", borderRadius: 5, overflow: "hidden"
        }}>
          <div style={{
            width: `${percentage}%`, height: "100%",
            background: "linear-gradient(90deg, #48BB78 0%, #38A169 100%)",
            borderRadius: 5, transition: "width 1s ease-out"
          }} />
        </div>
      </div>

      <div style={{ 
        padding: "10px", borderRadius: 10, 
        background: "rgba(56, 161, 105, 0.05)",
        display: "flex", alignItems: "center", gap: 8,
        fontSize: "0.65rem", color: "#2F855A"
      }}>
        <CheckCircle2 size={14} color="#38A169" />
        <span>Pendiente por cobrar: ${totalPending.toLocaleString("es-MX")}</span>
      </div>
    </div>
  );
}
