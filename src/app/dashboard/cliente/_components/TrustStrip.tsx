"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCcw, Gem } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Envío Gratis",
    subtitle: "En pedidos +$1,500",
    color: "#b76e79",
  },
  {
    icon: ShieldCheck,
    title: "Pago Seguro",
    subtitle: "Cifrado SSL · Stripe",
    color: "#8c9768",
  },
  {
    icon: RefreshCcw,
    title: "Devoluciones",
    subtitle: "30 días sin preguntas",
    color: "#708090",
  },
  {
    icon: Gem,
    title: "100% Artesanal",
    subtitle: "Materiales de alta calidad",
    color: "#b76e79",
  },
];

export default function TrustStrip() {
  return (
    <section
      style={{
        background: "#F6F4EF",
        padding: "clamp(24px, 3vw, 36px) clamp(20px, 5vw, 52px)",
        position: "relative",
        borderTop: "1px solid rgba(183,110,121,0.1)",
        borderBottom: "1px solid rgba(183,110,121,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Dot grid original recuperado para textura */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(112,128,144,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "clamp(16px, 3vw, 32px)",
          }}
        >
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "white",
                  border: "1px solid rgba(183,110,121,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
                }}>
                  <Icon size={20} color={item.color} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{
                    fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                    fontSize: "0.95rem", fontWeight: 400,
                    color: "#2d3748", margin: "0 0 2px",
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: "0.68rem", color: "#708090",
                    margin: 0, letterSpacing: "0.04em",
                  }}>
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
