"use client";

import { AlertTriangle } from "lucide-react";
import { useRouter }     from "next/navigation";

interface StockItem {
  nombre: string;
  categoria: string;
  stock: number;
  minimo: number;
  urgencia: "critico" | "bajo";
}

const items: StockItem[] = [
  { nombre: "Anillo Solitario Oro 14k", categoria: "Anillos",    stock: 1, minimo: 5,  urgencia: "critico" },
  { nombre: "Aretes Perla Natural",      categoria: "Aretes",     stock: 3, minimo: 8,  urgencia: "critico" },
  { nombre: "Collar Cadena Plata 925",   categoria: "Collares",   stock: 4, minimo: 10, urgencia: "bajo"    },
  { nombre: "Pulsera Oro Rosado",        categoria: "Pulseras",   stock: 2, minimo: 6,  urgencia: "critico" },
  { nombre: "Dije Estrella Plata",       categoria: "Accesorios", stock: 6, minimo: 12, urgencia: "bajo"    },
];

const URGENCIA = {
  critico: { color: "#B76E79", bg: "#FDECEA", bar: "#B76E79", label: "Crítico" },
  bajo:    { color: "#b07830", bg: "#FDF3E7", bar: "#e8a855", label: "Bajo"    },
};

export default function StockAlerts() {
  const router   = useRouter();
  const criticos = items.filter(i => i.urgencia === "critico").length;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.11)",
      borderTop: "3px solid #B76E79",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #F0EDE8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "#FDECEA",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={15} style={{ color: "#B76E79" }} />
          </div>
          <div>
            <h3 style={{
              fontFamily: "var(--font-display, Manrope, sans-serif)",
              fontSize: "0.9rem", fontWeight: 700,
              color: "#1C1C1C", margin: 0,
            }}>
              Stock Crítico
            </h3>
            <p style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.67rem", color: "#8C9796", margin: 0,
            }}>
              {criticos} {criticos === 1 ? "pieza" : "piezas"} bajo mínimo — acción requerida
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.72rem", fontWeight: 600,
            color: "#B76E79", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Ver inventario →
        </button>
      </div>

      {/* Grid items */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}>
        {items.map((item) => {
          const cfg = URGENCIA[item.urgencia];
          const pct = Math.min(100, Math.round((item.stock / item.minimo) * 100));

          return (
            <div
              key={item.nombre}
              onClick={() => router.push("/dashboard/inicio/inventarios")}
              style={{
                padding: "14px 18px",
                borderRight: "1px solid #F0EDE8",
                borderBottom: "1px solid #F0EDE8",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FAFAF8")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.76rem", fontWeight: 600,
                    color: "#1C1C1C", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.nombre}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.62rem", color: "#8C9796", margin: "2px 0 0",
                  }}>
                    {item.categoria} · mín. {item.minimo}
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span style={{
                    fontFamily: "var(--font-display, Manrope, sans-serif)",
                    fontSize: "1.1rem", fontWeight: 800,
                    color: cfg.color, display: "block", lineHeight: 1,
                  }}>
                    {item.stock}
                  </span>
                  <span style={{
                    background: cfg.bg, borderRadius: 20, padding: "1px 7px",
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.58rem", fontWeight: 700, color: cfg.color,
                    marginTop: 2, display: "inline-block",
                  }}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.58rem", color: "#8C9796",
                  }}>
                    {pct}% del mínimo requerido
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 5, background: "#F0EDE8", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 5,
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cfg.bar}bb, ${cfg.bar})`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "12px 20px" }}>
        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          style={{
            width: "100%",
            background: "#FDECEA",
            border: "1px solid rgba(183,110,121,0.25)",
            borderRadius: 9,
            padding: "9px",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.75rem", fontWeight: 600,
            color: "#B76E79", cursor: "pointer",
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
