"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock as ClockIcon, ArrowRight as ArrowRightIcon } from "lucide-react";

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

function CountdownSquare({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-12 h-14 md:w-14 md:h-18 bg-white rounded-2xl shadow-md border border-white/80 flex items-center justify-center">
        <span className="text-2xl md:text-3xl font-serif text-[#4a5568]" style={{ fontFamily: "var(--font-marcellus), serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[0.6rem] md:text-[0.65rem] font-bold text-[#4a5568]/70 uppercase tracking-widest">{label}</span>
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full overflow-hidden rounded-[32px] md:rounded-[50px] shadow-2xl border border-white/50 cursor-pointer mb-10 group"
        style={{ 
          minHeight: "180px",
          background: "#fdfaf5"
        }}
        onClick={() => router.push(campana.cta_href || "/productos")}
      >
        {/* ── Background: Ultra-Vibrant Colorful Orbs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#fdfaf5]" />

          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[0%] w-[500px] h-[500px] bg-[radial-gradient(circle,#ff9a9e_0%,#fecfef_30%,transparent_70%)] opacity-50 blur-[60px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -60, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,#a1c4fd_0%,#c2e9fb_40%,transparent_70%)] opacity-40 blur-[70px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[25%] w-64 h-64 bg-[radial-gradient(circle,#fed06e_0%,transparent_70%)] opacity-40 blur-[50px]"
          />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-10 md:px-16 py-8 md:py-10 gap-10 md:gap-4">
          
          {/* 1. Left: Bold Text Content */}
          <div className="flex-[1.5] flex flex-col items-center md:items-start space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-[2px] bg-[#b76e79]" />
              <span className="text-[0.7rem] tracking-[0.3em] uppercase text-[#b76e79] font-black">
                {campana.tipo_promocion || "EDICIÓN ESPECIAL"}
              </span>
            </div>
            <h2 
              className="text-2xl md:text-3xl lg:text-5xl font-serif text-[#4a5568] leading-tight"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {campana.titulo}
            </h2>
            <p 
              className="text-xs md:text-sm lg:text-base text-[#708090] font-serif italic opacity-90"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {campana.subtitulo}
            </p>
          </div>

          {/* 2. Center: Product Image */}
          <div className="flex-1 flex items-center justify-center">
            {campana.url_imagen && (
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56"
              >
                <img 
                  src={campana.url_imagen} 
                  alt={campana.titulo}
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000"
                />
              </motion.div>
            )}
          </div>

          {/* 3. Right: Vibrant Glassmorphism Countdown Area */}
          <div className="flex-[1.5] flex flex-col items-center md:items-end gap-6">
            <div className="bg-white/30 backdrop-blur-3xl border border-white/60 p-8 md:p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-[#4a5568] font-bold">
                <ClockIcon size={16} />
                <span className="text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.3em]">TERMINA EN:</span>
              </div>
              
              <div className="flex gap-3 md:gap-4 lg:gap-5">
                <CountdownSquare value={timeLeft.dias} label="D" />
                <CountdownSquare value={timeLeft.horas} label="H" />
                <CountdownSquare value={timeLeft.minutos} label="M" />
                <CountdownSquare value={timeLeft.segundos} label="S" />
              </div>
            </div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="border-b-2 border-[#b76e79]/30 pb-1.5 group mr-4"
            >
              <span className="text-[#b76e79] font-black text-xs md:text-sm tracking-[0.25em] uppercase flex items-center gap-2">
                {campana.cta_texto || "Ver Regalos"}
                <ArrowRightIcon size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.div>
          </div>

        </div>
      </motion.section>
    </AnimatePresence>
  );
}
