"use client";

import { useMemo } from "react";
import { AlertCircle, PackageX, PackageSearch } from "lucide-react";

interface Props {
  productos: any[];
  ventas: any[]; // To calculate rotation
}

export default function InventoryReportSection({ productos, ventas }: Props) {
  const { 
    lowStock, 
    noRotation, 
    overStock, 
    valorInventarioBajo, 
    valorExcesoStock 
  } = useMemo(() => {
    // Collect what has been sold in the current period
    const soldProductIds = new Set<number>();
    ventas.forEach((v) => {
      v.detalles?.forEach((d: any) => {
        soldProductIds.add(d.id_producto || d.producto?.id);
      });
    });

    const lowStockList = [];
    const noRotationList = [];
    const overStockList = [];
    let valorInventarioBajo = 0;
    let totalPiezasEnRiesgo = 0;
    let valorExcesoStock = 0;

    for (const p of productos) {
      const stock = p.stock_actual || 0;
      const min = p.stock_min || 0;
      
      if (stock <= min) {
        lowStockList.push(p);
        valorInventarioBajo += stock * (p.precio || 0);
        totalPiezasEnRiesgo += stock;
      }
      
      // Overstock logic: stock > 3x min
      if (min > 0 && stock > min * 3) {
        overStockList.push(p);
        valorExcesoStock += (stock - min) * (p.precio || 0);
      }
      
      // If it exists, has stock, but was NOT sold in the period
      if (stock > 0 && !soldProductIds.has(p.id)) {
        noRotationList.push(p);
      }
    }

    // Sort by most critical (lowest stock)
    lowStockList.sort((a, b) => (a.stock_actual || 0) - (b.stock_actual || 0));
    overStockList.sort((a, b) => (b.stock_actual || 0) - (a.stock_actual || 0));

    return { 
      lowStock: lowStockList, 
      noRotation: noRotationList, 
      overStock: overStockList,
      valorInventarioBajo,
      totalPiezasEnRiesgo,
      valorExcesoStock
    };
  }, [productos, ventas]);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      gap: 20
    }}>
      <div>
        <h3 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "1rem", fontWeight: 700, color: "#2A2E34", margin: 0,
          display: "flex", alignItems: "center", gap: 8
        }}>
          <AlertCircle size={18} color="#C07E88" /> Monitoreo de Inventario Crítico
        </h3>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.75rem", color: "#8A94A6", margin: "4px 0 0",
        }}>
          Alertas de rotura de stock y productos sin movilización en el periodo consultado.
        </p>
      </div>

      {/* New Summary KPIs for Inventory */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div style={{ padding: "16px", borderRadius: 12, background: "rgba(183, 110, 121, 0.05)", border: "1px solid rgba(183, 110, 121, 0.1)" }}>
          <div style={{ fontSize: "0.65rem", color: "#8A94A6", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Ventas en Riesgo</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#b76e79", marginTop: 4 }}>
            ${valorInventarioBajo.toLocaleString("es-MX")}
          </div>
          <div style={{ fontSize: "0.6rem", color: "#A0AEC0", marginTop: 2 }}>Potencial perdido por falta de stock</div>
        </div>
        <div style={{ padding: "16px", borderRadius: 12, background: "rgba(112, 128, 144, 0.05)", border: "1px solid rgba(112, 128, 144, 0.1)" }}>
          <div style={{ fontSize: "0.65rem", color: "#8A94A6", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Capital Estancado</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#708090", marginTop: 4 }}>
            ${valorExcesoStock.toLocaleString("es-MX")}
          </div>
          <div style={{ fontSize: "0.6rem", color: "#A0AEC0", marginTop: 2 }}>Valor de mercancía en exceso (sobrestock)</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        
        {/* Panel Bajo Stock */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#8A94A6", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <PackageX size={14} /> Alertas: Bajo Stock
          </h4>
          <div style={{ background: "#FAFAFA", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", maxHeight: 300, overflowY: "auto" }}>
            {lowStock.length === 0 ? (
               <div style={{ padding: 24, textAlign: "center", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "var(--font-sans)" }}>Sin alertas. Inventario saludable.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#F1F5F9" }}>
                  <tr>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>PRODUCTO</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>STOCK (MIN)</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: "#2A2E34", fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
                        {p.nombre}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           <span style={{ 
                             background: p.stock_actual === 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", 
                             color: p.stock_actual === 0 ? "#ef4444" : "#f59e0b", 
                             padding: "4px 8px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                             fontFamily: "var(--font-sans)"
                           }}>
                             {p.stock_actual} uds
                           </span>
                           <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "var(--font-sans)" }}>/ {p.stock_min}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Panel Sin Rotación */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#8A94A6", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <PackageSearch size={14} /> Productos Sin Rotación (Estancados)
          </h4>
          <div style={{ background: "#FAFAFA", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", maxHeight: 300, overflowY: "auto" }}>
            {noRotation.length === 0 ? (
               <div style={{ padding: 24, textAlign: "center", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "var(--font-sans)" }}>Todos los artículos en inventario mostraron rotación.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#F1F5F9" }}>
                  <tr>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>PRODUCTO</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>EN ALMACÉN</th>
                  </tr>
                </thead>
                <tbody>
                  {noRotation.slice(0, 50).map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: "#2A2E34", fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
                        {p.nombre}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                         <span style={{ 
                           background: "rgba(100,116,139,0.1)", 
                           color: "#64748B", 
                           padding: "4px 8px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                           fontFamily: "var(--font-sans)"
                         }}>
                           {p.stock_actual} uds
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Panel Exceso de Stock */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#8A94A6", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
             Alertas: Exceso de Stock
          </h4>
          <div style={{ background: "#FAFAFA", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", maxHeight: 300, overflowY: "auto" }}>
            {overStock.length === 0 ? (
               <div style={{ padding: 24, textAlign: "center", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "var(--font-sans)" }}>No se detectó inventario en exceso.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#F1F5F9" }}>
                  <tr>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>PRODUCTO</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontSize: "0.68rem", color: "#64748B", fontFamily: "var(--font-sans)", fontWeight: 600 }}>SOBRESTOCK</th>
                  </tr>
                </thead>
                <tbody>
                  {overStock.slice(0, 50).map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: "#2A2E34", fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
                        {p.nombre}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                         <span style={{ 
                           background: "rgba(16,185,129,0.1)", 
                           color: "#10b981", 
                           padding: "4px 8px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                           fontFamily: "var(--font-sans)"
                         }}>
                           {p.stock_actual} uds
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
