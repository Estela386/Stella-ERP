"use client";

import { UserPlus, Star } from "lucide-react";

interface WholesalerGoalProps {
  currentCount: number;
  target?: number;
}

export default function WholesalerGoal({ currentCount, target = 10 }: WholesalerGoalProps) {
  const percentage = Math.min(Math.round((currentCount / target) * 100), 100);
  
  return (
    <div style={{
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      minHeight: 200,
      background: "linear-gradient(135deg, #fff 0%, #F5F7FA 100%)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#EBF8FF", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <UserPlus size={18} color="#3182CE" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Nuevos Mayoristas
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Crecimiento de red comercial
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 15, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#718096" }}>Nuevos Registros</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#3182CE" }}>{currentCount} / {target}</span>
        </div>
        <div style={{
          width: "100%", height: 10, background: "#EDF2F7", borderRadius: 5, overflow: "hidden"
        }}>
          <div style={{
            width: `${percentage}%`, height: "100%",
            background: "linear-gradient(90deg, #4299E1 0%, #3182CE 100%)",
            borderRadius: 5, transition: "width 1s ease-out"
          }} />
        </div>
      </div>

      <div style={{ 
        padding: "10px", borderRadius: 10, 
        background: "rgba(49, 130, 206, 0.05)",
        display: "flex", alignItems: "center", gap: 8,
        fontSize: "0.65rem", color: "#2B6CB0"
      }}>
        <Star size={14} fill="#2B6CB0" />
        <span>{10 - currentCount} registros más para la meta semanal.</span>
      </div>
    </div>
  );
}
