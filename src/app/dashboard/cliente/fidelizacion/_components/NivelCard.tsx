"use client";

import type { ILoyaltySummary, NivelProgreso } from "@/lib/models/Fidelizacion";

interface NivelCardProps {
  summary: ILoyaltySummary;
  progreso: NivelProgreso | null;
}

const NIVEL_GRADIENTS: Record<string, string> = {
  cliente:            "linear-gradient(135deg, #708090 0%, #9aabbf 100%)",
  cliente_preferente: "linear-gradient(135deg, #b76e79 0%, #d4a5a5 100%)",
  mayorista:          "linear-gradient(135deg, #4a5568 0%, #718096 100%)",
  consignacion:       "linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)",
};

export default function NivelCard({ summary, progreso }: NivelCardProps) {
  const nivelKey = (summary.nivel_actual?.name ?? summary.nivel?.name ?? "cliente").toLowerCase().replace(" ", "_");
  const gradiente = NIVEL_GRADIENTS[nivelKey] ?? NIVEL_GRADIENTS.cliente;
  const progresoGasto = progreso?.progreso_gasto ?? 100;
  const progresoScore = progreso?.progreso_score ?? 100;

  return (
    <div style={{
      background: gradiente,
      borderRadius: 20,
      padding: "24px 28px",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    }}>
      {/* Fondo decorativo */}
      <div style={{ position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:-20,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none" }} />

      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <p style={{ margin:0, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", opacity:0.75, fontFamily:"var(--font-sans)" }}>
            Nivel Actual
          </p>
          <h2 style={{ margin:"4px 0 0", fontSize:"1.8rem", fontFamily:"var(--font-serif)", fontWeight:500, letterSpacing:"-0.02em" }}>
            {summary.nivel_icono} {summary.nivel_display ?? summary.nivel_actual?.name ?? summary.nivel?.name}
          </h2>
        </div>
        <div style={{
          background:"rgba(255,255,255,0.15)",
          borderRadius:14,
          padding:"8px 16px",
          textAlign:"center",
          backdropFilter:"blur(4px)",
          border:"1px solid rgba(255,255,255,0.2)"
        }}>
          <p style={{ margin:0, fontSize:"0.65rem", opacity:0.8, fontFamily:"var(--font-sans)", letterSpacing:"0.1em" }}>SCORE</p>
          <p style={{ margin:0, fontSize:"2rem", fontWeight:800, fontFamily:"var(--font-display)", lineHeight:1 }}>{summary.score}</p>
          <p style={{ margin:0, fontSize:"0.6rem", opacity:0.7 }}>/100</p>
        </div>
      </div>

      {/* Puntos disponibles */}
      <div style={{
        background:"rgba(255,255,255,0.12)",
        borderRadius:12,
        padding:"12px 16px",
        marginBottom:20,
        border:"1px solid rgba(255,255,255,0.15)"
      }}>
        <p style={{ margin:0, fontSize:"0.7rem", opacity:0.8, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"var(--font-sans)" }}>
          Puntos disponibles
        </p>
        <p style={{ margin:"2px 0 0", fontSize:"2.2rem", fontWeight:800, fontFamily:"var(--font-display)", lineHeight:1 }}>
          {(summary.puntos_disponibles ?? summary.points ?? 0).toLocaleString()}
        </p>
        <p style={{ margin:"2px 0 0", fontSize:"0.72rem", opacity:0.7 }}>
          {(summary.puntos_acumulados ?? summary.lifetime_points ?? 0).toLocaleString()} acumulados {summary.gasto_total != null ? `· Gasto total: $${summary.gasto_total.toLocaleString()}` : ''}
        </p>
      </div>

      {/* Progreso al siguiente nivel */}
      {progreso?.proximo_nivel && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <p style={{ margin:0, fontSize:"0.72rem", opacity:0.8, fontFamily:"var(--font-sans)" }}>
              Progreso a {progreso.proximo_nivel.nombre_display}
            </p>
            <p style={{ margin:0, fontSize:"0.72rem", fontWeight:700, opacity:0.9 }}>
              {progresoGasto}%
            </p>
          </div>

          {/* Barra de progreso gasto */}
          <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
            <div style={{
              height:"100%",
              width:`${Math.min(progresoGasto,100)}%`,
              background:"rgba(255,255,255,0.85)",
              borderRadius:4,
              transition:"width 1s cubic-bezier(0.22,1,0.36,1)"
            }} />
          </div>

          <div style={{ display:"flex", gap:12, fontSize:"0.7rem", opacity:0.8, flexWrap:"wrap" }}>
            {progreso.falta_gasto && progreso.falta_gasto > 0 && (
              <span>💰 Faltan ${Math.ceil(progreso.falta_gasto).toLocaleString()} en compras</span>
            )}
            {progreso.falta_score && progreso.falta_score > 0 && (
              <span>📊 Faltan {progreso.falta_score} pts de score</span>
            )}
            {!progreso.cumple_compras && (
              <span>🛒 Necesitas más compras</span>
            )}
          </div>
        </div>
      )}

      {!progreso?.proximo_nivel && (
        <div style={{ textAlign:"center", padding:"8px 0" }}>
          <span style={{ fontSize:"1rem", opacity:0.9 }}>👑 Has alcanzado el nivel máximo</span>
        </div>
      )}
    </div>
  );
}
