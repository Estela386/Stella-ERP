"use client";

import { useState, useEffect } from "react";
import { MapPin, CreditCard, Hash, Calendar, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { Order } from "../../type";
import { createClient } from "@utils/supabase/client";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const [dbOrder, setDbOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchOrderDetails = async () => {
      if (!isOpen) return;

      setLoading(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("ventas")
          .select(
            `
            *,
            detalles:detallesventas (
              id, cantidad,
              producto:producto (id, nombre, url_imagen, precio)
            )
          `
          )
          .eq("id", order.id)
          .single();

        if (error) throw error;

        if (mounted && data) {
          setDbOrder(data);
        }
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => {
      mounted = false;
    };
  }, [isOpen, order.id]);

  // Si está cargando o no hay datos, usamos los valores por defecto del prop
  const currentTotal = dbOrder ? Number(dbOrder.total) : order.total;
  const currentFecha = dbOrder
    ? new Date(dbOrder.fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : order.fecha;
  const currentItems = dbOrder
    ? dbOrder.detalles.map((d: any) => ({
        id_producto: d.producto?.id,
        nombre_producto: d.producto?.nombre,
        cantidad: d.cantidad,
        precio_unitario: d.producto?.precio || 0,
        imagen_url: d.producto?.url_imagen,
      }))
    : order.items;

  const subtotal = currentTotal / 1.16;
  const iva = currentTotal - subtotal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Pedido">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Loader2 size={32} className="animate-spin text-[#b76e79]" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                background: "#f6f4ef",
                borderRadius: "8px",
              }}
            >
              <Hash size={18} color="#b76e79" />
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#708090" }}>
                  Número de Pedido
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#4a5568",
                  }}
                >
                  #{order.id}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                background: "#f6f4ef",
                borderRadius: "8px",
              }}
            >
              <Calendar size={18} color="#b76e79" />
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#708090" }}>
                  Fecha
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#4a5568",
                  }}
                >
                  {currentFecha}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.9rem",
                  color: "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MapPin size={16} /> Envío
              </h4>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#708090",
                  lineHeight: "1.5",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600, color: "#4a5568" }}>
                  Stella Cliente
                </p>
                <p style={{ margin: 0 }}>{order.direccion_envio}</p>
                <p style={{ margin: 0 }}>México</p>
              </div>
            </div>
            <div>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.9rem",
                  color: "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CreditCard size={16} /> Método de Pago
              </h4>
              <div style={{ fontSize: "0.85rem", color: "#708090" }}>
                <p style={{ margin: 0 }}>{order.metodo_pago}</p>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    background: "rgba(140, 151, 104, 0.12)",
                    color: "#8c9768",
                    borderRadius: "4px",
                    marginTop: "4px",
                    display: "inline-block",
                  }}
                >
                  Confirmado
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4
              style={{
                margin: "0 0 16px 0",
                fontSize: "0.9rem",
                color: "#4a5568",
                borderBottom: "1px solid rgba(112, 128, 144, 0.1)",
                paddingBottom: "8px",
              }}
            >
              Resumen de Artículos ({currentItems.length})
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {currentItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      background: "#f6f4ef",
                      border: "1px solid rgba(112, 128, 144, 0.1)",
                      overflow: "hidden",
                      flexShrink: 0,
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
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#4a5568",
                      }}
                    >
                      {item.nombre_producto}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        color: "#708090",
                      }}
                    >
                      Cant: {item.cantidad}
                    </p>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    ${(item.precio_unitario * item.cantidad).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div
            style={{
              background: "#f6f4ef",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              border: "1px solid rgba(112, 128, 144, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#708090",
              }}
            >
              <span>Subtotal</span>
              <span>
                $
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#708090",
              }}
            >
              <span>IVA (16%)</span>
              <span>
                ${iva.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#708090",
              }}
            >
              <span>Envío</span>
              <span style={{ color: "#8c9768", fontWeight: 600 }}>Gratis</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#b76e79",
                marginTop: "6px",
                borderTop: "1px solid rgba(112, 128, 144, 0.1)",
                paddingTop: "10px",
              }}
            >
              <span>Total del pedido</span>
              <span>
                $
                {currentTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
