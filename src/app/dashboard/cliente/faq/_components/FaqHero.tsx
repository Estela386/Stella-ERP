"use client";

import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FaqHero() {
  return (
    <section style={{
      textAlign: "center",
      padding: "clamp(48px,6vw,80px) clamp(20px,5vw,52px) clamp(32px,4vw,52px)",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #f6f4ef 0%, #ede9e3 100%)",
      borderRadius: "0 0 32px 32px",
    }}>
      {/* Blobs */}
      <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(183,110,121,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"rgba(140,151,104,0.07)", pointerEvents:"none" }} />

      {/* Eyebrow pill */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:8,
        padding:"6px 12px 6px 8px", borderRadius:99,
        background:"rgba(183,110,121,0.06)",
        border:"1px solid rgba(183,110,121,0.15)",
        marginBottom:20,
        animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) both",
      }}>
        {/* Icon Container similar a categorías */}
        <div style={{
          width: 24, height: 24, borderRadius: 8,
          background: "rgba(183,110,121,0.15)",
          border: "1px solid rgba(183,110,121,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={12} style={{ color:"#b76e79" }} />
        </div>
        <span style={{
          fontFamily:"var(--font-sans)",
          fontSize:"0.62rem", fontWeight:500,
          textTransform:"uppercase", letterSpacing:"0.2em",
          color:"#b76e79",
        }}>
          Preguntas frecuentes
        </span>
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily:"var(--font-marcellus)",
        fontSize:"clamp(2.6rem,5vw,4.4rem)",
        fontWeight:400,
        lineHeight:1.1,
        color:"#4a5568",
        margin:"0 0 16px",
        animation:"fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.06s both",
      }}>
        Todo lo que necesitas{" "}
        <em style={{ color:"#b76e79", fontStyle:"italic", fontFamily:"var(--font-marcellus)" }}>saber</em>
      </h1>

      {/* Subtítulo */}
      <p style={{
        fontFamily:"var(--font-sans)",
        fontSize:"clamp(0.9rem,1.5vw,1.05rem)",
        color:"#708090",
        maxWidth:520,
        margin:"0 auto 28px",
        lineHeight:1.7,
        animation:"fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.12s both",
      }}>
        Resolvemos tus dudas sobre envíos, materiales, pedidos personalizados, 
        mayoreo y cómo cuidar tus joyas Stella.
      </p>

      {/* Breadcrumb */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        fontFamily:"var(--font-sans)", fontSize:"0.78rem", color:"#708090",
        animation:"fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.18s both",
      }}>
        <Link href="/dashboard/cliente" style={{ color:"#b76e79", textDecoration:"none" }}>Inicio</Link>
        <ChevronRight size={12} />
        <span>Preguntas frecuentes</span>
      </div>
    </section>
  );
}
