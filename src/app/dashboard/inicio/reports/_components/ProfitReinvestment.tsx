"use client";

import { Venta } from "@/lib/models/Venta";
import { Producto } from "@/lib/models/Producto";

interface ProfitReinvestmentProps {
  ventas: Venta[];
  productos: Producto[];
}

export default function ProfitReinvestment({ ventas, productos }: ProfitReinvestmentProps) {
  // 1. Calculate Average Margin across the Store from `productos` table
  let totalPrecio = 0;
  let totalCosto = 0;

  productos.forEach(p => {
    totalPrecio += (p.precio || 0);
    totalCosto += (p.costo || 0); // Assuming 'costo' exists on Producto
  });

  const averageMargin = totalPrecio > 0 ? (totalPrecio - totalCosto) / totalPrecio : 0.4; // Fallback to 40% margin

  // 2. Calculate Gross Income from completed sales
  const ingresos = ventas
    .filter(v => v.estado === "aprobada")
    .reduce((acc, v) => acc + v.total, 0);

  // 3. Compute Metrics
  const estimatedCost = ingresos * (1 - averageMargin);
  const gananciaBruta = ingresos - estimatedCost; // Also directly ingresos * averageMargin

  const adminRatio = 0.30;
  const fondoInversion = gananciaBruta * adminRatio;
  const gananciaNeta = gananciaBruta - fondoInversion;

  const fmt = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.03)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      <h3 style={{
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        fontSize: "0.85rem", fontWeight: 700, color: "#2A2E34", margin: "0 0 4px 0",
      }}>
        Ganancias y Administración
      </h3>
      <p style={{
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        fontSize: "0.65rem", color: "#8A94A6", margin: "0 0 20px 0",
      }}>
        Basado en tus ventas completadas
      </p>

      {/* Main Income */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#8A94A6", margin: "0 0 4px 0", fontWeight: 600 }}>
          Ingresos Brutos
        </p>
        <span style={{ fontFamily: "var(--font-display, Manrope, sans-serif)", fontSize: "1.6rem", fontWeight: 800, color: "#2A2E34" }}>
          {fmt(ingresos)}
        </span>
      </div>

      {/* Progress Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        
        {/* Cost vs Gross Profit */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#4A5568", fontWeight: 600 }}>Costo de Mercancía</span>
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#2A2E34", fontWeight: 700 }}>{fmt(estimatedCost)}</span>
          </div>
          <div style={{ width: "100%", background: "#F0F2F5", borderRadius: 4, height: 6 }}>
            <div style={{ width: `${(estimatedCost/ingresos)*100 || 0}%`, background: "#8A94A6", borderRadius: 4, height: "100%" }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#4A5568", fontWeight: 600 }}>Ganancia Antes de Adm.</span>
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#3d8c60", fontWeight: 700 }}>{fmt(gananciaBruta)}</span>
          </div>
          <div style={{ width: "100%", background: "#F0F2F5", borderRadius: 4, height: 6 }}>
            <div style={{ width: `${(gananciaBruta/ingresos)*100 || 0}%`, background: "#3d8c60", borderRadius: 4, height: "100%" }} />
          </div>
        </div>

      </div>

      {/* Admin Split Card */}
      <div style={{ 
        marginTop: 20, 
        padding: "16px", 
        background: "#F7F9FA", 
        borderRadius: 12,
        border: "1px dashed #E2E8F0" 
      }}>
        <h4 style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#2A2E34", fontWeight: 700, margin: "0 0 10px 0" }}>
          Sugerencia de Distribución
        </h4>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#708090" }} />
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#4A5568" }}>Reinversión (30%)</span>
          </div>
          <span style={{ fontFamily: "var(--font-display, Manrope, sans-serif)", fontSize: "0.75rem", fontWeight: 700, color: "#2A2E34" }}>{fmt(fondoInversion)}</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#B76E79" }} />
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.7rem", color: "#4A5568" }}>Ganancia Neta (70%)</span>
          </div>
          <span style={{ fontFamily: "var(--font-display, Manrope, sans-serif)", fontSize: "0.75rem", fontWeight: 700, color: "#2A2E34" }}>{fmt(gananciaNeta)}</span>
        </div>
      </div>

    </div>
  );
}
