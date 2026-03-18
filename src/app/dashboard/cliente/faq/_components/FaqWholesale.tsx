"use client";

import { Users, CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: Users,
    title: "Solicitud de contacto",
    desc: "Escríbenos por Instagram o WhatsApp indicando que te interesa vender Stella en tu punto.",
  },
  {
    icon: CheckCircle,
    title: "Evaluación",
    desc: "Revisamos tu perfil, ubicación y canal de venta. Respondemos en máximo 5 días hábiles.",
  },
  {
    icon: Package,
    title: "Primer pedido mayorista",
    desc: "Una vez aprobado, realizas tu pedido mínimo y obtienes acceso a precios exclusivos.",
  },
];

export default function FaqWholesale() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #4a5568 0%, #3d4a5c 100%)",
      borderRadius: 20,
      padding: "clamp(28px,4vw,48px)",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 12px 40px rgba(74,85,104,0.25)",
    }}>
      {/* Blob */}
      <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(183,110,121,0.1)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:-40, width:200, height:200, borderRadius:"50%", background:"rgba(140,151,104,0.08)", pointerEvents:"none" }} />

      {/* Eyebrow */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ height:1, width:36, background:"#b76e79", flexShrink:0 }} />
        <span style={{
          fontFamily:"'DM Sans',sans-serif",
          fontSize:"0.62rem", fontWeight:500,
          textTransform:"uppercase", letterSpacing:"0.2em",
          color:"#b76e79",
        }}>
          Programa mayoristas
        </span>
      </div>

      {/* Título */}
      <h2 style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:"clamp(1.7rem,3vw,2.4rem)",
        fontWeight:500,
        color:"rgba(246,244,239,0.92)",
        lineHeight:1.2,
        margin:"0 0 10px",
      }}>
        Crece con{" "}
        <em style={{ color:"#b76e79" }}>Stella</em>
      </h2>
      <p style={{
        fontFamily:"'DM Sans',sans-serif",
        fontSize:"0.9rem",
        color:"rgba(246,244,239,0.55)",
        margin:"0 0 32px",
        maxWidth:560,
        lineHeight:1.7,
      }}>
        Únete a nuestra red de distribuidores y mayoristas. Descuento exclusivo del 
        <strong style={{ color:"#b76e79" }}> 30%</strong> sobre precio de lista, 
        acceso anticipado a colecciones y la posibilidad de consignación para quienes 
        viven en la Zona Metropolitana de Guadalajara.
      </p>

      {/* Proceso */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:16,
        marginBottom:32,
      }}>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} style={{
              background:"rgba(246,244,239,0.06)",
              border:"1px solid rgba(246,244,239,0.1)",
              borderRadius:14,
              padding:"18px 16px",
              position:"relative",
            }}>
              {/* Número */}
              <span style={{
                position:"absolute", top:12, right:14,
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"2rem", fontWeight:400,
                color:"rgba(246,244,239,0.08)",
                lineHeight:1,
              }}>
                {i + 1}
              </span>

              <div style={{
                width:36, height:36, borderRadius:10,
                background:"rgba(183,110,121,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:12,
              }}>
                <Icon size={17} style={{ color:"#b76e79" }} />
              </div>

              <p style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"1rem", fontWeight:600, fontStyle:"italic",
                color:"rgba(246,244,239,0.82)", margin:"0 0 6px",
              }}>
                {step.title}
              </p>
              <p style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"0.8rem",
                color:"rgba(246,244,239,0.45)",
                margin:0, lineHeight:1.6,
              }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Resumen de beneficios */}
      <div style={{
        display:"flex", flexWrap:"wrap", gap:10,
        marginBottom:28,
      }}>
        {[
          "30% descuento permanente",
          "Mínimo 10 piezas por pedido",
          "Consignación ZMG (después de 1er pedido)",
          "Acceso a nuevas colecciones",
          "Catálogo mayorista exclusivo",
        ].map(b => (
          <span key={b} style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"5px 13px", borderRadius:99,
            background:"rgba(183,110,121,0.12)",
            border:"1px solid rgba(183,110,121,0.3)",
            fontFamily:"'DM Sans',sans-serif",
            fontSize:"0.75rem",
            color:"rgba(246,244,239,0.7)",
          }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#b76e79", flexShrink:0 }} />
            {b}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/cliente/nosotros"
        style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"11px 24px", borderRadius:99,
          background:"#b76e79", color:"#f6f4ef",
          fontFamily:"'DM Sans',sans-serif",
          fontSize:"0.84rem", fontWeight:500,
          textDecoration:"none",
          boxShadow:"0 4px 16px rgba(183,110,121,0.35)",
          transition:"all 0.2s ease",
        }}
      >
        Solicitar información
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
