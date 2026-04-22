"use client";

import { TrendingUp, Award } from "lucide-react";
import { IProducto } from "@/lib/models";

interface TopProfitProductsProps {
  productos: IProducto[];
}

export default function TopProfitProducts({ productos }: TopProfitProductsProps) {
  // Calculate margin and sort
  const highMarginProducts = productos
    .filter(p => p.precio && p.precio > 0)
    .map(p => {
      const hasCost = p.costo && p.costo > 0;
      
      // 1. Quitar el 16% de IVA
      const precioSinIVA = (p.precio || 0) / 1.16;
      // 2. Quitar el 60% adicional (quedarse con el 40%)
      const ingresoNetoReal = precioSinIVA * 0.40;
      
      // 3. Calcular margen sobre el costo (si existe)
      const margenNeto = hasCost ? ((ingresoNetoReal - p.costo!) / p.costo!) * 100 : 0;

      return {
        ...p,
        margin: margenNeto,
        hasCost
      };
    })
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  const hasAnyProduct = highMarginProducts.length > 0;

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
          background: "#FFF9E6", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Award size={18} color="#D69E2E" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          }}>
            Productos más Rentables
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.7rem", color: "#8A94A6", margin: "2px 0 0",
          }}>
            Mayor margen de ganancia por unidad
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {hasAnyProduct ? (
          highMarginProducts.map((p, index) => (
            <div 
              key={p.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: 10,
                background: index === 0 && p.hasCost ? "rgba(214, 158, 46, 0.05)" : "transparent",
                border: index === 0 && p.hasCost ? "1px solid rgba(214, 158, 46, 0.1)" : "1px solid #F1F5F9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: index === 0 && p.hasCost ? "#D69E2E" : "#CBD5E0" }}>#{index + 1}</span>
                <span style={{ 
                  fontFamily: "var(--font-sans)", 
                  fontSize: "0.75rem", 
                  fontWeight: 600,
                  color: "#4A5568"
                }}>
                  {p.nombre}
                </span>
              </div>
              
              {p.hasCost ? (
                <div style={{ 
                  fontSize: "0.8rem", 
                  fontWeight: 800, 
                  color: p.margin > 0 ? "#38A169" : "#E53E3E",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  <TrendingUp size={12} />
                  {p.margin.toFixed(0)}%
                </div>
              ) : (
                <div style={{ 
                  fontSize: "0.6rem", 
                  fontWeight: 600, 
                  color: "#A0AEC0",
                  background: "#F7FAFC",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid #E2E8F0"
                }}>
                  ⚠️ Sin Costo
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ 
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "20px", background: "rgba(248, 250, 252, 0.5)", borderRadius: 12, border: "1px dashed #E2E8F0"
          }}>
            <TrendingUp size={24} color="#CBD5E0" style={{ marginBottom: 8 }} />
            <p style={{ fontSize: "0.65rem", color: "#A0AEC0", textAlign: "center", margin: 0 }}>
              Registra productos en el inventario para ver este panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
