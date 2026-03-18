"use client";

import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

const ADDRESS = "C. Agustín de Iturbide 578, Santa Teresita, 44200 Guadalajara, Jal.";
const MAPS_URL = "https://maps.google.com/?q=C.+Agustín+de+Iturbide+578,+Santa+Teresita,+44200+Guadalajara,+Jalisco";
const EMBED_URL = "https://maps.google.com/maps?q=Agust%C3%ADn+de+Iturbide+578+Guadalajara+Jalisco&output=embed&z=16";

const HOURS = [
  { day: "Lunes – Viernes", time: "10:00 – 19:00" },
  { day: "Sábado",          time: "10:00 – 17:00" },
  { day: "Domingo",         time: "Cerrado" },
];

export default function FaqLocation() {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.16)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(140,151,104,0.1)",
      marginTop: 8,
    }}>
      {/* Accent top */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#b76e79,#8c9768)" }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
      }}
        className="faq-location-grid"
      >
        {/* ── Info ── */}
        <div style={{ padding: "clamp(24px,3vw,36px)" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ height: 1, width: 36, background: "#b76e79", flexShrink: 0 }} />
            <span style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.62rem", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "#b76e79",
            }}>
              Punto físico
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: "clamp(1.5rem,2.5vw,2rem)",
            fontWeight: 500, color: "#4a5568",
            lineHeight: 1.2, marginBottom: 20,
          }}>
            Visítanos en{" "}
            <em style={{ color: "#b76e79", fontStyle: "italic" }}>Guadalajara</em>
          </h3>

          {/* Dirección */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-start" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "rgba(183,110,121,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MapPin size={16} style={{ color: "#b76e79" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#4a5568", margin: "0 0 2px" }}>
                Dirección
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.875rem", color: "#708090", margin: 0, lineHeight: 1.6 }}>
                {ADDRESS}
              </p>
            </div>
          </div>

          {/* Horarios */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-start" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "rgba(140,151,104,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Clock size={16} style={{ color: "#8c9768" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#4a5568", margin: "0 0 8px" }}>
                Horarios de atención
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {HOURS.map(h => (
                  <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: "#708090" }}>{h.day}</span>
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem",
                      fontWeight: 500,
                      color: h.time === "Cerrado" ? "#C0404F" : "#4a5568",
                    }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Mapa */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 99,
              background: "#b76e79", color: "#f6f4ef",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.82rem", fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(183,110,121,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 24px rgba(183,110,121,0.4)";
            }}
            onMouseOut={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 14px rgba(183,110,121,0.3)";
            }}
          >
            <ExternalLink size={14} />
            Ver en Google Maps
          </a>
        </div>

        {/* ── Mapa embed ── */}
        <div style={{ position: "relative", minHeight: 280 }}>
          <iframe
            src={EMBED_URL}
            width="100%"
            height="100%"
            style={{
              border: "none", display: "block",
              borderRadius: "0 20px 20px 0",
              minHeight: 280,
              filter: "sepia(15%) saturate(0.85) brightness(0.96)",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Stella Joyería"
          />
          {/* Pin overlay */}
          <div style={{
            position: "absolute", bottom: 12, right: 12,
            background: "#fff",
            borderRadius: 10, padding: "6px 12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.72rem", color: "#4a5568",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <MapPin size={11} style={{ color: "#b76e79" }} />
            Stella Joyería
          </div>
        </div>
      </div>

      {/* Responsive mobile style */}
      <style>{`
        @media (max-width: 640px) {
          .faq-location-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
