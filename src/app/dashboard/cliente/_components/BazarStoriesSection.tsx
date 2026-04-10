"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronLeft, ChevronRight, ExternalLink, Play, Instagram } from "lucide-react";

// ── Stories estilo Instagram — Bazares de @stellajoyeriar ──
const STORIES = [
  {
    id: 1,
    titulo: "Bazar Primavera",
    lugar: "CDMX",
    fecha: "Próximamente",
    bg: "linear-gradient(160deg, #b76e79 0%, #8c5a64 100%)",
    emoji: "🌸",
    etiqueta: "Nuevo"
  },
  {
    id: 2,
    titulo: "Aretes exclusivos",
    lugar: "@stellajoyeriar",
    fecha: "Nueva colección",
    bg: "linear-gradient(160deg, #4a5568 0%, #2d3748 100%)",
    emoji: "✨",
    etiqueta: "Destacado"
  },
  {
    id: 3,
    titulo: "Anillos artesanales",
    lugar: "@stellajoyeriar",
    fecha: "Hecho a mano",
    bg: "linear-gradient(160deg, #8c9768 0%, #6b7450 100%)",
    emoji: "💍",
    etiqueta: "Colección"
  },
  {
    id: 4,
    titulo: "Bazar Artesanal",
    lugar: "CDMX · México",
    fecha: "Ver fechas ↓",
    bg: "linear-gradient(160deg, #b76e79 0%, #4a5568 100%)",
    emoji: "🛍️",
    etiqueta: "Stella"
  },
  {
    id: 5,
    titulo: "Recuerdos & Eventos",
    lugar: "Bautizos · Comuniones",
    fecha: "Pedidos por mensaje",
    bg: "linear-gradient(160deg, #3d4a5c 0%, #1a2130 100%)",
    emoji: "🎊",
    etiqueta: "Especial"
  },
];

// ── Anuncios de eventos / bazares ──
const BAZARES = [
  {
    id: 1,
    nombre: "Bazar Artesanal · Stella Joyería",
    descripcion: "Ven a conocer nuestra colección completa de joyería artesanal: anillos, aretes, collares y pulseras. Además de piezas especiales para recuerdos.",
    fecha: "Próximamente",
    horario: "Consulta nuestras historias",
    lugar: "CDMX · Anuncio en Instagram",
    color: "#b76e79",
    badge: "Stella presente 💍",
    ig: "https://www.instagram.com/stellajoyeriar"
  },
  {
    id: 2,
    nombre: "Mayoreo & Menudeo · Pop-Up",
    descripcion: "Lleva tu joyería favorita a precio directo de fabricante con la calidad artesanal que nos caracteriza.",
    fecha: "Fechas en Instagram",
    horario: "Consulta historias de Bazares",
    lugar: "@stellajoyeriar para no perderte ninguno",
    color: "#708090",
    badge: "Mayoreo disponible",
    ig: "https://www.instagram.com/stellajoyeriar"
  }
];

function StoryCard({ s, isActive, onClick }: { s: typeof STORIES[0]; isActive: boolean; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -5 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0, width: "clamp(130px, 18vw, 168px)", aspectRatio: "9/16",
        borderRadius: 20, overflow: "hidden", cursor: "pointer", position: "relative",
        background: s.bg,
        boxShadow: isActive ? "0 0 0 3px #b76e79, 0 16px 40px rgba(183,110,121,0.3)" : "0 8px 28px rgba(74,85,104,0.15)",
        transition: "box-shadow 0.3s ease"
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, height: 2, background: "rgba(255,255,255,0.25)", borderRadius: 1 }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: isActive ? "100%" : "25%" }}
          transition={{ duration: isActive ? 5 : 0.3 }}
          style={{ height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 1 }}
        />
      </div>

      <div style={{ position: "absolute", top: 18, left: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.4)" }} />
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.56rem", fontWeight: 700, color: "rgba(246,244,239,0.9)" }}>stellajoyeriar</span>
      </div>

      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(2.2rem, 5vw, 3rem)" }}>
        {s.emoji}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 12px 14px", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}>
        <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.82rem", color: "#fff", margin: "0 0 4px" }}>{s.titulo}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={8} color="rgba(246,244,239,0.5)" /><span style={{ fontSize: "0.52rem", color: "rgba(246,244,239,0.5)" }}>{s.fecha}</span></div>
      </div>
    </motion.div>
  );
}

export default function BazarStoriesSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") =>
    carouselRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });

  return (
    <section style={{ background: "#f6f4ef", padding: "clamp(48px, 6vw, 80px) 0", overflow: "hidden" }}>
      <div style={{ padding: "0 clamp(20px, 5vw, 52px)", maxWidth: 1240, margin: "0 auto 24px" }}>
        <h2 style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#4a5568", margin: 0 }}>
          Bazares & <em style={{ color: "#b76e79", fontStyle: "italic" }}>Eventos</em>
        </h2>
      </div>

      <div style={{ position: "relative", marginBottom: 44 }}>
        <div ref={carouselRef} style={{ display: "flex", gap: "16px", overflowX: "auto", paddingLeft: "clamp(20px, 5vw, 52px)", paddingBottom: 10, scrollbarWidth: "none" }}>
          {STORIES.map(s => (
            <StoryCard key={s.id} s={s} isActive={activeStory === s.id} onClick={() => setActiveStory(s.id)} />
          ))}
        </div>
      </div>

      <div style={{ padding: "0 clamp(20px, 5vw, 52px)", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
          {BAZARES.map((b, i) => (
            <motion.div key={b.id} whileHover={{ y: -4 }} style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(112,128,144,0.1)", boxShadow: "0 2px 12px rgba(140,151,104,0.05)" }}>
              <div style={{ height: 4, background: b.color }} />
              <div style={{ padding: "20px 22px 22px" }}>
                <h4 style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.02rem", color: "#4a5568", margin: "0 0 8px" }}>{b.nombre}</h4>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.79rem", color: "#708090", lineHeight: 1.65, margin: "0 0 16px" }}>{b.descripcion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
