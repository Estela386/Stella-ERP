"use client";

import { ISolicitudMayorista } from "@lib/models";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface SolicitudesTableProps {
  solicitudes: ISolicitudMayorista[];
  loading: boolean;
  onAprobar: (s: ISolicitudMayorista) => void;
  onRechazar: (s: ISolicitudMayorista) => void;
}

const ESTADO_CONFIG = {
  pendiente: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", Icon: Clock, label: "Pendiente" },
  aprobada: { color: "#10b981", bg: "rgba(16,185,129,0.1)", Icon: CheckCircle, label: "Aprobada" },
  rechazada: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", Icon: XCircle, label: "Rechazada" },
};

function fmt(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function SolicitudesTable({
  solicitudes,
  loading,
  onAprobar,
  onRechazar,
}: SolicitudesTableProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Desktop */}
      <div className="hidden md:block" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#708090,#5a6a7a)", color: "#fff" }}>
              {["Usuario", "Correo", "Mensaje", "Fecha Solicitud", "Estado", "Acciones"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "12px 14px",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>Cargando...</td></tr>
            ) : solicitudes.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>No hay solicitudes</td></tr>
            ) : (
              solicitudes.map((s, i) => {
                const cfg = ESTADO_CONFIG[s.estado] ?? ESTADO_CONFIG.pendiente;
                return (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAF8" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: "0.85rem" }}>
                      {s.usuario?.nombre ?? "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#4a5568" }}>
                      {s.usuario?.correo ?? "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "0.78rem", color: "#4a5568", maxWidth: 200 }}>
                      {s.mensaje ?? <span style={{ color: "#aaa" }}>Sin mensaje</span>}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "0.78rem", color: "#4a5568" }}>
                      {fmt(s.fecha_solicitud)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: cfg.bg,
                          color: cfg.color,
                          borderRadius: 20,
                          padding: "3px 12px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        <cfg.Icon size={11} />
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {s.estado === "pendiente" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            id={`btn-aprobar-${s.id}`}
                            onClick={() => onAprobar(s)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              border: "none",
                              background: "rgba(16,185,129,0.12)",
                              color: "#10b981",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <CheckCircle size={11} /> Aprobar
                          </button>
                          <button
                            id={`btn-rechazar-${s.id}`}
                            onClick={() => onRechazar(s)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              border: "none",
                              background: "rgba(239,68,68,0.1)",
                              color: "#ef4444",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <XCircle size={11} /> Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {solicitudes.map(s => {
          const cfg = ESTADO_CONFIG[s.estado] ?? ESTADO_CONFIG.pendiente;
          return (
            <div
              key={s.id}
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
                  <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>{s.usuario?.nombre}</p>
                  <p style={{ fontSize: "0.75rem", color: "#708090" }}>{s.usuario?.correo}</p>
                </div>
                <span
                  style={{
                    background: cfg.bg,
                    color: cfg.color,
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {cfg.label}
                </span>
              </div>
              {s.mensaje && (
                <p style={{ marginTop: 8, fontSize: "0.78rem", color: "#4a5568" }}>{s.mensaje}</p>
              )}
              {s.estado === "pendiente" && (
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onAprobar(s)}
                    style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: "rgba(16,185,129,0.12)", color: "#10b981", fontWeight: 700, cursor: "pointer" }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onRechazar(s)}
                    style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 700, cursor: "pointer" }}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
