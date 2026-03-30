"use client";

import React, { useState } from "react";
import { IConsignacion, EstadoConsignacion } from "@lib/models";
import { Pencil, Ban, Search, Plus, List } from "lucide-react";

const BADGE: Record<EstadoConsignacion, { bg: string; color: string; label: string }> = {
  activa: { bg: "rgba(183,110,121,0.12)", color: "#B76E79", label: "Activa" },
  finalizada: { bg: "rgba(112,128,144,0.12)", color: "#708090", label: "Finalizada" },
  cancelada: { bg: "rgba(192,133,109,0.12)", color: "#c0856d", label: "Cancelada" },
};

function fmt(date: string) {
  // Asegurarse de que date solo tenga YYYY-MM-DD
  const rawDate = date.split('T')[0];
  // Anexamos mediodia UTC para forzar que sea el mismo día sin importar la zona local (-6 horas)
  return new Date(rawDate + "T12:00:00Z").toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Mexico_City"
  });
}

interface ConsignacionesTableProps {
  consignaciones: IConsignacion[];
  loading: boolean;
  onNueva: () => void;
  onEditar: (c: IConsignacion) => void;
  onCancelar: (c: IConsignacion) => void;
}

export default function ConsignacionesTable({
  consignaciones,
  loading,
  onNueva,
  onEditar,
  onCancelar,
}: ConsignacionesTableProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtradas = consignaciones.filter(c => {
    const q = search.toLowerCase();
    const productosNombres = c.detalles?.map(d => d.producto?.nombre?.toLowerCase()).join(" ") || "";
    return (
      productosNombres.includes(q) ||
      c.mayorista?.nombre?.toLowerCase().includes(q) ||
      c.estado.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F6F3EF",
            border: "1px solid rgba(112,128,144,0.2)",
            borderRadius: 10,
            padding: "8px 14px",
            flex: "1",
            maxWidth: 340,
          }}
        >
          <Search size={14} style={{ color: "#8C9796", flexShrink: 0 }} />
          <input
            placeholder="Buscar producto, mayorista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "0.82rem",
              color: "#1C1C1C",
              width: "100%",
            }}
          />
        </div>

        <button
          id="btn-nueva-consignacion"
          onClick={onNueva}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg,#B76E79,#9d5a64)",
            border: "none",
            borderRadius: 10,
            padding: "9px 18px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(183,110,121,0.35)",
            color: "#fff",
            fontSize: "0.82rem",
            fontWeight: 600,
            fontFamily: "Manrope,sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={14} />
          Nueva Consignación
        </button>
      </div>

      {/* Table desktop */}
      <div className="hidden md:block" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr
              style={{
                background: "linear-gradient(90deg,#708090,#5a6a7a)",
                color: "#fff",
              }}
            >
              {["Ingreso", "Mayorista", "Productos", "Total Asignado", "Total P. May.", "Estado", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      borderBottom: "2px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>
                  Cargando...
                </td>
              </tr>
            ) : filtradas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>
                  No hay consignaciones
                </td>
              </tr>
            ) : (
              filtradas.map((c, i) => {
                const badge = BADGE[c.estado] ?? BADGE.activa;
                const totalProductos = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0;
                const totalVendido = c.detalles?.reduce((acc, d) => acc + (d.cantidad_vendida || 0), 0) || 0;
                const totalValMayorista = c.detalles?.reduce((acc, d) => acc + (d.cantidad * (d.precio_mayorista || 0)), 0) || 0;

                return (
                  <React.Fragment key={c.id}>
                    <tr
                      style={{
                        background: i % 2 === 0 ? "#fff" : "#FAFAF8",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "12px 14px", fontSize: "0.78rem", color: "#4a5568" }}>
                        <span style={{ fontWeight: 600, color: "#1C1C1C", display: "block" }}>{fmt(c.fecha_inicio)}</span>
                        <span>Límite: {fmt(c.fecha_fin)}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1C1C1C" }}>
                          {c.mayorista?.nombre ?? "—"}
                        </p>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#708090",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            textDecoration: "underline"
                          }}
                        >
                          <List size={14} />
                          Ver {c.detalles?.length || 0} Prod(s)
                        </button>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "0.85rem", fontWeight: 600 }}>
                        <span style={{ color: "#B76E79" }}>{totalProductos}</span>
                        {totalVendido > 0 && (
                          <span style={{ fontSize: "0.7rem", color: "#8C9796", display: "block" }}>
                            {totalVendido} vendidos
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#1C1C1C", fontWeight: 600 }}>
                        ${totalValMayorista.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            borderRadius: 20,
                            padding: "3px 12px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            fontFamily: "Manrope,sans-serif",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {c.estado === "activa" && (
                            <>
                              <button
                                title="Editar"
                                onClick={() => onEditar(c)}
                                style={iconBtnStyle("#708090")}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                title="Cancelar"
                                onClick={() => onCancelar(c)}
                                style={iconBtnStyle("#c0856d")}
                              >
                                <Ban size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded === c.id && (
                      <tr style={{ background: "#F1F5F9" }}>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div style={{ padding: "16px", paddingLeft: "40px" }}>
                            <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid #CBD5E1", color: "#475569" }}>
                                  <th style={{ textAlign: "left", paddingBottom: 6 }}>Producto</th>
                                  <th style={{ textAlign: "left", paddingBottom: 6 }}>Precio Normal</th>
                                  <th style={{ textAlign: "left", paddingBottom: 6 }}>Precio Mayorista</th>
                                  <th style={{ textAlign: "left", paddingBottom: 6 }}>Cant. Asignada</th>
                                </tr>
                              </thead>
                              <tbody>
                                {c.detalles?.map(d => (
                                  <tr key={d.id_producto}>
                                    <td style={{ padding: "8px 0" }}>{d.producto?.nombre}</td>
                                    <td style={{ padding: "8px 0" }}>${d.producto?.precio?.toFixed(2)}</td>
                                    <td style={{ padding: "8px 0", color: "#B76E79", fontWeight: 600 }}>${d.precio_mayorista?.toFixed(2)}</td>
                                    <td style={{ padding: "8px 0" }}>{d.cantidad}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#8C9796", padding: 20 }}>Cargando...</p>
        ) : filtradas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8C9796", padding: 20 }}>
            No hay consignaciones
          </p>
        ) : (
          filtradas.map(c => {
            const badge = BADGE[c.estado] ?? BADGE.activa;
            const totalProductos = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0;

            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  border: "1px solid rgba(112,128,144,0.12)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.mayorista?.nombre}</p>
                    <p style={{ fontSize: "0.78rem", color: "#708090" }}>{c.detalles?.length || 0} Prod(s) ({totalProductos} items)</p>
                  </div>
                  <span
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: "0.78rem", color: "#4a5568" }}>
                  <span>{fmt(c.fecha_inicio)} → {fmt(c.fecha_fin)}</span>
                </div>
                {c.estado === "activa" && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button onClick={() => onEditar(c)} style={mobileActionBtn("#708090")}>
                      Editar
                    </button>
                    <button onClick={() => onCancelar(c)} style={mobileActionBtn("#c0856d")}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function iconBtnStyle(color: string) {
  return {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: `1px solid ${color}22`,
    background: `${color}12`,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties;
}

function mobileActionBtn(color: string) {
  return {
    flex: 1,
    padding: "7px",
    borderRadius: 8,
    border: "none",
    background: `${color}15`,
    color,
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties;
}
