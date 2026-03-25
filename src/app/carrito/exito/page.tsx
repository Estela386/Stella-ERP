"use client";

import { useEffect } from "react";
import { useCart } from "@lib/hooks/useCart";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ExitoPage() {
  const { limpiarCarrito } = useCart();
  const router = useRouter();

  useEffect(() => {
    limpiarCarrito();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f4ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: "48px 40px",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(112,128,144,0.15)",
          boxShadow: "0 20px 40px rgba(140,151,104,0.08)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>💎</div>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: "2rem",
            fontWeight: 500,
            color: "#4a5568",
            marginBottom: 12,
          }}
        >
          ¡Pedido confirmado!
        </h1>
        <p style={{ color: "#708090", marginBottom: 32, lineHeight: 1.6 }}>
          Tu pago fue procesado exitosamente. Recibirás una confirmación en
          breve y nos pondremos en contacto contigo.
        </p>
        <Link
          href="/catalogo"
          style={{
            display: "inline-block",
            background: "#b76e79",
            color: "white",
            padding: "14px 32px",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
