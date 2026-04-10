"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Zap } from "lucide-react";

const VALORES = [
  {
    icon: Heart,
    title: "Hecho con amor",
    text: "Cada pieza es creada a mano por artesanas con años de experiencia, cuidando cada detalle.",
    color: "#b76e79",
  },
  {
    icon: Leaf,
    title: "Materiales éticos",
    text: "Usamos materiales sostenibles y de fuentes responsables, porque la joyería debe ser conscientemente bella.",
    color: "#8c9768",
  },
  {
    icon: Zap,
    title: "Diseño contemporáneo",
    text: "Fusionamos la tradición artesanal con estética moderna para piezas que trascienden tendencias.",
    color: "#708090",
  },
];

export default function BrandStorySection() {
  return (
    <section style={{
      background: "white",
      padding: "clamp(56px, 7vw, 100px) clamp(20px, 5vw, 52px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Soft rose glow top-right */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 500, height: 500,
        borderRadius: "50%", background: "rgba(183,110,121,0.05)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(36px, 6vw, 80px)",
          alignItems: "center",
        }}
          className="brand-grid"
        >

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ height: 1, width: 32, background: "#b76e79", display: "block" }} />
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase", color: "#8c9768",
              }}>
                Nuestra Historia
              </span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-marcellus), 'Marcellus', serif",
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              fontWeight: 400, lineHeight: 1.1,
              color: "#4a5568", margin: "0 0 20px",
            }}>
              Joyería que{" "}
              <em style={{ color: "#b76e79", fontStyle: "italic" }}>cuenta historias</em>
            </h2>

            <p style={{
              fontFamily: "var(--font-lora), 'Lora', serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.6vw, 1.12rem)",
              color: "#708090", lineHeight: 1.75,
              margin: "0 0 20px",
            }}>
              &ldquo;Stella nació del deseo de crear joyas que sean más que adornos — 
              son fragmentos de historia, amor y arte que se llevan consigo.&rdquo;
            </p>

            <p style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "0.88rem", color: "#708090",
              lineHeight: 1.75, margin: "0 0 32px",
            }}>
              Cada colección nace de la observación de la naturaleza y las emociones humanas. 
              Desde 2020, hemos creado piezas únicas que acompañan momentos que importan: 
              el primer beso, el sí, el abrazo que no necesita palabras.
            </p>

            <div style={{ display: "flex", gap: "clamp(20px, 4vw, 48px)", flexWrap: "wrap" }}>
              {[
                { num: "500+", label: "Piezas únicas" },
                { num: "4.9★", label: "Valoración media" },
                { num: "2000+", label: "Clientes felices" },
              ].map(stat => (
                <div key={stat.label}>
                  <p style={{
                    fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    fontWeight: 400, color: "#b76e79", margin: "0 0 4px",
                  }}>
                    {stat.num}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: "0.68rem", fontWeight: 500,
                    color: "#708090", letterSpacing: "0.1em",
                    textTransform: "uppercase", margin: 0,
                  }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Values Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {VALORES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  style={{
                    background: "#f6f4ef",
                    border: "1px solid rgba(112,128,144,0.12)",
                    borderRadius: 18,
                    padding: "clamp(16px, 2.5vw, 22px) clamp(18px, 2.5vw, 24px)",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    boxShadow: "0 2px 8px rgba(140,151,104,0.04)",
                    transition: "transform 0.2s ease",
                    cursor: "default",
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "white",
                    border: `1px solid rgba(112,128,144,0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(140,151,104,0.06)",
                  }}>
                    <Icon size={20} color={v.color} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                      fontSize: "0.95rem", color: "#4a5568",
                      margin: "0 0 6px", fontWeight: 400,
                    }}>
                      {v.title}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                      fontSize: "0.8rem", color: "#708090",
                      lineHeight: 1.6, margin: 0,
                    }}>
                      {v.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brand-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
