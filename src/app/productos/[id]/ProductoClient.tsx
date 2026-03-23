"use client";
import { useState, useEffect } from "react";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoService, ReviewService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import { useCart } from "@lib/hooks/useCart";
import Image from "next/image";
import { toast } from "sonner";

interface ProductoClientProps {
  id: string;
}

export default function ProductoClient({ id }: ProductoClientProps) {
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCart();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agregandoCarrito, setAgregandoCarrito] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [enviandoReview, setEnviandoReview] = useState(false);
  const [yaComento, setYaComento] = useState(false);
  const [opciones, setOpciones] = useState<any[]>([]);
  const [configuracion, setConfiguracion] = useState<Record<number, any>>({});
  const [loadingOpciones, setLoadingOpciones] = useState(true);
  const [erroresPersonalizacion, setErroresPersonalizacion] = useState<
    Record<number, string>
  >({});
  const validarPersonalizacion = (): boolean => {
    if (!producto.es_personalizable || opciones.length === 0) return true;

    const nuevosErrores: Record<number, string> = {};

    opciones.forEach(op => {
      if (op.obligatorio) {
        const valor = configuracion[op.id];
        if (!valor || String(valor).trim() === "") {
          nuevosErrores[op.id] = "Este campo es obligatorio";
        }
      }
    });

    setErroresPersonalizacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);

        const supabase = createClient();
        const productoService = new ProductoService(supabase);

        const { producto: productoData, error: errorProducto } =
          await productoService.obtenerPorId(parseInt(id));

        if (errorProducto || !productoData) {
          setError("Producto no encontrado");
          return;
        }

        setProducto(productoData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    console.log("id:", id);
    if (!isNaN(Number(id))) {
      cargarProducto();
    } else {
      setError("ID inválido");
      setLoading(false);
    }
    const cargarReviews = async () => {
      try {
        const supabase = createClient();
        const reviewService = new ReviewService(supabase);

        const { reviews, error } = await reviewService.obtenerPorProducto(id);

        if (!error && reviews) {
          setReviews(reviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) cargarReviews();

    const verificarYaComento = async () => {
      console.log("Verificando si el usuario ya comentó:", { id, usuario });
      if (usuario?.id_auth) {
        const reviewService = new ReviewService(createClient());
        const { yaComento, error } = await reviewService.yaComento(
          id,
          usuario.id_auth
        );
        console.log("Resultado de yaComento:", { yaComento, error });
        if (!error) {
          setYaComento(yaComento);
        }
      }
    };

    verificarYaComento();
    const cargarOpciones = async () => {
      try {
        setLoadingOpciones(true);

        const res = await fetch(`/api/productos/${id}/opciones`);
        const data = await res.json();

        if (!res.ok || !data.opciones) return;

        setOpciones(data.opciones);
      } catch (err) {
        console.error("Error cargando opciones:", err);
      } finally {
        setLoadingOpciones(false);
      }
    };

    if (id) cargarOpciones();
  }, [id, usuario]);
  const handleSubmitReview = async () => {
    if (!usuario) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      setEnviandoReview(true);

      const supabase = createClient();
      const reviewService = new ReviewService(supabase);

      if (usuario.uid === undefined) {
        toast.error("Inicie sesión para enviar una reseña");
        return;
      }
      const { review, error } = await reviewService.crear({
        product_id: id,
        user_id: usuario.uid,
        rating,
        comment,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Reseña publicada 💎");

      setComment("");
      setRating(5);

      // recargar reviews
      const { reviews: updated } = await reviewService.obtenerPorProducto(id);

      if (updated) setReviews(updated);
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar reseña");
    } finally {
      setEnviandoReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderClient user={usuario} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c5c4a]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderClient user={usuario} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600">{error || "Producto no encontrado"}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f4ef",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <HeaderClient user={usuario} />

      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "40px 20px",
          animation: "fadeIn 0.8s ease-out",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: 60,
            alignItems: "start",
          }}
        >
          {/* Columna Izquierda: Imagen */}
          <div style={{ position: "sticky", top: 100 }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                background: "#ffffff",
                borderRadius: 32,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(112,128,144,0.08)",
                border: "1px solid rgba(112,128,144,0.05)",
              }}
            >
              {producto.url_imagen ? (
                <Image
                  src={producto.url_imagen}
                  alt={producto.nombre || "Imagen del producto"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #f6f4ef 0%, #ede9e3 100%)",
                    color: "#b76e79",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.2rem",
                        fontStyle: "italic",
                      }}
                    >
                      Stella Joyería
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        opacity: 0.6,
                      }}
                    >
                      Imagen en proceso
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Badges de Calidad */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
                gap: 20,
                opacity: 0.8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.75rem",
                  color: "#708090",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#b76e79" }}>◆</span> Arte Texturizado
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.75rem",
                  color: "#708090",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#b76e79" }}>◆</span> Calidad Premium
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.75rem",
                  color: "#708090",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#b76e79" }}>◆</span> Envío Seguro
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <header>
              {producto.categoria && (
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#b76e79",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {producto.categoria.nombre}
                </span>
              )}
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  fontWeight: 500,
                  color: "#4a5568",
                  lineHeight: 1.1,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {producto.nombre}
              </h1>

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.2rem",
                    fontWeight: 600,
                    color: "#b76e79",
                  }}
                >
                  ${producto.precio.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#708090",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  MXN
                </span>
              </div>
            </header>

            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(112,128,144,0.15) 0%, rgba(112,128,144,0) 100%)",
              }}
            />

            <section>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#4a5568",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Descripción
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  color: "#708090",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {producto.descripcion ||
                  "Esta pieza artesanal ha sido diseñada con la elegancia y sutileza que caracteriza a Stella Joyería, utilizando materiales de la más alta calidad para resaltar tu brillo natural."}
              </p>
            </section>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: producto.stock_actual > 0 ? "#8c9768" : "#b76e79",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: producto.stock_actual > 0 ? "#8c9768" : "#b76e79",
                }}
              >
                {producto.stock_actual > 0
                  ? `${producto.stock_actual} Disponibles`
                  : "Agotado temporalmente"}
              </span>
            </div>
            {producto.es_personalizable && (
              <section
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#4a5568",
                    textTransform: "uppercase",
                  }}
                >
                  Personaliza tu pieza
                </h3>
                {loadingOpciones ? (
                  <p style={{ color: "#708090", fontSize: "0.9rem" }}>
                    Cargando opciones...
                  </p>
                ) : opciones.length === 0 ? (
                  <p
                    style={{
                      color: "#708090",
                      fontSize: "0.9rem",
                      opacity: 0.7,
                    }}
                  >
                    No hay opciones disponibles.
                  </p>
                ) : (
                  opciones.map(op => (
                    <div key={op.id}>
                      <label
                        style={{
                          fontSize: "0.8rem",
                          color: erroresPersonalizacion[op.id]
                            ? "#b76e79"
                            : "#708090",
                          fontWeight: erroresPersonalizacion[op.id] ? 600 : 400,
                        }}
                      >
                        {op.nombre}
                        {op.obligatorio && (
                          <span style={{ color: "#b76e79", marginLeft: 4 }}>
                            *
                          </span>
                        )}
                      </label>

                      {op.tipo === "select" && (
                        <select
                          onChange={e => {
                            setConfiguracion(prev => ({
                              ...prev,
                              [op.id]: e.target.value,
                            }));
                            // Limpiar error al seleccionar
                            if (erroresPersonalizacion[op.id]) {
                              setErroresPersonalizacion(prev => {
                                const next = { ...prev };
                                delete next[op.id];
                                return next;
                              });
                            }
                          }}
                          style={{
                            width: "100%",
                            marginTop: 4,
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: `1px solid ${erroresPersonalizacion[op.id] ? "#b76e79" : "rgba(112,128,144,0.3)"}`,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.9rem",
                            color: "#4a5568",
                            background: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Selecciona...</option>
                          {op.valores?.map((v: any) => (
                            <option key={v.id} value={v.valor}>
                              {v.valor}
                            </option>
                          ))}
                        </select>
                      )}

                      {op.tipo === "text" && (
                        <input
                          type="text"
                          placeholder="Escribe aquí..."
                          onChange={e => {
                            setConfiguracion(prev => ({
                              ...prev,
                              [op.id]: e.target.value,
                            }));
                            if (erroresPersonalizacion[op.id]) {
                              setErroresPersonalizacion(prev => {
                                const next = { ...prev };
                                delete next[op.id];
                                return next;
                              });
                            }
                          }}
                          style={{
                            width: "100%",
                            marginTop: 4,
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: `1px solid ${erroresPersonalizacion[op.id] ? "#b76e79" : "rgba(112,128,144,0.3)"}`,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.9rem",
                            color: "#4a5568",
                            background: "#ffffff",
                          }}
                        />
                      )}

                      {op.tipo === "number" && (
                        <input
                          type="number"
                          onChange={e => {
                            setConfiguracion(prev => ({
                              ...prev,
                              [op.id]: e.target.value,
                            }));
                            if (erroresPersonalizacion[op.id]) {
                              setErroresPersonalizacion(prev => {
                                const next = { ...prev };
                                delete next[op.id];
                                return next;
                              });
                            }
                          }}
                          style={{
                            width: "100%",
                            marginTop: 4,
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: `1px solid ${erroresPersonalizacion[op.id] ? "#b76e79" : "rgba(112,128,144,0.3)"}`,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.9rem",
                            color: "#4a5568",
                            background: "#ffffff",
                          }}
                        />
                      )}

                      {/* Error message */}
                      {erroresPersonalizacion[op.id] && (
                        <p
                          style={{
                            marginTop: 4,
                            fontSize: "0.75rem",
                            color: "#b76e79",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {erroresPersonalizacion[op.id]}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </section>
            )}

            <button
              disabled={producto.stock_actual === 0 || agregandoCarrito}
              onClick={() => {
                if (!validarPersonalizacion()) {
                  toast.error(
                    "Completa las opciones obligatorias antes de continuar"
                  );
                  return;
                }

                setAgregandoCarrito(true);
                agregarAlCarrito(
                  producto,
                  1,
                  producto.es_personalizable ? configuracion : undefined // ← separado
                );
                setTimeout(() => {
                  setAgregandoCarrito(false);
                  toast.success("Agregado al carrito");
                }, 800);
              }}
              style={{
                width: "100%",
                padding: "20px",
                background: "#b76e79",
                color: "#ffffff",
                border: "none",
                borderRadius: 16,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 10px 20px rgba(183,110,121,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
              onMouseOver={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 25px rgba(183,110,121,0.3)";
                  e.currentTarget.style.background = "#a65d68";
                }
              }}
              onMouseOut={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(183,110,121,0.2)";
                  e.currentTarget.style.background = "#b76e79";
                }
              }}
            >
              {agregandoCarrito
                ? "Asegurando pieza..."
                : producto.stock_actual > 0
                  ? "Añadir al carrito"
                  : "Sin existencias"}
            </button>

            {/* Cuidados de la Pieza */}
            <section
              style={{
                marginTop: 16,
                padding: "24px",
                background: "#ffffff",
                borderRadius: 24,
                border: "1px solid rgba(140,151,104,0.15)",
                boxShadow: "0 8px 16px rgba(140,151,104,0.04)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#4a5568",
                  fontStyle: "italic",
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ color: "#8c9768" }}>✦</span> Cuidados Especiales
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px 20px",
                }}
              >
                {[
                  { icon: "✧", text: "Evita perfumes" },
                  { icon: "✧", text: "Limpia con paño suave" },
                  { icon: "✧", text: "Guarda por separado" },
                  { icon: "✧", text: "Evita químicos" },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "#708090",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#b76e79" }}>{item.icon}</span>{" "}
                    {item.text}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: 16,
                  fontSize: "0.75rem",
                  color: "#8c9768",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5,
                  opacity: 0.8,
                }}
              >
                * Para piezas de chapa, retirar antes de nadar o ducharte. El
                acero inoxidable es resistente al agua.
              </p>
            </section>
            {/* REVIEWS */}
            <section
              style={{
                borderTop: "1px solid rgba(112,128,144,0.15)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  color: "#4a5568",
                  marginBottom: 24,
                  fontStyle: "italic",
                }}
              >
                Opiniones
              </h2>

              {/* LISTA */}
              {loadingReviews ? (
                <p style={{ color: "#708090" }}>Cargando opiniones...</p>
              ) : reviews.length === 0 ? (
                <p style={{ color: "#708090", opacity: 0.7 }}>
                  Aún no hay opiniones. Sé el primero 💎
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {reviews.map(r => (
                    <div
                      key={r.id}
                      style={{
                        background: "#ffffff",
                        padding: 20,
                        borderRadius: 16,
                        border: "1px solid rgba(112,128,144,0.15)",
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        {r.user_name ? (
                          <span
                            style={{ fontWeight: "bold", color: "#4a5568" }}
                          >
                            {r.user_name}
                          </span>
                        ) : (
                          <span
                            style={{ fontWeight: "bold", color: "#4a5568" }}
                          >
                            Anónimo
                          </span>
                        )}

                        <span style={{ fontSize: 12, color: "#708090" }}>
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star}>
                              {star <= r.rating ? "⭐" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p
                        style={{
                          marginTop: 8,
                          color: "#708090",
                          fontSize: "0.95rem",
                        }}
                      >
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* FORM SOLO SI LOGUEADO */}
              {usuario && !yaComento && (
                <div
                  style={{
                    marginTop: 32,
                    padding: 24,
                    background: "#ffffff",
                    borderRadius: 20,
                    border: "1px solid rgba(183,110,121,0.2)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      color: "#4a5568",
                    }}
                  >
                    Deja tu opinión
                  </h3>

                  {/* estrellas */}
                  <div style={{ marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          fontSize: 22,
                          marginRight: 4,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {star <= rating ? "⭐" : "☆"}
                      </button>
                    ))}
                  </div>

                  {/* textarea */}
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Comparte tu experiencia..."
                    style={{
                      width: "100%",
                      minHeight: 100,
                      borderRadius: 12,
                      padding: 12,
                      border: "1px solid rgba(112,128,144,0.2)",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: 12,
                      color: "#708090",
                    }}
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={enviandoReview}
                    style={{
                      background: "#b76e79",
                      color: "#fff",
                      padding: "12px 20px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      opacity: enviandoReview ? 0.6 : 1,
                    }}
                  >
                    {enviandoReview ? "Publicando..." : "Publicar reseña"}
                  </button>
                </div>
              )}

              {!usuario && (
                <p
                  style={{
                    marginTop: 20,
                    fontSize: "0.9rem",
                    color: "#708090",
                  }}
                >
                  Inicia sesión para dejar una opinión
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
