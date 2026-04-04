"use client";

import { useEffect, useState } from "react";
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

const ESTADO_CONFIG = {
  urgente:    { color: "#B76E79", bg: "#FDECEA", label: "Urgente",    Icon: AlertCircle  },
  en_proceso: { color: "#b07830", bg: "#FDF3E7", label: "En proceso", Icon: Clock        },
  pendiente:  { color: "#708090", bg: "#EEF2F6", label: "Pendiente",  Icon: Package      },
  completado: { color: "#3d8c60", bg: "#EDF5F0", label: "Completado", Icon: CheckCircle  },
};

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const hue      = (name.charCodeAt(0) * 17 + (name.charCodeAt(1) || 5) * 7) % 360;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue}, 25%, 88%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)",
      fontSize: "0.65rem", fontWeight: 700,
      color: `hsl(${hue}, 40%, 38%)`,
    }}>
      {initials}
    </div>
  );
}

export default function RecentOrders() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("/api/dashboard/recent-orders");
        if (!res.ok) throw new Error("Error fetching orders");
        const data = await res.json();
        setPedidos(data.pedidos || []);
      } catch (error) {
        console.error("Error loading recent orders:", error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
    const interval = setInterval(fetchPedidos, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

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
      <style>{`
        .recent-orders-loading { opacity: 0.6; pointer-events: none; animation: ro-pulse 2s infinite; }
        @keyframes ro-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "1px solid #F0EDE8",
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.95rem", fontWeight: 400,
            color: "#1C1C1C", margin: 0,
          }}>
            Pedidos Recientes
          </h3>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
          }}>
            Últimas órdenes registradas
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/pedidos")}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem", fontWeight: 600,
            color: "#708090", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Ver todos →
        </button>
      </div>

      {/* Rows */}
      <div className={loading ? "recent-orders-loading" : ""} style={{ flex: 1 }}>
        {loading ? (
          /* Skeleton */
          [1, 2, 3].map(i => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: "10px 18px",
              borderBottom: i < 3 ? "1px solid #F7F4F0" : "none",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F0EDE8" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, width: "60%", borderRadius: 4, background: "#F0EDE8", marginBottom: 5 }} />
                <div style={{ height: 8, width: "40%", borderRadius: 4, background: "#F0EDE8" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ height: 10, width: 50, borderRadius: 4, background: "#F0EDE8", marginBottom: 5 }} />
                <div style={{ height: 8, width: 40, borderRadius: 4, background: "#F0EDE8" }} />
              </div>
            </div>
          ))
        ) : pedidos.length === 0 ? (
          <div style={{
            padding: "24px 18px",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.83rem",
            color: "#8C9796",
          }}>
            No hay pedidos recientes
          </div>
        ) : (
          pedidos.map((p, idx) => {
            const cfg    = ESTADO_CONFIG[p.estado] || ESTADO_CONFIG.pendiente;
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
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.79rem", fontWeight: 600,
                    color: "#1C1C1C", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {p.cliente}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.63rem", color: "#8C9796", margin: "1px 0 0",
                  }}>
                    {p.id} · {p.items} {p.items === 1 ? "pieza" : "piezas"} · {p.fecha}
                  </p>
                </div>

                {/* Amount + badge */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-marcellus)",
                    fontSize: "0.86rem", fontWeight: 400,
                    color: "#1C1C1C", margin: 0,
                  }}>
                    {p.monto}
                  </p>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    background: cfg.bg, borderRadius: 20, padding: "2px 8px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.59rem", fontWeight: 700,
                    color: cfg.color, marginTop: 2,
                  }}>
                    <Icon size={9} />
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
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
            fontFamily: "var(--font-sans)",
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
