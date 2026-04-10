"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function StoryVideos() {
  // Aquí puedes cambiar las URLs cuando tengas los videos reales subidos
  const videos = [
    { id: 1, title: "Bazar Navideño CETI Colomos", url: "https://drive.google.com/file/d/1SV_9r77R0X9likadlW5N6XIzAi3-pntW/view?usp=drive_link" },
    { id: 2, title: "Exposición de marcas locales CO-RUN MEET", url: "https://drive.google.com/file/d/1TzA1sfZT7A6zbwi6UOVbg2wwpWI38dwU/view?usp=drive_link" },
  ];

  return (
    <section style={{
      background: "white",
      padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 52px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 600 }}>
        <p style={{
          fontFamily: "var(--font-poppins)", fontSize: "0.65rem",
          fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#8c9768", marginBottom: 12
        }}>Historias Reales</p>
        <h2 style={{
          fontFamily: "var(--font-marcellus)", fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "#4a5568", margin: "0 0 16px"
        }}>
          Nuestras <em style={{ color: "#b76e79", fontStyle: "italic" }}>Aventuras</em>
        </h2>
        <p style={{
          fontFamily: "var(--font-poppins)", fontSize: "0.9rem",
          color: "#708090", lineHeight: 1.6
        }}>
          Un vistazo detrás de escena de nuestros bazares y el proceso de creación.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
        gap: "clamp(20px, 4vw, 40px)",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1000,
      }}>
        {videos.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -8 }}
            style={{
              width: "100%",
              aspectRatio: "9/16",
              borderRadius: 24,
              background: "linear-gradient(145deg, #ede8e1, #d4c8b7)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            {v.url ? (
              v.url.includes("drive.google.com") ? (
                <iframe 
                  src={v.url.replace(/\/view.*/, '/preview')} 
                  className="w-full h-full" 
                  style={{ border: "none", objectFit: "cover" }}
                  allow="autoplay"
                />
              ) : (
                <video 
                  src={v.url} 
                  className="object-cover w-full h-full" 
                  muted loop playsInline 
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              )
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 16
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.5)"
                }}>
                  <Play size={24} fill="white" color="white" style={{ marginLeft: 4 }} />
                </div>
                <span style={{
                  fontFamily: "var(--font-poppins)", color: "rgba(107,76,50,0.6)",
                  fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  {v.title}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
