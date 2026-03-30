"use client";

import { useState } from "react";
import { IUsuarioMayorista, IConsignacion } from "@lib/models";
import {
  UserCheck, Search, Mail, BadgeCheck, BadgeX,
  ChevronDown, ChevronUp, AlertTriangle, Package,
  Trash2, X, Clock, ShieldOff, ShieldCheck,
} from "lucide-react";

interface MayoristasTableProps {
  mayoristas: IUsuarioMayorista[];
  consignaciones: IConsignacion[];
  loading: boolean;
  onPromover?: () => void;
  onEliminar: (m: IUsuarioMayorista) => void;
  onSuspender: (m: IUsuarioMayorista, motivo: string) => Promise<void>;
  onReactivar: (m: IUsuarioMayorista) => Promise<void>;
}

function diasRetraso(fechaFin: string): number {
  const fin = new Date(fechaFin.split("T")[0] + "T12:00:00Z");
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  return Math.floor((hoy.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
}

function fmt(date: string) {
  const raw = date.split("T")[0];
  return new Date(raw + "T12:00:00Z").toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Mexico_City",
  });
}

function ConfirmModal({
  mayorista,
  onConfirm,
  onCancel,
  loading,
}: {
  mayorista: IUsuarioMayorista;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={18} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1C1C1C", margin: 0 }}>Quitar Mayorista</h3>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9796" }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#4a5568", marginBottom: 20, lineHeight: 1.6 }}>
          ¿Quitar el rol de Mayorista a <strong>{mayorista.nombre}</strong>?
          <br />
          <span style={{ fontSize: "0.78rem", color: "#8C9796" }}>Su cuenta volverá a ser Cliente. Esta acción no elimina sus registros históricos.</span>
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid rgba(112,128,144,0.25)", background: "#fff", color: "#708090", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: loading ? "#ccc" : "#ef4444", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {loading ? "Procesando..." : <><Trash2 size={14} /> Quitar rol</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuspendModal({
  mayorista,
  onConfirm,
  onCancel,
  loading,
}: {
  mayorista: IUsuarioMayorista;
  onConfirm: (motivo: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [motivo, setMotivo] = useState("");
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldOff size={18} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1C1C1C", margin: 0 }}>Suspender cuenta</h3>
              <p style={{ fontSize: "0.72rem", color: "#8C9796", margin: "2px 0 0" }}>Se notificará al usuario por email</p>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9796" }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#4a5568", lineHeight: 1.6, marginBottom: 16 }}>
          ¿Suspender la cuenta de <strong>{mayorista.nombre}</strong>? El usuario no podrá acceder a sus consignaciones hasta que se reactive.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#708090", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Motivo (opcional — se incluirá en el email)
          </label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Ej. Consignación vencida sin liquidar..."
            rows={3}
            style={{
              width: "100%", borderRadius: 10, border: "1.5px solid rgba(112,128,144,0.25)",
              padding: "10px 12px", fontSize: "0.85rem", color: "#1C1C1C",
              background: "#FAFAF8", resize: "none", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid rgba(112,128,144,0.25)", background: "#fff", color: "#708090", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(motivo)}
            disabled={loading}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: loading ? "#ccc" : "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {loading ? "Procesando..." : <><ShieldOff size={14} /> Suspender y notificar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function MayoristaRow({
  m,
  consignacionesMayorista,
  onEliminar,
  onSuspender,
}: {
  m: IUsuarioMayorista;
  consignacionesMayorista: IConsignacion[];
  onEliminar: () => void;
  onSuspender: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const activas = consignacionesMayorista.filter(c => c.estado === "activa");
  const conRetraso = activas.filter(c => diasRetraso(c.fecha_fin) > 0);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: conRetraso.length > 0
          ? "1.5px solid rgba(239,68,68,0.35)"
          : "1px solid rgba(112,128,144,0.12)",
        boxShadow: conRetraso.length > 0
          ? "0 4px 16px rgba(239,68,68,0.08)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Franja de alerta */}
      {conRetraso.length > 0 && (
        <div style={{ height: 3, background: "linear-gradient(90deg,#ef4444,#f87171)" }} />
      )}

      {/* Fila principal */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", flexWrap: "wrap" }}>
        {/* Avatar */}
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#B76E79,#9d5a64)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <UserCheck size={18} style={{ color: "#fff" }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1C1C1C", margin: 0 }}>{m.nombre ?? "—"}</p>
            {conRetraso.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: 20, padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700 }}>
                <AlertTriangle size={10} /> {conRetraso.length} consignación{conRetraso.length > 1 ? "es" : ""} vencida{conRetraso.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.75rem", color: "#708090", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
            <Mail size={11} />{m.correo}
          </p>
        </div>

        {/* Estado + Consignaciones badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {activas.length > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(112,128,144,0.1)", color: "#708090", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 600 }}>
              <Package size={10} /> {activas.length} activa{activas.length > 1 ? "s" : ""}
            </span>
          )}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: m.activo ? "rgba(183,110,121,0.1)" : "rgba(112,128,144,0.1)", color: m.activo ? "#B76E79" : "#708090", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700 }}>
            {m.activo ? <BadgeCheck size={11} /> : <BadgeX size={11} />}
            {m.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {consignacionesMayorista.length > 0 && (
            <button
              onClick={() => setExpanded(v => !v)}
              title="Ver consignaciones"
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(112,128,144,0.2)", background: "#F6F3EF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#708090" }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <button
            onClick={onSuspender}
            title={m.activo ? "Suspender cuenta" : "Reactivar cuenta"}
            style={{ width: 32, height: 32, borderRadius: 8, border: m.activo ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(16,185,129,0.3)", background: m.activo ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: m.activo ? "#f59e0b" : "#10b981" }}
          >
            {m.activo ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
          </button>
          <button
            onClick={onEliminar}
            title="Quitar mayorista"
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Panel expandido: consignaciones */}
      {expanded && consignacionesMayorista.length > 0 && (
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "14px 18px", background: "#FAFAF8", display: "flex", flexDirection: "column", gap: 10 }}>
          {consignacionesMayorista.map(c => {
            const retraso = diasRetraso(c.fecha_fin);
            const vencida = retraso > 0;
            const proxima = !vencida && retraso > -7;
            const totalItems = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) ?? 0;

            return (
              <div
                key={c.id}
                style={{
                  borderRadius: 10,
                  padding: "12px 14px",
                  background: vencida ? "rgba(239,68,68,0.05)" : "#fff",
                  border: vencida
                    ? "1px solid rgba(239,68,68,0.2)"
                    : proxima
                    ? "1px solid rgba(245,158,11,0.25)"
                    : "1px solid rgba(112,128,144,0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                {/* Dot */}
                <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: vencida ? "#ef4444" : proxima ? "#f59e0b" : "#10b981" }} />

                {/* Fechas */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1C1C1C", margin: 0 }}>
                    Consignación #{c.id} · {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#8C9796", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} /> {fmt(c.fecha_inicio)} → {fmt(c.fecha_fin)}
                  </p>
                </div>

                {/* Alerta de retraso */}
                {vencida ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                    <AlertTriangle size={10} /> {retraso} día{retraso !== 1 ? "s" : ""} de retraso
                  </span>
                ) : proxima ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                    <Clock size={10} /> Vence pronto
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600 }}>Al día</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MayoristasTable({ mayoristas, consignaciones, loading, onEliminar, onSuspender, onReactivar }: MayoristasTableProps) {
  const [search, setSearch] = useState("");
  const [confirmando, setConfirmando] = useState<IUsuarioMayorista | null>(null);
  const [suspendiendo, setSuspendiendo] = useState<IUsuarioMayorista | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [suspLoading, setSuspLoading] = useState(false);

  const filtrados = mayoristas.filter(m => {
    const q = search.toLowerCase();
    return m.nombre?.toLowerCase().includes(q) || m.correo?.toLowerCase().includes(q);
  });

  const handleConfirmarEliminar = async () => {
    if (!confirmando) return;
    setDeleting(true);
    await onEliminar(confirmando);
    setDeleting(false);
    setConfirmando(null);
  };

  const handleConfirmarSuspender = async (motivo: string) => {
    if (!suspendiendo) return;
    setSuspLoading(true);
    await onSuspender(suspendiendo, motivo);
    setSuspLoading(false);
    setSuspendiendo(null);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px 0", color: "#8C9796" }}>Cargando...</div>;
  }

  // Alertas globales de retraso
  const conRetraso = mayoristas.filter(m =>
    consignaciones.some(c =>
      c.id_mayorista === m.id && c.estado === "activa" && diasRetraso(c.fecha_fin) > 0
    )
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Banner de alertas globales */}
      {conRetraso.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px" }}>
          <AlertTriangle size={16} style={{ color: "#ef4444", flexShrink: 0 }} />
          <p style={{ fontSize: "0.82rem", color: "#ef4444", fontWeight: 600, margin: 0 }}>
            {conRetraso.length} mayorista{conRetraso.length > 1 ? "s" : ""} con consignaciones vencidas sin liquidar
          </p>
        </div>
      )}

      {/* Búsqueda */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F6F3EF", border: "1px solid rgba(112,128,144,0.2)", borderRadius: 10, padding: "8px 14px", maxWidth: 340 }}>
        <Search size={14} style={{ color: "#8C9796", flexShrink: 0 }} />
        <input
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: "none", border: "none", outline: "none", fontSize: "0.82rem", color: "#1C1C1C", width: "100%" }}
        />
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#8C9796", fontSize: "0.85rem" }}>
          <UserCheck size={32} style={{ opacity: 0.3, display: "block", margin: "0 auto 10px" }} />
          {search ? "Sin resultados para tu búsqueda" : "Sin mayoristas registrados aún"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtrados.map(m => (
            <MayoristaRow
              key={m.id}
              m={m}
              consignacionesMayorista={consignaciones.filter(c => c.id_mayorista === m.id)}
              onEliminar={() => setConfirmando(m)}
              onSuspender={() => {
                if (!m.activo) { onReactivar(m); } else { setSuspendiendo(m); }
              }}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {filtrados.length > 0 && (
        <p style={{ fontSize: "0.72rem", color: "#8C9796", textAlign: "right", margin: 0 }}>
          {filtrados.length} mayorista{filtrados.length !== 1 ? "s" : ""} registrado{filtrados.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modal quitar mayorista */}
      {confirmando && (
        <ConfirmModal
          mayorista={confirmando}
          onConfirm={handleConfirmarEliminar}
          onCancel={() => setConfirmando(null)}
          loading={deleting}
        />
      )}

      {/* Modal suspender */}
      {suspendiendo && (
        <SuspendModal
          mayorista={suspendiendo}
          onConfirm={handleConfirmarSuspender}
          onCancel={() => setSuspendiendo(null)}
          loading={suspLoading}
        />
      )}
    </div>
  );
}
