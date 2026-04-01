"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter } from "lucide-react";
import { Venta } from "@/lib/models/Venta";

interface SalesTableProps {
  ventas: Venta[];
  loading: boolean;
}

export default function SalesTable({ ventas, loading }: SalesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Filter local state based on search over customer or ID
  const filtered = ventas.filter(v => 
    String(v.id).includes(search) || 
    String(v.id_usuario || "").toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.8rem", fontWeight: 700, color: "#2A2E34", margin: 0,
        }}>
          Registro de Ventas
        </h3>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.65rem", color: "#8A94A6", margin: "2px 0 0",
        }}>
          Bitácora completa extraída de la base de datos
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => router.push("/dashboard/inicio/nuevaVenta")}
            style={{
              background: "#B76E79", color: "#fff", border: "none", borderRadius: 8,
              padding: "6px 14px", display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-marcellus)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
          }}>
            <Plus size={14} /> Nueva
          </button>
          <button style={{
             background: "#F0F2F5", border: "none", borderRadius: 8, width: 32, height: 32,
             display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <Filter size={14} color="#8A94A6" />
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            background: "#F0F2F5", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", width: 220,
          }}>
            <Search size={14} color="#8A94A6" />
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar folio o cliente..."
              style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.7rem", fontFamily: "var(--font-poppins)", color: "#2A2E34", width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flex: 1, minHeight: 400 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "Inter" }}>
            Cargando ventas...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["FOLIO (INVOICE)", "CLIENTE", "FECHA", "MONTO", "ESTADO"].map(th => (
                  <th key={th} style={{
                    textAlign: "left", padding: "12px 10px",
                    fontFamily: "var(--font-marcellus)", fontSize: "0.6rem", fontWeight: 800, color: "#8A94A6",
                    borderBottom: "1px solid #F0F2F5", letterSpacing: "0.05em"
                  }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 0", textAlign: "center", color: "#8A94A6", fontSize: "0.8rem", fontFamily: "Inter" }}>
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                paged.map((v) => {
                  const sc = statusColors[v.estado] || { color: "#8A94A6", bg: "#F0F2F5" };
                  const fDate = new Date(v.fecha).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' });
                  
                  return (
                    <tr key={v.id} style={{ borderBottom: "1px solid #F7F9FA" }}>
                      <td style={{ padding: "14px 10px", fontFamily: "var(--font-poppins)", fontSize: "0.75rem", fontWeight: 700, color: "#2A2E34" }}>
                        #{v.id}
                      </td>
                      <td style={{ padding: "14px 10px", fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#8A94A6" }}>
                        {v.id_usuario === "guest" || !v.id_usuario ? "Cliente General" : v.id_usuario}
                      </td>
                      <td style={{ padding: "14px 10px", fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#8A94A6" }}>
                        {fDate}
                      </td>
                      <td style={{ padding: "14px 10px", fontFamily: "var(--font-poppins)", fontSize: "0.75rem", fontWeight: 700, color: "#3d8c60" }}>
                        ${v.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <span style={{
                          background: sc.bg, color: sc.color,
                          padding: "4px 12px", borderRadius: 12, display: "inline-block",
                          fontFamily: "var(--font-marcellus)", fontSize: "0.65rem", fontWeight: 700,
                        }}>
                          {getStatusName(v.estado)}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer / Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "#8A94A6" }}>
          Mostrando {paged.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} a {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ border: "none", background: "none", color: page === 1 ? "#E2E8F0" : "#8A94A6", fontSize: "0.65rem", cursor: page === 1 ? "default" : "pointer" }}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 20, height: 20, borderRadius: "50%", border: "none", cursor: "pointer",
              background: p === page ? "#708090" : "transparent",
              color: p === page ? "#fff" : "#8A94A6", fontSize: "0.65rem", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-marcellus)"
            }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ border: "none", background: "none", color: page === totalPages ? "#E2E8F0" : "#8A94A6", fontSize: "0.65rem", cursor: page === totalPages ? "default" : "pointer" }}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
