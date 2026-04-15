"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, ArrowRight, Gem } from "lucide-react";

interface Campana {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha_fin: string;
  cta_texto: string;
  cta_href: string;
  url_imagen?: string;
  tipo_promocion: string;
}

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function useCountdown(fechaFin: string): TimeLeft {
  const calcularTiempo = useCallback((): TimeLeft => {
    const diferencia = new Date(fechaFin).getTime() - Date.now();
    if (diferencia <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    return {
      dias:     Math.floor(diferencia / (1000 * 60 * 60 * 24)),
      horas:    Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutos:  Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
    };
  }, [fechaFin]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcularTiempo);

  useEffect(() => {
    const tick = () => setTimeLeft(calcularTiempo());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [calcularTiempo]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="relative overflow-hidden group"
        style={{
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: 12,
          padding: "clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 15px)",
          minWidth: "clamp(44px, 6vw, 65px)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-marcellus), 'Marcellus', serif",
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 400,
            color: "#4a5568", 
            lineHeight: 1,
            display: "block",
            letterSpacing: "-0.01em"
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
          fontSize: "0.55rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(74, 85, 104, 0.6)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function MothersDayBanner() {
  const router = useRouter();
  const [campana, setCampana] = useState<Campana | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/campanas")
      .then(r => r.json())
      .then(({ campana }) => setCampana(campana ?? null))
      .catch(() => setCampana(null));
  }, []);

  const timeLeft = useCountdown(campana?.fecha_fin ?? new Date().toISOString());
  const isExpired = campana ? new Date(campana.fecha_fin) < new Date() : true;

  if (!mounted || !campana || isExpired) return null;

  // Design Tokens
  const ROSE = "#b76e79";
  const BEIGE = "#f6f4ef";

  return (
    <AnimatePresence>
      <motion.section
        key="compact-striking-banner"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        whileHover={{ y: -4, boxShadow: "0 30px 60px rgba(183, 110, 121, 0.15)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "clamp(20px, 3vw, 32px)",
          marginBottom: "clamp(20px, 4vw, 32px)",
          // Altura compacta
          minHeight: "clamp(180px, 22vw, 240px)",
          background: BEIGE,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          border: "1px solid rgba(183, 110, 121, 0.12)",
          boxShadow: "0 15px 40px rgba(112, 128, 144, 0.06)",
        }}
        onClick={() => router.push(campana.cta_href || "/productos")}
      >
        {/* ── 1. Animated Mesh Background ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Layer 1: Base Linear Gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f6f4ef 0%, #fff 50%, #fdfbf7 100%)" }} />

          {/* Layer 2: Moving Radial Blurs */}
          <motion.div 
            animate={{ 
              x: [0, 100, 0, -100, 0], 
              y: [0, -50, 50, -50, 0],
              scale: [1, 1.2, 0.9, 1.1, 1]
            }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", top: "10%", left: "20%", width: "60%", height: "80%",
              background: "radial-gradient(circle, rgba(183, 110, 121, 0.1) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 80, -40, 0], 
              y: [0, 60, -60, 40, 0],
              scale: [1, 0.8, 1.3, 0.9, 1]
            }} 
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", bottom: "10%", right: "10%", width: "50%", height: "70%",
              background: "radial-gradient(circle, rgba(140, 151, 104, 0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />

          {/* Layer 3: Noise Texture Overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04, mixBlendMode: "multiply", pointerEvents: "none",
            backgroundImage: `url("https://www.transparenttextures.com/patterns/felt.png")`, // Sutil textura de grano
          }} />

          {/* Layer 4: Shimmer Sweep Animation */}
          <motion.div
            initial={{ x: "-150%" }}
            animate={{ x: "250%" }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: "skewX(-25deg)",
              pointerEvents: "none"
            }}
          />
        </div>

        {/* ── 2. Decorative Image (If exists) ── */}
        {campana.url_imagen && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "45%",
            zIndex: 1, pointerEvents: "none",
            maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)",
          }}>
            <img 
              src={campana.url_imagen} 
              alt="" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        )}

        {/* ── 3. Content ── */}
        <div style={{
          position: "relative", zIndex: 10, width: "100%",
          padding: "clamp(20px, 3vw, 32px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "24px",
          alignItems: "center",
        }} className="banner-compact-grid">
          
          {/* Left Side: Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div style={{ width: 12, height: 1.5, background: ROSE }} />
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em",
                textTransform: "uppercase", color: ROSE
              }}>
                {campana.tipo_promocion || "Solo por hoy"}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
                fontWeight: 400, color: "#4a5568", lineHeight: 1.1, margin: 0,
                letterSpacing: "-0.02em"
              }}
            >
              {campana.titulo}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-lora), 'Lora', serif",
                fontStyle: "italic", fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
                color: "#708090", margin: 0, opacity: 0.9, maxWidth: "400px"
              }}
            >
              {campana.subtitulo}
            </motion.p>
            
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.8rem", fontWeight: 700, color: ROSE,
                letterSpacing: "0.05em", borderBottom: `1.5px solid ${ROSE}`,
                paddingBottom: 2, display: "flex", alignItems: "center", gap: 8
              }}>
                {campana.cta_texto || "Ver más"}
                <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* Right Side: Simple Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              borderRadius: 24,
              padding: "clamp(12px, 2vw, 20px) clamp(16px, 2.5vw, 24px)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center"
            }}
            className="compact-countdown"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={12} color="#708090" />
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#708090"
              }}>
                Termina en:
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <CountdownUnit value={timeLeft.dias}     label="D" />
              <CountdownUnit value={timeLeft.horas}    label="H" />
              <CountdownUnit value={timeLeft.minutos}  label="M" />
              <CountdownUnit value={timeLeft.segundos} label="S" />
            </div>
          </motion.div>
        </div>

        {/* CSS TWEAKS */}
        <style>{`
          @media (max-width: 768px) {
            .banner-compact-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
              justify-items: center;
            }
            .compact-countdown {
              transform: scale(0.9);
            }
          }
        `}</style>
      </motion.section>
    </AnimatePresence>
  );
}
