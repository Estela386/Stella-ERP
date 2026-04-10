"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { createClient } from "@utils/supabase/client";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  url_imagen?: string | null;
  tipo?: string;
}

export default function ProductCenterCarousel() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("producto")
        .select("id, nombre, precio, url_imagen, tipo")
        .limit(10);
      setProductos(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || productos.length === 0) return null;

  return (
    <section style={{
      background: "#f6f4ef",
      padding: "clamp(40px, 6vw, 64px) 0 0 0",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 20px" }}>
        <p style={{
          fontFamily: "var(--font-poppins)", fontSize: "0.65rem",
          fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#8c9768", marginBottom: 12
        }}>Colección Exclusiva</p>
        <h2 style={{
          fontFamily: "var(--font-marcellus)", fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "#4a5568", margin: 0
        }}>
          Piezas <em style={{ color: "#b76e79", fontStyle: "italic" }}>Destacadas</em>
        </h2>
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        <div 
          ref={carouselRef}
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: "clamp(16px, 3vw, 24px)",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "0 clamp(20px, 5vw, 52px) 60px",
            scrollBehavior: "smooth"
          }}
        >
          {productos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => router.push(`/productos/${p.id}`)}
              style={{
                scrollSnapAlign: "center",
                flexShrink: 0,
                width: "clamp(240px, 60vw, 300px)",
                cursor: "pointer"
              }}
            >
              <div style={{ pointerEvents: "none" }}>
                <ProductCard
                  id={p.id}
                  name={p.nombre}
                  price={p.precio}
                  image={p.url_imagen}
                  category={p.tipo}
                  rating={5}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
