"use client";

import { useState } from "react";
import type { IUserPromoCode } from "@/lib/models/Promocion";

interface MisCodigosPanelProps {
  codigos: IUserPromoCode[];
  onCopiar?: (codigo: string) => void;
}

export default function MisCodigosPanel({ codigos, onCopiar }: MisCodigosPanelProps) {
  // Capturar 'now' una sola vez al montar el componente para evitar llamadas impuras en render
  const [now] = useState(() => Date.now());

  const copiar = (codigo: string) => {
    navigator.clipboard.writeText(codigo).catch(() => {});
    onCopiar?.(codigo);
  };

  if (codigos.length === 0) {
    return (
      <div style={{
        background:"#fff",
        borderRadius:16,
        padding:"24px",
        border:"1.5px dashed rgba(183,110,121,0.25)",
        textAlign:"center"
      }}>
        <div style={{ fontSize:"2rem", marginBottom:8 }}>🎁</div>
        <p style={{ margin:0, fontSize:"0.88rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
          Aún no tienes códigos. ¡Gira la ruleta o realiza una compra!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {codigos.map((upc) => {
        const code = upc.promo_code;
        if (!code) return null;
        const vence = code.fecha_expiracion
          ? new Date(code.fecha_expiracion)
          : null;
        const diasRestantes = vence
          ? Math.ceil((vence.getTime() - now) / (1000 * 60 * 60 * 24))
          : null;
        const urgente = diasRestantes !== null && diasRestantes <= 3;

        return (
          <div
            key={upc.id}
            style={{
              background: urgente
                ? "linear-gradient(135deg, #fff5f5, #ffe8e8)"
                : "linear-gradient(135deg, #fff, #f9f7f4)",
              borderRadius:14,
              padding:"14px 16px",
              border: urgente
                ? "1.5px solid rgba(220,53,69,0.3)"
                : "1.5px solid rgba(183,110,121,0.15)",
              display:"flex",
              alignItems:"center",
              gap:12,
            }}
          >
            {/* Ícono */}
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background: urgente ? "rgba(220,53,69,0.1)" : "rgba(183,110,121,0.1)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.3rem"
            }}>
              {code.origen === "ruleta" ? "🎰" : code.origen === "referido" ? "👥" : "🏷️"}
            </div>

            {/* Info */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                <p style={{
                  margin:0, fontWeight:800, fontSize:"1rem",
                  fontFamily:"var(--font-display)", color:"#b76e79",
                  letterSpacing:"0.06em"
                }}>
                  {code.codigo}
                </p>
                {urgente && (
                  <span style={{
                    fontSize:"0.6rem", fontWeight:700, padding:"2px 6px", borderRadius:4,
                    background:"#dc3545", color:"#fff", letterSpacing:"0.08em"
                  }}>
                    ¡EXPIRA PRONTO!
                  </span>
                )}
              </div>
              <p style={{ margin:0, fontSize:"0.78rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
                {code.descripcion ?? "Código promocional"}
              </p>
              {diasRestantes !== null && (
                <p style={{ margin:"2px 0 0", fontSize:"0.7rem", color: urgente ? "#dc3545" : "#8c9768", fontFamily:"var(--font-sans)" }}>
                  {urgente ? `⚠️ Vence en ${diasRestantes} días` : `Válido por ${diasRestantes} días`}
                </p>
              )}
            </div>

            {/* Botón copiar */}
            <button
              onClick={() => copiar(code.codigo)}
              title="Copiar código"
              style={{
                background:"rgba(183,110,121,0.1)",
                border:"1px solid rgba(183,110,121,0.2)",
                borderRadius:8,
                padding:"6px 12px",
                fontSize:"0.75rem",
                color:"#b76e79",
                cursor:"pointer",
                fontFamily:"var(--font-sans)",
                fontWeight:600,
                flexShrink:0,
                transition:"all 0.15s ease"
              }}
            >
              Copiar
            </button>
          </div>
        );
      })}
    </div>
  );
}
