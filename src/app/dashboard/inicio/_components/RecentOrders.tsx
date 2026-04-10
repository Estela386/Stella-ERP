"use client";

import { useEffect, useState } from "react";
import { Package, AlertCircle, CheckCircle, Clock, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/app/_components/ui/Skeleton";
import EmptyState from "@/app/_components/ui/EmptyState";

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
  pendiente:  { color: "var(--slate)", bg: "#EEF2F6", label: "Pendiente",  Icon: Package      },
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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "var(--white)",
        border: "1px solid var(--border-subtle)",
        borderTop: "3px solid var(--slate)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--beige)",
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "1rem", fontWeight: 400,
            color: "var(--charcoal)", margin: 0,
          }}>
            Pedidos Recientes
          </h3>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem", color: "var(--slate-light)", margin: "2px 0 0",
          }}>
            Últimas órdenes del periodo
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/pedidos")}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem", fontWeight: 600,
            color: "var(--slate)", background: "none",
            border: "none", cursor: "pointer", padding: "4px 8px",
            borderRadius: 6,
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--beige)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          Ver todos →
        </button>
      </div>

      {/* Rows */}
      <div style={{ flex: 1 }}>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 20px",
              borderBottom: "1px solid var(--beige-light)",
            }}>
              <Skeleton width={32} height={32} borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height={12} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={8} />
              </div>
              <div style={{ textAlign: "right" }}>
                <Skeleton width={50} height={12} style={{ marginBottom: 6 }} />
                <Skeleton width={60} height={18} borderRadius={12} />
              </div>
            </div>
          ))
        ) : pedidos.length === 0 ? (
          <EmptyState 
            icon={Inbox}
            title="Sin pedidos pendientes"
            description="No se han registrado órdenes en las últimas horas."
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {pedidos.slice(0, 5).map((p, idx) => {
              const cfg    = ESTADO_CONFIG[p.estado] || ESTADO_CONFIG.pendiente;
              const { Icon } = cfg;
              const isLast = idx === Math.min(pedidos.length, 5) - 1;

              return (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0 }
                  }}
                  onClick={() => router.push("/dashboard/inicio/pedidos")}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 20px",
                    borderBottom: isLast ? "none" : "1px solid var(--beige-light)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e  => ((e.currentTarget as HTMLElement).style.background = "var(--beige-light)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <Avatar name={p.cliente} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.85rem", fontWeight: 600,
                      color: "var(--charcoal)", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {p.cliente}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.68rem", color: "var(--slate-light)", margin: "1px 0 0",
                    }}>
                      {p.id} · {p.items} pzs · {p.fecha}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-marcellus)",
                      fontSize: "0.95rem", fontWeight: 500,
                      color: "var(--charcoal)", margin: 0,
                    }}>
                      {p.monto}
                    </p>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: cfg.bg, borderRadius: 20, padding: "3px 10px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem", fontWeight: 700,
                      color: cfg.color, marginTop: 4,
                      letterSpacing: "0.02em"
                    }}>
                      <Icon size={10} />
                      {cfg.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        borderTop: "1px solid var(--beige)",
        padding: "14px 20px",
      }}>
        <button
          onClick={() => router.push("/dashboard/inicio/pedidos")}
          style={{
            width: "100%",
            background: "var(--beige)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            padding: "10px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem", fontWeight: 600,
            color: "var(--slate)", cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--white)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--beige)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Gestionar histórico de pedidos →
        </button>
      </div>
    </motion.div>
  );
}
