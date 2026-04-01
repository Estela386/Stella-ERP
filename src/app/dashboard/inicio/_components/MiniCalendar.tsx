"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS   = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const EVENTS: Record<number, string> = {
  5:  "Entrega consignación",
  12: "Pedido mayorista",
  18: "Inventario físico",
  25: "Revisión de stock",
};

export default function MiniCalendar() {
  const today   = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = cur.getFullYear();
  const month = cur.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button
          onClick={() => setCur(new Date(year, month - 1, 1))}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9796", padding: 3, borderRadius: 6 }}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.85rem", fontWeight: 400, color: "#1C1C1C",
        }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setCur(new Date(year, month + 1, 1))}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9796", padding: 3, borderRadius: 6 }}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 3 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.07em",
            color: "#8C9796",
            padding: "2px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const isToday = (
            day === today.getDate() &&
            month === today.getMonth() &&
            year  === today.getFullYear()
          );
          const hasEvent = !!EVENTS[day];

          return (
            <div
              key={day}
              title={EVENTS[day] || undefined}
              style={{
                position: "relative",
                textAlign: "center",
                borderRadius: 7,
                padding: "5px 2px",
                /* Today → #B76E79 (alerta/acción). Event → suave crema. */
                background: isToday ? "#B76E79" : hasEvent ? "#F0EDE8" : "transparent",
                boxShadow: isToday ? "0 2px 6px rgba(183,110,121,0.3)" : "none",
                cursor: hasEvent ? "pointer" : "default",
                transition: "background 0.13s",
              }}
            >
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.7rem", fontWeight: isToday ? 700 : 400,
                color: isToday ? "#fff" : hasEvent ? "#708090" : "#1C1C1C",
              }}>
                {day}
              </span>
              {hasEvent && !isToday && (
                <div style={{
                  position: "absolute", bottom: 2, left: "50%",
                  transform: "translateX(-50%)",
                  width: 3, height: 3, borderRadius: "50%",
                  /* Dot evento = #B76E79 como indicador de alerta */
                  background: "#B76E79",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
