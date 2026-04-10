"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, HeartHandshake } from "lucide-react";

export default function TrustModern() {
  const items = [
    {
      icon: Shield,
      title: "Garantía de calidad",
      desc: "Materiales premium seleccionados cuidadosamente para asegurar durabilidad y belleza."
    },
    {
      icon: HeartHandshake,
      title: "Diseño Artesanal",
      desc: "Cada pieza es ensamblada a mano, prestando atención a los detalles más pequeños."
    },
    {
      icon: Sparkles,
      title: "Envíos Seguros",
      desc: "Tu joyería viaja asegurada hasta la puerta de tu casa, en un empaque especial."
    }
  ];

  return (
    <section style={{
      background: "white",
      padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 52px)",
      borderBottom: "1px solid rgba(0,0,0,0.05)"
    }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h2 style={{
          fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          color: "#4a5568", margin: 0
        }}>
          ¿Por qué elegirnos?
        </h2>
        <div style={{ width: 40, height: 2, background: "#b76e79", margin: "16px auto 0" }} />
      </div>

      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "clamp(30px, 5vw, 60px)",
        textAlign: "center"
      }}>
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div style={{
              width: 70, height: 70, margin: "0 auto 20px",
              borderRadius: "50%", border: "1.5px solid rgba(183,110,121,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(183,110,121,0.03)"
            }}>
              <it.icon size={28} strokeWidth={1.5} color="#b76e79" />
            </div>
            <h3 style={{
              fontFamily: "var(--font-marcellus)", fontSize: "1.1rem",
              color: "#4a5568", marginBottom: 12
            }}>{it.title}</h3>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.85rem",
              color: "#708090", lineHeight: 1.6
            }}>{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
