"use client";

import { Package, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Pedido {
  id: string;
  cliente: string;
  monto: string;
  estado: "pendiente" | "en_proceso" | "completado" | "urgente";
  fecha: string;
  items: number;
}

const pedidos: Pedido[] = [
  { id: "PED-0821", cliente: "María García",  monto: "$5,200",  estado: "urgente",    fecha: "Hoy 10:30",  items: 3 },
  { id: "PED-0820", cliente: "Laura Ramírez", monto: "$8,400",  estado: "en_proceso", fecha: "Hoy 09:15",  items: 5 },
  { id: "PED-0819", cliente: "Ana Torres",    monto: "$3,100",  estado: "pendiente",  fecha: "Ayer 17:45", items: 2 },
  { id: "PED-0818", cliente: "Sofía Mendoza", monto: "$12,700", estado: "completado", fecha: "Ayer 14:20", items: 8 },
  { id: "PED-0817", cliente: "Carla Vega",    monto: "$2,600",  estado: "pendiente",  fecha: "Mar 22",     items: 1 },
];

const ESTADO_CONFIG = {
  urgente:    { color: "#B76E79", bg: "#FDECEA", label: "Urgente",    Icon: AlertCircle  },
  en_proceso: { color: "#b07830", bg: "#FDF3E7", label: "En proceso", Icon: Clock        },
  pendiente:  { color: "#708090", bg: "#EEF2F6", label: "Pendiente",  Icon: Package      },
  completado: { color: "#3d8c60", bg: "#EDF5F0", label: "Completado", Icon: CheckCircle  },
};

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const hue      = (name.charCodeAt(0) * 17 + name.charCodeAt(1) * 7) % 360;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue}, 30%, 88%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display, Manrope, sans-serif)",
      fontSize: "0.65rem", fontWeight: 700,
      color: `hsl(${hue}, 40%, 38%)`,
    }}>
      {initials}
    </div>
  );
}

export default function RecentOrders() {
  const router = useRouter();

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.11)",
      borderTop: "3px solid #708090",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "1px solid #F0EDE8",
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-display, Manrope, sans-serif)",
            fontSize: "0.9rem", fontWeight: 700,
            color: "#1C1C1C", margin: 0,
          }}>
            Pedidos Recientes
          </h3>
          <p style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
          }}>
            Últimas órdenes registradas
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/pedidos")}
          style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.72rem", fontWeight: 600,
            color: "#708090", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Ver todos →
        </button>
      </div>

      {/* Rows */}
      <div style={{ flex: 1 }}>
        {pedidos.map((p, idx) => {
          const cfg    = ESTADO_CONFIG[p.estado];
          const { Icon } = cfg;
          const isLast = idx === pedidos.length - 1;

          return (
            <div
              key={p.id}
              onClick={() => router.push("/dashboard/inicio/pedidos")}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 18px",
                borderBottom: isLast ? "none" : "1px solid #F7F4F0",
                transition: "background 0.12s",
                cursor: "pointer",
              }}
              onMouseEnter={e  => ((e.currentTarget as HTMLElement).style.background = "#FAFAF8")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Avatar name={p.cliente} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.79rem", fontWeight: 600,
                  color: "#1C1C1C", margin: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {p.cliente}
                </p>
                <p style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.63rem", color: "#8C9796", margin: "1px 0 0",
                }}>
                  {p.id} · {p.items} {p.items === 1 ? "pieza" : "piezas"} · {p.fecha}
                </p>
              </div>

              {/* Amount + badge */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display, Manrope, sans-serif)",
                  fontSize: "0.86rem", fontWeight: 700,
                  color: "#1C1C1C", margin: 0,
                }}>
                  {p.monto}
                </p>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  background: cfg.bg, borderRadius: 20, padding: "2px 8px",
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.59rem", fontWeight: 700,
                  color: cfg.color, marginTop: 2,
                }}>
                  <Icon size={9} />
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div style={{
        borderTop: "1px solid #F0EDE8",
        padding: "10px 18px",
      }}>
        <button
          onClick={() => router.push("/dashboard/inicio/pedidos")}
          style={{
            width: "100%",
            background: "#F6F3EF",
            border: "1px solid rgba(112,128,144,0.15)",
            borderRadius: 9,
            padding: "8px",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.75rem", fontWeight: 600,
            color: "#708090", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#EEEBE5";
            (e.currentTarget as HTMLElement).style.color = "#1C1C1C";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "#F6F3EF";
            (e.currentTarget as HTMLElement).style.color = "#708090";
          }}
        >
          Gestionar todos los pedidos →
        </button>
      </div>
    </div>
  );
}
