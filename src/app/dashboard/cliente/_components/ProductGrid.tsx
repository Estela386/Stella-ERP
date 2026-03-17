"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { ProductoCard } from "../types";
import Link from "next/link";

export default function ProductGrid() {
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const productoService = new ProductoService(supabase);

        const { productos: productosData, error: errorProductos } =
          await productoService.obtenerTodos();

        if (errorProductos || !productosData) {
          setError(errorProductos || "No se pudieron cargar los productos");
          return;
        }

        const productosFormatted: ProductoCard[] = productosData.map(p => ({
          id: p.id,
          name: p.nombre || "Producto",
          price: p.precio || 0,
          image: p.url_imagen || undefined,
          category: p.nombre?.split(" ")[0] || undefined,
          rating: 5,
        }));

        setProductos(productosFormatted);
        setError(null);
      } catch (err) {
        setError("Error al cargar productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (loading) {
    return (
      <section
        style={{
          background: "#f6f4ef",
          padding: "clamp(44px, 5.5vw, 68px) clamp(20px, 5vw, 52px)",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          .skeleton { animation: pulse 1.6s ease-in-out infinite; }
        `}</style>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          {/* Skeleton header */}
          <div style={{ marginBottom: 36 }}>
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 6, background: "rgba(140,151,104,0.2)", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 36, width: 260, borderRadius: 8, background: "rgba(112,128,144,0.12)" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "clamp(9px, 1.5vw, 16px)" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div
                  className="skeleton"
                  style={{
                    aspectRatio: "1/1", borderRadius: 14,
                    background: "rgba(112,128,144,0.1)", marginBottom: 12,
                  }}
                />
                <div className="skeleton" style={{ height: 10, width: "60%", borderRadius: 4, background: "rgba(112,128,144,0.08)", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "80%", borderRadius: 4, background: "rgba(112,128,144,0.1)", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 18, width: "40%", borderRadius: 4, background: "rgba(112,128,144,0.08)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          background: "#f6f4ef",
          padding: "clamp(44px, 5.5vw, 68px) clamp(20px, 5vw, 52px)",
        }}
      >
        <div
          className="mx-auto text-center"
          style={{
            maxWidth: 400,
            padding: "32px 24px",
            borderRadius: 14,
            background: "white",
            border: "1px solid rgba(183,110,121,0.18)",
            boxShadow: "0 4px 14px rgba(140,151,104,0.08)",
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(183,110,121,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#708090" }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .grid-fade { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <section
        style={{
          background: "#f6f4ef",
          padding: "clamp(44px, 5.5vw, 68px) clamp(20px, 5vw, 52px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          {/* Section header */}
          <div style={{ marginBottom: 36 }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8c9768",
                marginBottom: 10,
              }}
            >
              Shop Newest Collection
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.1rem, 4vw, 3.2rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  color: "#4a5568",
                  margin: 0,
                }}
              >
                Colección{" "}
                <em style={{ color: "#b76e79", fontStyle: "italic" }}>Destacada</em>
              </h2>
              <Link
                href="/dashboard/cliente/catalogo"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.04em",
                  color: "#b76e79",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(183,110,121,0.35)",
                  paddingBottom: 2,
                  transition: "border-color 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                See all →
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(183,110,121,0.3), rgba(140,151,104,0.2), transparent)",
              marginBottom: 32,
            }}
          />

          {/* Grid */}
          {productos.length > 0 ? (
            <>
              <div
                className="grid grid-cols-2 md:grid-cols-4"
                style={{ gap: "clamp(9px, 1.5vw, 16px)" }}
              >
                {productos.map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/productos/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="grid-fade"
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <ProductCard {...product} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* View all button */}
              <div style={{ textAlign: "center", marginTop: 48 }}>
                <Link href="/dashboard/cliente/catalogo">
                  <button
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      letterSpacing: "0.04em",
                      fontWeight: 400,
                      padding: "12px 32px",
                      borderRadius: 6,
                      border: "1.5px solid rgba(112,128,144,0.3)",
                      background: "transparent",
                      color: "#708090",
                      cursor: "pointer",
                      transition: "all 0.22s ease",
                    }}
                    onMouseEnter={e => {
                      const b = e.currentTarget;
                      b.style.borderColor = "#708090";
                      b.style.color = "#4a5568";
                      b.style.background = "rgba(112,128,144,0.06)";
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget;
                      b.style.borderColor = "rgba(112,128,144,0.3)";
                      b.style.color = "#708090";
                      b.style.background = "transparent";
                    }}
                  >
                    Ver Todo el Catálogo
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                color: "rgba(112,128,144,0.6)",
              }}
            >
              No hay productos disponibles
            </div>
          )}
        </div>
      </section>
    </>
  );
}