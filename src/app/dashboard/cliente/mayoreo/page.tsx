"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  Package, 
  BadgePercent, 
  Download, 
  Send, 
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2
} from "lucide-react";
import WholesaleCatalogModal from "./_components/WholesaleCatalogModal";

// ── ESTILOS REUTILIZABLES (DESIGN TOKENS) ─────────────────────
const STYLES = {
  bg: "#f6f4ef",
  bgAlt: "#ede9e3",
  white: "#ffffff",
  slate: "#708090",
  slateDeep: "#4a5568",
  rose: "#b76e79",
  sage: "#8c9768",
  shadowBase: "0 2px 12px rgba(140, 151, 104, 0.08)",
  shadowHover: "0 18px 40px rgba(140, 151, 104, 0.22)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

import { WholesaleRole } from "./type";

export default function WholesalePage() {
  const { usuario, loading: authLoading } = useAuth();
  const [role, setRole] = useState<WholesaleRole | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  useEffect(() => {
    if (usuario) {
      // 1 = Admin, 2 = Cliente (Prospecto), 3 = Mayorista (Activo)
      if (usuario.id_rol === 1) {
        setRole("admin");
      } else if (usuario.id_rol === 3) {
        setRole("active");
      } else {
        setRole("prospect");
      }
    }
  }, [usuario]);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: STYLES.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", color: STYLES.slateDeep }}>Cargando portal mayorista...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: STYLES.bg, display: "flex", flexDirection: "column" }}>
      <HeaderClient user={usuario} />
      
      <main style={{ flex: 1, padding: "clamp(40px, 8vw, 80px) 20px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ 
            fontFamily: "var(--font-sans, Inter, sans-serif)", 
            fontSize: "0.68rem", 
            fontWeight: 600, 
            color: STYLES.rose, 
            textTransform: "uppercase", 
            letterSpacing: "0.2em",
            display: "block",
            marginBottom: 16
          }}>
            {role === "admin" ? "Panel de Control Stella (Admin)" : role === "active" ? "Portal de Socio Exclusivo" : "Oportunidades de Negocio"}
          </span>
          <h1 style={{ 
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", 
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
            color: STYLES.slateDeep,
            margin: "0 0 20px 0",
            fontWeight: 400,
            lineHeight: 1.1
          }}>
            {role === "admin" ? (
              <>Vista de <em style={{ color: STYLES.rose, fontStyle: "italic" }}>Mayoreo</em> Multipropósito</>
            ) : role === "active" ? (
              <>Tu cuenta <em style={{ color: STYLES.rose, fontStyle: "italic" }}>Mayorista</em></>
            ) : (
              <>Emprende con al <em style={{ color: STYLES.rose, fontStyle: "italic" }}>joyería de autor</em></>
            )}
          </h1>
          <p style={{ 
            fontFamily: "var(--font-sans, Inter, sans-serif)", 
            fontSize: "1.1rem", 
            color: STYLES.slate, 
            maxWidth: 600, 
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {role === "admin"
              ? "Como administrador, puedes previsualizar ambas experiencias de usuario: la del prospecto que busca información y la del mayorista activo."
              : role === "active" 
                ? "Bienvenido de nuevo. Accede a tus herramientas de gestión, descarga el catálogo actualizado y gestiona tus pedidos a consignación."
                : "Únete a nuestra red y obtén beneficios únicos. Diseñamos piezas que cuentan historias, perfectas para clientes que buscan lo extraordinario."}
          </p>
        </section>

        {role === "admin" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 100 }}>
            <div style={adminSectionLabelStyle}>
              <span style={adminBadgeStyle}>VISTA DE PROSPECTO (CLIENTE)</span>
            </div>
            <ProspectLanding />
            
            <div style={{ ...adminSectionLabelStyle, borderTop: `1px dashed ${STYLES.rose}`, paddingTop: 100 }}>
              <span style={adminBadgeStyle}>VISTA DE SOCIO ACTIVO (MAYORISTA)</span>
            </div>
            <WholesalerDashboard onDownloadClick={() => setIsCatalogModalOpen(true)} />
          </div>
        ) : (
          role === "active" ? <WholesalerDashboard onDownloadClick={() => setIsCatalogModalOpen(true)} /> : <ProspectLanding />
        )}

        <WholesaleCatalogModal 
          isOpen={isCatalogModalOpen}
          onClose={() => setIsCatalogModalOpen(false)}
        />


      </main>

      <Footer />
      
      <style>{`
              `}</style>
    </div>
  );
}

// ── ESTILOS ADICIONALES PARA ADMIN ──────────────────────────
const adminSectionLabelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  position: "relative",
  marginBottom: 20
};

const adminBadgeStyle: React.CSSProperties = {
  background: STYLES.rose,
  color: "#f6f4ef",
  padding: "8px 20px",
  borderRadius: 99,
  fontFamily: "var(--font-sans, Inter, sans-serif)",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  boxShadow: "0 4px 12px rgba(183,110,121,0.2)"
};

// ── COMPONENTE PARA MAYORISTA ACTIVO (ROL 3) ──────────────────
function WholesalerDashboard({ onDownloadClick }: { onDownloadClick: () => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
      {/* CARD: CATALOGO PDF */}
      <div style={cardStyle}>
        <div style={iconBoxStyle}><FileText size={24} color={STYLES.slate} /></div>
        <h3 style={cardTitleStyle}>Catálogo de <em style={{color: STYLES.rose}}>Precios</em></h3>
        <p style={cardDescStyle}>Descarga el catálogo PDF actualizado con tus descuentos exclusivos del 25% aplicados.</p>
        <button 
          onClick={onDownloadClick}
          style={primaryButtonStyle}
        >
          <Download size={18} /> Descargar Catálogo
        </button>
      </div>

      {/* CARD: CONSIGNACIÓN */}
      <div style={cardStyle}>
        <div style={iconBoxStyle}><Package size={24} color={STYLES.slate} /></div>
        <h3 style={cardTitleStyle}>Solicitar <em style={{color: STYLES.rose}}>Consignación</em></h3>
        <p style={cardDescStyle}>¿Buscas renovar stock sin inversión inicial? Solicita piezas bajo el modelo de consignación (Solo ZMG).</p>
        <button style={secondaryButtonStyle}>Gestionar Consignación</button>
      </div>

      {/* CARD: BENEFICIOS ACTIVOS */}
      <div style={cardStyle}>
        <div style={iconBoxStyle}><BadgePercent size={24} color={STYLES.slate} /></div>
        <h3 style={cardTitleStyle}>Tus <em style={{color: STYLES.rose}}>Beneficios</em></h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 15 }}>
          <BenefitItem text="25% de descuento automático" />
          <BenefitItem text="Envío prioritario express" />
          <BenefitItem text="Soporte exclusivo 24/7" />
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTE PARA PROSPECTO (ROL 2) ─────────────────────────
function ProspectLanding() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
      {/* Beneficios Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
        <BenefitCard 
          icon={<BadgePercent size={24} />} 
          title="Margen de Ganancia" 
          desc="Obtén un 25% de descuento fijo en todas tus compras desde el primer pedido." 
        />
        <BenefitCard 
          icon={<ShoppingBag size={24} />} 
          title="Inventario Inteligente" 
          desc="Acceso a nuestro modelo de consignación para mayoristas consolidados en ZMG." 
        />
        <BenefitCard 
          icon={<Sparkles size={24} />} 
          title="Exclusividad" 
          desc="Piezas de edición limitada y colecciones de autor que no encontrarás en otros lados." 
        />
      </div>

      {/* Formulario / CTA */}
      <div style={{ 
        background: STYLES.white, 
        padding: "clamp(30px, 5vw, 60px)", 
        borderRadius: 24, 
        border: `1px solid rgba(112, 128, 144, 0.12)`,
        boxShadow: STYLES.shadowBase,
        textAlign: "center"
      }}>
        <h2 style={{ 
          fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", 
          fontSize: "2.5rem", 
          color: STYLES.slateDeep,
          marginBottom: 20
        }}>¿Listo para <em style={{ color: STYLES.rose, fontStyle: "italic" }}>crecer</em> con nosotros?</h2>
        <p style={{ 
          fontFamily: "var(--font-sans, Inter, sans-serif)", 
          color: STYLES.slate, 
          maxWidth: 500, 
          margin: "0 auto 40px",
          lineHeight: 1.6
        }}>Déjanos tus datos y un asesor de Stella se pondrá en contacto contigo para explicarte el programa de socios.</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <button style={{
            ...primaryButtonStyle,
            padding: "18px 40px",
            fontSize: "0.9rem",
          }}>
            Quiero más información <Send size={16} />
          </button>
          <button style={{
            ...secondaryButtonStyle,
            padding: "18px 40px",
            fontSize: "0.9rem",
          }}>
            Ver catálogo actual
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SUB-COMPONENTES Y ESTILOS ─────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: STYLES.white,
  borderRadius: 16,
  padding: "32px",
  border: `1px solid rgba(112, 128, 144, 0.12)`,
  boxShadow: STYLES.shadowBase,
  transition: STYLES.transition,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  position: "relative",
  overflow: "hidden"
};

const iconBoxStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  background: "rgba(112, 128, 144, 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
  fontSize: "1.6rem",
  color: STYLES.slateDeep,
  fontWeight: 600,
  margin: 0
};

const cardDescStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, Inter, sans-serif)",
  fontSize: "0.9rem",
  color: STYLES.slate,
  lineHeight: 1.5,
  margin: 0
};

const primaryButtonStyle: React.CSSProperties = {
  background: STYLES.rose,
  color: STYLES.bg,
  border: "none",
  borderRadius: 8,
  padding: "14px 24px",
  fontFamily: "var(--font-sans, Inter, sans-serif)",
  fontSize: "0.82rem",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  boxShadow: "0 4px 12px rgba(183,110,121,0.22)",
  transition: STYLES.transition
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: STYLES.slate,
  border: `1.5px solid rgba(112, 128, 144, 0.2)`,
  borderRadius: 8,
  padding: "14px 24px",
  fontFamily: "var(--font-sans, Inter, sans-serif)",
  fontSize: "0.82rem",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "auto",
  transition: STYLES.transition
};

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div style={cardStyle} onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = STYLES.shadowHover;
    }} onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = STYLES.shadowBase;
    }}>
      <div style={{ color: STYLES.rose }}>{icon}</div>
      <h4 style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.3rem", color: STYLES.slateDeep, margin: 0 }}>{title}</h4>
      <p style={{ ...cardDescStyle, fontSize: "0.85rem" }}>{desc}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", color: STYLES.slateDeep, fontFamily: "var(--font-sans, Inter, sans-serif)" }}>
      <CheckCircle2 size={16} color={STYLES.rose} />
      <span>{text}</span>
    </div>
  );
}
