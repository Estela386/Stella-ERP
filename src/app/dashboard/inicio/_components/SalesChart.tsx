"use client";

import { useState } from "react";

const data = [
  { day: "Lun", value: 8200  },
  { day: "Mar", value: 11300 },
  { day: "Mié", value: 6150  },
  { day: "Jue", value: 13340 },
  { day: "Vie", value: 16820 },
  { day: "Sáb", value: 20500 },
  { day: "Dom", value: 9230  },
];

const CHART_H   = 140; // px — altura total del área de barras
const MAX_VALUE = Math.max(...data.map(d => d.value));
const GRID_LINES = [0, 25, 50, 75, 100]; // porcentajes para líneas guía

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
}

export default function SalesChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.12)",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(112,128,144,0.07)",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px 12px",
        borderBottom: "1px solid rgba(112,128,144,0.08)",
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.95rem", fontWeight: 400,
            color: "#1C1C1C", margin: 0,
          }}>
            Ventas de la Semana
          </h3>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
          }}>
            Ingresos diarios — semana actual
          </p>
        </div>
        <span style={{
          background: "#EDF5F0", color: "#4a8c6a",
          borderRadius: 20, padding: "3px 11px",
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.75rem", fontWeight: 400,
        }}>
          $85,540 total
        </span>
      </div>

      {/* Chart area */}
      <div style={{ padding: "16px 18px 14px" }}>
        {/* Chart with grid */}
        <div style={{ position: "relative", height: CHART_H + 24 }}>

          {/* Grid lines */}
          {GRID_LINES.filter(g => g > 0).map(pct => (
            <div key={pct} style={{
              position: "absolute",
              left: 0, right: 0,
              bottom: 24 + (pct / 100) * CHART_H,
              height: 1,
              background: "rgba(112,128,144,0.08)",
              pointerEvents: "none",
            }} />
          ))}

          {/* Bars */}
          <div style={{
            position: "absolute",
            left: 0, right: 0,
            bottom: 24, // space for day labels
            height: CHART_H,
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "0 4px",
          }}>
            {data.map((d, i) => {
              const barH = Math.round((d.value / MAX_VALUE) * CHART_H);
              const isHov = hovered === i;

              return (
                <div
                  key={d.day}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  {isHov && (
                    <div style={{
                      position: "absolute",
                      bottom: barH + 6,
                      left: "50%", transform: "translateX(-50%)",
                      background: "#1C1C1C",
                      color: "#fff",
                      borderRadius: 7, padding: "4px 9px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.68rem", fontWeight: 700,
                      whiteSpace: "nowrap", zIndex: 20,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                      pointerEvents: "none",
                    }}>
                      {fmt(d.value)}
                    </div>
                  )}

                  {/* Bar */}
                  <div style={{
                    width: "80%",
                    height: barH,
                    borderRadius: "6px 6px 3px 3px",
                    background: isHov
                      ? "linear-gradient(180deg, #B76E79 0%, #a05060 100%)"
                      : "linear-gradient(180deg, #a0b0be 0%, #708090 100%)",
                    boxShadow: isHov ? "0 4px 12px rgba(183,110,121,0.35)" : "none",
                    transition: "all 0.18s cubic-bezier(.22,1,.36,1)",
                    transform: isHov ? "scaleY(1.04)" : "scaleY(1)",
                    transformOrigin: "bottom",
                  }} />
                </div>
              );
            })}
          </div>

          {/* Day labels row */}
          <div style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            height: 22,
            display: "flex",
            gap: 8,
            padding: "0 4px",
            alignItems: "center",
          }}>
            {data.map((d, i) => (
              <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.62rem",
                  fontWeight: hovered === i ? 700 : 400,
                  color: hovered === i ? "#B76E79" : "#8C9796",
                  transition: "color 0.15s",
                }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
