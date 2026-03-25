"use client";

import { useMemo } from "react";
import { useCart } from "@lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import Swal from "sweetalert2";

export default function CartView() {
  const {
    items: cartItems,
    actualizarCantidad,
    eliminarDelCarrito,
  } = useCart();
  const { usuario } = useAuth();
  const router = useRouter();

  // Calcular totales
  const calculos = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.producto.precio || 0) * item.cantidad,
      0
    );

    const descuento = 0;
    const subtotalConDescuento = subtotal - descuento;
    const iva = Math.round(subtotalConDescuento * 0.19 * 100) / 100;
    const total = subtotalConDescuento + iva;

    return { subtotal, descuento, iva, total };
  }, [cartItems]);

  const handleCantidadChange = (index: number, newCantidad: number) => {
    actualizarCantidad(cartItems[index].producto.id, newCantidad);
  };

  const handleRemove = (index: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b76e79",
      cancelButtonColor: "#708090",
      confirmButtonText: "Sí, eliminar",
    }).then(result => {
      if (result.isConfirmed) {
        eliminarDelCarrito(cartItems[index].producto.id);
        Swal.fire(
          "¡Eliminado!",
          "El producto ha sido eliminado del carrito.",
          "success"
        );
      }
    });
  };

  const handleCheckout = async () => {
    if (!usuario) {
      toast.error("Debes iniciar sesión para continuar");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: usuario.id_auth,
          clienteId: usuario.id,
          email: usuario.correo,
          nombre: usuario.nombre,
          items: cartItems.map(item => ({
            id_producto: item.producto.id,
            nombre: item.producto.nombre,
            precio: item.producto.precio,
            cantidad: item.cantidad,
            url_imagen: item.producto.url_imagen,
            personalizacion: item.personalizacion ?? null,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "Error al iniciar el pago");
        return;
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Error en checkout:", err);
      toast.error("Error al procesar el pago");
    }
  };

  const isEmpty = cartItems.length === 0;

  return (
    <>
      <style>{`
                @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .cart-fade { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .cart-fade-1 { animation-delay: 0.06s; }
        .cart-fade-2 { animation-delay: 0.14s; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f6f4ef",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(112,128,144,0.18)",
            boxShadow: "0 1px 12px rgba(140,151,104,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "18px clamp(16px,4vw,48px)",
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.62rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8c9768",
                margin: "0 0 4px",
              }}
            >
              Stella Joyería
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 400,
                  color: "#4a5568",
                  margin: 0,
                }}
              >
                Carrito de{" "}
                <em style={{ color: "#b76e79", fontStyle: "italic" }}>
                  Compras
                </em>
              </h1>
              {!isEmpty && (
                <span
                  style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.78rem",
                    color: "#708090",
                    padding: "3px 12px",
                    borderRadius: 20,
                    background: "rgba(112,128,144,0.08)",
                    border: "1px solid rgba(112,128,144,0.18)",
                  }}
                >
                  {cartItems.length} artículo{cartItems.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "clamp(24px,4vw,48px) clamp(16px,4vw,48px)",
          }}
        >
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div
              className="grid grid-cols-1 lg:grid-cols-3"
              style={{ gap: "clamp(16px,2vw,28px)" }}
            >
              {/* Items */}
              <div className="lg:col-span-2 cart-fade">
                <div
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid rgba(112,128,144,0.18)",
                    boxShadow: "0 2px 12px rgba(140,151,104,0.08)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      padding: "20px 28px 16px",
                      borderBottom: "1px solid rgba(112,128,144,0.12)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-sans, Inter, sans-serif)",
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "#8c9768",
                        margin: 0,
                      }}
                    >
                      Tus productos
                    </p>
                  </div>

                  <div style={{ padding: "8px 28px 28px" }}>
                    {cartItems.map((item, index) => (
                      <CartItem
                        key={index}
                        producto={item.producto}
                        cantidad={item.cantidad}
                        personalizacion={item.personalizacion}
                        onCantidadChange={newCantidad =>
                          handleCantidadChange(index, newCantidad)
                        }
                        onRemove={() => handleRemove(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div
                className="lg:col-span-1 cart-fade cart-fade-2"
                style={{ position: "relative", zIndex: 1 }}
              >
                <CartSummary
                  subtotal={calculos.subtotal}
                  descuento={calculos.descuento}
                  iva={calculos.iva}
                  total={calculos.total}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
