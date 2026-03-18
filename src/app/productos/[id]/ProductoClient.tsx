"use client";

import { useState, useEffect } from "react";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoService } from "@lib/services";
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
  console.log("usuario:", usuario);
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agregandoCarrito, setAgregandoCarrito] = useState(false);

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
  }, [id]);

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
    <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <HeaderClient user={usuario} />

      <main style={{
        flex: 1,
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
        padding: "40px 20px",
        animation: "fadeIn 0.8s ease-out"
      }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: 60,
          alignItems: "start" 
        }}>
          {/* Columna Izquierda: Imagen */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              position: "relative",
              aspectRatio: "4/5",
              background: "#ffffff",
              borderRadius: 32,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(112,128,144,0.08)",
              border: "1px solid rgba(112,128,144,0.05)"
            }}>
              {producto.url_imagen ? (
                <Image
                  src={producto.url_imagen}
                  alt={producto.nombre || "Imagen del producto"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #f6f4ef 0%, #ede9e3 100%)",
                  color: "#b76e79"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic" }}>Stella Joyería</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", opacity: 0.6 }}>Imagen en proceso</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Badges de Calidad */}
            <div style={{ 
              marginTop: 24, 
              display: "flex", 
              justifyContent: "center", 
              gap: 20,
              opacity: 0.8
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", color: "#708090", fontWeight: 500 }}>
                <span style={{ color: "#b76e79" }}>◆</span> Arte Texturizado
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", color: "#708090", fontWeight: 500 }}>
                <span style={{ color: "#b76e79" }}>◆</span> Calidad Premium
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", color: "#708090", fontWeight: 500 }}>
                <span style={{ color: "#b76e79" }}>◆</span> Envío Seguro
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <header>
              {producto.categoria && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: "#b76e79",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  display: "block",
                  marginBottom: 12
                }}>
                  {producto.categoria.nombre}
                </span>
              )}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: 500,
                color: "#4a5568",
                lineHeight: 1.1,
                margin: 0,
                fontStyle: "italic"
              }}>
                {producto.nombre}
              </h1>
              
              <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "#b76e79"
                }}>
                  ${producto.precio.toLocaleString()}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#708090", fontFamily: "'DM Sans', sans-serif" }}>MXN</span>
              </div>
            </header>

            <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(112,128,144,0.15) 0%, rgba(112,128,144,0) 100%)" }} />

            <section>
              <h3 style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                fontSize: "0.85rem", 
                fontWeight: 600, 
                color: "#4a5568", 
                textTransform: "uppercase", 
                marginBottom: 16 
              }}>Descripción</h3>
              <p style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                fontSize: "1.05rem", 
                color: "#708090", 
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: "pre-line"
              }}>
                {producto.descripcion || "Esta pieza artesanal ha sido diseñada con la elegancia y sutileza que caracteriza a Stella Joyería, utilizando materiales de la más alta calidad para resaltar tu brillo natural."}
              </p>
            </section>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 8, height: 8, borderRadius: "50%", 
                background: producto.stock_actual > 0 ? "#8c9768" : "#b76e79" 
              }} />
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                fontSize: "0.9rem", 
                fontWeight: 500,
                color: producto.stock_actual > 0 ? "#8c9768" : "#b76e79"
              }}>
                {producto.stock_actual > 0 ? `${producto.stock_actual} Disponibles` : "Agotado temporalmente"}
              </span>
            </div>

            <button
              disabled={producto.stock_actual === 0 || agregandoCarrito}
              onClick={() => {
                setAgregandoCarrito(true);
                agregarAlCarrito(producto, 1);
                setTimeout(() => {
                  setAgregandoCarrito(false);
                  toast.success("Agregado a tu colección");
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
                gap: 12
              }}
              onMouseOver={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 15px 25px rgba(183,110,121,0.3)";
                  e.currentTarget.style.background = "#a65d68";
                }
              }}
              onMouseOut={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(183,110,121,0.2)";
                  e.currentTarget.style.background = "#b76e79";
                }
              }}
            >
              {agregandoCarrito ? "Asegurando pieza..." : producto.stock_actual > 0 ? "Añadir al carrito" : "Sin existencias"}
            </button>

            {/* Cuidados de la Pieza */}
            <section style={{
              marginTop: 16,
              padding: "24px",
              background: "#ffffff",
              borderRadius: 24,
              border: "1px solid rgba(140,151,104,0.15)",
              boxShadow: "0 8px 16px rgba(140,151,104,0.04)"
            }}>
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "1.4rem", 
                fontWeight: 600, 
                color: "#4a5568", 
                fontStyle: "italic",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <span style={{ color: "#8c9768" }}>✦</span> Cuidados Especiales
              </h3>
              <ul style={{ 
                listStyle: "none", 
                padding: 0, 
                margin: 0, 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 20px"
              }}>
                {[
                  { icon: "✧", text: "Evita perfumes" },
                  { icon: "✧", text: "Limpia con paño suave" },
                  { icon: "✧", text: "Guarda por separado" },
                  { icon: "✧", text: "Evita químicos" }
                ].map((item, idx) => (
                  <li key={idx} style={{ 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "0.85rem", 
                    color: "#708090",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{ color: "#b76e79" }}>{item.icon}</span> {item.text}
                  </li>
                ))}
              </ul>
              <p style={{
                marginTop: 16,
                fontSize: "0.75rem",
                color: "#8c9768",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.5,
                opacity: 0.8
              }}>
                * Para piezas de chapa, retirar antes de nadar o ducharte. El acero inoxidable es resistente al agua.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
