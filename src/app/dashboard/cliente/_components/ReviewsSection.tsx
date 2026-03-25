"use client";

import ReviewCard from "./ReviewCard";

const RECENT_REVIEWS = [
  {
    id: 1,
    author: "Rosario",
    rating: 5,
    title: "Amor los productos",
    comment:
      "Excelente calidad de los productos y una atención excepcional. Muy recomendado.",
    avatar: "R",
  },
  {
    id: 2,
    author: "Ariana",
    rating: 5,
    title: "Excelentes aretes",
    comment:
      "Los aretes son hermosos, el envío fue rápido y la calidad excepcional. Volveré a comprar.",
    avatar: "A",
  },
  {
    id: 3,
    author: "Adriana",
    rating: 5,
    title: "Me gustó la variedad",
    comment:
      "Amplia variedad de productos y buenos precios. Definitivamente voy a volver a comprar aquí.",
    avatar: "A",
  },
  {
    id: 4,
    author: "Mariana",
    rating: 5,
    title: "Me gustó la variedad",
    comment:
      "Amplia variedad de productos y buenos precios. Definitivamente voy a volver a comprar aquí.",
    avatar: "M",
  },
];

export default function ReviewsSection() {
  return (
    <>
      <style>{`
                @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .rev-card-anim { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .review-card-inner:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 56px rgba(140,151,104,0.22), 0 4px 14px rgba(140,151,104,0.08) !important;
        }
        .see-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(183,110,121,0.32) !important;
        }
      `}</style>

      <section
        style={{
          background: "#ede9e3",
          padding: "clamp(44px, 5.5vw, 68px) clamp(20px, 5vw, 52px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200 }}>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8c9768",
                  marginBottom: 8,
                }}
              >
                Opiniones
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(2.1rem, 4vw, 3.2rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  color: "#4a5568",
                  margin: 0,
                }}
              >
                Últimas{" "}
                <em style={{ color: "#b76e79", fontStyle: "italic" }}>reseñas</em>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.94rem",
                  color: "#708090",
                  marginTop: 8,
                  maxWidth: 400,
                }}
              >
                Opiniones recientes de nuestros clientes
              </p>
            </div>

            {/* Stars summary badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 12,
                background: "white",
                border: "1px solid rgba(112,128,144,0.18)",
                boxShadow: "0 2px 12px rgba(140,151,104,0.08)",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                    fontSize: "2rem",
                    fontWeight: 500,
                    color: "#4a5568",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  5.0
                </p>
                <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#b76e79", fontSize: "0.75rem" }}>★</span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: 1, height: 36,
                  background: "rgba(112,128,144,0.18)",
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.72rem",
                    color: "rgba(112,128,144,0.7)",
                    margin: 0,
                  }}
                >
                  Calificación
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: "#4a5568",
                    margin: 0,
                  }}
                >
                  {RECENT_REVIEWS.length} reseñas
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(183,110,121,0.25), rgba(140,151,104,0.18), transparent)",
              marginBottom: 32,
            }}
          />

          {/* Cards grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            style={{ gap: "clamp(9px, 1.5vw, 16px)" }}
          >
            {RECENT_REVIEWS.map((review, i) => (
              <div
                key={review.id}
                className="rev-card-anim"
                style={{ animationDelay: `${i * 0.09}s` }}
              >
                <div
                  className="review-card-inner"
                  style={{
                    background: "white",
                    borderRadius: 14,
                    padding: "clamp(18px, 2.2vw, 26px)",
                    border: "1px solid rgba(112,128,144,0.18)",
                    boxShadow: "0 2px 12px rgba(140,151,104,0.08)",
                    transition: "all 0.22s cubic-bezier(.22,1,.36,1)",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  {/* Sheen */}
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                    }}
                  />

                  {/* Stars */}
                  <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: "#b76e79", fontSize: "0.85rem" }}>★</span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                      fontSize: "1.18rem",
                      fontWeight: 600,
                      color: "#4a5568",
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    {review.title}
                  </h3>

                  {/* Comment */}
                  <p
                    style={{
                      fontFamily: "var(--font-sans, Inter, sans-serif)",
                      fontSize: "0.84rem",
                      color: "#708090",
                      lineHeight: 1.65,
                      marginBottom: 20,
                      flexGrow: 1,
                    }}
                  >
                    {review.comment}
                  </p>

                  {/* Author */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      paddingTop: 14,
                      borderTop: "1px solid rgba(112,128,144,0.12)",
                    }}
                  >
                    <div
                      style={{
                        width: 36, height: 36,
                        borderRadius: "50%",
                        background: "rgba(183,110,121,0.1)",
                        border: "1px solid rgba(183,110,121,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#b76e79",
                        }}
                      >
                        {review.avatar}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-sans, Inter, sans-serif)",
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        color: "#4a5568",
                      }}
                    >
                      {review.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              className="see-all-btn"
              style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                fontWeight: 400,
                padding: "12px 32px",
                borderRadius: 6,
                border: "none",
                background: "#b76e79",
                color: "#f6f4ef",
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(183,110,121,0.22)",
                transition: "all 0.22s cubic-bezier(.22,1,.36,1)",
              }}
            >
              Ver todas las reseñas
            </button>
          </div>

        </div>
      </section>
    </>
  );
}