"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TerminosPageData, TerminosSection, TerminosBlock } from "../type";

// ─── Paleta (igual que landing) ──────────────────────────────────────────────
const C = {
  bg:          "#f6f4ef",
  bgAlt:       "#ede9e3",
  white:       "#ffffff",
  slate:       "#708090",
  slateDeep:   "#4a5568",
  slateBorder: "rgba(112,128,144,0.18)",
  slateMid:    "rgba(112,128,144,0.25)",
  slateLight:  "rgba(112,128,144,0.08)",
  rose:        "#b76e79",
  roseBg:      "rgba(183,110,121,0.08)",
  roseBorder:  "rgba(183,110,121,0.22)",
  sage:        "#8c9768",
  sageSm:      "rgba(140,151,104,0.08)",
  sageLg:      "rgba(140,151,104,0.22)",
};

// ─── Renderiza un bloque de contenido ─────────────────────────────────────────
function Block({ block }: { block: TerminosBlock }) {
  if (block.type === "subheading") {
    return (
      <h4 style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: "0.97rem", fontWeight: 700,
        color: C.slateDeep, marginBottom: 8, marginTop: 20,
      }}>
        {block.text}
      </h4>
    );
  }

  if (block.type === "list" && block.items) {
    return (
      <ul style={{ paddingLeft: 0, margin: "10px 0 14px", listStyle: "none" }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
            <span style={{
              marginTop: 6, width: 6, height: 6, borderRadius: "50%",
              background: C.rose, flexShrink: 0, display: "inline-block",
            }} />
            <span style={{ fontSize: "0.88rem", lineHeight: 1.70, color: C.slate, fontWeight: 400 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p style={{
      fontSize: "0.88rem", lineHeight: 1.75,
      color: C.slate, fontWeight: 400,
      marginBottom: 12, margin: "0 0 12px",
    }}>
      {block.text}
    </p>
  );
}

// ─── Tarjeta de sección ───────────────────────────────────────────────────────
function SectionCard({ section, active }: { section: TerminosSection; active: boolean }) {
  return (
    <div
      id={section.id}
      style={{
        background: C.white,
        borderRadius: 16,
        border: `1px solid ${active ? C.roseBorder : C.slateBorder}`,
        padding: "clamp(20px,3vw,32px)",
        boxShadow: active
          ? `0 4px 24px ${C.sageLg}, 0 0 0 3px ${C.roseBg}`
          : `0 2px 12px ${C.sageSm}`,
        transition: "border-color 0.3s, box-shadow 0.3s",
        scrollMarginTop: 100,
      }}
    >
      {/* número + título */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <span style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "0.72rem", fontWeight: 800,
          color: C.rose, letterSpacing: "0.10em",
          background: C.roseBg, border: `1px solid ${C.roseBorder}`,
          borderRadius: 6, padding: "3px 10px",
          whiteSpace: "nowrap",
        }}>
          {section.number}
        </span>
        <h3 style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "clamp(1rem,2vw,1.18rem)", fontWeight: 800,
          color: C.slateDeep, margin: 0, lineHeight: 1.2,
        }}>
          {section.title}
        </h3>
      </div>
      <div style={{ height: 1, background: C.slateBorder, marginBottom: 18 }} />

      {/* contenido */}
      {section.content.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

// ─── Índice lateral ───────────────────────────────────────────────────────────
function TableOfContents({
  sections,
  activeId,
}: {
  sections: TerminosSection[];
  activeId: string;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav style={{
      position: "sticky", top: 88,
      background: C.white,
      borderRadius: 16,
      border: `1px solid ${C.slateBorder}`,
      padding: "20px 16px",
      boxShadow: `0 2px 12px ${C.sageSm}`,
    }}>
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: "0.68rem", fontWeight: 800,
        color: C.rose, letterSpacing: "0.14em",
        textTransform: "uppercase", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 16, height: 1, background: C.rose, display: "inline-block" }} />
        Contenido
        <span style={{ width: 16, height: 1, background: C.rose, display: "inline-block" }} />
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                style={{
                  width: "100%", textAlign: "left",
                  background: isActive ? C.roseBg : "transparent",
                  border: `1px solid ${isActive ? C.roseBorder : "transparent"}`,
                  borderRadius: 8, padding: "8px 10px",
                  cursor: "pointer", transition: "all 0.18s",
                  display: "flex", alignItems: "center", gap: 9,
                  fontFamily: "'Nunito', sans-serif",
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.slateLight;
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <span style={{
                  fontSize: "0.60rem", fontWeight: 800, color: C.rose,
                  background: C.roseBg, borderRadius: 4, padding: "1px 6px",
                  flexShrink: 0,
                }}>
                  {s.number}
                </span>
                <span style={{
                  fontSize: "0.78rem", fontWeight: isActive ? 700 : 500,
                  color: isActive ? C.rose : C.slate,
                  lineHeight: 1.3,
                }}>
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TerminosContent({ data }: { data: TerminosPageData }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(data.sections[0]?.id ?? "");

  // ── Detecta de dónde viene el usuario ──
  // /terminos?from=registro  → viene del formulario de registro
  // /terminos                → viene del footer (usuario ya registrado)
  const from = searchParams.get("from");
  const isFromRegister = from === "registro";

  const backConfig = isFromRegister
    ? { label: "Volver al registro", href: "/register" }
    : { label: "Volver al inicio",   href: "/dashboard/cliente" };

  // IntersectionObserver para resaltar sección activa en el índice
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    data.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(section.id); },
        { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [data.sections]);

  return (
    <>
      <style>{`
                * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      <main style={{
        background: C.bg,
        fontFamily: "'Nunito Sans', sans-serif",
        minHeight: "100vh",
        paddingBottom: 80,
      }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: C.white,
          borderBottom: `1px solid ${C.slateBorder}`,
          padding: "clamp(48px,7vw,72px) clamp(20px,5vw,52px) clamp(32px,5vw,48px)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* dot grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(112,128,144,0.07) 1px, transparent 1px)`,
            backgroundSize: "32px 32px", pointerEvents: "none",
          }} />
          {/* rose glow */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 320, height: 320, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(183,110,121,0.07) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>

            {/* ── botón de regreso ── */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 28 }}>
              <button
                onClick={() => router.push(backConfig.href)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: C.white,
                  border: `1px solid ${C.slateBorder}`,
                  borderRadius: 20, padding: "7px 16px",
                  cursor: "pointer", transition: "all 0.18s",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.78rem", fontWeight: 700,
                  color: C.slate,
                  boxShadow: `0 1px 6px ${C.sageSm}`,
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = C.roseBorder;
                  b.style.color       = C.rose;
                  b.style.background  = C.roseBg;
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = C.slateBorder;
                  b.style.color       = C.slate;
                  b.style.background  = C.white;
                }}
              >
                <ArrowLeft size={14} />
                {backConfig.label}
              </button>
            </div>

            {/* badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: C.roseBg, border: `1px solid ${C.roseBorder}`,
              color: C.rose, borderRadius: 20, padding: "4px 14px",
              fontSize: "0.66rem", letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 20,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            }}>
              <span style={{ width: 5, height: 5, background: C.rose, borderRadius: "50%", display: "inline-block" }} />
              Documento legal · Stella Joyería Artesanal
            </div>

            {/* título bicolor */}
            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(2rem,5vw,3.4rem)",
              fontWeight: 900, lineHeight: 1.12,
              letterSpacing: "-0.02em", margin: "0 0 16px",
            }}>
              <span style={{ color: C.slateDeep }}>Términos y </span>
              <span style={{ color: C.rose }}>Condiciones</span>
            </h1>

            <p style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "clamp(0.9rem,1.5vw,1rem)",
              lineHeight: 1.72, color: C.slate,
              fontWeight: 400, maxWidth: 520, margin: "0 auto 24px",
            }}>
              Al usar la plataforma Stella ERP aceptas los presentes términos.
              Léelos con atención antes de registrarte o realizar cualquier compra.
            </p>

            {/* meta row */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.slateLight, borderRadius: 20, padding: "6px 16px",
              fontSize: "0.75rem", color: C.slate,
              fontFamily: "'Nunito', sans-serif", fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage, display: "inline-block" }} />
              Última actualización: {data.lastUpdated}
            </div>
          </div>
        </div>

        {/* ── CUERPO — índice + secciones ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "clamp(32px,4vw,52px) clamp(20px,5vw,52px) 0",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "clamp(20px,3vw,36px)",
          alignItems: "start",
        }}
          className="terminos-grid"
        >
          {/* índice — oculto en mobile */}
          <div className="terminos-toc">
            <TableOfContents sections={data.sections} activeId={activeId} />
          </div>

          {/* secciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                active={activeId === section.id}
              />
            ))}

            {/* footer de documento */}
            <div style={{
              background: C.slateDeep,
              borderRadius: 16, padding: "clamp(20px,3vw,28px)",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.88rem", fontWeight: 700,
                color: "rgba(246,244,239,0.75)", margin: "0 0 6px",
              }}>
                ¿Tienes dudas sobre estos términos?
              </p>
              <a href="mailto:contacto@stellajoyeria.com" style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.95rem", fontWeight: 800,
                color: C.rose, textDecoration: "none",
              }}>
                contacto@stellajoyeria.com
              </a>
              <p style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.78rem", color: "rgba(246,244,239,0.35)",
                margin: "14px 0 0", fontWeight: 400,
              }}>
                Al registrarte confirmas haber leído y aceptado estos Términos y Condiciones en su totalidad.
              </p>
            </div>
          </div>
        </div>

        {/* responsive */}
        <style>{`
          @media (max-width: 768px) {
            .terminos-grid {
              grid-template-columns: 1fr !important;
            }
            .terminos-toc {
              display: none !important;
            }
          }
        `}</style>
      </main>
    </>
  );
}