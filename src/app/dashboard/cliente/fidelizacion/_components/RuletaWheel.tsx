"use client";

import { useState, useCallback, useRef } from "react";
import type { IRuletaReward } from "@/lib/models/RuletaSpin";
import type { ResultadoGiro } from "@/lib/models/RuletaSpin";

interface RuletaWheelProps {
  rewards: IRuletaReward[];
  disponible: boolean;
  proximoGiro?: string;
  onGiro: (tipo: "diaria") => Promise<ResultadoGiro | null>;
}

export default function RuletaWheel({
  rewards,
  disponible,
  proximoGiro,
  onGiro,
}: RuletaWheelProps) {
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGiro | null>(null);
  const [rotacion, setRotacion] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentos = rewards.slice(0, 8);
  const numSeg = segmentos.length || 8;
  const anguloPorSeg = 360 / numSeg;

  const girar = useCallback(async () => {
    if (girando || !disponible) return;
    setGirando(true);
    setMostrarResultado(false);

    // Animación de giro (5-10 vueltas)
    const vueltasExtra = 5 + Math.floor(Math.random() * 5);
    const anguloFinal = rotacion + vueltasExtra * 360 + Math.floor(Math.random() * 360);
    setRotacion(anguloFinal);

    // Llamar al backend después de 300ms (UI primero)
    await new Promise((r) => setTimeout(r, 300));
    const res = await onGiro("diaria");

    // Esperar animación completa (3s)
    await new Promise((r) => setTimeout(r, 2700));
    setResultado(res);
    setMostrarResultado(true);
    setGirando(false);
  }, [girando, disponible, rotacion, onGiro]);

  // Calcular tiempo restante
  const tiempoRestante = proximoGiro
    ? Math.max(0, Math.ceil((new Date(proximoGiro).getTime() - Date.now()) / (1000 * 60 * 60)))
    : null;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
      <style>{`
        @keyframes ruletaSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(var(--target-rot, 1800deg)); }
        }
        @keyframes resultadoPop {
          0%   { opacity:0; transform:scale(0.7) translateY(10px); }
          60%  { transform:scale(1.05) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes shimmerRuleta {
          0%   { box-shadow: 0 0 0 0 rgba(183,110,121,0.4); }
          70%  { box-shadow: 0 0 0 20px rgba(183,110,121,0); }
          100% { box-shadow: 0 0 0 0 rgba(183,110,121,0); }
        }
        .ruleta-girar-btn:hover:not(:disabled) {
          transform: scale(1.04);
          box-shadow: 0 8px 28px rgba(183,110,121,0.5);
        }
        .ruleta-girar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Rueda */}
      <div style={{ position:"relative", width:260, height:260 }}>
        {/* Indicador (flecha) */}
        <div style={{
          position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
          width:0, height:0,
          borderLeft:"12px solid transparent",
          borderRight:"12px solid transparent",
          borderTop:"22px solid #b76e79",
          zIndex:10,
          filter:"drop-shadow(0 2px 4px rgba(183,110,121,0.5))"
        }} />

        {/* Rueda SVG */}
        <div
          ref={wheelRef}
          style={{
            width:260, height:260, borderRadius:"50%",
            overflow:"hidden",
            boxShadow:"0 8px 32px rgba(0,0,0,0.25), inset 0 2px 8px rgba(255,255,255,0.1)",
            border:"4px solid rgba(255,255,255,0.2)",
            transition: girando ? `transform 3s cubic-bezier(0.17,0.67,0.12,0.99)` : "none",
            transform: `rotate(${rotacion}deg)`,
            animation: girando ? "shimmerRuleta 0.5s ease-in-out infinite" : "none",
          }}
        >
          <svg viewBox="0 0 260 260" width="260" height="260">
            {segmentos.map((seg, i) => {
              const startAngle = (i * anguloPorSeg - 90) * (Math.PI / 180);
              const endAngle   = ((i + 1) * anguloPorSeg - 90) * (Math.PI / 180);
              const cx = 130, cy = 130, r = 124;
              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);
              const midAngle = startAngle + (endAngle - startAngle) / 2;
              const tx = cx + (r * 0.62) * Math.cos(midAngle);
              const ty = cy + (r * 0.62) * Math.sin(midAngle);
              const large = anguloPorSeg > 180 ? 1 : 0;

              return (
                <g key={seg.id}>
                  <path
                    d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
                    fill={seg.color}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    style={{ userSelect:"none" }}
                  >
                    {seg.emoji}
                  </text>
                </g>
              );
            })}
            {/* Centro */}
            <circle cx="130" cy="130" r="22" fill="#f6f4ef" stroke="rgba(183,110,121,0.4)" strokeWidth="3" />
            <text x="130" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="16">⭐</text>
          </svg>
        </div>
      </div>

      {/* Botón girar */}
      <button
        id="btn-girar-ruleta"
        className="ruleta-girar-btn"
        onClick={girar}
        disabled={girando || !disponible}
        style={{
          background: disponible
            ? "linear-gradient(135deg, #b76e79 0%, #d4a5a5 100%)"
            : "rgba(74,85,104,0.3)",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "14px 36px",
          fontSize: "1rem",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: disponible ? "pointer" : "not-allowed",
          transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
          letterSpacing: "0.04em",
          boxShadow: disponible ? "0 4px 16px rgba(183,110,121,0.35)" : "none",
          width: "100%",
          maxWidth: 220,
        }}
      >
        {girando ? "🎰 Girando..." : disponible ? "🎰 Girar Ruleta" : "⏰ No disponible"}
      </button>

      {/* Tiempo hasta próximo giro */}
      {!disponible && tiempoRestante !== null && (
        <p style={{ margin:0, fontSize:"0.78rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
          Disponible en {tiempoRestante}h aprox.
        </p>
      )}

      {/* Resultado */}
      {mostrarResultado && resultado && (
        <div style={{
          animation: "resultadoPop 0.45s cubic-bezier(0.22,1,0.36,1) both",
          background: `linear-gradient(135deg, ${resultado.color}22, ${resultado.color}44)`,
          border: `2px solid ${resultado.color}`,
          borderRadius: 16,
          padding: "16px 24px",
          textAlign:"center",
          width:"100%",
          maxWidth:280,
        }}>
          <div style={{ fontSize:"2.5rem", marginBottom:8 }}>{resultado.emoji}</div>
          <h3 style={{ margin:0, fontFamily:"var(--font-serif)", fontSize:"1.3rem", color:"#1a1a2e" }}>
            {resultado.premio_nombre}
          </h3>
          {resultado.puntos_ganados > 0 && (
            <p style={{ margin:"6px 0 0", fontSize:"0.9rem", color:"#4a5568", fontFamily:"var(--font-sans)" }}>
              +{resultado.puntos_ganados} puntos agregados
            </p>
          )}
          {resultado.codigo_promo && (
            <div style={{
              marginTop:10, background:"rgba(255,255,255,0.8)", borderRadius:10, padding:"8px 14px",
              fontFamily:"var(--font-sans)", fontSize:"0.85rem"
            }}>
              <p style={{ margin:0, fontSize:"0.65rem", color:"#708090", letterSpacing:"0.1em" }}>TU CÓDIGO</p>
              <p style={{ margin:0, fontWeight:800, color:"#b76e79", fontSize:"1.1rem", letterSpacing:"0.08em" }}>
                {resultado.codigo_promo}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Leyenda de premios */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", maxWidth:300 }}>
        {segmentos.map((seg) => (
          <div key={seg.id} style={{
            display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem",
            color:"#4a5568", fontFamily:"var(--font-sans)"
          }}>
            <div style={{ width:10, height:10, borderRadius:3, background:seg.color, flexShrink:0 }} />
            <span>{seg.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
