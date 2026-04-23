"use client";

import { AlertTriangle, Package } from "lucide-react";
import { IProducto } from "@/lib/models";

interface InventoryAlertsProps {
  productos: IProducto[];
}

export default function InventoryAlerts({ productos }: InventoryAlertsProps) {
  // Filter products with low stock
  const lowStockProducts = productos
    .filter(p => p.stock_actual !== null && p.stock_min !== null && p.stock_actual <= p.stock_min)
    .sort((a, b) => (a.stock_actual || 0) - (b.stock_actual || 0))
    .slice(0, 4);

  if (lowStockProducts.length === 0) return null;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      marginTop: 24
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <AlertTriangle size={18} color="#E53E3E" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Alertas de Reabastecimiento
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Productos por debajo del stock mínimo
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lowStockProducts.map(p => (
          <div 
            key={p.id}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(229, 62, 62, 0.03)",
              border: "1px solid rgba(229, 62, 62, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Package size={14} color="#718096" />
              <span style={{ 
                fontFamily: "var(--font-sans)", 
                fontSize: "0.75rem", 
                fontWeight: 600,
                color: "#4A5568"
              }}>
                {p.nombre}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ 
                fontSize: "0.8rem", 
                fontWeight: 800, 
                color: "#E53E3E"
              }}>
                {p.stock_actual} <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>uds</span>
              </div>
              <div style={{ fontSize: "0.6rem", color: "#A0AEC0" }}>
                Min: {p.stock_min}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        width: "100%", marginTop: 20, padding: "10px",
        borderRadius: 10, background: "none", border: "1px dashed #E2E8F0",
        color: "#718096", fontSize: "0.7rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s"
      }}>
        Ver inventario completo
      </button>
    </div>
  );
}
