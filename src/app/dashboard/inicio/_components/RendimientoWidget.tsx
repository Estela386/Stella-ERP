"use client";

import StatsRing from "./StatsRing";
import { useRouter } from "next/navigation";

const rings = [
  { label: "Ventas",       value: 78, color: "#708090", href: "/dashboard/inicio/reports" },
  { label: "Meta Mes",     value: 89, color: "#3d8c60", href: "/dashboard/inicio/reports" },
  { label: "Cobranza",     value: 65, color: "#b07830", href: "/dashboard/inicio/reports" },
  { label: "Satisfacción", value: 94, color: "#B76E79", href: "/dashboard/inicio/reports" },
];

export default function RendimientoWidget() {
  const router = useRouter();

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.11)",
      borderTop: "3px solid #708090",
      borderRadius: 14,
      padding: "16px 18px",
      boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.95rem", fontWeight: 400,
            color: "#1C1C1C", margin: 0,
          }}>
            Rendimiento
          </h3>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
          }}>
            Métricas del período actual
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/inicio/reports")}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem", fontWeight: 600,
            color: "#708090", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Ver reportes →
        </button>
      </div>

      {/* Sleek Horizontal Bars List */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        flex: 1,
        justifyContent: "center"
      }}>
        {rings.map(r => (
          <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem", fontWeight: 600, color: "#1C1C1C"
              }}>{r.label}</span>
              <span style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "0.85rem", fontWeight: 400, color: r.color
              }}>{r.value}%</span>
            </div>
            {/* Progress Bar Track */}
            <div style={{
              width: "100%", height: 6, borderRadius: 3, background: "#F0EDE8", overflow: "hidden"
            }}>
              {/* Progress Fill */}
              <div style={{
                width: `${r.value}%`, height: "100%", background: r.color, borderRadius: 3,
                transition: "width 1s ease-out"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
