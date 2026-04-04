"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Package, Beaker } from "lucide-react";
import { useRouter } from "next/navigation";

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
    color: "#B76E79",
    bg: "#FDECEA",
    bar: "#B76E79",
    label: "Crítico",
  },
  bajo: { color: "#b07830", bg: "#FDF3E7", bar: "#e8a855", label: "Bajo" },
};

const TIPO_CONFIG = {
  producto: { color: "#708090", bg: "#EEF2F6", label: "Producto", Icon: Package },
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
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(112,128,144,0.11)",
        borderTop: "3px solid #B76E79",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .stock-alerts-loading { opacity: 0.6; pointer-events: none; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #F0EDE8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#FDECEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={15} style={{ color: "#B76E79" }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "#1C1C1C",
                margin: 0,
              }}
            >
              Stock Crítico
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.67rem",
                color: "#8C9796",
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
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#B76E79",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Ver inventario →
        </button>
      </div>

      {/* Grid items */}
      <div
        className={loading ? "stock-alerts-loading" : ""}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {items.length > 0 ? (
          items.map(item => {
            const cfg   = URGENCIA[item.urgencia];
            const tipoCfg = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.producto;
            const TipoIcon = tipoCfg.Icon;
            const pct = Math.min(
              100,
              item.minimo > 0 ? Math.round((item.stock / item.minimo) * 100) : 0
            );

            return (
              <div
                key={`${item.tipo}-${item.id}`}
                onClick={() => router.push("/dashboard/inicio/inventarios")}
                style={{
                  padding: "14px 18px",
                  borderRight: "1px solid #F0EDE8",
                  borderBottom: "1px solid #F0EDE8",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.background = "#FAFAF8")
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
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        color: "#1C1C1C",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.nombre}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      {/* Categoría */}
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.62rem",
                          color: "#8C9796",
                          margin: 0,
                        }}
                      >
                        {item.categoria} · mín. {item.minimo}
                      </p>
                      {/* Badge tipo */}
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 2,
                        background: tipoCfg.bg,
                        color: tipoCfg.color,
                        borderRadius: 20,
                        padding: "1px 5px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                      }}>
                        <TipoIcon size={7} />
                        {tipoCfg.label}
                      </span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-marcellus)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
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
                        padding: "1px 7px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        color: cfg.color,
                        marginTop: 2,
                        display: "inline-block",
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.58rem",
                        color: "#8C9796",
                      }}
                    >
                      {pct}% del mínimo requerido
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 5,
                      background: "#F0EDE8",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 5,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cfg.bar}bb, ${cfg.bar})`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "20px",
              textAlign: "center",
              color: "#8C9796",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
            }}
          >
            {loading
              ? "Cargando alertas..."
              : "✓ Todo el stock está en nivel óptimo"}
          </div>
        )}
      </div>

      {/* Footer — leyenda + CTA */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #F0EDE8" }}>
        {/* Leyenda de tipos */}
        {items.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            {[TIPO_CONFIG.producto, TIPO_CONFIG.insumo].map(t => (
              <span key={t.label} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontFamily: "var(--font-sans)",
                fontSize: "0.62rem",
                color: t.color,
              }}>
                <t.Icon size={10} />
                {t.label}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          style={{
            width: "100%",
            background: "#FDECEA",
            border: "1px solid rgba(183,110,121,0.25)",
            borderRadius: 9,
            padding: "9px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#B76E79",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#B76E79";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "#FDECEA";
            (e.currentTarget as HTMLElement).style.color = "#B76E79";
          }}
        >
          Reponer stock ahora →
        </button>
      </div>
    </div>
  );
}
