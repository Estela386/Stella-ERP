"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  Package,
} from "lucide-react";
import Modal from "./Modal";
import { Order, OrderItem } from "../../type";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import { ReviewService } from "@/lib/services/ReviewService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function ReviewModal({
  isOpen,
  onClose,
  order,
}: ReviewModalProps) {
  const { usuario } = useAuth();
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardaremos los IDs de los productos que ya fueron reseñados
  const [reviewedProductIds, setReviewedProductIds] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchUserReviews = async () => {
      if (!isOpen || !usuario?.id) return;

      setLoadingData(true);
      const supabase = createClient();

      try {
        // Consultamos la BD para ver qué productos ya reseñó este usuario
        const { data, error } = await supabase
          .from("product_reviews")
          .select("product_id")
          .eq("user_id", usuario.id); // Ajusta la columna si usas id_auth

        if (error) throw error;

        if (mounted && data) {
          const ids = data.map(review => review.product_id);
          setReviewedProductIds(ids);
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    fetchUserReviews();

    return () => {
      mounted = false;
      if (!isOpen) {
        setSelectedItem(null);
        setSuccess(false);
      }
    };
  }, [isOpen, usuario]);

  const handleSubmit = async () => {
    if (!selectedItem || !usuario) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const reviewService = new ReviewService(supabase);

      const { error: revError } = await reviewService.crear({
        product_id: selectedItem.id_producto.toString(),
        user_id: usuario.id.toString(),
        rating,
        comment: comment.trim() || null,
      });

      if (revError) throw new Error(revError);

      setSuccess(true);

      // Agregamos el producto recién reseñado a la lista para bloquearlo visualmente
      setReviewedProductIds(prev => [...prev, selectedItem.id_producto]);

      setTimeout(() => {
        setSuccess(false);
        setSelectedItem(null);
        setComment("");
        setRating(5);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar la reseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dejar Reseña">
      {loadingData ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Loader2 size={32} className="animate-spin text-[#b76e79]" />
        </div>
      ) : !selectedItem ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#708090" }}>
            Selecciona el artículo que deseas calificar:
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {order.items.map((item, idx) => {
              const alreadyReviewed = reviewedProductIds.includes(
                item.id_producto
              );

              return (
                <button
                  key={idx}
                  onClick={() => !alreadyReviewed && setSelectedItem(item)}
                  disabled={alreadyReviewed}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    background: "#ffffff",
                    border: "1px solid rgba(112, 128, 144, 0.15)",
                    borderRadius: "12px",
                    cursor: alreadyReviewed ? "not-allowed" : "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    opacity: alreadyReviewed ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      background: "#f6f4ef",
                      overflow: "hidden",
                      flexShrink: 0,
                      filter: alreadyReviewed ? "grayscale(100%)" : "none",
                    }}
                  >
                    <img
                      src={item.imagen_url || "/LogoM.svg"}
                      alt={item.nombre_producto}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#4a5568",
                      }}
                    >
                      {item.nombre_producto}
                    </p>
                    {alreadyReviewed && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#8c9768",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "4px",
                        }}
                      >
                        <Check size={12} /> Ya evaluado
                      </span>
                    )}
                  </div>
                  {!alreadyReviewed && (
                    <ChevronRight size={18} color="#708090" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : success ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(140, 151, 104, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8c9768",
              margin: "0 auto 16px",
            }}
          >
            <Check size={32} />
          </div>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "1.25rem",
              color: "#4a5568",
            }}
          >
            ¡Gracias por tu opinión!
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#708090" }}>
            Tu reseña ha sido guardada con éxito.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Formulario de Reseña Original */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(112, 128, 144, 0.08)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                background: "#f6f4ef",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={selectedItem.imagen_url || "/LogoM.svg"}
                alt={selectedItem.nombre_producto}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#4a5568",
                }}
              >
                {selectedItem.nombre_producto}
              </p>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#b76e79",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Cambiar artículo
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#4a5568",
                marginBottom: "12px",
              }}
            >
              ¿Qué te pareció este producto?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "8px" }}
            >
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <Star
                    size={32}
                    fill={s <= rating ? "#b76e79" : "transparent"}
                    color={s <= rating ? "#b76e79" : "rgba(112, 128, 144, 0.3)"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "#708090" }}
            >
              Agrega un comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Escribe aquí tu experiencia con el producto..."
              style={{
                width: "100%",
                height: "120px",
                padding: "16px",
                borderRadius: "12px",
                border: "1.5px solid rgba(112, 128, 144, 0.25)",
                outline: "none",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.9rem",
                color: "#4a5568",
                resize: "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#e53e3e",
                fontSize: "0.85rem",
              }}
            >
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#b76e79",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 10px 26px rgba(183, 110, 121, 0.32)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Publicar reseña"
            )}
          </button>
        </div>
      )}
    </Modal>
  );
}
