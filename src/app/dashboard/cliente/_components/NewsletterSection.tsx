"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <section style={{
      background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #3d4a5c 100%)",
      padding: "clamp(56px, 7vw, 96px) clamp(20px, 5vw, 52px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decorations */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(246,244,239,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div style={{
        position: "absolute", top: -120, right: -100, width: 480, height: 480,
        borderRadius: "50%", background: "rgba(183,110,121,0.1)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 360, height: 360,
        borderRadius: "50%", background: "rgba(140,151,104,0.08)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      {/* Top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "rgba(246,244,239,0.1)",
      }} />

      <div style={{
        maxWidth: 680, margin: "0 auto",
        position: "relative", zIndex: 1,
        textAlign: "center",
      }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(183,110,121,0.15)",
            border: "1px solid rgba(183,110,121,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Sparkles size={28} color="#b76e79" strokeWidth={1.5} />
          </div>

          {/* Eyebrow */}
          <p style={{
            fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
            fontSize: "0.62rem", fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(246,244,239,0.45)", marginBottom: 12,
          }}>
            Únete · Comunidad Stella
          </p>

          {/* Title */}
          <h2 style={{
            fontFamily: "var(--font-marcellus), 'Marcellus', serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 400, lineHeight: 1.15,
            color: "#f6f4ef", margin: "0 0 16px",
          }}>
            Descubre tus{" "}
            <em style={{ color: "#b76e79", fontStyle: "italic" }}>privilegios exclusivos</em>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--font-lora), 'Lora', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 1.5vw, 1.02rem)",
            color: "rgba(246,244,239,0.55)",
            lineHeight: 1.7, margin: "0 0 36px",
          }}>
            Suscríbete y sé la primera en conocer nuevas colecciones, 
            preventas exclusivas y descuentos solo para miembros.
          </p>

          {/* Benefits row */}
          <div style={{
            display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap",
            marginBottom: 36,
          }}>
            {["10% en tu primera compra", "Preventa de colecciones", "Ofertas exclusivas"].map(b => (
              <div
                key={b}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                  fontSize: "0.73rem", color: "rgba(246,244,239,0.65)",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#b76e79", display: "inline-block", flexShrink: 0,
                }} />
                {b}
              </div>
            ))}
          </div>

          {/* Form */}
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}
              className="newsletter-form"
            >
              <div style={{ flex: 1, position: "relative" }}>
                <Mail
                  size={16}
                  color="rgba(246,244,239,0.35)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 42px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(246,244,239,0.12)",
                    background: "rgba(246,244,239,0.07)",
                    color: "#f6f4ef",
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: "0.85rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(183,110,121,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(246,244,239,0.12)")}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(183,110,121,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "#b76e79",
                  color: "#f6f4ef",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 22px",
                  fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                  fontSize: "0.82rem", fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  boxShadow: "0 4px 16px rgba(183,110,121,0.3)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                }}
              >
                Suscribirme
                <ArrowRight size={15} />
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "rgba(140,151,104,0.15)",
                border: "1px solid rgba(140,151,104,0.3)",
                borderRadius: 14,
                padding: "18px 28px",
                maxWidth: 480, margin: "0 auto",
              }}
            >
              <p style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "1.05rem", color: "#f6f4ef", margin: "0 0 4px",
              }}>
                ¡Bienvenida a la familia Stella! 💖
              </p>
              <p style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.78rem", color: "rgba(246,244,239,0.55)", margin: 0,
              }}>
                Pronto recibirás noticias especiales en tu correo
              </p>
            </motion.div>
          )}

          <p style={{
            fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
            fontSize: "0.66rem", color: "rgba(246,244,239,0.28)",
            marginTop: 16,
          }}>
            Sin spam. Puedes cancelar cuando quieras.
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .newsletter-form {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
