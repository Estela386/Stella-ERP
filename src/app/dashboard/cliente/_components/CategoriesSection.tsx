"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { createClient } from "@utils/supabase/client";

interface CategoriaExtended {
  id: number;
  nombre: string;
  image: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23ede9e3' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='Cormorant Garamond,serif' font-size='20' fill='%23708090' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

export default function CategoriesSection() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [categorias, setCategorias] = useState<CategoriaExtended[]>([]);

  useEffect(() => {
    const loadCategorias = async () => {
      const supabase = createClient();
      // Obtenemos categorias
      const { data: catData } = await supabase.from("categoria").select("*");
      if (!catData) return;

      // Por cada categoría, obtenemos la primera imagen de producto disponible para usarla como portada
      const withImages = await Promise.all(
        catData.map(async (c) => {
          const { data: prodData } = await supabase
            .from("producto")
            .select("url_imagen")
            .eq("id_categoria", c.id)
            .not("url_imagen", "is", null)
            .limit(1);

          return {
            id: c.id,
            nombre: c.nombre,
            image: prodData && prodData.length > 0 && prodData[0].url_imagen 
                   ? prodData[0].url_imagen 
                   : PLACEHOLDER_IMAGE,
          };
        })
      );
      
      setCategorias(withImages);
    };
    
    loadCategorias();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const amount = dir === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (categorias.length === 0) return null;

  return (
    <section style={{
      background: "white",
      padding: "clamp(40px, 6vw, 64px) 0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ padding: "0 clamp(20px, 5vw, 52px)", maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Section Header con un título más refinado */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <p style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "#8c9768", marginBottom: 8,
            }}>
              Tu Estilo
            </p>
            <h2 style={{
              fontFamily: "var(--font-marcellus), 'Marcellus', serif",
              fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
              fontWeight: 400, lineHeight: 1.1, color: "#2d3748", margin: 0,
            }}>
              Nuestras <em style={{ color: "#b76e79", fontStyle: "italic" }}>Líneas</em>
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => scroll("left")}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "white", border: "1px solid rgba(112,128,144,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#4a5568",
                boxShadow: "0 4px 12px rgba(112,128,144,0.05)"
              }}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "white", border: "1px solid rgba(112,128,144,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#4a5568",
                boxShadow: "0 4px 12px rgba(112,128,144,0.05)"
              }}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Carrusel Dinámico */}
      <div style={{ position: "relative" }}>
        <div 
          ref={carouselRef}
          style={{ 
            display: "flex", 
            gap: "24px", 
            overflowX: "auto", 
            paddingLeft: "clamp(20px, 5vw, 52px)", 
            paddingRight: "clamp(20px, 5vw, 52px)", 
            paddingBottom: 24, 
            scrollbarWidth: "none" 
          }}
        >
          {categorias.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push(`/dashboard/cliente/catalogo?categoria=${encodeURIComponent(cat.nombre)}&categoriaId=${cat.id}`)}
              style={{
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                width: "clamp(200px, 25vw, 280px)",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "100%",
                aspectRatio: "4/5",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                marginBottom: 16,
                boxShadow: "0 12px 30px rgba(74,85,104,0.08)",
                background: "#ede9e3"
              }}>
                <Image
                  src={cat.image}
                  alt={cat.nombre}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                  className="category-img"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)",
                }} />
              </div>

              <div style={{ padding: "0 8px" }}>
                <p style={{
                  fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                  fontSize: "1.2rem",
                  color: "#2d3748",
                  margin: "0 0 4px",
                }}>
                  {cat.nombre}
                </p>
                <div style={{
                  height: 1, width: 30, background: "#b76e79",
                  transition: "width 0.3s ease"
                }} className="category-line" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .category-img:hover { transform: scale(1.08) !important; }
        .category-line { width: 30px; }
        div:hover > div > .category-line { width: 100% !important; background: #8c9768 !important; }
      `}</style>
    </section>
  );
}
