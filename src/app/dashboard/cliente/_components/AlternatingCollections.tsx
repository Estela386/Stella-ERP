"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { createClient } from "@utils/supabase/client";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  url_imagen?: string | null;
  tipo?: string;
}

export default function AlternatingCollections() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("producto")
        .select("id, nombre, precio, url_imagen, tipo")
        .limit(10);
      setProductos(data ?? []);
    };
    load();
  }, []);

  // Dividimos productos para las 2 colecciones
  const col1 = productos.filter(p => (p.tipo || "").toLowerCase().includes("anillo")).slice(0, 2);
  const col2 = productos.filter(p => !(p.tipo || "").toLowerCase().includes("anillo")).slice(0, 2);

  // Fallback a los primeros 4 si no hay filtros exactos
  const finalCol1 = col1.length === 2 ? col1 : productos.slice(0, 2);
  const finalCol2 = col2.length === 2 ? col2 : productos.slice(2, 4);

  const colecciones = [
    { 
      title: "Anillos de Compromiso", 
      desc: "Diseños eternos para momentos que cambian la vida. Oro de 14k y diamantes certificados.",
      route: "/dashboard/cliente/catalogo?categoria=Anillos",
      bg: "linear-gradient(135deg, #ede8e1, #d4c8b7)",
      productos: finalCol1
    },
    { 
      title: "Sets Exclusivos", 
      desc: "Combina perfectamente tu estilo con nuestros conjuntos coordinados de collar y aretes.",
      route: "/dashboard/cliente/catalogo?categoria=Sets",
      bg: "linear-gradient(135deg, #f0ede6, #e2d9ce)",
      productos: finalCol2
    }
  ];

  if(productos.length === 0) return null;

  return (
    <section style={{
      background: "white",
      padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 52px)"
    }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <p style={{
          fontFamily: "var(--font-poppins)", fontSize: "0.65rem",
          fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#8c9768", marginBottom: 12
        }}>Obras Maestras</p>
        <h2 style={{
          fontFamily: "var(--font-marcellus)", fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "#4a5568", margin: 0
        }}>
          Nuestras <em style={{ color: "#b76e79", fontStyle: "italic" }}>Colecciones</em>
        </h2>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(60px, 8vw, 100px)" }}>
        {colecciones.map((c, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              style={{
                display: "grid", 
                gridTemplateColumns: isEven ? "1fr 1.2fr" : "1.2fr 1fr",
                alignItems: "center",
                gap: "clamp(30px, 5vw, 60px)",
              }}
              className={`collection-grid ${isEven ? "" : "reverse-mobile"}`}
            >
              {/* Imagen Editorial */}
              <div style={{
                width: "100%", aspectRatio: "4/5", borderRadius: 24,
                background: c.bg, position: "relative", overflow: "hidden",
                order: isEven ? 1 : 2,
                boxShadow: "0 20px 50px rgba(0,0,0,0.06)"
              }}>
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(107,76,50,0.05)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center"
                }}>
                  <h3 style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.8rem", color: "#6b4c32", marginBottom: 16 }}>
                    {c.title}
                  </h3>
                  <button
                    onClick={() => router.push(c.route)}
                    style={{
                      background: "white", color: "#6b4c32", border: "none",
                      padding: "12px 28px", borderRadius: 100,
                      fontFamily: "var(--font-poppins)", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
                    }}
                  >
                    Explorar Colección
                  </button>
                </div>
              </div>
              
              {/* Productos de la colección */}
              <div style={{
                order: isEven ? 2 : 1,
                display: "flex", flexDirection: "column", gap: 32
              }}>
                <p style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.95rem",
                  color: "#708090", lineHeight: 1.7, maxWidth: 500,
                  margin: "0 0 10px"
                }}>
                  {c.desc}
                </p>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20
                }}>
                  {c.productos.map((p, idx) => (
                    <motion.div key={p.id} whileHover={{ y: -5 }}>
                      <ProductCard
                        id={p.id}
                        name={p.nombre}
                        price={p.precio}
                        image={p.url_imagen}
                        category={p.tipo}
                        rating={5}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <style>{`
        @media (max-width: 800px) {
          .collection-grid { grid-template-columns: 1fr !important; }
          .reverse-mobile > div:nth-child(1) { order: 1 !important; }
          .reverse-mobile > div:nth-child(2) { order: 2 !important; }
        }
      `}</style>
    </section>
  );
}
