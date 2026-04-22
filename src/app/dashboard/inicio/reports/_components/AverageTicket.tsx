"use client";

import { Receipt, TrendingUp } from "lucide-react";

interface AverageTicketProps {
  totalSales: number;
  orderCount: number;
  prevAverage?: number;
}

export default function AverageTicket({ totalSales, orderCount, prevAverage = 450 }: AverageTicketProps) {
  const average = orderCount > 0 ? totalSales / orderCount : 0;
  const isUp = average >= prevAverage;
  
  return (
    <div style={{
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      marginTop: 20,
      background: "linear-gradient(135deg, #fff 0%, #FDFCFB 100%)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#F0FFF4", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Receipt size={18} color="#38A169" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Ticket Promedio
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Consumo medio por pedido
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2D3748" }}>
            ${average.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 4, 
            fontSize: "0.7rem", color: isUp ? "#38A169" : "#E53E3E", 
            fontWeight: 700, marginTop: 4 
          }}>
            <TrendingUp size={14} style={{ transform: isUp ? "none" : "rotate(90deg)" }} />
            {isUp ? "+" : "-"}{Math.abs(((average - prevAverage) / prevAverage) * 100).toFixed(1)}% vs ant.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.6rem", color: "#A0AEC0", textTransform: "uppercase" }}>Pedidos</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#4A5568" }}>{orderCount}</div>
        </div>
      </div>
    </div>
  );
}
