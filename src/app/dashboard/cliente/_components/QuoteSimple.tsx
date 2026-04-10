"use client";

import { motion } from "framer-motion";

export default function QuoteSimple() {
  return (
    <section style={{
      background: "#e3dbce", // Beige de la imagen
      padding: "clamp(48px, 8vw, 84px) 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Estrella abstracta */}
        <div style={{ marginBottom: 30, display: "flex", justifyContent: "center" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 28.9543 20 40C20 28.9543 11.0457 20 0 20C11.0457 20 20 11.0457 20 0Z" fill="#a47738"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: "var(--font-marcellus), 'Marcellus', serif",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 400,
          color: "#a47738", // Color café dorado
          lineHeight: 1.1,
          maxWidth: 800,
          margin: "0 auto 30px",
          letterSpacing: "-0.02em",
        }}>
          La joyería es nuestra <em style={{ fontStyle: "italic", fontFamily: "var(--font-lora), serif" }}>expresión</em> de <em style={{ fontStyle: "italic", fontFamily: "var(--font-lora), serif" }}>arte</em> favorita
        </h2>

        <p style={{
          fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
          fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
          fontWeight: 400,
          color: "#a47738",
          letterSpacing: "0.05em",
        }}>
          @stellajoyeriar
        </p>
      </motion.div>
    </section>
  );
}
