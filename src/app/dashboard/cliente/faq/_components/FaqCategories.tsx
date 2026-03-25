"use client";

import type { FaqCategory, FaqSection } from "../type";

interface Props {
  sections: FaqSection[];
  active: FaqCategory;
  onChange: (cat: FaqCategory) => void;
}

export default function FaqCategories({ sections, active, onChange }: Props) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap",
      gap: 8,
      justifyContent: "center",
    }}>
      {sections.map(s => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px",
              borderRadius: 99,
              border: isActive
                ? "1.5px solid rgba(183,110,121,0.5)"
                : "1.5px solid rgba(112,128,144,0.2)",
              background: isActive
                ? "rgba(183,110,121,0.1)"
                : "rgba(255,255,255,0.7)",
              color: isActive ? "#b76e79" : "#708090",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.82rem",
              fontWeight: isActive ? 500 : 400,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.18s cubic-bezier(.22,1,.36,1)",
              boxShadow: isActive
                ? "0 4px 14px rgba(183,110,121,0.18)"
                : "0 1px 6px rgba(140,151,104,0.06)",
              whiteSpace: "nowrap",
            }}
          >
            {/* Icon Container */}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: isActive ? "rgba(183,110,121,0.15)" : "rgba(112,128,144,0.06)",
              border: `1px solid ${isActive ? "rgba(183,110,121,0.2)" : "rgba(112,128,144,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s ease",
            }}>
              <div style={{
                color: isActive ? "#b76e79" : "#708090",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: isActive ? 1 : 0.75,
              }}>
                {s.icon}
              </div>
            </div>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
