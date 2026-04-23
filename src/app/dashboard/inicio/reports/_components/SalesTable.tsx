"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, Download, ChevronDown, ChevronUp, Package } from "lucide-react";

import { IVenta, IDetalleVenta } from "@/lib/models";

interface SalesTableProps {
  ventas: IVenta[]; 
  loading: boolean;
}

export default function SalesTable({ ventas, loading }: SalesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  const PAGE_SIZE = 8;

  // Filter local state based on search over customer or ID, and status
  const filtered = useMemo(() => {
    return ventas.filter(v => {
      // Get customer name for searching
      const customerObj = (v as any).usuario;
      const customerName = customerObj?.nombre || String(v.id_usuario || "");
      
      // Search text match
      const searchMatch = 
        String(v.id).includes(search) || 
        customerName.toLowerCase().includes(search.toLowerCase());
      
      // Status filter match
      const statusMatch = statusFilter === "todos" || v.estado === statusFilter;
      
      return searchMatch && statusMatch;
    });
  }, [ventas, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Helper map to give different status badges matching the reference colors
  const statusColors: Record<string, { color: string, bg: string }> = {
    "aprobada":  { color: "#3d8c60", bg: "#EDF5F0" },
    "pendiente": { color: "#b07830", bg: "#FDF3E7" },
    "cancelada": { color: "#ff5c6b", bg: "#FFE8EA" },
    "denegada":  { color: "#8A94A6", bg: "#F0F2F5" },
  };

  function getStatusName(status: string) {
    if (status === "aprobada") return "Completado";
    if (status === "pendiente") return "Pendiente";
    if (status === "cancelada") return "Cancelado";
    if (status === "denegada") return "Denegado";
    return status;
  }

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;
    
    // Create CSV Header
    const headers = ["Folio", "Cliente", "Fecha", "Monto", "Estado", "Artículos Totales"];
    
    // Create CSV Rows
    const rows = filtered.map(v => {
      const date = v.fecha ? new Date(v.fecha).toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A";
      const client = v.id_usuario === "guest" || !v.id_usuario ? "Cliente General" : v.id_usuario;
      const amount = v.total || 0;
      const itemsCount = (v.detalles || []).reduce<number>((acc, d) => acc + (d.cantidad || 0), 0);
      
      return [v.id, `"${client}"`, date, amount, getStatusName(v.estado), itemsCount].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Ventas_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
        <style>{`
          @media (max-width: 640px) {
            .hide-mobile { display: none !important; }
            .sales-table-container { padding: 16px !important; }
          }
        `}</style>
        <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "1rem", fontWeight: 700, color: "#2A2E34", margin: 0,
        }}>
          Tabla Avanzada de Ventas
        </h3>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.75rem", color: "#8A94A6", margin: "4px 0 0",
        }}>
          Vista granular de pedidos con detalles de artículos y exportación.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          
          <button 
            onClick={() => router.push("/dashboard/inicio/nuevaVenta")}
            style={{
              background: "#B76E79", color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 16px", display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-marcellus)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              transition: "opacity 0.2s"
          }}>
            <Plus size={16} /> Nueva Venta
          </button>
          
          <button 
            onClick={exportToCSV}
            title="Exportar a CSV"
            style={{
             background: "#F0F2F5", border: "1px solid #E2E8F0", borderRadius: 8, padding: "0 14px",
             display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#4B5563",
             fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 500, transition: "background 0.2s"
          }}>
            <Download size={16} /> Exportar
          </button>

          {/* Status Filter Dropdown */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Filter size={14} color="#8A94A6" style={{ position: "absolute", left: 12 }} />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              style={{
                appearance: "none",
                background: "#F0F2F5", border: "1px solid #E2E8F0", borderRadius: 8,
                padding: "8px 14px 8px 34px", color: "#4B5563", fontFamily: "var(--font-sans)",
                fontSize: "0.8rem", outline: "none", cursor: "pointer", width: 140
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="aprobada">Completadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", width: 260,
          }}>
            <Search size={16} color="#8A94A6" />
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por folio o ID cliente..."
              style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.8rem", fontFamily: "var(--font-poppins)", color: "#2A2E34", width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flex: 1, minHeight: 400 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#8A94A6", fontSize: "0.85rem", fontFamily: "var(--font-sans)" }}>
            Buscando registros...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                <th style={{ width: 40 }}></th>
                <th className="hide-mobile" style={{ textAlign: "left", padding: "14px 12px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "#64748B", borderBottom: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>FOLIO</th>
                <th style={{ textAlign: "left", padding: "14px 12px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "#64748B", borderBottom: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>CLIENTE</th>
                <th className="hide-mobile" style={{ textAlign: "left", padding: "14px 12px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "#64748B", borderBottom: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>FECHA</th>
                <th style={{ textAlign: "left", padding: "14px 12px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "#64748B", borderBottom: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>MONTO ($)</th>
                <th style={{ textAlign: "left", padding: "14px 12px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "#64748B", borderBottom: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 0", textAlign: "center", color: "#8A94A6", fontSize: "0.85rem", fontFamily: "var(--font-poppins)" }}>
                    No concuerdan ventas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                paged.map((v) => {
                  const sc = statusColors[v.estado] || { color: "#8A94A6", bg: "#F0F2F5" };
                  const fDate = v.fecha ? new Date(v.fecha).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A";
                  const isExpanded = expandedRows.has(v.id);
                  // Compatibilidad con ambos nombres de propiedad
                  const items = v.detalles || (v as any).detallesventas;
                  const hasDetails = items && items.length > 0;
                  
                  const customerObj = (v as any).usuario;
                  const customerDisplay = customerObj?.nombre || (v.id_usuario === "guest" || !v.id_usuario ? "Cliente Foráneo" : `ID: ${v.id_usuario}`);
                  
                  return (
                    <React.Fragment key={v.id}>
                      <tr 
                        onClick={() => hasDetails && toggleRow(v.id)}
                        style={{ 
                          borderBottom: "1px solid #F0F2F5", 
                          cursor: hasDetails ? "pointer" : "default",
                          background: isExpanded ? "rgba(183,110,121,0.02)" : "transparent",
                          transition: "background 0.2s"
                        }}
                      >
                        <td style={{ padding: "16px 12px", textAlign: "center" }}>
                          {hasDetails ? (
                            isExpanded ? <ChevronUp size={16} color="#8A94A6" /> : <ChevronDown size={16} color="#8A94A6" />
                          ) : (
                            <div style={{ width: 16, height: 16 }} />
                          )}
                        </td>
                        <td className="hide-mobile" style={{ padding: "16px 12px", fontFamily: "var(--font-poppins)", fontSize: "0.85rem", fontWeight: 600, color: "#2A2E34" }}>
                          #{v.id}
                        </td>
                        <td style={{ padding: "16px 12px", fontFamily: "var(--font-poppins)", fontSize: "0.85rem", color: "#4B5563" }}>
                          {customerDisplay.length > 20 ? customerDisplay.substring(0,20)+"..." : customerDisplay}
                        </td>
                        <td className="hide-mobile" style={{ padding: "16px 12px", fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#64748B" }}>
                          {fDate}
                        </td>
                        <td style={{ padding: "16px 12px", fontFamily: "var(--font-poppins)", fontSize: "0.85rem", fontWeight: 600, color: "#2A2E34" }}>
                          ${(v.total || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: "16px 12px" }}>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            padding: "6px 12px", borderRadius: 20, display: "inline-flex",
                            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600,
                          }}>
                            {getStatusName(v.estado)}
                          </span>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E2E8F0" }}>
                          <td colSpan={6} style={{ padding: "20px 40px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              <h4 style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "0.85rem", color: "#4B5563", display: "flex", alignItems: "center", gap: 6 }}>
                                <Package size={14} /> Desglose de Artículos
                              </h4>
                              <div style={{ 
                                background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" 
                              }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                  <thead style={{ background: "#F1F5F9" }}>
                                    <tr>
                                      <th style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.7rem", fontFamily: "var(--font-sans)", color: "#64748B", fontWeight: 600 }}>CANTIDAD</th>
                                      <th style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.7rem", fontFamily: "var(--font-sans)", color: "#64748B", fontWeight: 600 }}>PRODUCTO</th>
                                      <th style={{ textAlign: "right", padding: "10px 14px", fontSize: "0.7rem", fontFamily: "var(--font-sans)", color: "#64748B", fontWeight: 600 }}>COSTO U.</th>
                                      <th style={{ textAlign: "right", padding: "10px 14px", fontSize: "0.7rem", fontFamily: "var(--font-sans)", color: "#64748B", fontWeight: 600 }}>UTILIDAD</th>
                                      <th style={{ textAlign: "right", padding: "10px 14px", fontSize: "0.7rem", fontFamily: "var(--font-sans)", color: "#64748B", fontWeight: 600 }}>SUBTOTAL</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items?.map((det: any, i: number) => {
                                      const cost = Number(det.producto?.costo) || 0;
                                      const price = Number(det.producto?.precio) || 0;
                                      const qty = Number(det.cantidad) || 0;
                                      const unitProfit = price - cost;
                                      const totalProfit = unitProfit * qty;

                                      return (
                                        <tr key={i} style={{ borderBottom: i === (items?.length ?? 0) - 1 ? "none" : "1px solid #E2E8F0" }}>
                                          <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#2A2E34", fontFamily: "var(--font-poppins)" }}>
                                            {qty}x
                                          </td>
                                          <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#4B5563", fontFamily: "var(--font-sans)" }}>
                                            {det.producto?.nombre || "Producto desconocido"}
                                          </td>
                                          <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#8A94A6", fontFamily: "var(--font-poppins)", textAlign: "right" }}>
                                            ${cost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                          </td>
                                          <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#38A169", fontFamily: "var(--font-poppins)", textAlign: "right", fontWeight: 600 }}>
                                            +${totalProfit.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                          </td>
                                          <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#2A2E34", fontFamily: "var(--font-poppins)", textAlign: "right", fontWeight: 600 }}>
                                            ${(qty * price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer / Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#8A94A6" }}>
          Mostrando {paged.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} al {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ border: "1px solid #E2E8F0", borderRadius: 6, background: "#fff", color: page === 1 ? "#cbd5e1" : "#64748B", padding: "4px 8px", cursor: page === 1 ? "not-allowed" : "pointer" }}>Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              minWidth: 28, height: 28, borderRadius: 6, border: "1px solid", 
              borderColor: p === page ? "#C07E88" : "#E2E8F0", cursor: "pointer",
              background: p === page ? "#C07E88" : "#fff",
              color: p === page ? "#fff" : "#64748B", fontSize: "0.75rem", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-sans)"
            }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ border: "1px solid #E2E8F0", borderRadius: 6, background: "#fff", color: page === totalPages ? "#cbd5e1" : "#64748B", padding: "4px 8px", cursor: page === totalPages ? "not-allowed" : "pointer" }}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
