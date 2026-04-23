"use client";

import { Wallet, TrendingUp, CreditCard, ShoppingBag } from "lucide-react";

interface FinancialSummaryProps {
  productos: any[];
}

export default function FinancialSummary({ productos }: FinancialSummaryProps) {
  // Cálculos basados únicamente en el inventario actual
  const inversionStock = productos.reduce((acc, p) => acc + ((p.stock_actual || 0) * (p.costo || 0)), 0);
  const valorVentaTotal = productos.reduce((acc, p) => acc + ((p.stock_actual || 0) * (p.precio || 0)), 0);
  const gananciaProyectada = valorVentaTotal - inversionStock;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      border: "1px solid rgba(112, 128, 144, 0.08)",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ background: "rgba(183, 110, 121, 0.1)", padding: 8, borderRadius: 12 }}>
          <Wallet size={20} color="#B76E79" />
        </div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1.1rem", color: "#2A2E34" }}>
          Potencial del Inventario Actual
        </h3>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 20 
      }}>
        {/* Inversión en Stock */}
        <div style={{
          padding: "20px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
          border: "1px solid #fed7d7",
          display: "flex",
          flexDirection: "column",
          gap: 4
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#c53030" }}>
            <CreditCard size={14} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Inversión Total en Inventario</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#9b2c2c", fontFamily: "var(--font-marcellus)" }}>
            ${inversionStock.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#f56565" }}>Capital invertido en mercancía actual</div>
        </div>

        {/* Valor de Venta Estimado */}
        <div style={{
          padding: "20px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #ebf8ff 0%, #ffffff 100%)",
          border: "1px solid #bee3f8",
          display: "flex",
          flexDirection: "column",
          gap: 4
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2b6cb0" }}>
            <ShoppingBag size={14} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Valor de Venta (Público)</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2c5282", fontFamily: "var(--font-marcellus)" }}>
            ${valorVentaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#4299e1" }}>Ingreso bruto si se vende todo hoy</div>
        </div>

        {/* Ganancia Proyectada */}
        <div style={{
          padding: "20px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #f0fff4 0%, #ffffff 100%)",
          border: "1px solid #c6f6d5",
          display: "flex",
          flexDirection: "column",
          gap: 4
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2f855a" }}>
            <TrendingUp size={14} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ganancia Proyectada</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#276749", fontFamily: "var(--font-marcellus)" }}>
            ${gananciaProyectada.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#48bb78" }}>Utilidad neta estimada del stock actual</div>
        </div>
      </div>
    </div>
  );
}
