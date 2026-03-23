"use client";

import React from "react";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import ChatbotPage from "@/app/chatbot/page";
import { useAuth } from "@/lib/hooks/useAuth";
import { 
  MapPin, 
  Clock, 
  MessageSquare, 
  Smartphone, 
  ExternalLink,
  Mail,
  Navigation
} from "lucide-react";
import { FaTiktok, FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa6";

const ADDRESS = "C. Agustín de Iturbide 578, Santa Teresita, 44200 Guadalajara, Jal.";
const MAP_EMBED = "https://maps.google.com/maps?q=Agust%C3%ADn+de+Iturbide+578+Guadalajara+Jalisco&output=embed&z=16";
const GOOGLE_MAPS_LINK = "https://maps.google.com/?q=C.+Agustín+de+Iturbide+578,+Santa+Teresita,+44200+Guadalajara,+Jalisco";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    handle: "@stellajoyeriar",
    link: "https://www.instagram.com/stellajoyeriar",
    icon: <FaInstagram size={24} />,
    color: "#E1306C",
    bg: "rgba(225, 48, 108, 0.1)"
  },
  {
    name: "Facebook",
    handle: "StellaJoyeriaAr",
    link: "https://www.facebook.com/StellaJoyeriaAr",
    icon: <FaFacebookF size={24} />,
    color: "#1877F2",
    bg: "rgba(24, 119, 242, 0.1)"
  },
  {
    name: "WhatsApp",
    handle: "Contactar ahora",
    link: "https://wa.me/stella-jewelry",
    icon: <FaWhatsapp size={24} />,
    color: "#25D366",
    bg: "rgba(37, 211, 102, 0.1)"
  },
  {
    name: "TikTok",
    handle: "@stellajoyeriar",
    link: "https://www.tiktok.com/@stellajoyeriar",
    icon: <FaTiktok size={24} />,
    color: "#000000",
    bg: "rgba(0, 0, 0, 0.05)"
  }
];

export default function ContactoPage() {
  const { usuario } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500&display=swap');
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .social-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(140, 151, 104, 0.15);
        }

        .map-container {
          box-shadow: 0 20px 50px rgba(112, 128, 144, 0.1);
          border: 1px solid rgba(112, 128, 144, 0.1);
        }
      `}</style>

      <HeaderClient user={usuario} />
      <ChatbotPage />

      <main style={{ flex: 1, paddingTop: "clamp(40px, 8vw, 80px)", paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1100, padding: "0 24px" }}>
          
          {/* Hero Section */}
          <div className="text-center animate-fade-up" style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 40, height: 1.5, background: "#b76e79" }} />
              <span style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                fontSize: "0.75rem", 
                fontWeight: 500, 
                textTransform: "uppercase", 
                letterSpacing: "0.25em", 
                color: "#b76e79" 
              }}>
                Atención al cliente
              </span>
              <span style={{ width: 40, height: 1.5, background: "#b76e79" }} />
            </div>
            <h1 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: "clamp(2.5rem, 5vw, 4rem)", 
              fontWeight: 500, 
              color: "#4a5568",
              margin: 0,
              lineHeight: 1.1
            }}>
              Estamos aquí para <em style={{ fontStyle: "italic", color: "#b76e79" }}>ayudarte</em>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-fade-up" style={{ animationDelay: "0.1s" }}>
            
            {/* Store Information */}
            <div style={{ 
              background: "#fff", 
              padding: "clamp(24px, 4vw, 48px)", 
              borderRadius: 32,
              boxShadow: "0 10px 30px rgba(112, 128, 144, 0.05)",
              border: "1px solid rgba(112, 128, 144, 0.08)"
            }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "1.8rem", 
                fontWeight: 600, 
                color: "#4a5568",
                marginBottom: 32
              }}>
                Nuestra Tienda Física
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                
                {/* Address */}
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 14, 
                    background: "rgba(183, 110, 121, 0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: "#b76e79"
                  }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p style={{ 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.8rem", 
                      fontWeight: 500, 
                      color: "#b76e79",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: "0 0 6px"
                    }}>
                      Ubicación
                    </p>
                    <p style={{ 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.95rem", 
                      color: "#708090",
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {ADDRESS}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 14, 
                    background: "rgba(140, 151, 104, 0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: "#8c9768"
                  }}>
                    <Clock size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.8rem", 
                      fontWeight: 500, 
                      color: "#8c9768",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: "0 0 12px"
                    }}>
                      Horarios
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#708090" }}>
                        <span>Lunes – Viernes</span>
                        <span style={{ fontWeight: 500, color: "#4a5568" }}>10:00 – 19:00</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#708090" }}>
                        <span>Sábado</span>
                        <span style={{ fontWeight: 500, color: "#4a5568" }}>10:00 – 17:00</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#708090" }}>
                        <span>Domingo</span>
                        <span style={{ fontWeight: 500, color: "#c0404f" }}>Cerrado</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email (Optional but good) */}
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 14, 
                    background: "rgba(112, 128, 144, 0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: "#708090"
                  }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <p style={{ 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.8rem", 
                      fontWeight: 500, 
                      color: "#708090",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: "0 0 6px"
                    }}>
                      Correo Electrónico
                    </p>
                    <p style={{ 
                      fontFamily: "'DM Sans', sans-serif", 
                      fontSize: "0.95rem", 
                      color: "#4a5568",
                      textDecoration: "none",
                      margin: 0
                    }}>
                      hola@stellajoyeria.com
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 40 }}>
                <a 
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                    padding: "16px",
                    borderRadius: 16,
                    background: "#b76e79",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(183, 110, 121, 0.25)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = "0 12px 24px rgba(183, 110, 121, 0.35)";
                    el.style.background = "#a05e68";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 8px 20px rgba(183, 110, 121, 0.25)";
                    el.style.background = "#b76e79";
                  }}
                >
                  <Navigation size={18} />
                  Cómo Llegar
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="map-container" style={{ 
              height: "100%", 
              minHeight: 450, 
              borderRadius: 32, 
              overflow: "hidden",
              position: "relative"
            }}>
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 450 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Stella Joyería"
              />
              {/* Overlay styling for the map to match brand */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(183, 110, 121, 0.03)",
                pointerEvents: "none"
              }} />
            </div>

          </div>

          {/* Social Media Section */}
          <div className="animate-fade-up" style={{ marginTop: 80, animationDelay: "0.2s" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "2.2rem", 
                fontWeight: 600, 
                color: "#4a5568",
                margin: "0 0 12px"
              }}>
                Síguenos en Redes
              </h2>
              <p style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                color: "#708090",
                fontSize: "0.95rem"
              }}>
                Mantente al día con nuestras nuevas colecciones y promociones.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SOCIAL_LINKS.map(social => (
                <a 
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px 20px",
                    background: "#fff",
                    borderRadius: 24,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(112, 128, 144, 0.08)"
                  }}
                >
                  <div style={{ 
                    width: 60, height: 60, borderRadius: "50%",
                    background: social.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: social.color,
                    marginBottom: 16
                  }}>
                    {social.icon}
                  </div>
                  <span style={{ 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "0.85rem", 
                    fontWeight: 500, 
                    color: "#4a5568",
                    marginBottom: 4
                  }}>
                    {social.name}
                  </span>
                  <span style={{ 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "0.75rem", 
                    color: "#708090"
                  }}>
                    {social.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
