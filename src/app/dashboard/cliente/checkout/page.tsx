"use client";

import { useState, useMemo, Suspense } from "react";
import { useCart } from "@lib/hooks/useCart";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  CheckCircle2,
  User,
  Phone,
  Home,
  Building2,
  Zap,
  ArrowLeft,
  ShoppingBag,
  Package,
} from "lucide-react";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import { useAuth } from "@/lib/hooks/useAuth";

const COLORS = {
  bg: "#f6f4ef",
  white: "#ffffff",
  rose: "#b76e79",
  roseLight: "rgba(183, 110, 121, 0.1)",
  slate: "#708090",
  slateDeep: "#4a5568",
  slateBorder: "rgba(112, 128, 144, 0.18)",
  sage: "#8c9768",
};

export default function CheckoutPage() {
  const { items: cartItems } = useCart();
  const { usuario } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  const [shippingData, setShippingData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    apartamento: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    telefono: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardholder: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.producto.precio || 0) * item.cantidad,
      0
    );
  }, [cartItems]);

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return v.match(/.{1,4}/g)?.join(" ") || v;
  };

  if (step === 3) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <HeaderClient user={usuario} />
        </Suspense>
        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "60px 40px",
              borderRadius: "24px",
              textAlign: "center",
              boxShadow: "0 20px 56px rgba(140, 151, 104, 0.15)",
              maxWidth: "500px",
              width: "100%",
              animation: "slideUp 0.5s ease-out",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(140, 151, 104, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8c9768",
                margin: "0 auto 24px",
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "2.5rem",
                color: "#4a5568",
                marginBottom: "12px",
              }}
            >
              ¡Gracias por tu compra!
            </h1>
            <p
              style={{
                color: "#708090",
                marginBottom: "32px",
                fontSize: "1rem",
              }}
            >
              Tu pedido ha sido procesado con éxito. Recibirás un correo con los
              detalles en breve.
            </p>
            <button
              onClick={() => router.push("/dashboard/cliente/pedidos")}
              style={{
                background: COLORS.rose,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Ir a mis pedidos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf8f4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .input-stella:focus { border-bottom: 2px solid #b76e79 !important; outline: none; }
        .progress-line { height: 2px; background: #ede9e3; flex: 1; margin: 0 clamp(8px, 2vw, 16px); position: relative; overflow: hidden; }
        .progress-line-active::after { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 100%; background: #b76e79; transform: translateX(-100%); animation: loadLine 0.5s forwards; }
        @keyframes loadLine { to { transform: translateX(0); } }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.3fr 450px;
          gap: clamp(30px, 4vw, 80px);
          align-items: start;
        }

        .form-section {
          background: #ffffff; 
          border-radius: 40px; 
          padding: clamp(32px, 5vw, 64px);
          box-shadow: 0 40px 80px rgba(112, 128, 144, 0.06);
          min-height: 600px; 
          position: relative; 
          overflow: hidden;
          border: 1px solid rgba(112, 128, 144, 0.18);
        }

        @media (max-width: 1100px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .summary-panel {
            order: -1; /* Summary first on mobile? Or last? Usually last is better for checkout, but user might want it at top. Let's keep it last for now or optional. */
          }
        }

        @media (max-width: 768px) {
          .shipping-content {
            flex-direction: column !important;
          }
          .illustration-container {
            display: none !important; /* Hide illustration on small mobile to save space */
          }
          .payment-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .progress-bar-text {
            display: none;
          }
          .form-section {
            padding: 32px 24px;
            border-radius: 24px;
          }
        }
      `}</style>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderClient user={usuario} />
      </Suspense>

      <main
        style={{
          flex: 1,
          padding: "40px clamp(24px, 6vw, 80px)",
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ── Progress Bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "70px",
            maxWidth: "900px",
            margin: "0 auto 70px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: COLORS.rose,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "bold",
                boxShadow: `0 4px 12px ${COLORS.roseLight}`,
              }}
            >
              1
            </div>
            <span
              className="progress-bar-text"
              style={{
                fontSize: "0.8rem",
                color: COLORS.rose,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Carrito
            </span>
          </div>
          <div className="progress-line progress-line-active" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: step >= 1 ? COLORS.rose : "#ede9e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              2
            </div>
            <span
              className="progress-bar-text"
              style={{
                fontSize: "0.8rem",
                color: step >= 1 ? COLORS.rose : COLORS.slate,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Envío
            </span>
          </div>
          <div
            className={`progress-line ${step >= 2 ? "progress-line-active" : ""}`}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: step >= 2 ? COLORS.rose : "#ede9e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              3
            </div>
            <span
              className="progress-bar-text"
              style={{
                fontSize: "0.8rem",
                color: step >= 2 ? COLORS.rose : COLORS.slate,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Pago
            </span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* ── Forms (Left) ── */}
          <section className="form-section">
            {/* Background Decorations */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "300px",
                height: "300px",
                background: "rgba(183, 110, 121, 0.03)",
                borderRadius: "50%",
                zIndex: 0,
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              {step === 1 ? (
                <div
                  className="animate-slideUp shipping-content"
                  style={{ display: "flex", gap: "40px" }}
                >
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontFamily:
                          "var(--font-serif, 'Cormorant Garamond', serif)",
                        fontSize: "2.2rem",
                        color: COLORS.slateDeep,
                        marginBottom: "32px",
                      }}
                    >
                      Detalles de <em style={{ color: COLORS.rose }}>Envío</em>
                    </h2>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "32px 24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Nombre
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                          }}
                        >
                          <User
                            size={16}
                            color={COLORS.slate}
                            style={{ marginRight: "12px" }}
                          />
                          <input
                            className="input-stella"
                            placeholder="Tu nombre"
                            value={shippingData.nombre}
                            onChange={e =>
                              setShippingData({
                                ...shippingData,
                                nombre: e.target.value,
                              })
                            }
                            style={{
                              border: "none",
                              fontSize: "0.95rem",
                              color: COLORS.slateDeep,
                              width: "100%",
                              background: "transparent",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Apellidos
                        </label>
                        <input
                          className="input-stella"
                          placeholder="Tu apellido"
                          value={shippingData.apellido}
                          onChange={e =>
                            setShippingData({
                              ...shippingData,
                              apellido: e.target.value,
                            })
                          }
                          style={{
                            border: "none",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                            fontSize: "0.95rem",
                            color: COLORS.slateDeep,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          gridColumn: "span 2",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Calle y Número
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                          }}
                        >
                          <Home
                            size={16}
                            color={COLORS.slate}
                            style={{ marginRight: "12px" }}
                          />
                          <input
                            className="input-stella"
                            placeholder="Ej. Av. Vallarta 123"
                            value={shippingData.direccion}
                            onChange={e =>
                              setShippingData({
                                ...shippingData,
                                direccion: e.target.value,
                              })
                            }
                            style={{
                              border: "none",
                              fontSize: "0.95rem",
                              color: COLORS.slateDeep,
                              width: "100%",
                              background: "transparent",
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Ciudad
                        </label>
                        <input
                          className="input-stella"
                          placeholder="Guadalajara"
                          value={shippingData.ciudad}
                          onChange={e =>
                            setShippingData({
                              ...shippingData,
                              ciudad: e.target.value,
                            })
                          }
                          style={{
                            border: "none",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                            fontSize: "0.95rem",
                            color: COLORS.slateDeep,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Estado
                        </label>
                        <input
                          className="input-stella"
                          placeholder="Jalisco"
                          value={shippingData.estado}
                          onChange={e =>
                            setShippingData({
                              ...shippingData,
                              estado: e.target.value,
                            })
                          }
                          style={{
                            border: "none",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                            fontSize: "0.95rem",
                            color: COLORS.slateDeep,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Código Postal
                        </label>
                        <input
                          className="input-stella"
                          placeholder="44100"
                          value={shippingData.codigoPostal}
                          onChange={e =>
                            setShippingData({
                              ...shippingData,
                              codigoPostal: e.target.value,
                            })
                          }
                          style={{
                            border: "none",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                            fontSize: "0.95rem",
                            color: COLORS.slateDeep,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.slate,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Teléfono
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom:
                              "1.5px solid rgba(112, 128, 144, 0.2)",
                            paddingBottom: "8px",
                          }}
                        >
                          <Phone
                            size={16}
                            color={COLORS.slate}
                            style={{ marginRight: "12px" }}
                          />
                          <input
                            className="input-stella"
                            placeholder="33 1234 5678"
                            value={shippingData.telefono}
                            onChange={e =>
                              setShippingData({
                                ...shippingData,
                                telefono: e.target.value,
                              })
                            }
                            style={{
                              border: "none",
                              fontSize: "0.95rem",
                              color: COLORS.slateDeep,
                              width: "100%",
                              background: "transparent",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      style={{
                        marginTop: "48px",
                        width: "100%",
                        padding: "16px",
                        background: COLORS.rose,
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 10px 20px rgba(183, 110, 121, 0.2)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={e =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      Continuar al Pago
                    </button>
                  </div>

                  {/* Illustration (Shipment boxes like in the image) */}
                  <div
                    className="illustration-container"
                    style={{
                      flex: "0 0 320px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "350px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: 20,
                          right: 0,
                          width: "200px",
                          height: "200px",
                          background: "#f6f4ef",
                          borderRadius: "16px",
                          transform: "rotate(-10deg)",
                          border: "1.5px solid rgba(112, 128, 144, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Package
                          size={100}
                          color={COLORS.rose}
                          strokeWidth={0.5}
                          style={{ opacity: 0.8 }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 80,
                          left: 0,
                          width: "160px",
                          height: "160px",
                          background: "#ffffff",
                          borderRadius: "16px",
                          transform: "rotate(15deg)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                          border: "1.5px solid rgba(112, 128, 144, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BoxIcon3D />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-slideUp">
                  <button
                    onClick={handleBack}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "none",
                      border: "none",
                      color: COLORS.slate,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      marginBottom: "16px",
                    }}
                  >
                    <ArrowLeft size={16} /> Volver a envío
                  </button>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <h2
                        style={{
                          fontFamily:
                            "var(--font-serif, 'Cormorant Garamond', serif)",
                          fontSize: "2.5rem",
                          color: COLORS.slateDeep,
                          marginBottom: "4px",
                        }}
                      >
                        Detalles de <em style={{ color: COLORS.rose }}>Pago</em>
                      </h2>
                      <p
                        style={{
                          color: COLORS.slate,
                          fontSize: "0.95rem",
                          margin: 0,
                        }}
                      >
                        Seguro y encriptado vía Stripe
                      </p>
                    </div>

                    {/* Visual Card (Centered & Larger) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "480px",
                          height: "auto",
                          aspectRatio: "1.6 / 1",
                          borderRadius: "28px",
                          background:
                            "linear-gradient(135deg, #708090 0%, #4a5568 100%)",
                          padding: "clamp(24px, 4vw, 40px)",
                          color: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          boxShadow: "0 25px 50px rgba(112, 128, 144, 0.25)",
                          position: "relative",
                          overflow: "hidden",
                          animation:
                            "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0.08,
                            pointerEvents: "none",
                          }}
                        >
                          <svg
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            style={{ width: "100%", height: "100%" }}
                          >
                            <path
                              d="M0,100 C30,80 70,50 100,20 L100,0 L0,0 Z"
                              fill="white"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              width: "clamp(50px, 8vw, 65px)",
                              height: "clamp(35px, 6vw, 45px)",
                              background: "rgba(255,255,255,0.15)",
                              borderRadius: "8px",
                            }}
                          ></div>
                          <span
                            style={{
                              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                              fontWeight: "bold",
                              fontStyle: "italic",
                              letterSpacing: "0.12em",
                            }}
                          >
                            STELLA
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: "clamp(1.1rem, 3.5vw, 1.6rem)",
                            letterSpacing: "0.15em",
                            fontFamily: "'Courier New', monospace",
                            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {paymentData.cardNumber
                            ? formatCardNumber(paymentData.cardNumber)
                            : "#### #### #### ####"}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                opacity: 0.8,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Titular
                            </span>
                            <span
                              style={{
                                fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
                                fontWeight: 500,
                              }}
                            >
                              {paymentData.cardholder || "NOMBRE EN TARJETA"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                opacity: 0.8,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Vence
                            </span>
                            <span
                              style={{
                                fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
                                fontWeight: 500,
                              }}
                            >
                              {paymentData.expiryMonth || "MM"}/
                              {paymentData.expiryYear || "AA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "60px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ flex: "1 1 480px", maxWidth: "600px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "32px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "0.75rem",
                                color: COLORS.slate,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Titular de la Tarjeta
                            </label>
                            <input
                              className="input-stella"
                              placeholder="Ej. Juan Pérez"
                              value={paymentData.cardholder}
                              onChange={e =>
                                setPaymentData({
                                  ...paymentData,
                                  cardholder: e.target.value,
                                })
                              }
                              style={{
                                border: "none",
                                borderBottom:
                                  "1.5px solid rgba(112, 128, 144, 0.2)",
                                paddingBottom: "10px",
                                fontSize: "1rem",
                                color: COLORS.slateDeep,
                                width: "100%",
                                background: "transparent",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "0.75rem",
                                color: COLORS.slate,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Número de Tarjeta
                            </label>
                            <input
                              className="input-stella"
                              placeholder="0000 0000 0000 0000"
                              value={formatCardNumber(paymentData.cardNumber)}
                              onChange={e =>
                                setPaymentData({
                                  ...paymentData,
                                  cardNumber: e.target.value,
                                })
                              }
                              maxLength={19}
                              style={{
                                border: "none",
                                borderBottom:
                                  "1.5px solid rgba(112, 128, 144, 0.2)",
                                paddingBottom: "10px",
                                fontSize: "1.1rem",
                                color: COLORS.slateDeep,
                                width: "100%",
                                background: "transparent",
                                letterSpacing: "0.15em",
                              }}
                            />
                          </div>

                          <div
                            className="payment-grid-3"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr",
                              gap: "32px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "0.75rem",
                                  color: COLORS.slate,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                }}
                              >
                                Mes
                              </label>
                              <input
                                className="input-stella"
                                placeholder="MM"
                                value={paymentData.expiryMonth}
                                onChange={e =>
                                  setPaymentData({
                                    ...paymentData,
                                    expiryMonth: e.target.value,
                                  })
                                }
                                maxLength={2}
                                style={{
                                  border: "none",
                                  borderBottom:
                                    "1.5px solid rgba(112, 128, 144, 0.2)",
                                  paddingBottom: "10px",
                                  fontSize: "1rem",
                                  color: COLORS.slateDeep,
                                  width: "100%",
                                  background: "transparent",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "0.75rem",
                                  color: COLORS.slate,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                }}
                              >
                                Año
                              </label>
                              <input
                                className="input-stella"
                                placeholder="AA"
                                value={paymentData.expiryYear}
                                onChange={e =>
                                  setPaymentData({
                                    ...paymentData,
                                    expiryYear: e.target.value,
                                  })
                                }
                                maxLength={2}
                                style={{
                                  border: "none",
                                  borderBottom:
                                    "1.5px solid rgba(112, 128, 144, 0.2)",
                                  paddingBottom: "10px",
                                  fontSize: "1rem",
                                  color: COLORS.slateDeep,
                                  width: "100%",
                                  background: "transparent",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "0.75rem",
                                  color: COLORS.slate,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                }}
                              >
                                CVV
                              </label>
                              <input
                                className="input-stella"
                                placeholder="123"
                                value={paymentData.cvv}
                                onChange={e =>
                                  setPaymentData({
                                    ...paymentData,
                                    cvv: e.target.value,
                                  })
                                }
                                maxLength={3}
                                style={{
                                  border: "none",
                                  borderBottom:
                                    "1.5px solid rgba(112, 128, 144, 0.2)",
                                  paddingBottom: "10px",
                                  fontSize: "1rem",
                                  color: COLORS.slateDeep,
                                  width: "100%",
                                  background: "transparent",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleNext}
                          style={{
                            marginTop: "60px",
                            width: "100%",
                            padding: "18px",
                            background: COLORS.rose,
                            color: "#fff",
                            border: "none",
                            borderRadius: "14px",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 12px 24px rgba(183, 110, 121, 0.25)",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={e =>
                            (e.currentTarget.style.transform =
                              "translateY(-2px)")
                          }
                          onMouseOut={e =>
                            (e.currentTarget.style.transform = "translateY(0)")
                          }
                        >
                          Pagar ${total.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Summary (Right) ── */}
          <aside
            className="summary-panel"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 40px rgba(112, 128, 144, 0.05)",
                border: "1px solid rgba(112, 128, 144, 0.1)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "1.5rem",
                  color: "#4a5568",
                  marginBottom: "24px",
                }}
              >
                Resumen de pedido
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        background: COLORS.bg,
                        overflow: "hidden",
                        border: `1px solid ${COLORS.slateBorder}`,
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.producto.url_imagen || "/LogoM.svg"}
                        alt={item.producto.nombre || "Producto"}
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
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: COLORS.slateDeep,
                        }}
                      >
                        {item.producto.nombre || "Producto"}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: COLORS.slate,
                        }}
                      >
                        Cant: {item.cantidad}
                      </p>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.slateDeep,
                      }}
                    >
                      ${(item.producto.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  borderTop: "1px solid rgba(112, 128, 144, 0.1)",
                  paddingTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    color: COLORS.slate,
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
                    fontSize: "0.9rem",
                    color: COLORS.slate,
                  }}
                >
                  <span>Envío</span>
                  <span style={{ color: COLORS.sage, fontWeight: "bold" }}>
                    Gratis
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    color: COLORS.slate,
                  }}
                >
                  <span>IVA (16%)</span>
                  <span>
                    $
                    {iva.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: COLORS.rose,
                    marginTop: "8px",
                  }}
                >
                  <span>Total</span>
                  <span>
                    $
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(140, 151, 104, 0.05)",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid rgba(140, 151, 104, 0.1)",
                display: "flex",
                gap: "12px",
              }}
            >
              <Zap size={20} color={COLORS.sage} />
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: COLORS.slateDeep,
                  lineHeight: "1.4",
                }}
              >
                Tus datos están protegidos con encriptación de grado bancario.
                Compra con total seguridad.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Components for Illustration ──

function BoxIcon3D() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        fill="#b76e79"
        fillOpacity="0.2"
        stroke="#b76e79"
        strokeWidth="1"
      />
      <path
        d="M2 17L12 22V12L2 7V17Z"
        fill="#b76e79"
        fillOpacity="0.1"
        stroke="#b76e79"
        strokeWidth="1"
      />
      <path
        d="M22 17L12 22V12L22 7V17Z"
        fill="#b76e79"
        fillOpacity="0.3"
        stroke="#b76e79"
        strokeWidth="1"
      />
      <path d="M12 12V22" stroke="#b76e79" strokeWidth="1" />
      <rect
        x="7"
        y="10"
        width="10"
        height="2"
        transform="rotate(-30 7 10)"
        fill="#b76e79"
        fillOpacity="0.4"
      />
    </svg>
  );
}
