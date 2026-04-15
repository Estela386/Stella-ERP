"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Clock } from "lucide-react";

interface Campana {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha_fin: string;
  cta_texto: string;
  cta_href: string;
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

export default function CampaignTopBar() {
  const router = useRouter();
  const [campana, setCampana] = useState<Campana | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetch("/api/campanas", { cache: "no-store" })
      .then(res => res.json())
      .then(({ campana: c }) => {
        setCampana(c ?? null);
      })
      .catch(() => {
        setCampana(null);
      });
  }, [mounted]);

  const timeLeft = useCountdown(campana?.fecha_fin ?? new Date().toISOString());
  const isExpired = campana ? new Date(campana.fecha_fin) < new Date() : true;

  if (!mounted || !campana || isExpired) return null;

  const ROSE = "#b76e79";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 60,
          background: "#f6f4ef",
          borderBottom: "1px solid rgba(183,110,121,0.1)",
          overflow: "hidden",
        }}
        onClick={() => router.push(campana.cta_href || "/productos")}
      >
        {/* Animated Mesh Background Layer */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <motion.div
            animate={{ 
              background: [
                "linear-gradient(90deg, #f6f4ef 0%, #fff0f2 50%, #f6f4ef 100%)",
                "linear-gradient(135deg, #fdfbf7 0%, #f6f4ef 50%, #fff0f2 100%)",
                "linear-gradient(180deg, #f6f4ef 0%, #fdfbf7 50%, #f6f4ef 100%)",
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            style={{ position: "absolute", inset: 0, opacity: 0.6 }}
          />
          <motion.div
            animate={{ 
              x: ["-20%", "20%"],
              y: ["-10%", "10%"],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
            style={{ 
              position: "absolute", 
              inset: "-50%",
              background: "radial-gradient(circle, rgba(183, 110, 121, 0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div 
          className="max-w-[1440px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10"
          style={{ cursor: "pointer" }}
        >
          {/* Tag & Title */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              style={{
                background: ROSE,
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <Sparkles size={10} fill="white" />
              {campana.tipo_promocion || "Promo"}
            </div>
            <p 
              style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "0.85rem",
                color: "#4a5568",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: 500,
              }}
            >
              <span className="hidden sm:inline">{campana.titulo} — </span>
              <span style={{ color: ROSE, fontWeight: 600 }}>{campana.subtitulo}</span>
            </p>
          </div>

          {/* Countdown & CTA */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Tiny Countdown */}
            <div className="hidden md:flex items-center gap-2" style={{ color: "#708090", fontSize: "0.75rem" }}>
              <Clock size={12} />
              <div className="flex gap-1.5 font-medium">
                {timeLeft.dias > 0 && <span>{timeLeft.dias}d</span>}
                <span>{String(timeLeft.horas).padStart(2, '0')}h</span>
                <span>{String(timeLeft.minutos).padStart(2, '0')}m</span>
                <span style={{ color: ROSE }}>{String(timeLeft.segundos).padStart(2, '0')}s</span>
              </div>
            </div>

            <button
              className="group flex items-center gap-1.5 text-[0.75rem] font-bold"
              style={{
                color: ROSE,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            >
              <span style={{ borderBottom: `1px solid ${ROSE}` }}>{campana.cta_texto || "Ver más"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
