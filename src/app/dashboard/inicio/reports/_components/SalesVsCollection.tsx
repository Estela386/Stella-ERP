"use client";

import { Scale, AlertCircle } from "lucide-react";

interface SalesVsCollectionProps {
  totalSales: number;
  totalCollected: number;
}

export default function SalesVsCollection({ totalSales, totalCollected }: SalesVsCollectionProps) {
  const pending = totalSales - totalCollected;
  const ratio = totalSales > 0 ? (totalCollected / totalSales) * 100 : 0;
  
  return (
    <div style={{
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      minHeight: 200,
      background: "linear-gradient(135deg, #fff 0%, #F7FAFC 100%)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#EBF8FF", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Scale size={18} color="#3182CE" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Balance de Flujo
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Ventas vs Recaudación
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 15, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#718096" }}>Liquidez</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#3182CE" }}>{ratio.toFixed(1)}%</span>
        </div>
        <div style={{
          width: "100%", height: 10, background: "#EDF2F7", borderRadius: 5, overflow: "hidden"
        }}>
          <div style={{
            width: `${ratio}%`, height: "100%",
            background: "linear-gradient(90deg, #63B3ED 0%, #3182CE 100%)",
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
        <AlertCircle size={14} color="#3182CE" />
        <span>Saldo en calle: ${pending.toLocaleString("es-MX")}</span>
      </div>
    </div>
  );
}
