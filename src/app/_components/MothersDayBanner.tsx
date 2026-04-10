"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative overflow-hidden countdown-box"
        style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 12,
          padding: "clamp(6px, 1.5vw, 14px) clamp(10px, 2vw, 20px)",
          minWidth: "clamp(42px, 7vw, 68px)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* shimmer */}
        <div
          className="shimmer-line"
          style={{
            position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-marcellus), 'Marcellus', serif",
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1,
            display: "block",
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
          fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.65)",
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

  return (
    <AnimatePresence>
      <motion.section
        key="mothers-day-banner"
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "clamp(16px, 2.5vw, 28px)",
          marginBottom: "clamp(24px, 3vw, 40px)",
          // Fondo cálido con paleta Stella + Imagen opcional
          background: campana.url_imagen 
            ? `linear-gradient(135deg, rgba(45,55,72,0.92) 0%, rgba(74,85,104,0.85) 40%, rgba(183,110,121,0.7) 100%), url(${campana.url_imagen})`
            : "linear-gradient(135deg, #2d3748 0%, #4a5568 40%, #b76e79 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 20px 60px rgba(183,110,121,0.25), 0 4px 16px rgba(74,85,104,0.3)",
          minHeight: "clamp(240px, 30vw, 340px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* ── Background decorations ── */}
        {/* Left blot */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(246,244,239,0.06) 0%, transparent 70%)",
        }} />
        {/* Right rose glow */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 320, height: 320,
          borderRadius: "50%", background: "rgba(183,110,121,0.22)", pointerEvents: "none",
          filter: "blur(40px)",
        }} />
        {/* Bottom sage tint */}
        <div style={{
          position: "absolute", bottom: -40, left: "20%", width: 280, height: 200,
          borderRadius: "50%", background: "rgba(140,151,104,0.12)", pointerEvents: "none",
          filter: "blur(50px)",
        }} />
        {/* Dot pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(246,244,239,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* ── Floating hearts ── */}
        {["10%", "30%", "55%", "75%", "90%"].map((left, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left,
              top: `${15 + (i % 3) * 20}%`,
              pointerEvents: "none",
              opacity: 0.12 + i * 0.03,
            }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            <Heart size={14 + i * 4} fill="rgba(246,244,239,0.8)" color="rgba(246,244,239,0.8)" />
          </motion.div>
        ))}

        {/* ── Content ── */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%",
          padding: "clamp(24px, 4vw, 48px) clamp(16px, 5vw, 56px)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(20px, 4vw, 48px)",
          alignItems: "center",
        }}
          className="banner-grid"
        >
          {/* Left — Text */}
          <div>
            {/* "Tiempo limitado" badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 100,
                padding: "4px 14px 4px 10px",
                marginBottom: "clamp(10px, 2vw, 18px)",
              }}
            >
              <Clock size={12} color="rgba(246,244,239,0.9)" />
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(246,244,239,0.9)",
              }}>
                Tiempo limitado
              </span>
            </motion.div>

            {/* Título principal */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "clamp(1.6rem, 4.5vw, 3.4rem)",
                fontWeight: 400,
                color: "#ffffff",
                lineHeight: 1.12,
                marginBottom: "clamp(8px, 1.5vw, 14px)",
                letterSpacing: "-0.01em",
              }}
            >
              {campana.titulo.includes("💖")
                ? <>
                    {campana.titulo.replace("💖", "").trim()}{" "}
                    <span style={{ color: "#f6c5cb", fontStyle: "italic" }}>💖</span>
                  </>
                : campana.titulo
              }
            </motion.h2>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              style={{
                fontFamily: "var(--font-lora), 'Lora', serif",
                fontStyle: "italic",
                fontSize: "clamp(0.88rem, 2vw, 1.1rem)",
                color: "rgba(246,244,239,0.75)",
                marginBottom: "clamp(16px, 3vw, 28px)",
                lineHeight: 1.5,
              }}
            >
              {campana.subtitulo}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(246,244,239,0.25), 0 0 0 4px rgba(246,244,239,0.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(campana.cta_href || "/productos")}
              style={{
                background: "#f6f4ef",
                color: "#b76e79",
                border: "none",
                borderRadius: 100,
                padding: "clamp(12px, 1.5vw, 15px) clamp(24px, 3vw, 36px)",
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
                width: "fit-content"
              }}
            >
              {/* Shimmer en botón */}
              <span
                className="shimmer-line"
                style={{
                  position: "absolute", inset: 0, borderRadius: 100, pointerEvents: "none",
                }}
              />
              <Sparkles size={15} />
              <span style={{ position: "relative", zIndex: 1 }}>
                {campana.cta_texto || "Ver regalos"}
              </span>
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Right — Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="banner-countdown"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(8px, 1.5vw, 14px)",
            }}
          >
            {/* Heart icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={28} fill="#f6c5cb" color="#f6c5cb" />
            </motion.div>

            {/* Timer grid */}
            <div style={{ display: "flex", gap: "clamp(6px, 1.5vw, 10px)", alignItems: "flex-start" }}>
              <CountdownUnit value={timeLeft.dias}     label="Días" />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.5rem", marginTop: "clamp(4px, 1vw, 8px)", lineHeight: 1 }}>:</span>
              <CountdownUnit value={timeLeft.horas}    label="Horas" />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.5rem", marginTop: "clamp(4px, 1vw, 8px)", lineHeight: 1 }}>:</span>
              <CountdownUnit value={timeLeft.minutos}  label="Min" />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.5rem", marginTop: "clamp(4px, 1vw, 8px)", lineHeight: 1 }}>:</span>
              <CountdownUnit value={timeLeft.segundos} label="Seg" />
            </div>

            <p style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(246,244,239,0.45)",
              textAlign: "center",
            }}>
              La oferta termina el 10 de mayo
            </p>
          </motion.div>
        </div>

        {/* Responsive tweaks */}
        <style>{`
          @media (max-width: 768px) {
            .banner-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
              justify-items: center;
              gap: 32px !important;
            }
            .banner-countdown {
              transform: scale(0.9);
            }
          }
          @media (max-width: 480px) {
             .countdown-box {
                padding: 6px 10px !important;
                min-width: 44px !important;
             }
             .banner-countdown {
                transform: scale(0.85);
             }
          }
        `}</style>
      </motion.section>
    </AnimatePresence>
  );
}
