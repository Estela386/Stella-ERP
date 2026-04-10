"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AlternatingCategories() {
  const router = useRouter();
  
  const cats = [
    { title: "Colección Anillos", route: "/dashboard/cliente/catalogo?categoria=Anillos" },
    { title: "Personalizados", route: "/dashboard/cliente/catalogo" },
    { title: "Sets para eventos", route: "/dashboard/cliente/catalogo?categoria=Sets" }
  ];

  return (
    <section style={{
      background: "white",
      padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 52px)"
    }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h2 style={{
          fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          color: "#4a5568", margin: 0
        }}>
          Nuestras <em style={{ color: "#b76e79", fontStyle: "italic" }}>Líneas</em>
        </h2>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 30 }}>
        {cats.map((c, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                display: "flex", 
                flexDirection: isEven ? "row" : "row-reverse",
                alignItems: "center",
                gap: 30,
                background: "#f6f4ef",
                padding: "20px 30px",
                borderRadius: 20,
              }}
            >
              {/* Imagen Placeholder */}
              <div style={{
                flexShrink: 0, width: 120, height: 90, borderRadius: 12,
                background: "linear-gradient(135deg, #ede8e1, #d4c8b7)",
              }} />
              
              <div style={{ flex: 1, textAlign: isEven ? "left" : "right" }}>
                <h3 style={{
                  fontFamily: "var(--font-marcellus)", fontSize: "1.2rem",
                  color: "#4a5568", marginBottom: 12
                }}>{c.title}</h3>
                <button
                  onClick={() => router.push(c.route)}
                  style={{
                    background: "#8c9768", color: "white", border: "none",
                    padding: "8px 20px", borderRadius: 100,
                    fontFamily: "var(--font-poppins)", fontSize: "0.75rem",
                    fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Ver Más
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
