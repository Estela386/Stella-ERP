"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ShieldCheck, Package, Sparkles, Bot,
  ArrowRight, Menu, X, ChevronRight,
  LayoutGrid, Database, CircleDollarSign, ShoppingCart, TrendingUp, Handshake, Gem, Check,
} from "lucide-react";
import LogoM from "@assets/LogoM.svg";

// ─── Paleta exacta de la imagen ───────────────────────────────────────────────
// #f6f4ef  → fondo general (crema cálido)
// #708090  → texto base, estructura, bordes, iconos (slate)
// #b76e79  → acento: palabras clave en títulos, botón CTA principal, estrellas
// #ffffff  → superficie de cards
// #8c9768  → sombras sage sutiles
const C = {
  // ── fondos ──
  bg:           "#f6f4ef",       // fondo página
  bgAlt:        "#ede9e3",       // secciones alternas ligeramente más cálidas
  white:        "#ffffff",       // cards

  // ── slate (base dominante) ──
  slate:        "#708090",       // texto párrafos, labels, bordes
  slateDeep:    "#4a5568",       // títulos principales, texto oscuro
  slateBorder:  "rgba(112,128,144,0.18)",
  slateMid:     "rgba(112,128,144,0.25)",
  slateLight:   "rgba(112,128,144,0.08)",
  slateIcon:    "rgba(112,128,144,0.12)",  // fondo de iconos

  // ── rose (acento — sólo en palabras clave y CTA) ──
  rose:         "#b76e79",
  roseDeep:     "#9c5a65",
  roseBg:       "rgba(183,110,121,0.08)",  // fondo pill badge
  roseBorder:   "rgba(183,110,121,0.22)",
  roseMid:      "rgba(183,110,121,0.32)",

  // ── sage (sombras) ──
  sage:         "#8c9768",
  sageSm:       "rgba(140,151,104,0.08)",
  sageMd:       "rgba(140,151,104,0.15)",
  sageLg:       "rgba(140,151,104,0.22)",
};

// ─── Variants ─────────────────────────────────────────────────────────────────
const itemV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const containerV: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const fadeV: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};
const scaleV: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const slideV: Variants = {
  hidden: { opacity: 0, x: 44 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const menuV: Variants = {
  hidden: { opacity: 0, x: "100%" },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
  exit:   { opacity: 0, x: "100%", transition: { duration: 0.18 } },
};

function d(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureCardProps { icon: React.ReactNode; title: string; text: string; }
interface RoleCardProps    { badge: string; title: string; desc: string; perks: string[]; }
interface ModuleCardProps  { num: string; icon: React.ReactNode; name: string; desc: string; }
interface ReviewCardProps  { text: string; initials: string; name: string; role: string; }

// ─── Feature Card — blanca limpia, icono slate, sin color extra ───────────────
function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -6, boxShadow: `0 18px 40px ${C.sageLg}` }}
      transition={{ duration: 0.22 }}
      style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(18px,2.2vw,26px)",
        boxShadow: `0 2px 12px ${C.sageSm}`,
        textAlign: "center",
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 16px", background: C.slateIcon, border: `1px solid ${C.slateBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "var(--font-subtitle)", fontSize: "1.18rem", fontWeight: 600, color: C.slateDeep, marginBottom: 8, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.86rem", lineHeight: 1.68, color: C.slate, fontWeight: 400, margin: 0 }}>
        {text}
      </p>
    </motion.div>
  );
}

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ badge, title, desc, perks }: RoleCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -6, boxShadow: `0 20px 44px ${C.sageLg}` }}
      transition={{ duration: 0.22 }}
      style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(20px,2.5vw,28px)",
        boxShadow: `0 2px 12px ${C.sageSm}`,
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.rose, marginBottom: 12, fontWeight: 500 }}>
        <span style={{ width: 10, height: 1, background: C.rose, display: "inline-block" }} />
        {badge}
      </div>
      <h3 style={{ fontFamily: "var(--font-subtitle)", fontSize: "clamp(1.25rem,1.9vw,1.52rem)", fontWeight: 600, color: C.slateDeep, marginBottom: 10, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.86rem", lineHeight: 1.70, color: C.slate, fontWeight: 400, marginBottom: 18 }}>
        {desc}
      </p>
      <div style={{ height: 1, background: C.slateBorder, marginBottom: 14 }} />
      <ul style={{ display: "flex", flexDirection: "column", gap: 9, listStyle: "none", padding: 0, margin: 0 }}>
        {perks.map((p) => (
          <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", color: C.slate, fontFamily: "var(--font-subtitle)" }}>
            <ChevronRight size={13} color={C.rose} style={{ flexShrink: 0 }} />
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({ num, icon, name, desc }: ModuleCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -5, boxShadow: `0 16px 36px ${C.sageMd}` }}
      transition={{ duration: 0.20 }}
      style={{
        background: C.white, borderRadius: 12,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(16px,1.8vw,22px)",
        boxShadow: `0 2px 8px ${C.sageSm}`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* number watermark */}
      <span style={{ position: "absolute", top: -8, right: 10, lineHeight: 1, fontFamily: "var(--font-serif)", fontSize: "4.5rem", fontWeight: 600, color: "rgba(112,128,144,0.06)", pointerEvents: "none", userSelect: "none" }}>
        {num}
      </span>
      {/* left accent */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${C.slate} 0%, transparent 100%)`, borderRadius: "12px 0 0 12px", opacity: 0.18 }} />
      <div style={{ fontSize: "1.2rem", marginBottom: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: C.slateIcon, borderRadius: 9, border: `1px solid ${C.slateBorder}` }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.93rem", fontWeight: 600, color: C.slateDeep, marginBottom: 6, letterSpacing: "-0.01em" }}>{name}</div>
      <p style={{ fontSize: "0.82rem", lineHeight: 1.62, color: C.slate, fontWeight: 400, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ─── Review Card — exactamente como la imagen ─────────────────────────────────
function ReviewCard({ text, initials, name, role }: ReviewCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -5, boxShadow: `0 18px 40px ${C.sageLg}` }}
      transition={{ duration: 0.22 }}
      style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(18px,2.2vw,24px)",
        boxShadow: `0 2px 10px ${C.sageSm}`,
      }}
    >
      {/* author row arriba como en la imagen */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.slateIcon}, rgba(140,151,104,0.12))`, border: `1px solid ${C.slateBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 600, color: C.slate }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 500, color: C.slateDeep }}>{name}</div>
          <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: C.sage, marginTop: 1 }}>{role}</div>
        </div>
        {/* stars right */}
        <div style={{ marginLeft: "auto", color: C.rose, fontSize: "0.82rem", letterSpacing: 1 }}>★★★★★</div>
      </div>
      <div style={{ height: 1, background: C.slateBorder, marginBottom: 14 }} />
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.08rem", fontStyle: "italic", color: C.slateDeep, lineHeight: 1.67, fontWeight: 400, margin: 0 }}>
        &ldquo;{text}&rdquo;
      </p>
    </motion.div>
  );
}

// ─── Section Header — título bicolor como en la imagen ────────────────────────
// "Lo que dicen" en slate + "Nuestros Clientes" en rose
function SectionHeader({
  eyebrow, before, accent, after, sub,
}: {
  eyebrow?: string;
  before: string;
  accent: string;
  after?: string;
  sub?: string;
}) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={containerV} style={{ textAlign: "center", marginBottom: 36 }}>
      {eyebrow && (
        <motion.p variants={d(0)} style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.rose, marginBottom: 10, fontWeight: 600, fontFamily: "var(--font-subtitle)" }}>
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 variants={d(0.06)} style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.1rem,4vw,3.2rem)", fontWeight: 500, lineHeight: 1.18, letterSpacing: "-0.01em", margin: "0 0 0" }}>
        <span style={{ color: C.slateDeep }}>{before} </span>
        <span style={{ color: C.rose }}>{accent}</span>
        {after && <span style={{ color: C.slateDeep }}> {after}</span>}
      </motion.h2>
      {sub && (
        <motion.p variants={d(0.12)} style={{ color: C.slate, fontSize: "0.94rem", lineHeight: 1.72, maxWidth: 520, margin: "12px auto 0", fontWeight: 400 }}>
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features: FeatureCardProps[] = [
  { icon: <ShieldCheck size={20} color={C.slate} />, title: "Pagos Seguros",             text: "Stripe y SPEI con cifrado AES y cumplimiento PCI-DSS en cada transacción." },
  { icon: <Package     size={20} color={C.slate} />, title: "Inventario en Tiempo Real", text: "Control FIFO/LIFO con alertas automáticas y notificaciones push al detectar stock bajo." },
  { icon: <Sparkles    size={20} color={C.slate} />, title: "Visualización 3D",          text: "Catálogo interactivo con modelos 3D para decisiones de compra seguras y confiables." },
  { icon: <Bot         size={20} color={C.slate} />, title: "IA Integrada",              text: "Predicción de demanda, precios dinámicos y recomendaciones con TensorFlow y Gemini." },
];

const roles: RoleCardProps[] = [
  {
    badge: "Administrador",
    title: "Control Total del Negocio",
    desc: "Panel centralizado con inventarios, precios, reportes estratégicos y gestión de usuarios.",
    perks: ["Dashboard con KPIs en tiempo real", "Gestión de catálogo y precios", "Reportes y analítica predictiva", "Configuración de módulos y permisos"],
  },
  {
    badge: "Mayorista B2B",
    title: "Portal de Distribuidores",
    desc: "Consignaciones, créditos personalizados y facturación electrónica automática.",
    perks: ["Consignaciones trazables", "Precios y descuentos por volumen", "Reportes PDF/Excel individuales", "Facturación electrónica integrada"],
  },
  {
    badge: "Cliente Minorista B2C",
    title: "Experiencia de Compra Premium",
    desc: "Catálogo 3D, carrito inteligente y programa de fidelización con gamificación.",
    perks: ["Catálogo 3D responsivo", "Reseñas y sistema de rating", "Seguimiento en tiempo real", "Programa de recompensas"],
  },
];

const modules: ModuleCardProps[] = [
  { num: "01", icon: <LayoutGrid      size={18} color={C.slate} />, name: "Catálogo de Productos",  desc: "Artículos con imágenes optimizadas y categorías jerárquicas." },
  { num: "02", icon: <Database        size={18} color={C.slate} />, name: "Inventario Inteligente",  desc: "WebSockets + triggers SQL para actualización automática." },
  { num: "03", icon: <CircleDollarSign size={18} color={C.slate} />, name: "Gestión de Precios",      desc: "Márgenes, descuentos por volumen y políticas de fidelización." },
  { num: "04", icon: <ShoppingCart    size={18} color={C.slate} />, name: "Pedidos y Ventas",        desc: "Trazabilidad ACID, devoluciones y panel interactivo." },
  { num: "05", icon: <TrendingUp      size={18} color={C.slate} />, name: "Reportes Estratégicos",   desc: "Dashboards con KPIs personalizables y analítica predictiva." },
  { num: "06", icon: <Handshake       size={18} color={C.slate} />, name: "Módulo Mayoristas",       desc: "Consignaciones, créditos y paneles individualizados." },
];

const techStack = [
  "Next.js","React","Tailwind CSS","Supabase","PostgreSQL",
  "Node.js / Express","Gemini API",
  "Stripe", "JWT / OAuth 2.0", "Vercel", "CI/CD Pipeline",
];

const reviews: ReviewCardProps[] = [
  { text: "La trazabilidad de consignaciones es exactamente lo que necesitábamos. Antes perdíamos piezas; ahora tenemos control total.", initials: "MR", name: "María R.",  role: "Distribuidora Mayorista" },
  { text: "El dashboard en tiempo real me da la tranquilidad de saber qué piezas tengo disponibles desde cualquier dispositivo.",        initials: "EB", name: "Estela B.", role: "Administradora · Stella" },
  { text: "Ver las joyas en 3D cambia completamente la experiencia. Me siento segura de lo que adquiero sin verla en persona.",          initials: "LC", name: "Laura C.",  role: "Cliente Minorista" },
];

const statsData = [
  { num: "80%",  label: "Adopción primer mes" },
  { num: "50%",  label: "Reducción de errores" },
  { num: "4/5",  label: "Satisfacción cliente" },
  { num: "100%", label: "Reportes automatizados" },
];

// ─── Shared padding ──────────────────────────────────────────────────────────
const SP = "clamp(44px,5.5vw,68px) clamp(20px,5vw,52px)";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomeClient() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const heroRef             = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const blobY               = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const navLinks = [
    { label: "Inicio",      href: "#" },
    { label: "Módulos",     href: "#modulos" },
    { label: "Usuarios",    href: "#usuarios" },
    { label: "Tecnología",  href: "#tecnologia" },
    { label: "Mayoristas",  href: "#contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1)).filter(id => id);
      
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset to detect section earlier
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveSection(""); // Inicio
      } else {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
                *,*::before,*::after{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        .cta-input:focus{outline:none;border-color:rgba(183,110,121,0.45)!important;box-shadow:0 0 0 3px rgba(183,110,121,0.09)!important;}
        .nav-link{transition:color 0.2s;}
        .nav-link:hover{color:#b76e79!important;}
        .foot-link:hover{color:#b76e79!important;}
        /* ── RESPONSIVE ── */
        @media(max-width:1024px){.feat-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:768px){
          .hero-inner{grid-template-columns:1fr!important;padding-top:82px!important;padding-bottom:48px!important;}
          .hero-visual-wrap{display:none!important;}
          .feat-grid{grid-template-columns:repeat(2,1fr)!important;}
          .roles-grid{grid-template-columns:1fr!important;}
          .mod-grid{grid-template-columns:repeat(2,1fr)!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .rev-grid{grid-template-columns:1fr!important;}
          .footer-flex{flex-direction:column!important;gap:14px!important;text-align:center!important;}
          .nav-links-desk{display:none!important;}
          .nav-login-desk{display:none!important;}
          .ham-btn{display:flex!important;}
          .cta-row{flex-direction:column!important;}
          .hero-stats{flex-wrap:wrap!important;}
        }
        @media(max-width:480px){
          .feat-grid{grid-template-columns:1fr!important;}
          .mod-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <main style={{ background: C.bg, color: C.slate, fontFamily: "var(--font-sans, 'Tan Mon Cheri', sans-serif)", overflowX: "hidden" }}>

        {/* ══════════ NAV ══════════ */}
        {/* Estilo igual a la imagen: fondo blanco, links slate, CTA rose */}
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            height: 60, padding: "0 clamp(20px,4vw,52px)",
            background: C.white,
            borderBottom: `1px solid ${C.slateBorder}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: `0 1px 12px ${C.sageSm}`,
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <Image src={LogoM} alt="Stella" width={150} height={80} priority style={{ objectFit: "contain", display: "block" }} />
          </motion.div>

          {/* Desktop links */}
          <ul className="nav-links-desk" style={{ display: "flex", gap: 14, listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map(({ label, href }) => {
              const isActive = activeSection === href.substring(1) || (activeSection === "" && href === "#");
              return (
                <li key={label} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-nav"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(183,110,121,0.12)",
                        borderRadius: 999,
                        zIndex: 0
                      }}
                    />
                  )}
                  <a href={href} className="nav-link" style={{ 
                    position: "relative",
                    zIndex: 1,
                    padding: "10px 24px",
                    textDecoration: "none", 
                    color: isActive ? C.rose : C.slate, 
                    fontWeight: 500,
                    textShadow: isActive ? `0 0 0.5px ${C.rose}` : "none",
                    fontSize: "0.95rem", 
                    letterSpacing: "0.04em",
                    transition: "color 0.25s ease, text-shadow 0.25s ease",
                    borderRadius: 999,
                  }}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <motion.button className="nav-login-desk" whileHover={{ color: C.rose }} onClick={() => router.push("/login")}
              style={{ display: "flex", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.78rem", color: C.slate, padding: "8px 2px", transition: "color 0.2s" }}>
              Iniciar sesión
            </motion.button>
            {/* CTA principal: rose como en la imagen */}
            <motion.button
              whileHover={{ y: -2, boxShadow: `0 8px 22px ${C.roseMid}` }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/dashboard/cliente")}
              style={{ background: C.rose, color: "#f6f4ef", border: "none", cursor: "pointer", padding: "9px 20px", borderRadius: 6, fontSize: "0.78rem", letterSpacing: "0.04em", fontFamily: "var(--font-sans, Inter, sans-serif)", boxShadow: `0 3px 10px ${C.roseBorder}`, transition: "box-shadow 0.2s" }}
            >
              Visitar Tienda
            </motion.button>
            <button className="ham-btn" onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.slate, padding: 4, alignItems: "center" }}>
              <Menu size={20} />
            </button>
          </div>
        </motion.nav>

        {/* ══════════ MOBILE MENU ══════════ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div key="mob" variants={menuV} initial="hidden" animate="show" exit="exit"
              style={{ position: "fixed", inset: 0, zIndex: 200, background: C.white, padding: "0 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Image src={LogoM} alt="Stella" width={96} height={30} style={{ objectFit: "contain" }} />
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}><X size={21} /></button>
              </div>
              <div style={{ height: 1, background: C.slateBorder }} />
              <div style={{ flex: 1, paddingTop: 24, paddingLeft: 24, paddingRight: 24, margin: "0 -24px" }}>
                {navLinks.map(({ label, href }) => {
                  const isActive = activeSection === href.substring(1) || (activeSection === "" && href === "#");
                  return (
                    <a key={label} href={href} onClick={() => setMobileOpen(false)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center",
                        justifyContent: "space-between",
                        textDecoration: "none", 
                        color: isActive ? C.rose : C.slateDeep, 
                        fontSize: "1.35rem", 
                        fontFamily: "var(--font-serif, 'Celestial', serif)", 
                        fontWeight: 300, 
                        textShadow: isActive ? `0 0 0.5px ${C.rose}` : "none",
                        padding: "16px 24px", 
                        background: isActive ? "linear-gradient(90deg, rgba(183,110,121,0.06) 0%, transparent 100%)" : "transparent",
                        borderLeft: isActive ? `3px solid ${C.rose}` : "3px solid transparent",
                        borderBottom: `1px solid ${C.slateBorder}`,
                        transition: "all 0.25s ease"
                      }}>
                      {label}
                      {isActive && <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: "1rem", color: C.rose }}>✦</motion.span>}
                    </a>
                  );
                })}
              </div>
              <div style={{ paddingBottom: 40, display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => { router.push("/dashboard/cliente"); setMobileOpen(false); }} style={{ background: C.rose, color: "#f6f4ef", border: "none", borderRadius: 6, padding: "12px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.88rem", cursor: "pointer" }}>Visitar Tienda</button>
                <div style={{ display: "flex", gap: 10 }}>
                   <button onClick={() => { router.push("/login"); setMobileOpen(false); }} style={{ flex: 1, background: "none", border: `1.5px solid ${C.slateMid}`, borderRadius: 6, padding: "10px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.80rem", color: C.slate, cursor: "pointer" }}>Inicia sesión</button>
                   <button onClick={() => { router.push("/register"); setMobileOpen(false); }} style={{ flex: 1, background: "none", border: `1.5px solid ${C.slateMid}`, borderRadius: 6, padding: "10px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.80rem", color: C.slate, cursor: "pointer" }}>Regístrate</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ HERO ══════════ */}
        {/* Fondo #f6f4ef, texto slate, acento rose en keyword */}
        <section ref={heroRef} style={{ position: "relative", overflow: "hidden", background: C.bg, paddingBottom: 0 }}>
          {/* dot grid sutil */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(112,128,144,0.08) 1px, transparent 1px)`, backgroundSize: "36px 36px", pointerEvents: "none" }} />
          {/* rose glow top-right — muy sutil */}
          <motion.div style={{ y: blobY, position: "absolute", top: -80, right: -80, width: 420, height: 420, background: `radial-gradient(circle, rgba(183,110,121,0.07) 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
          <motion.div style={{ y: blobY, position: "absolute", bottom: -60, left: -60, width: 320, height: 320, background: `radial-gradient(circle, rgba(112,128,144,0.06) 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />

          <div
            className="hero-inner"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: "clamp(24px,5vw,56px)", maxWidth: 1240, margin: "0 auto", padding: "clamp(90px,10vh,120px) clamp(20px,5vw,52px) clamp(60px,8vw,88px)", position: "relative", zIndex: 2 }}
          >
            {/* TEXT */}
            <motion.div initial="hidden" animate="show" variants={containerV}>
              {/* eyebrow pill — como en la imagen */}
              <motion.div variants={d(0)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.roseBg, border: `1px solid ${C.roseBorder}`, color: C.rose, borderRadius: 4, padding: "4px 12px", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24, fontFamily: "var(--font-subtitle)" }}>
                <span style={{ width: 4, height: 4, background: C.rose, borderRadius: "50%", display: "inline-block" }} />
                ERP + E-Commerce · Joyería Artesanal
              </motion.div>

              {/* h1: palabra clave en rose */}
              <motion.h1 variants={d(0.07)} style={{ fontFamily: "var(--font-title)", fontSize: "clamp(2.8rem,5.2vw,5.2rem)", fontWeight: 400, lineHeight: 1.10, marginBottom: 20, letterSpacing: "-0.02em" }}>
                <span style={{ color: C.slateDeep }}>Gestión inteligente<br />para </span>
                <em style={{ fontStyle: "italic", color: C.rose }}>joyería</em>
                <span style={{ color: C.slateDeep }}><br />de alto valor</span>
              </motion.h1>

              <motion.p variants={d(0.14)} style={{ fontSize: "clamp(0.94rem,1.5vw,1.05rem)", lineHeight: 1.72, color: C.slate, maxWidth: 440, marginBottom: 32, fontWeight: 400 }}>
                Stella ERP centraliza inventario, ventas, consignaciones y atención al cliente en una plataforma moderna y segura diseñada para crecer.
              </motion.p>

              <motion.div variants={d(0.20)} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <motion.button whileHover={{ y: -2, boxShadow: `0 10px 26px ${C.roseMid}` }} whileTap={{ scale: 0.96 }} onClick={() => router.push("/dashboard/cliente")}
                  style={{ background: C.rose, color: "#f6f4ef", border: "none", cursor: "pointer", padding: "13px 26px", borderRadius: 6, fontSize: "0.83rem", letterSpacing: "0.04em", fontFamily: "var(--font-sans, Inter, sans-serif)", boxShadow: `0 3px 12px ${C.roseBorder}`, display: "flex", alignItems: "center", gap: 7, transition: "box-shadow 0.2s" }}>
                  Explorar Catálogo <ArrowRight size={13} />
                </motion.button>
                <motion.button whileHover={{ borderColor: C.slate, color: C.slateDeep }} whileTap={{ scale: 0.96 }} onClick={() => router.push("/login")}
                  style={{ background: "transparent", color: C.slate, border: `1.5px solid ${C.slateMid}`, cursor: "pointer", padding: "13px 26px", borderRadius: 6, fontSize: "0.83rem", letterSpacing: "0.04em", fontFamily: "var(--font-sans, Inter, sans-serif)", transition: "border-color 0.2s, color 0.2s" }}>
                  Iniciar sesión
                </motion.button>
              </motion.div>

              {/* stats row */}
              <motion.div variants={d(0.26)} className="hero-stats" style={{ display: "flex", gap: "clamp(16px,3.5vw,34px)", marginTop: 40 }}>
                {[{ num: "50%", label: "Menos errores" }, { num: "3", label: "Roles de usuario" }, { num: "10+", label: "Módulos ERP" }].map((s, i) => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2, paddingRight: i < 2 ? "clamp(12px,3vw,30px)" : 0, borderRight: i < 2 ? `1px solid ${C.slateBorder}` : "none" }}>
                    <span style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "2.1rem", fontWeight: 600, color: C.rose, lineHeight: 1 }}>{s.num}</span>
                    <span style={{ fontSize: "0.74rem", color: C.slate, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 400 }}>{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* CARD STACK — más grande, tercera card, sin espacio vacío */}
            <motion.div className="hero-visual-wrap" initial="hidden" animate="show" variants={slideV} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: 380, height: 480 }}>

                {/* Back card — ventas */}
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} whileHover={{ rotate: 2, y: -12 }}
                  style={{ position: "absolute", top: 0, right: 0, width: 236, height: 300, borderRadius: 16, background: `linear-gradient(145deg, #708090 0%, #4a5568 100%)`, transform: "rotate(8deg)", boxShadow: `0 24px 56px rgba(112,128,144,0.40), 0 6px 16px rgba(112,128,144,0.22)`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24, color: "#f6f4ef", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,rgba(246,244,239,0.04) 0,rgba(246,244,239,0.04) 1px,transparent 1px,transparent 44px)", borderRadius: 16 }} />
                  <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: "rgba(183,110,121,0.14)" }} />
                  <div style={{ position: "absolute", top: 20, left: 20, width: 32, height: 32, borderRadius: 8, background: "rgba(183,110,121,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>✦</div>
                  {/* mini bar chart */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 14, paddingTop: 48 }}>
                    {[40, 60, 45, 75, 55, 90, 70].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: h * 0.5, borderRadius: 3, background: i === 5 ? "rgba(183,110,121,0.90)" : "rgba(246,244,239,0.25)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "0.60rem", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 5 }}>Ventas del mes</div>
                  <div style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "1.6rem", fontWeight: 600, color: "#f6f4ef", lineHeight: 1 }}>$284,500</div>
                  <div style={{ fontSize: "0.64rem", opacity: 0.55, marginTop: 4 }}>MXN · ↑ 18% este mes</div>
                </motion.div>

                {/* Main product card — white */}
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} whileHover={{ y: -12 }}
                  style={{ position: "absolute", top: 40, left: 18, width: 292, height: 382, borderRadius: 16, background: C.white, border: `1px solid ${C.slateBorder}`, boxShadow: `0 20px 56px ${C.sageLg}, 0 4px 14px ${C.sageSm}, inset 0 1px 0 rgba(255,255,255,1)`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* product image */}
                  <div style={{ height: 196, position: "relative", background: "linear-gradient(135deg,#ede8e1 0%,#e2d9ce 50%,#d6cec2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: "3.8rem", filter: "drop-shadow(0 5px 12px rgba(112,128,144,0.22))", color: C.slate }}>
                      <Gem size={80} strokeWidth={1} />
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to top,rgba(255,255,255,0.97),transparent)" }} />
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)", borderRadius: 4, padding: "3px 9px", fontSize: "0.58rem", color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>En stock</div>
                    <div style={{ position: "absolute", top: 12, left: 12, background: C.roseBg, border: `1px solid ${C.roseBorder}`, borderRadius: 4, padding: "3px 9px", fontSize: "0.58rem", color: C.rose, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>Nuevo</div>
                  </div>
                  {/* card body */}
                  <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "1.28rem", fontWeight: 600, color: C.slateDeep, marginBottom: 2, letterSpacing: "-0.01em" }}>Anillo Stella</div>
                    <div style={{ fontSize: "0.72rem", color: C.slate, marginBottom: 8 }}>Colección Primavera 2025 · Talla 7</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: "0.96rem", color: C.rose, fontWeight: 600 }}>$12,500 MXN</div>
                      <div style={{ color: C.rose, fontSize: "0.72rem", letterSpacing: 1 }}>★★★★★ <span style={{ color: C.slate, fontSize: "0.68rem" }}>(24)</span></div>
                    </div>
                    <div style={{ height: 1, background: C.slateBorder, marginBottom: 10 }} />
                    {/* specs */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {["Oro 18k", "Brillante", "Artesanal"].map((tag) => (
                        <span key={tag} style={{ fontSize: "0.60rem", color: C.slate, background: C.slateIcon, border: `1px solid ${C.slateBorder}`, borderRadius: 3, padding: "2px 7px" }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      <div style={{ flex: 1, background: C.rose, borderRadius: 5, padding: "9px 0", textAlign: "center", fontSize: "0.72rem", color: "#f6f4ef", letterSpacing: "0.06em", fontWeight: 500 }}>Comprar ahora</div>
                      <div style={{ width: 36, height: 34, borderRadius: 5, border: `1.5px solid ${C.slateBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", color: C.slate }}>♡</div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom-left: stock pill */}
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} whileHover={{ y: -8 }}
                  style={{ position: "absolute", bottom: 48, left: 0, width: 162, height: 66, borderRadius: 12, background: C.white, border: `1px solid ${C.slateBorder}`, transform: "rotate(-4deg)", boxShadow: `0 10px 28px ${C.sageLg}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.slateIcon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0, border: `1px solid ${C.slateBorder}` }}>
                    <Package size={16} color={C.slate} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.60rem", color: C.slate, textTransform: "uppercase", letterSpacing: "0.10em" }}>Inventario</div>
                    <div style={{ fontSize: "0.90rem", fontWeight: 600, color: C.slateDeep }}>48 piezas</div>
                  </div>
                </motion.div>

                {/* Bottom-right: pedido confirmado */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.4, ease: [0.22,1,0.36,1] }}
                  style={{ position: "absolute", bottom: 0, right: 0, width: 158, height: 60, borderRadius: 12, background: C.white, border: `1px solid ${C.slateBorder}`, boxShadow: `0 8px 22px ${C.sageLg}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(140,151,104,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, border: `1px solid rgba(140,151,104,0.25)` }}>
                    <Check size={16} color={C.sage} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.60rem", color: C.slate, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pedido</div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: C.slateDeep }}>Confirmado</div>
                  </div>
                </motion.div>

                {/* Notification dot */}
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 320 }}
                  style={{ position: "absolute", top: 36, left: 14, width: 22, height: 22, borderRadius: "50%", background: C.rose, color: "#f6f4ef", fontSize: "0.58rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.white}` }}>
                  3
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ FEATURES ══════════ */}
        <section id="modulos" style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Lo que hace" accent="diferente" after="a Stella" sub="Cada funcionalidad diseñada para resolver un problema real de la joyería artesanal." />
              <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(10px,1.6vw,16px)" }}>
                {features.map((f) => <FeatureCard key={f.title} {...f} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.slateMid},transparent)`, maxWidth: 1200, margin: "0 auto" }} />

        {/* ══════════ ROLES ══════════ */}
        <section id="usuarios" style={{ padding: SP, background: C.bg }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Una plataforma para" accent="cada rol" sub="Accesos, vistas y herramientas diseñadas para el administrador, distribuidor y comprador." />
              <div className="roles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(12px,2vw,18px)" }}>
                {roles.map((r) => <RoleCard key={r.title} {...r} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ MODULES ══════════ */}
        <section style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Módulos" accent="funcionales" sub="Independientes y escalables — activa solo lo que tu negocio necesita." />
              <div className="mod-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(9px,1.5vw,14px)" }}>
                {modules.map((m) => <ModuleCard key={m.name} {...m} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        {/* En la imagen esta sección tiene fondo slate oscuro — mantenemos ese contraste */}
        <section style={{ padding: `clamp(40px,5vw,60px) clamp(20px,5vw,52px)`, background: "#4a5568", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(246,244,239,0.05) 1px, transparent 1px)`, backgroundSize: "36px 36px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(246,244,239,0.10)" }} />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV} className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(16px,4vw,40px)", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {statsData.map((st) => (
              <motion.div key={st.label} variants={scaleV} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "clamp(2.2rem,4.2vw,3.2rem)", fontWeight: 600, color: "#f6f4ef", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.02em" }}>{st.num}</div>
                <div style={{ width: 24, height: 2, background: C.rose, margin: "0 auto 8px", borderRadius: 1 }} />
                <div style={{ fontSize: "0.67rem", color: "rgba(246,244,239,0.60)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{st.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════ TECH ══════════ */}
        <section id="tecnologia" style={{ padding: SP, background: C.bg }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Construido con" accent="tecnología de vanguardia" />
              <motion.div variants={containerV} style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", maxWidth: 820, margin: "0 auto" }}>
                {techStack.map((tech) => (
                  <motion.div key={tech} variants={fadeV}
                    whileHover={{ borderColor: C.slate, color: C.slateDeep, y: -2 }}
                    transition={{ duration: 0.18 }}
                    style={{ background: C.white, borderRadius: 5, padding: "7px 16px", border: `1px solid ${C.slateBorder}`, fontSize: "0.75rem", color: C.slate, cursor: "default", boxShadow: `0 1px 5px ${C.sageSm}`, display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.sage, display: "inline-block", flexShrink: 0 }} />
                    {tech}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ REVIEWS ══════════ */}
        <section style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Lo que dicen" accent="Nuestros Clientes" sub="Escuchamos cada palabra de quienes confían en nosotros para sus momentos inolvidables." />
              <div className="rev-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,1.6vw,16px)" }}>
                {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        {/* Como la barra inferior de la imagen: fondo slate oscuro, texto f6f4ef, botón rose */}
        <section id="contacto" style={{ padding: `clamp(36px,4.5vw,52px) clamp(20px,5vw,52px)`, background: "#4a5568", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(246,244,239,0.10)" }} />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              {/* left */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <motion.p variants={d(0)} style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(246,244,239,0.45)", marginBottom: 8, fontFamily: "var(--font-subtitle)" }}>
                  Únete al proyecto
                </motion.p>
                <motion.h2 variants={d(0.06)} style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "clamp(1.7rem,3.4vw,2.8rem)", fontWeight: 500, color: "#f6f4ef", lineHeight: 1.18, letterSpacing: "-0.01em", margin: 0 }}>
                  Descubre tu{" "}
                  <em style={{ fontStyle: "italic", color: C.rose }}>brillo interior</em>
                </motion.h2>
                <motion.p variants={d(0.12)} style={{ fontSize: "0.92rem", lineHeight: 1.68, color: "rgba(246,244,239,0.60)", marginTop: 10, fontWeight: 400, maxWidth: 400 }}>
                  Explora nuestro catálogo y encuentra esa pieza que hablará por ti más allá de una sola palabra.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{ padding: "clamp(16px,2vw,22px) clamp(20px,5vw,52px)", background: "#3d4a5c", borderTop: `1px solid rgba(246,244,239,0.07)` }}>
          <div className="footer-flex" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Image src={LogoM} alt="Stella" width={86} height={26} style={{ objectFit: "contain", opacity: 0.70, filter: "brightness(10)" }} />
            <p style={{ fontSize: "0.68rem", color: "rgba(246,244,239,0.38)", margin: 0 }}>
              © 2025 Stella Joyería Artesanal · Proyecto ERP Web
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacidad", "Términos", "Docs"].map((link) => (
                <a key={link} href="#" className="foot-link" style={{ fontSize: "0.68rem", color: "rgba(246,244,239,0.40)", textDecoration: "none", transition: "color 0.2s" }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}