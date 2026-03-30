"use client";

import React, { useState } from "react";
import { IConsignacion, EstadoConsignacion } from "@lib/models";
import {
  Pencil, Ban, Search, Plus, X,
  ChevronDown, ChevronUp, AlertTriangle, Clock,
  CalendarDays, Package, DollarSign, User, RotateCcw,
} from "lucide-react";

const BADGE: Record<EstadoConsignacion, { bg: string; color: string; label: string; dot: string }> = {
  activa:     { bg: "rgba(183,110,121,0.1)",  color: "#B76E79", label: "Activa",     dot: "#B76E79" },
  finalizada: { bg: "rgba(112,128,144,0.1)",  color: "#708090", label: "Finalizada", dot: "#708090" },
  cancelada:  { bg: "rgba(192,133,109,0.1)",  color: "#c0856d", label: "Cancelada",  dot: "#c0856d" },
};

function fmt(date: string) {
  const raw = date.split("T")[0];
  return new Date(raw + "T12:00:00Z").toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Mexico_City",
  });
}

function diasRetraso(fechaFin: string): number {
  const fin = new Date(fechaFin.split("T")[0] + "T12:00:00Z");
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  return Math.floor((hoy.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
}

interface ConsignacionesTableProps {
  consignaciones: IConsignacion[];
  loading: boolean;
  onNueva: () => void;
  onEditar: (c: IConsignacion) => void;
  onCancelar: (c: IConsignacion) => void;
  onReactivar: (c: IConsignacion) => void;
}

function ConfirmActionModal({
  title,
  message,
  confirmText,
  confirmColor,
  icon: Icon,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: React.ReactNode;
  confirmText: string;
  confirmColor: string;
  icon: any;
  onConfirm: () => void;
  onCancel: () => void;
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
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${confirmColor}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={18} style={{ color: confirmColor }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1C1C1C", margin: 0 }}>{title}</h3>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9796" }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#4a5568", marginBottom: 20, lineHeight: 1.6 }}>
          {message}
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
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: confirmColor, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Icon size={14} /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsignacionCard({
  c,
  onEditar,
  onCancelar,
  onReactivar,
}: {
  c: IConsignacion;
  onEditar: (c: IConsignacion) => void;
  onCancelar: (c: IConsignacion) => void;
  onReactivar: (c: IConsignacion) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const badge   = BADGE[c.estado] ?? BADGE.activa;
  const retraso = c.estado === "activa" ? diasRetraso(c.fecha_fin) : 0;
  const vencida = retraso > 0;
  const proxima = !vencida && retraso > -7 && c.estado === "activa";

  // Totales calculados una sola vez
  const totalItems    = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) ?? 0;
  const totalVendidos = c.detalles?.reduce((acc, d) => acc + (d.cantidad_vendida ?? 0), 0) ?? 0;
  const valorMayorista = c.detalles?.reduce((acc, d) => acc + d.cantidad * (d.precio_mayorista ?? 0), 0) ?? 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: vencida
          ? "1.5px solid rgba(239,68,68,0.35)"
          : "1px solid rgba(112,128,144,0.12)",
        boxShadow: vencida
          ? "0 4px 20px rgba(239,68,68,0.08)"
          : "0 1px 6px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Franja superior de estado */}
      <div style={{ height: 3, background: vencida ? "linear-gradient(90deg,#ef4444,#f87171)" : badge.dot }} />

      {/* Cuerpo principal */}
      <div style={{ padding: "16px 20px" }}>

        {/* Fila 1: Mayorista + Estado + Acciones */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#B76E79,#9d5a64)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1C1C1C", margin: 0 }}>
                {c.mayorista?.nombre ?? "—"}
              </p>
              {vencida && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "0.68rem", color: "#ef4444", fontWeight: 700 }}>
                  <AlertTriangle size={10} /> {retraso} día{retraso !== 1 ? "s" : ""} de retraso
                </span>
              )}
              {proxima && !vencida && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "0.68rem", color: "#f59e0b", fontWeight: 700 }}>
                  <Clock size={10} /> Vence pronto
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: badge.bg, color: badge.color, borderRadius: 20, padding: "3px 12px", fontSize: "0.72rem", fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, display: "inline-block" }} />
              {badge.label}
            </span>
            {c.estado === "activa" && (
              <>
                <button title="Editar" onClick={() => onEditar(c)} style={iconBtn("#708090")}>
                  <Pencil size={13} />
                </button>
                <button title="Cancelar" onClick={() => onCancelar(c)} style={iconBtn("#c0856d")}>
                  <Ban size={13} />
                </button>
              </>
            )}
            {c.estado !== "activa" && (
              <button title="Reactivar consignación" onClick={() => onReactivar(c)} style={iconBtn("#10b981")}>
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Fila 2: Métricas rápidas */}
        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          {/* Fechas */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarDays size={13} style={{ color: "#8C9796", flexShrink: 0 }} />
            <span style={{ fontSize: "0.76rem", color: "#4a5568" }}>
              {fmt(c.fecha_inicio)} → <span style={{ fontWeight: vencida ? 700 : 400, color: vencida ? "#ef4444" : "#4a5568" }}>{fmt(c.fecha_fin)}</span>
            </span>
          </div>

          {/* Items */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Package size={13} style={{ color: "#8C9796", flexShrink: 0 }} />
            <span style={{ fontSize: "0.76rem", color: "#4a5568" }}>
              {totalItems} items
              {totalVendidos > 0 && (
                <span style={{ color: "#B76E79", fontWeight: 600 }}> · {totalVendidos} vendidos</span>
              )}
            </span>
          </div>

          {/* Valor */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DollarSign size={13} style={{ color: "#8C9796", flexShrink: 0 }} />
            <span style={{ fontSize: "0.76rem", color: "#4a5568", fontWeight: 600 }}>
              ${valorMayorista.toLocaleString()} <span style={{ fontWeight: 400 }}>valor consignado</span>
            </span>
          </div>
        </div>

        {/* Botón expandir productos */}
        {c.detalles && c.detalles.length > 0 && (
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 5, marginTop: 12,
              background: "none", border: "none", cursor: "pointer",
              color: "#708090", fontSize: "0.75rem", fontWeight: 600, padding: 0,
            }}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? "Ocultar productos" : `Ver ${c.detalles.length} producto${c.detalles.length !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Panel de productos expandido */}
      {expanded && c.detalles && c.detalles.length > 0 && (
        <div style={{ borderTop: "1px solid #F1F5F9", background: "#FAFAF8", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {c.detalles.map(d => (
            <div
              key={d.id_producto}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", background: "#fff", borderRadius: 10, border: "1px solid rgba(112,128,144,0.1)", flexWrap: "wrap" }}
            >
              <p style={{ flex: 1, fontSize: "0.82rem", fontWeight: 600, color: "#1C1C1C", margin: 0, minWidth: 120 }}>
                {d.producto?.nombre ?? `Producto #${d.id_producto}`}
              </p>
              <div style={{ display: "flex", gap: 16, fontSize: "0.75rem", color: "#4a5568", flexWrap: "wrap" }}>
                <span>Precio normal: <strong>${d.producto?.precio?.toFixed(2)}</strong></span>
                <span style={{ color: "#B76E79", fontWeight: 700 }}>Mayorista: ${d.precio_mayorista?.toFixed(2)}</span>
                <span>Cant: <strong>{d.cantidad}</strong></span>
                {(d.cantidad_vendida ?? 0) > 0 && (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>{d.cantidad_vendida} vendidos</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConsignacionesTable({
  consignaciones,
  loading,
  onNueva,
  onEditar,
  onCancelar,
  onReactivar,
}: ConsignacionesTableProps) {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoConsignacion | "todas">("todas");
  
  const [confirmandoCancelar, setConfirmandoCancelar] = useState<IConsignacion | null>(null);
  const [confirmandoReactivar, setConfirmandoReactivar] = useState<IConsignacion | null>(null);

  const filtradas = consignaciones.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.mayorista?.nombre?.toLowerCase().includes(q) ||
      c.estado.toLowerCase().includes(q) ||
      (c.detalles ?? []).some(d => d.producto?.nombre?.toLowerCase().includes(q));
    const matchEstado = filtroEstado === "todas" || c.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  // Agrupadas por estado para el flujo organico
  const activas     = filtradas.filter(c => c.estado === "activa");
  const finalizadas = filtradas.filter(c => c.estado === "finalizada");
  const canceladas  = filtradas.filter(c => c.estado === "cancelada");

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px 0", color: "#8C9796" }}>Cargando consignaciones...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ─── Toolbar ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        {/* Búsqueda */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F6F3EF", border: "1px solid rgba(112,128,144,0.2)", borderRadius: 10, padding: "8px 14px", flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ color: "#8C9796", flexShrink: 0 }} />
          <input
            placeholder="Buscar por mayorista o producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontSize: "0.82rem", color: "#1C1C1C", width: "100%" }}
          />
        </div>

        {/* Filtro de estado */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["todas", "activa", "finalizada", "cancelada"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: "0.75rem", fontWeight: filtroEstado === f ? 700 : 500,
                background: filtroEstado === f ? "rgba(112,128,144,0.15)" : "transparent",
                color: filtroEstado === f ? "#1C1C1C" : "#8C9796",
              }}
            >
              {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
        </div>

        <button
          id="btn-nueva-consignacion"
          onClick={onNueva}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#B76E79,#9d5a64)", border: "none", borderRadius: 10, padding: "9px 18px", cursor: "pointer", boxShadow: "0 4px 14px rgba(183,110,121,0.35)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <Plus size={14} /> Nueva Consignación
        </button>
      </div>

      {/* ─── Sin resultados ───────────────────────────────── */}
      {filtradas.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#8C9796" }}>
          <Package size={32} style={{ opacity: 0.3, display: "block", margin: "0 auto 10px" }} />
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            {search ? "Sin resultados para tu búsqueda" : "No hay consignaciones registradas"}
          </p>
        </div>
      )}

      {/* ─── Activas ────────────────────────────────────── */}
      {activas.length > 0 && (
        <Section label="Activas" count={activas.length} dotColor="#B76E79">
          {activas.map(c => (
            <ConsignacionCard 
              key={c.id} 
              c={c} 
              onEditar={onEditar} 
              onCancelar={() => setConfirmandoCancelar(c)} 
              onReactivar={() => setConfirmandoReactivar(c)} 
            />
          ))}
        </Section>
      )}

      {/* ─── Finalizadas ────────────────────────────────── */}
      {finalizadas.length > 0 && (filtroEstado === "todas" || filtroEstado === "finalizada") && (
        <CollapsibleSection label="Finalizadas" count={finalizadas.length} dotColor="#708090">
          {finalizadas.map(c => (
            <ConsignacionCard 
              key={c.id} 
              c={c} 
              onEditar={onEditar} 
              onCancelar={() => setConfirmandoCancelar(c)} 
              onReactivar={() => setConfirmandoReactivar(c)} 
            />
          ))}
        </CollapsibleSection>
      )}

      {/* ─── Canceladas ─────────────────────────────────── */}
      {canceladas.length > 0 && (filtroEstado === "todas" || filtroEstado === "cancelada") && (
        <CollapsibleSection label="Canceladas" count={canceladas.length} dotColor="#c0856d">
          {canceladas.map(c => (
            <ConsignacionCard 
              key={c.id} 
              c={c} 
              onEditar={onEditar} 
              onCancelar={() => setConfirmandoCancelar(c)} 
              onReactivar={() => setConfirmandoReactivar(c)} 
            />
          ))}
        </CollapsibleSection>
      )}

      {/* ─── Modales de Confirmación ────────────────────── */}
      {confirmandoCancelar && (
        <ConfirmActionModal
          title="Cancelar Consignación"
          message={<>¿Estás seguro de cancelar la consignación <strong>#{confirmandoCancelar.id}</strong>? Todo el stock consignado volverá a estar disponible en el inventario.</>}
          confirmText="Sí, cancelar"
          confirmColor="#ef4444"
          icon={Ban}
          onCancel={() => setConfirmandoCancelar(null)}
          onConfirm={() => {
            onCancelar(confirmandoCancelar);
            setConfirmandoCancelar(null);
          }}
        />
      )}

      {confirmandoReactivar && (
        <ConfirmActionModal
          title="Reactivar Consignación"
          message={<>¿Volver a activar la consignación <strong>#{confirmandoReactivar.id}</strong>? El stock requerido se volverá a descontar del inventario general. Si no hay suficiente, la operación fallará.</>}
          confirmText="Sí, reactivar"
          confirmColor="#10b981"
          icon={RotateCcw}
          onCancel={() => setConfirmandoReactivar(null)}
          onConfirm={() => {
            onReactivar(confirmandoReactivar);
            setConfirmandoReactivar(null);
          }}
        />
      )}
    </div>
  );
}

// Sección siempre visible
function Section({ label, count, dotColor, children }: { label: string; count: number; dotColor: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1C1C1C", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ background: dotColor, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: "0.6rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

// Sección colapsable (finalizadas/canceladas)
function CollapsibleSection({ label, count, dotColor, children }: { label: string; count: number; dotColor: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 0", color: "#8C9796", fontSize: "0.76rem", fontWeight: 600, marginBottom: open ? 10 : 0 }}
      >
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor }} />
        {label} · {count}
      </button>
      {open && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>}
    </div>
  );
}

function iconBtn(color: string): React.CSSProperties {
  return {
    width: 30, height: 30, borderRadius: 8,
    border: `1px solid ${color}33`,
    background: `${color}12`,
    color, display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
  };
}
