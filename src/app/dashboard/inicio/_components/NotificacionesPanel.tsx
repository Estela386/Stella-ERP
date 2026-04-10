"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell, X, Check, CheckCheck,
  Package, FlaskConical, ShoppingCart, Truck, RefreshCw,
  BellOff, Trash2
} from "lucide-react";
import { INotificacion, TipoNotificacion } from "@lib/models/Notificacion";

// =========================================
// 🎨 Configuración Estética (Premium Palette)
// =========================================

const THEME = {
  roseGold: "#B76E79",
  deepCharcoal: "#4A5568",
  slate: "#708090",
  lightBeige: "#F6F3EF",
  accentGreen: "#8C9768",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.82)",
};

const TIPO_CONFIG: Record<TipoNotificacion, { icon: React.ReactNode; color: string; bg: string }> = {
  stock_bajo_producto: { icon: <Package size={14} />,    color: "#C0392B", bg: "rgba(192,57,43,0.08)" },
  stock_bajo_insumo:   { icon: <FlaskConical size={14} />, color: "#E67E22", bg: "rgba(230,126,34,0.08)" },
  pedido_nuevo:        { icon: <ShoppingCart size={14} />, color: "#2980B9", bg: "rgba(41,128,185,0.08)" },
  pedido_estado:       { icon: <RefreshCw size={14} />,  color: "#8E44AD", bg: "rgba(142,68,173,0.08)" },
  consignacion_nueva:  { icon: <Truck size={14} />,      color: "#27AE60", bg: "rgba(39,174,96,0.08)" },
};

function tiempoRelativo(fechaStr: string): string {
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (diff < 60)    return "Reciente";
  if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} d`;
}

// =========================================
// 🃏 Tarjeta de Notificación (Premium)
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
  const cfg = TIPO_CONFIG[notif.tipo] ?? { icon: <Bell size={14} />, color: THEME.slate, bg: "rgba(112,128,144,0.08)" };

  return (
    <div 
      className={`notif-card group ${!notif.leida ? 'unread' : ''}`}
      style={{
        display: "flex",
        gap: 15,
        padding: "16px 20px",
        background: notif.leida ? "transparent" : "rgba(183,110,121,0.03)",
        borderBottom: "1px solid rgba(112,128,144,0.06)",
        position: "relative",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default"
      }}
    >
      {/* Indicador de no leído premium */}
      {!notif.leida && (
        <div style={{
          position: "absolute", 
          left: 6, 
          top: "50%",
          transform: "translateY(-50%)",
          width: 4, 
          height: "30%", 
          borderRadius: 20,
          background: THEME.roseGold,
          boxShadow: `0 0 8px ${THEME.roseGold}44`
        }} />
      )}

      {/* Ícono Estilizado */}
      <div style={{
        width: 42, 
        height: 42, 
        flexShrink: 0,
        borderRadius: 12, 
        background: cfg.bg,
        color: cfg.color,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        border: `1px solid ${cfg.color}15`,
        transition: "transform 0.2s",
      }} className="icon-container">
        {cfg.icon}
      </div>

      {/* Contenido de Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          margin: 0,
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: THEME.deepCharcoal,
          lineHeight: 1.2,
          letterSpacing: "-0.01em"
        }}>
          {notif.titulo}
        </h4>
        <p style={{
          margin: "4px 0 0",
          fontFamily: "var(--font-sans)",
          fontSize: "0.78rem",
          color: THEME.slate,
          lineHeight: 1.5,
          opacity: 0.85,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {notif.mensaje}
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
        }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            color: THEME.accentGreen,
            letterSpacing: "0.02em",
            fontWeight: 500,
            textTransform: "uppercase"
          }}>
            {tiempoRelativo(notif.created_at)}
          </span>
        </div>
      </div>

      {/* Acciones flotantes */}
      <div className="card-actions" style={{
        display: "flex", 
        flexDirection: "column",
        gap: 8, 
        alignItems: "center", 
        justifyContent: "center",
        flexShrink: 0,
        opacity: 0.4,
        transition: "opacity 0.2s"
      }}>
        {!notif.leida && (
          <button
            onClick={onLeer}
            className="action-btn"
            title="Marcar como leída"
            style={{
              background: "white",
              border: "1px solid rgba(112,128,144,0.1)",
              cursor: "pointer",
              color: THEME.roseGold,
              width: 28, height: 28,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={onEliminar}
          className="action-btn delete"
          title="Eliminar"
          style={{
            background: "white",
            border: "1px solid rgba(112,128,144,0.1)",
            cursor: "pointer",
            color: "#E74C3C",
            width: 28, height: 28,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// =========================================
// 🔔 Panel de Notificaciones (Glassmorphism)
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={`notifications-container ${isMobile ? 'mobile' : 'desktop'}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: THEME.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        border: `1px solid rgba(255, 255, 255, 0.45)`,
        ...(isMobile ? {
          position: "fixed" as const,
          bottom: 0, left: 0, right: 0,
          borderRadius: "32px 32px 0 0",
          maxHeight: "85vh",
          boxShadow: "0 -15px 50px rgba(0,0,0,0.15)",
          animation: "slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
          zIndex: 9999,
        } : {
          position: "absolute" as const,
          top: "calc(100% + 15px)",
          right: -10,
          width: 380,
          maxHeight: 520,
          borderRadius: 24,
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
          animation: "revealIn 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
          zIndex: 1000,
        }),
      }}
    >
      <style>{`
        @keyframes revealIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .notif-card:hover {
          background: rgba(255, 255, 255, 0.4) !important;
          transform: translateX(4px);
        }
        .notif-card:hover .icon-container {
          transform: scale(1.05);
        }
        .notif-card:hover .card-actions {
          opacity: 1 !important;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .action-btn:active {
          transform: scale(0.92);
        }
        .list-container::-webkit-scrollbar {
          width: 5px;
        }
        .list-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .list-container::-webkit-scrollbar-thumb {
          background: rgba(112,128,144,0.1);
          border-radius: 10px;
        }
      `}</style>

      {/* Header Estilizado */}
      <div style={{
        padding: "24px 24px 18px",
        borderBottom: "1px solid rgba(112,128,144,0.06)",
        background: "rgba(255, 255, 255, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: THEME.roseGold,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${THEME.roseGold}33`
            }}>
              <Bell size={16} color="white" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontFamily: "var(--font-marcellus)",
                fontSize: "1.05rem",
                color: THEME.deepCharcoal,
                letterSpacing: "-0.01em"
              }}>
                Notificaciones
              </h3>
              {noLeidas > 0 && (
                <span style={{
                  fontSize: "0.68rem",
                  color: THEME.roseGold,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}>
                  Tienes {noLeidas} sin leer
                </span>
              )}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
             {noLeidas > 0 && (
               <button
                onClick={onMarcarTodas}
                title="Limpia todas"
                style={{
                  width: 34, height: 34,
                  borderRadius: 10,
                  border: "none",
                  background: "rgba(112,128,144,0.05)",
                  color: THEME.slate,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                className="action-btn"
              >
                <CheckCheck size={16} />
              </button>
             )}
             <button
              onClick={onClose}
              style={{
                width: 34, height: 34,
                borderRadius: 10,
                border: "none",
                background: "rgba(0,0,0,0.05)",
                color: THEME.deepCharcoal,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer"
              }}
              className="action-btn"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div 
        className="list-container"
        style={{ 
          overflowY: "auto", 
          flex: 1, 
          padding: "8px 0",
          WebkitOverflowScrolling: "touch" 
        }}
      >
        {loading ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 60, gap: 12
          }}>
             <div className="animate-spin" style={{ 
               width: 24, height: 24, border: `2px solid ${THEME.roseGold}22`,
               borderTopColor: THEME.roseGold, borderRadius: "50%"
             }} />
             <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: THEME.slate }}>
               Actualizando novedades...
             </span>
          </div>
        ) : notificaciones.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "80px 40px", gap: 20,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 24,
              background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              color: THEME.slate,
              opacity: 0.5
            }}>
              <BellOff size={32} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "1rem",
                color: THEME.deepCharcoal,
                margin: "0 0 4px"
              }}>
                Todo al día
              </p>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                color: THEME.slate,
                margin: 0,
                opacity: 0.7
              }}>
                No hay notificaciones nuevas en este momento
              </p>
            </div>
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

      {/* Footer Minimalista */}
      {notificaciones.length > 0 && (
        <div style={{
          padding: "16px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(112,128,144,0.04)",
          background: "rgba(255,255,255,0.1)"
        }}>
           <button 
            style={{
              background: "none", border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: THEME.roseGold,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              opacity: 0.8
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
             Ver todas las actividades
           </button>
        </div>
      )}
    </div>
  );
}
