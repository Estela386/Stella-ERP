"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeroStella from "@assets/HomePagePicture.webp";

export default function HeroModern() {
  const router = useRouter();

  return (
    <section style={{
      background: "white",
      padding: "clamp(80px, 12vw, 140px) clamp(20px, 5vw, 52px) clamp(60px, 10vw, 100px)",
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid rgba(0,0,0,0.05)"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px, 6vw, 80px)", alignItems: "center",
      }}>
        
        {/* Lado Izquierdo - Texto */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: 500 }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
            <span style={{ width: 40, height: 1, background: "#b76e79" }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "#8c9768", textTransform: "uppercase" }}>Joyería Artesanal</span>
          </div>
          
          <h1 style={{
            fontFamily: "var(--font-marcellus), 'Marcellus', serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 400, color: "#4a5568",
            lineHeight: 1.05, margin: "0 0 24px",
          }}>
            Estudio de arte<br/>
            y <em style={{ color: "#b76e79", fontStyle: "italic" }}>diseño</em>
          </h1>
          
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            color: "#708090", lineHeight: 1.7, margin: "0 0 40px",
          }}>
            Creamos piezas únicas que te acompañan en los momentos más importantes. Encuentra tu estilo en nuestra nueva colección de temporada.
          </p>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button
              onClick={() => router.push("/dashboard/cliente/catalogo")}
              style={{
                background: "#b76e79", color: "white", border: "none",
                padding: "16px 32px", borderRadius: 100,
                fontFamily: "var(--font-poppins)", fontSize: "0.85rem",
                fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(183,110,121,0.3)",
                transition: "transform 0.2s"
              }}
            >
              Ver Colección
            </button>
          </div>
        </motion.div>

        {/* Lado Derecho - Figuras abstractas como el wireframe */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.9, delay: 0.2 }}
           style={{ position: "relative", height: "100%", minHeight: 400 }}
        >
          {/* Círculo de fondo */}
          <div style={{
            position: "absolute", top: "10%", left: "10%",
            width: "60%", aspectRatio: "1/1", borderRadius: "50%",
            background: "linear-gradient(135deg, #f0ede6, #e2d9ce)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.02)"
          }} />

          {/* Arco principal (Arch shape) */}
          <div style={{
            position: "absolute", bottom: "5%", right: "5%",
            width: "55%", height: "85%",
            background: "linear-gradient(135deg, #d4c8b7, #bba78e)",
            borderRadius: "500px 500px 20px 20px",
            boxShadow: "-20px 20px 60px rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}>
            <Image 
              src={HeroStella} 
              alt="Colección Stella" 
              fill 
              style={{ objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.85 }} 
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
