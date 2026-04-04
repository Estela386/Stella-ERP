"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell, X, Check, CheckCheck,
  Package, FlaskConical, ShoppingCart, Truck, RefreshCw,
} from "lucide-react";
import { INotificacion, TipoNotificacion } from "@lib/models/Notificacion";

// =========================================
// 🎨 Config visual por tipo
// =========================================

const TIPO_CONFIG: Record<TipoNotificacion, { icon: React.ReactNode; color: string; bg: string }> = {
  stock_bajo_producto: { icon: <Package size={15} />,    color: "#C0392B", bg: "#FDF0EF" },
  stock_bajo_insumo:   { icon: <FlaskConical size={15} />, color: "#E67E22", bg: "#FEF6EC" },
  pedido_nuevo:        { icon: <ShoppingCart size={15} />, color: "#2980B9", bg: "#EBF5FB" },
  pedido_estado:       { icon: <RefreshCw size={15} />,  color: "#8E44AD", bg: "#F5EEF8" },
  consignacion_nueva:  { icon: <Truck size={15} />,      color: "#27AE60", bg: "#EAFAF1" },
};

function tiempoRelativo(fechaStr: string): string {
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (diff < 60)    return "Hace un momento";
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} d`;
}

// =========================================
// 🃏 Tarjeta individual
// =========================================

function NotifCard({
  notif,
  onLeer,
  onEliminar,
}: {
  notif: INotificacion;
  onLeer: () => void;
  onEliminar: () => void;
}) {
  const cfg = TIPO_CONFIG[notif.tipo] ?? { icon: <Bell size={15} />, color: "#708090", bg: "#F6F3EF" };

  return (
    <div className="notif-card" style={{
      display: "flex",
      gap: 10,
      padding: "12px 14px 12px 20px",
      background: notif.leida ? "transparent" : "rgba(183,110,121,0.045)",
      borderBottom: "1px solid rgba(112,128,144,0.08)",
      position: "relative",
      transition: "background 0.15s",
    }}>
      {/* Dot no leída */}
      {!notif.leida && (
        <div style={{
          position: "absolute", left: 7, top: "50%",
          transform: "translateY(-50%)",
          width: 5, height: 5, borderRadius: "50%",
          background: "#B76E79",
        }} />
      )}

      {/* Ícono */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        borderRadius: 9, background: cfg.bg,
        color: cfg.color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {cfg.icon}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "0.8rem",
          fontWeight: notif.leida ? 400 : 600,
          color: "#1C1C1C",
          lineHeight: 1.35,
        }}>
          {notif.titulo}
        </p>
        <p style={{
          margin: "3px 0 0",
          fontFamily: "var(--font-sans)",
          fontSize: "0.73rem",
          color: "#8C9796",
          lineHeight: 1.4,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {notif.mensaje}
        </p>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.64rem",
          color: "#A8B2B0",
          marginTop: 4,
          display: "block",
        }}>
          {tiempoRelativo(notif.created_at)}
        </span>
      </div>

      {/* Botones acción */}
      <div style={{
        display: "flex", flexDirection: "column",
        gap: 6, alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {!notif.leida && (
          <button
            onClick={onLeer}
            title="Marcar como leída"
            style={{
              background: "rgba(112,128,144,0.08)",
              border: "none", cursor: "pointer",
              color: "#708090",
              width: 28, height: 28,
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Check size={13} />
          </button>
        )}
        <button
          onClick={onEliminar}
          title="Eliminar"
          style={{
            background: "rgba(192,57,43,0.07)",
            border: "none", cursor: "pointer",
            color: "#C0392B",
            width: 28, height: 28,
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// =========================================
// 🔔 Panel principal — adaptativo móvil/desktop
// =========================================

interface Props {
  open: boolean;
  onClose: () => void;
  notificaciones: INotificacion[];
  noLeidas: number;
  loading: boolean;
  onMarcarLeida: (id: number) => Promise<void>;
  onMarcarTodas: () => Promise<void>;
  onEliminar: (id: number) => Promise<void>;
}

export default function NotificacionesPanel({
  open, onClose,
  notificaciones, noLeidas, loading,
  onMarcarLeida, onMarcarTodas, onEliminar,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Cerrar al hacer clic fuera (solo desktop)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, isMobile]);

  // Bloquear scroll del body en móvil cuando el panel está abierto
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  if (!open) return null;

  const content = (
    <div
      ref={panelRef}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        overflow: "hidden",
        ...(isMobile ? {
          // móvil: bottom-sheet
          position: "fixed" as const,
          bottom: 0, left: 0, right: 0,
          borderRadius: "20px 20px 0 0",
          maxHeight: "80vh",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
          animation: "notifSlideUp 0.22s cubic-bezier(0.32,0.72,0,1)",
          zIndex: 9999,
        } : {
          // desktop: dropdown
          position: "absolute" as const,
          top: "calc(100% + 8px)",
          right: 0,
          width: 340,
          maxHeight: 480,
          borderRadius: 16,
          border: "1px solid rgba(112,128,144,0.15)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          animation: "notifSlideIn 0.18s ease",
          zIndex: 1000,
        }),
      }}
    >
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notifSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes notifFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .notif-card:hover {
          background: rgba(112,128,144,0.04) !important;
        }
      `}</style>

      {/* Handle móvil */}
      {isMobile && (
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "12px 0 6px",
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 4,
            borderRadius: 2, background: "rgba(112,128,144,0.25)",
          }} />
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "8px 18px 12px" : "14px 16px 10px",
        borderBottom: "1px solid rgba(112,128,144,0.1)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={16} style={{ color: "#B76E79" }} />
          <span style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: isMobile ? "1rem" : "0.92rem",
            color: "#1C1C1C",
          }}>
            Notificaciones
          </span>
          {noLeidas > 0 && (
            <span style={{
              background: "#B76E79", color: "#fff",
              borderRadius: 20, padding: "1px 7px",
              fontSize: "0.62rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
            }}>
              {noLeidas}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {noLeidas > 0 && (
            <button
              onClick={onMarcarTodas}
              style={{
                background: "rgba(112,128,144,0.08)",
                border: "none",
                borderRadius: 7,
                padding: isMobile ? "6px 10px" : "3px 8px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                color: "#708090",
                fontSize: "0.68rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              <CheckCheck size={12} />
              Leer todas
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "rgba(112,128,144,0.08)",
              border: "none", cursor: "pointer",
              color: "#708090",
              width: 30, height: 30, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Lista scrollable */}
      <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 48,
            color: "#8C9796",
            fontFamily: "var(--font-sans)", fontSize: "0.8rem",
          }}>
            Cargando...
          </div>
        ) : notificaciones.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "48px 20px", gap: 10,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "rgba(112,128,144,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={24} style={{ color: "rgba(112,128,144,0.35)" }} />
            </div>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              color: "#A8B2B0",
              margin: 0, textAlign: "center",
              lineHeight: 1.5,
            }}>
              Sin notificaciones pendientes
            </p>
          </div>
        ) : (
          notificaciones.map((n) => (
            <NotifCard
              key={n.id}
              notif={n}
              onLeer={() => onMarcarLeida(n.id)}
              onEliminar={() => onEliminar(n.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notificaciones.length > 0 && (
        <div style={{
          padding: isMobile ? "12px 18px 20px" : "10px 14px",
          borderTop: "1px solid rgba(112,128,144,0.1)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            color: "#A8B2B0",
          }}>
            {notificaciones.length} notificaciones · {noLeidas} sin leer
          </span>
        </div>
      )}
    </div>
  );

  // En móvil: renderizar con backdrop sobre toda la pantalla
  if (isMobile) {
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.38)",
          zIndex: 9998,
          animation: "notifFadeIn 0.18s ease",
        }}
      >
        {/* Evitar que el click dentro del panel cierre el backdrop */}
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  // Desktop: dropdown normal (position absolute relativo al botón)
  return content;
}
