"use client";

import { useState } from "react";
import { ISolicitudMayorista } from "@lib/models";
import {
  CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp,
  Mail, CalendarDays,
} from "lucide-react";

interface SolicitudesTableProps {
  solicitudes: ISolicitudMayorista[];
  loading: boolean;
  onAprobar: (s: ISolicitudMayorista) => void;
  onRechazar: (s: ISolicitudMayorista) => void;
}

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
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const procesadas = solicitudes.filter(s => s.estado !== "pendiente");

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px 0", color: "#8C9796" }}>Cargando solicitudes...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ─── Pendientes ───────────────────────────────── */}
      <div>
        {/* Header de sección */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Clock size={14} style={{ color: "#f59e0b" }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1C1C1C", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Requieren atención
          </span>
          {pendientes.length > 0 && (
            <span style={{ background: "#f59e0b", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: "0.6rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {pendientes.length}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          /* Estado vacío */
          <div style={{ textAlign: "center", padding: "28px 20px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, color: "#10b981" }}>
            <CheckCircle size={24} style={{ display: "block", margin: "0 auto 8px", opacity: 0.7 }} />
            <p style={{ fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Sin solicitudes pendientes</p>
            <p style={{ fontSize: "0.75rem", opacity: 0.8, margin: "4px 0 0" }}>Cuando alguien aplique, aparecerá aquí para revisión.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendientes.map(s => (
              /* Card de solicitud pendiente — diseño destacado con acción clara */
              <div
                key={s.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid rgba(245,158,11,0.35)",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.1)",
                  overflow: "hidden",
                }}
              >
                {/* Franja superior amarilla */}
                <div style={{ height: 3, background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }} />

                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Persona */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1C1C1C", margin: 0 }}>
                        {s.usuario?.nombre ?? "—"}
                      </p>
                      <p style={{ fontSize: "0.76rem", color: "#708090", margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Mail size={11} />
                        {s.usuario?.correo ?? "—"}
                      </p>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#8C9796", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                      <CalendarDays size={11} />
                      {fmt(s.fecha_solicitud)}
                    </p>
                  </div>

                  {/* Mensaje */}
                  {s.mensaje && (
                    <p style={{ fontSize: "0.8rem", color: "#4a5568", background: "#FAFAF8", borderRadius: 8, padding: "8px 12px", margin: 0, borderLeft: "3px solid rgba(245,158,11,0.4)", lineHeight: 1.5 }}>
                      {s.mensaje}
                    </p>
                  )}

                  {/* Acciones */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                    <button
                      id={`btn-aprobar-${s.id}`}
                      onClick={() => onAprobar(s)}
                      style={{
                        flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
                        background: "rgba(16,185,129,0.12)", color: "#10b981",
                        fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <CheckCircle size={14} /> Aprobar → Mayorista
                    </button>
                    <button
                      id={`btn-rechazar-${s.id}`}
                      onClick={() => onRechazar(s)}
                      style={{
                        padding: "9px 16px", borderRadius: 10, border: "none",
                        background: "rgba(239,68,68,0.08)", color: "#ef4444",
                        fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Historial (colapsado) ────────────────────── */}
      {procesadas.length > 0 && (
        <div>
          <button
            onClick={() => setMostrarHistorial(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 0", color: "#8C9796", fontSize: "0.76rem", fontWeight: 600,
            }}
          >
            {mostrarHistorial ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {mostrarHistorial ? "Ocultar historial" : `Historial · ${procesadas.length} solicitudes procesadas`}
          </button>

          {mostrarHistorial && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {procesadas.map(s => {
                const isAprobada = s.estado === "aprobada";
                return (
                  /* Fila compacta — solo lectura, sin acciones */
                  <div
                    key={s.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                      background: "#FAFAF8", borderRadius: 10, padding: "10px 14px",
                      border: "1px solid rgba(112,128,144,0.1)",
                    }}
                  >
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: isAprobada ? "#10b981" : "#ef4444",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#1C1C1C", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.usuario?.nombre ?? "—"}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#8C9796", margin: 0 }}>
                        {s.usuario?.correo}
                      </p>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: isAprobada ? "#10b981" : "#ef4444", fontWeight: 700, flexShrink: 0 }}>
                      {isAprobada ? "Aprobada" : "Rechazada"}
                    </span>
                    <span style={{ fontSize: "0.70rem", color: "#8C9796", flexShrink: 0 }}>
                      {fmt(s.fecha_respuesta ?? s.fecha_solicitud)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
