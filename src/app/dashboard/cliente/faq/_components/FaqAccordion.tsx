"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../type";

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "3rem 1rem",
        color: "var(--slate,#708090)", fontFamily: "'DM Sans',sans-serif",
        fontSize: "0.95rem",
      }}>
        No hay preguntas en esta categoría aún.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            style={{
              background: "#fff",
              border: `1px solid ${isOpen ? "rgba(183,110,121,0.35)" : "rgba(112,128,144,0.16)"}`,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: isOpen
                ? "0 8px 28px rgba(140,151,104,0.14)"
                : "0 2px 8px rgba(140,151,104,0.06)",
              transition: "box-shadow 0.22s ease, border-color 0.22s ease",
              animation: `fadeUp 0.45s cubic-bezier(.22,1,.36,1) ${idx * 0.05}s both`,
            }}
          >
            {/* Accent line top activo */}
            {isOpen && (
              <div style={{
                height: 2, background: "#b76e79",
                borderRadius: "14px 14px 0 0",
              }} />
            )}

            {/* Pregunta */}
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: "100%", textAlign: "left",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16,
                padding: "18px 22px",
                background: "transparent", border: "none", cursor: "pointer",
              }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: "clamp(1rem,2vw,1.12rem)",
                fontWeight: 600,
                color: isOpen ? "#b76e79" : "#4a5568",
                lineHeight: 1.35,
                flex: 1,
                transition: "color 0.2s",
              }}>
                {item.question}
              </span>

              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: isOpen ? "rgba(183,110,121,0.12)" : "rgba(112,128,144,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s, transform 0.3s cubic-bezier(.22,1,.36,1)",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}>
                <ChevronDown
                  size={16}
                  style={{ color: isOpen ? "#b76e79" : "#708090" }}
                />
              </div>
            </button>

            {/* Respuesta */}
            {isOpen && (
              <div style={{
                padding: "0 22px 22px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(0.875rem,1.3vw,0.95rem)",
                color: "#708090",
                lineHeight: 1.75,
                borderTop: "1px solid rgba(112,128,144,0.1)",
                paddingTop: 16,
              }}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
