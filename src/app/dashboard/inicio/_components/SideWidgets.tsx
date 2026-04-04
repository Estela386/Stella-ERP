"use client";

import { useEffect, useState } from "react";
import MiniCalendar from "./MiniCalendar";
import { useRouter } from "next/navigation";

interface Event {
  date: string;
  title: string;
  href: string;
  isUrgent?: boolean;
}

const CARD: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(112,128,144,0.11)",
  borderRadius: 14,
  padding: "16px",
  boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
  boxSizing: "border-box",
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-marcellus)",
  fontSize: "0.75rem", fontWeight: 400,
  letterSpacing: "0.15em", textTransform: "uppercase",
  color: "#8C9796",
  margin: "0 0 12px",
};

export default function SideWidgets() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/dashboard/upcoming-events");
        if (!res.ok) throw new Error("Error fetching events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 120000); // cada 2 minutos
    return () => clearInterval(interval);
  }, []);

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

      {/* ── Upcoming Events (desde la BD) ── */}
      <div style={{ ...CARD, borderTop: "3px solid #B76E79", height: "100%", display: "flex", flexDirection: "column" }}>
        <p style={SECTION_LABEL}>Próximos eventos</p>

        {loading ? (
          /* Skeleton */
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 4px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8E4DE", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, width: "70%", borderRadius: 4, background: "#F0EDE8", marginBottom: 4 }} />
                  <div style={{ height: 8, width: "40%", borderRadius: 4, background: "#F0EDE8" }} />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "#8C9796",
            textAlign: "center",
            padding: "12px 0",
          }}>
            ✓ Sin pedidos pendientes por entregar
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((ev, i) => (
              <div
                key={i}
                onClick={() => router.push(ev.href)}
                style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: i === 0 ? "8px 10px" : "5px 4px",
                  background: i === 0 ? (ev.isUrgent ? "#FDF4F5" : "#F4F7FD") : "transparent",
                  borderRadius: i === 0 ? 9 : 0,
                  border: i === 0 ? `1px solid ${ev.isUrgent ? "#F0D8DB" : "#D8E3F0"}` : "none",
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
                  background: i === 0
                    ? (ev.isUrgent ? "#B76E79" : "#708090")
                    : "#C8C4BC",
                  marginTop: 5, flexShrink: 0,
                }} />
                <div>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.74rem", fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? "#1C1C1C" : "#708090",
                    margin: 0,
                  }}>
                    {ev.title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.62rem",
                    color: i === 0
                      ? (ev.isUrgent ? "#B76E79" : "#708090")
                      : "#8C9796",
                    margin: "1px 0 0",
                  }}>
                    {ev.date}
                    {ev.isUrgent && i === 0 && (
                      <span style={{ marginLeft: 4, fontWeight: 700, color: "#B76E79" }}>
                        · Urgente
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
