"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-[#708090]/5 text-[#1a1a2e] rounded-[2rem] shadow-xl border border-[#708090]/20 relative overflow-hidden group">
      {/* Glossy overlay para dar dimensión */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
      
      <div className="flex items-center gap-2 mb-3 sm:mb-4 relative z-10">
        <Timer size={16} className="text-[#708090] animate-pulse sm:w-[18px] sm:h-[18px]" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#708090]">
          El sorteo termina en:
        </span>
      </div>

      <div className="flex gap-2 sm:gap-4 md:gap-6 relative z-10">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-18 bg-white rounded-xl flex items-center justify-center border border-[#708090]/20 shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#708090]">
                {value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-[8px] sm:text-[10px] mt-2 uppercase tracking-widest text-gray-400 font-bold">
              {unit[0]}
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-xs font-serif italic text-gray-400 relative z-10">
        Últimos días para participar
      </p>
    </div>
  );
}
