"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Package, Beaker, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/app/_components/ui/Skeleton";
import EmptyState from "@/app/_components/ui/EmptyState";

interface StockItem {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  minimo: number;
  urgencia: "critico" | "bajo";
  tipo: "producto" | "insumo";
}

const URGENCIA = {
  critico: {
    color: "var(--rose-gold)",
    bg: "#FDECEA",
    bar: "var(--rose-gold)",
    label: "Crítico",
  },
  bajo: { color: "#b07830", bg: "#FDF3E7", bar: "#e8a855", label: "Bajo" },
};

const TIPO_CONFIG = {
  producto: { color: "var(--slate)", bg: "var(--beige)", label: "Producto", Icon: Package },
  insumo:   { color: "#5a7a6a", bg: "#EDF5F0", label: "Insumo",   Icon: Beaker  },
};

export default function StockAlerts() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);
  const [criticos, setCriticos] = useState(0);
  const [totalInsumos, setTotalInsumos] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        const res = await fetch("/api/dashboard/stock-alerts");
        if (!res.ok) throw new Error("Error fetching alerts");
        const data = await res.json();
        setItems(data.items || []);
        setCriticos(data.criticos || 0);
        setTotalInsumos(data.totalInsumos || 0);
        setTotalProductos(data.totalProductos || 0);
      } catch (error) {
        console.error("Error loading stock alerts:", error);
        setItems([]);
        setCriticos(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStockAlerts();
    const interval = setInterval(fetchStockAlerts, 120000); // Actualizar cada 2 minutos

    return () => clearInterval(interval);
  }, []);

  const totalAlertas = totalProductos + totalInsumos;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        background: "var(--white)",
        border: "1px solid var(--border-subtle)",
        borderTop: "3px solid var(--rose-gold)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        boxSizing: "border-box",
      }}
    >

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--beige)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#FDECEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={18} style={{ color: "var(--rose-gold)" }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "1rem",
                fontWeight: 400,
                color: "var(--charcoal)",
                margin: 0,
              }}
            >
              Alertas de Inventario
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: "var(--slate-light)",
                margin: 0,
              }}
            >
              {loading ? "Cargando..." : (
                <>
                  {criticos} {criticos === 1 ? "artículo crítico" : "artículos críticos"} —{" "}
                  {totalAlertas === 0
                    ? "todo en orden"
                    : `${totalProductos} producto${totalProductos !== 1 ? "s" : ""} · ${totalInsumos} insumo${totalInsumos !== 1 ? "s" : ""}`}
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--rose-gold)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 6,
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FDECEA"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          Ir al inventario →
        </button>
      </div>

      {/* Grid items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}
      >
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{ padding: 20, borderRight: "1px solid var(--beige-light)", borderBottom: "1px solid var(--beige-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={12} style={{ marginBottom: 6 }} />
                  <Skeleton width="40%" height={8} />
                </div>
                <Skeleton width={40} height={20} borderRadius={10} />
              </div>
              <Skeleton width="100%" height={6} borderRadius={3} />
            </div>
          ))
        ) : items.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={{
              show: {
                transition: { staggerChildren: 0.05 }
              }
            }}
            style={{ display: "contents" }}
          >
            {items.map(item => {
              const cfg   = URGENCIA[item.urgencia];
              const tipoCfg = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.producto;
              const TipoIcon = tipoCfg.Icon;
              const pct = Math.min(
                100,
                item.minimo > 0 ? Math.round((item.stock / item.minimo) * 100) : 0
              );

              return (
                <motion.div
                  key={`${item.tipo}-${item.id}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.98 },
                    show: { opacity: 1, scale: 1 }
                  }}
                  onClick={() => router.push("/dashboard/inicio/inventarios")}
                  style={{
                    padding: "16px 20px",
                    borderRight: "1px solid var(--beige-light)",
                    borderBottom: "1px solid var(--beige-light)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                  }}
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLElement).style.background = "var(--beige-light)")
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--charcoal)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.nombre}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.68rem",
                            color: "var(--slate-light)",
                            margin: 0,
                          }}
                        >
                          mín. {item.minimo}
                        </p>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          background: tipoCfg.bg,
                          color: tipoCfg.color,
                          borderRadius: 20,
                          padding: "2px 7px",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.02em"
                        }}>
                          <TipoIcon size={8} />
                          {tipoCfg.label}
                        </span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-marcellus)",
                          fontSize: "1.2rem",
                          fontWeight: 500,
                          color: cfg.color,
                          display: "block",
                          lineHeight: 1,
                        }}
                      >
                        {item.stock}
                      </span>
                      <span
                        style={{
                          background: cfg.bg,
                          borderRadius: 20,
                          padding: "2px 8px",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          color: cfg.color,
                          marginTop: 4,
                          display: "inline-block",
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: "auto" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.62rem",
                          color: "var(--slate-light)",
                          fontWeight: 500
                        }}
                      >
                        Salud de stock: {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 6,
                        background: "var(--beige)",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          borderRadius: 6,
                          background: cfg.bar,
                          boxShadow: `0 0 10px ${cfg.bar}33`
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div style={{ gridColumn: "1 / -1", padding: "10px" }}>
            <EmptyState 
              icon={CheckCircle2}
              title="Inventario Saludable"
              description="Todo el stock está por encima de los niveles mínimos de contingencia."
            />
          </div>
        )}
      </div>

      {/* Footer — leyenda + CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--beige)" }}>
        {/* Leyenda de tipos */}
        {!loading && items.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[TIPO_CONFIG.producto, TIPO_CONFIG.insumo].map(t => (
              <span key={t.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                color: t.color,
                fontWeight: 500
              }}>
                <t.Icon size={12} />
                {t.label}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          style={{
            width: "100%",
            background: "var(--rose-gold)",
            border: "none",
            borderRadius: 12,
            padding: "11px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--white)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(183,110,121,0.25)"
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--rose-gold-light)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)";
          }}
        >
          Reponer existencias ahora →
        </button>
      </div>
    </motion.div>
  );
}
