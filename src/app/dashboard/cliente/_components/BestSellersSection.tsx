"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, ShoppingCart, Star } from "lucide-react";
import { createClient } from "@utils/supabase/client";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  url_imagen?: string | null;
}

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardV = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function BestSellersSection() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("producto")
        .select("id, nombre, precio, url_imagen")
        .eq("activo", true)
        .order("precio", { ascending: false })
        .limit(4);
      setProductos(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section style={{
      background: "#f6f4ef",
      padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 52px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Sage glow bottom-left */}
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 400, height: 400,
        borderRadius: "50%", background: "rgba(140,151,104,0.07)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <TrendingUp size={16} color="#b76e79" />
            <span style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "0.62rem", fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase", color: "#8c9768",
            }}>
              Más populares · Colección Stella
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{
              fontFamily: "var(--font-marcellus), 'Marcellus', serif",
              fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
              fontWeight: 400, lineHeight: 1.1, color: "#4a5568", margin: 0,
            }}>
              Top{" "}
              <em style={{ color: "#b76e79", fontStyle: "italic" }}>Ventas</em>
            </h2>
            <button
              onClick={() => router.push("/dashboard/cliente/catalogo")}
              style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.75rem", fontWeight: 500,
                color: "#b76e79", background: "none", border: "none",
                cursor: "pointer", letterSpacing: "0.04em",
                textDecoration: "underline",
                textDecorationColor: "rgba(183,110,121,0.35)",
              }}
            >
              Ver catálogo completo →
            </button>
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, rgba(183,110,121,0.25), rgba(140,151,104,0.15), transparent)",
          marginBottom: "clamp(24px, 3.5vw, 36px)",
        }} />

        {/* Product Cards */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 20,
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden" }}>
                <div style={{
                  aspectRatio: "1/1", background: "rgba(112,128,144,0.1)",
                  animation: "pulse 1.6s ease-in-out infinite",
                  borderRadius: "16px 16px 0 0",
                }} />
                <div style={{ padding: 16, background: "white", borderRadius: "0 0 16px 16px" }}>
                  <div style={{ height: 10, background: "rgba(112,128,144,0.1)", borderRadius: 4, marginBottom: 8, width: "70%" }} />
                  <div style={{ height: 18, background: "rgba(112,128,144,0.1)", borderRadius: 4, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "clamp(12px, 2vw, 20px)",
            }}
          >
            {productos.map((p, i) => (
              <motion.div
                key={p.id}
                variants={cardV}
                whileHover={{ y: -8, boxShadow: "0 24px 56px rgba(183,110,121,0.15)" }}
                onClick={() => router.push(`/productos/${p.id}`)}
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(112,128,144,0.1)",
                  boxShadow: "0 2px 12px rgba(140,151,104,0.06)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* Rank badge */}
                {i < 3 && (
                  <div style={{
                    position: "absolute", top: 12, left: 12, zIndex: 10,
                    background: "#b76e79", color: "#f6f4ef",
                    borderRadius: 100, padding: "3px 10px",
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: "0.6rem", fontWeight: 700,
                    letterSpacing: "0.1em",
                    display: "flex", alignItems: "center", gap: 4,
                    boxShadow: "0 2px 8px rgba(183,110,121,0.3)",
                  }}>
                    <Star size={9} fill="white" color="white" />
                    #{i + 1}
                  </div>
                )}

                {/* Image */}
                <div style={{
                  aspectRatio: "1/1", position: "relative",
                  background: "linear-gradient(135deg, #ede8e1 0%, #e2d9ce 100%)",
                  overflow: "hidden",
                }}>
                  {p.url_imagen ? (
                    <Image
                      src={p.url_imagen}
                      alt={p.nombre}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(112,128,144,0.3)",
                    }}>
                      <ShoppingCart size={40} strokeWidth={1} />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(74,85,104,0.5) 0%, transparent 60%)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                    className="card-overlay"
                  />
                </div>

                {/* Info */}
                <div style={{ padding: "16px 18px 20px" }}>
                  <p style={{
                    fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                    fontSize: "0.95rem", fontWeight: 400,
                    color: "#4a5568", margin: "0 0 6px",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {p.nombre}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{
                      fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                      fontSize: "1rem", fontWeight: 700,
                      color: "#b76e79", margin: 0,
                    }}>
                      ${p.precio.toLocaleString("es-MX")}
                    </p>
                    {/* Rating */}
                    <div style={{ display: "flex", gap: 1 }}>
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} size={10} fill="#b76e79" color="#b76e79" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          .card-overlay:hover { opacity: 1 !important; }
        `}</style>
      </div>
    </section>
  );
}
