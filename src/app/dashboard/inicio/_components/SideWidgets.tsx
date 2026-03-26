"use client";

import MiniCalendar from "./MiniCalendar";
import { useRouter } from "next/navigation";

const upcomingEvents = [
  { date: "Hoy 15:00",  title: "Entrega pedido PED-0818",    href: "/dashboard/inicio/pedidos"       },
  { date: "Jue 26 Mar", title: "Consignación — Mayoreo",     href: "/dashboard/inicio/consignaciones" },
  { date: "Vie 27 Mar", title: "Inventario físico",          href: "/dashboard/inicio/inventarios"   },
  { date: "Mar 31 Mar", title: "Cierre de mes — Reportes",   href: "/dashboard/inicio/reports"       },
];

const CARD: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(112,128,144,0.11)",
  borderRadius: 14,
  padding: "16px",
  boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
  boxSizing: "border-box",
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-sans, Inter, sans-serif)",
  fontSize: "0.6rem", fontWeight: 700,
  letterSpacing: "0.13em", textTransform: "uppercase",
  color: "#8C9796",
  margin: "0 0 12px",
};

export default function SideWidgets() {
  const router = useRouter();

  return (
    <div className="side-widgets-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%" }}>
      <style>{`
        @media (max-width: 900px) {
          .side-widgets-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* ── Mini Calendar ── */}
      <div style={{ ...CARD, borderTop: "3px solid #708090", height: "100%", display: "flex", flexDirection: "column" }}>
        <p style={SECTION_LABEL}>Calendario</p>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <MiniCalendar />
        </div>
      </div>

      {/* ── Upcoming Events ── */}
      <div style={{ ...CARD, borderTop: "3px solid #B76E79", height: "100%", display: "flex", flexDirection: "column" }}>
        <p style={SECTION_LABEL}>Próximos eventos</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcomingEvents.map((ev, i) => (
            <div
              key={i}
              onClick={() => router.push(ev.href)}
              style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: i === 0 ? "8px 10px" : "5px 4px",
                background: i === 0 ? "#FDF4F5" : "transparent",
                borderRadius: i === 0 ? 9 : 0,
                border: i === 0 ? "1px solid #F0D8DB" : "none",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => {
                if (i !== 0) (e.currentTarget as HTMLElement).style.background = "#F7F4F0";
              }}
              onMouseLeave={e => {
                if (i !== 0) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === 0 ? "#B76E79" : "#C8C4BC",
                marginTop: 5, flexShrink: 0,
              }} />
              <div>
                <p style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.74rem", fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? "#1C1C1C" : "#708090",
                  margin: 0,
                }}>
                  {ev.title}
                </p>
                <p style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.62rem",
                  color: i === 0 ? "#B76E79" : "#8C9796",
                  margin: "1px 0 0",
                }}>
                  {ev.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
