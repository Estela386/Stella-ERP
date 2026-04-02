"use client";

import Link from "next/link";
import logo from "@assets/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  BarChart3,
  LogOut,
  LayoutListIcon,
  PackageIcon,
  ChevronRight,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BiMoney } from "react-icons/bi";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/app/(auth)/actions";
import { Usuario } from "@/lib/models";

// ─── Design tokens Stella ─────────────────────────────────
const ROSE  = "#b76e79";
const DEEP  = "#4a5568";
const BG    = "#f6f4ef";

// ─── Menú con roles permitidos ────────────────────────────
const menuItems = [
  { label: "Inicio",       href: "/dashboard/inicio",                icon: LayoutDashboard, roles: [1, 3] },
  { label: "Inventario",   href: "/dashboard/inicio/inventarios",   icon: Boxes,           roles: [1] },
  { label: "Consignación", href: "/dashboard/inicio/consignaciones",icon: ShoppingCart,    roles: [1, 3] },
  { label: "Pedidos",      href: "/dashboard/inicio/pedidos",       icon: PackageIcon,     roles: [1, 3] },
  { label: "Materiales",   href: "/dashboard/inicio/materials",     icon: LayoutListIcon,  roles: [1] },
  { label: "Cuentas",      href: "/accounts",                       icon: BiMoney,         roles: [1, 3] },
  { label: "Reportes",     href: "/dashboard/inicio/reports",       icon: BarChart3,       roles: [1, 3] },
];

export default function SidebarMenu() {
  const pathname = usePathname();
  const router   = useRouter();
  const { usuario, loading } = useAuth();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [shopHovered, setShopHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const userType = usuario?.id_rol || 2;

  useEffect(() => {
    if (!loading && usuario?.id_rol === 2) {
      router.push("/dashboard/cliente");
    }
  }, [loading, usuario, router]);

  if (!loading && !usuario) {
    // Redirigir a login si no hay usuario (opcional, pero mejora la seguridad)
    // router.push("/login");
  }

  const filteredMenu = menuItems.filter(item => item.roles.includes(Number(userType)));

  const roleLabel =
    userType === 1 ? "Administrador" :
    userType === 3 ? "Mayorista" : "Cliente";

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          .sk { animation: pulse 1.6s ease-in-out infinite; background: rgba(246,244,239,0.15); border-radius: 8px; }
        `}</style>
        <aside 
          className="flex"
          style={{
          width: 260,
          position: "fixed", top: 0, left: 0,
          minHeight: "100vh",
          background: `linear-gradient(165deg, #4a5568 0%, #3d4a5c 100%)`,
          display: "flex", flexDirection: "column",
          borderRadius: "0 24px 24px 0",
          boxShadow: "6px 0 32px rgba(140,151,104,0.18)",
          padding: "24px 12px",
          gap: 12,
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="sk" style={{ height: 44 }} />
          ))}
        </aside>
      </>
    );
  }

  // ── No mostrar si es cliente o no hay usuario ──
  if (!usuario || Number(usuario?.id_rol) === 2) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .sidebar-item { animation: fadeIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .logout-btn:hover { color: ${ROSE} !important; background: rgba(183,110,121,0.08) !important; border-color: rgba(183,110,121,0.2) !important; }
        .logout-btn:hover .logout-icon { transform: translateX(2px); }
        .logout-icon { transition: transform 0.18s ease; }
        
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: #708090 transparent;
        }
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background-color: #708090;
          border-radius: 4px;
        }
        .sidebar-nav::-webkit-scrollbar-button {
          display: none;
        }

        /* ── Mobile specific ── */
        .stella-nav-label {
          display: inline-block !important;
          opacity: 1 !important;
          visibility: visible !important;
          color: #f6f4ef !important;
          font-family: var(--font-sans, Inter, sans-serif) !important;
        }

        /* ── Mobile specific ── */
        @media (max-width: 768px) {
          .sidebar-aside {
            position: fixed !important;
            left: 0; top: 0; bottom: 0;
            width: 280px !important;
            z-index: 1000;
            border-radius: 0 16px 16px 0 !important;
            background: rgba(45, 55, 72, 0.95) !important;
            backdrop-filter: blur(12px) !important;
            border-right: 1.5px solid rgba(183, 110, 121, 0.25) !important;
            display: flex !important;
          }
          .label-visible {
            display: none !important; /* Limpiar clase vieja */
          }
          /* Ocultar forzosamente cualquier residuo de aside no intencional */
          aside:not(.sidebar-aside) {
            display: none !important;
          }
          /* Empujar el contenido hacia abajo para que la barra no estorbe */
          main {
            padding-top: 65px !important;
          }
          .mobile-nav-bar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 60px;
            background: rgba(246, 244, 239, 0.85);
            backdrop-filter: blur(10px);
            border-bottom: 1.5px solid rgba(183, 110, 121, 0.1);
            padding: 0 16px;
            z-index: 900;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          }
        }
      `}</style>

      {/* ── Barra de navegación móvil (Solo móvil) ── */}
      <div className="mobile-nav-bar md:hidden">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src={logo}
            alt="Stella Logo"
            width={120}
            height={40}
            style={{ objectFit: "contain", filter: "brightness(0)" }}
          />
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "rgba(183, 110, 121, 0.08)",
            border: "none",
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ROSE,
            cursor: "pointer",
          }}
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              zIndex: 950,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="sidebar-aside"
            style={{
              width: 280,
              height: "100vh",
              background: `linear-gradient(165deg, ${DEEP} 0%, #3d4a5c 60%, #2d3748 100%)`,
              display: "flex", flexDirection: "column",
              borderRadius: "0 24px 24px 0",
              boxShadow: "6px 0 32px rgba(74,85,104,0.3)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              position: "fixed", top: 0, left: 0,
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <SidebarContent 
              usuario={usuario} roleLabel={roleLabel} pathname={pathname} 
              router={router} filteredMenu={filteredMenu} hoveredHref={hoveredHref} 
              setHoveredHref={setHoveredHref} shopHovered={shopHovered} setShopHovered={setShopHovered}
              onClose={() => setIsOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Versión de escritorio (Normal) */}
      <aside
        className="hidden md:flex"
        style={{
          width: 260,
          minHeight: "100vh",
          background: `linear-gradient(165deg, ${DEEP} 0%, #3d4a5c 60%, #2d3748 100%)`,
          display: "flex", flexDirection: "column",
          borderRadius: "0 24px 24px 0",
          boxShadow: "6px 0 32px rgba(74,85,104,0.25), 2px 0 8px rgba(140,151,104,0.1)",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <SidebarContent 
          usuario={usuario} roleLabel={roleLabel} pathname={pathname} 
          router={router} filteredMenu={filteredMenu} hoveredHref={hoveredHref} 
          setHoveredHref={setHoveredHref} shopHovered={shopHovered} setShopHovered={setShopHovered}
        />
      </aside>
    </>
  );
}

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: number[];
}

interface SidebarContentProps {
  usuario: Usuario | null;
  roleLabel: string;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  filteredMenu: MenuItem[];
  hoveredHref: string | null;
  setHoveredHref: (href: string | null) => void;
  shopHovered: boolean;
  setShopHovered: (hovered: boolean) => void; 
  onClose?: () => void;
}

// ─── Sub-componente para evitar duplicar código ──────────────────────────────
function SidebarContent({
  usuario, roleLabel, pathname, router, filteredMenu, hoveredHref,
  setHoveredHref, shopHovered, setShopHovered, onClose
}: SidebarContentProps) {
  return (
    <>
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(183,110,121,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(140,151,104,0.06)", pointerEvents: "none" }} />

      {/* ── Logo ── */}
      <div style={{
        padding: "clamp(16px,2vw,28px) clamp(12px,1.5vw,20px)",
        borderBottom: "1px solid rgba(246,244,239,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8,
      }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <Image
            src={logo}
            alt="Stella Logo"
            width={onClose ? 140 : 130}
            height={onClose ? 50 : 130}
            style={{ 
              filter: "brightness(0) invert(1)", 
              opacity: onClose ? 0.9 : 0.85, 
              margin: "0 auto",
              objectFit: "contain"
            }}
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex md:hidden"
            style={{
              background: "none", border: "none", color: "rgba(246,244,239,0.5)",
              cursor: "pointer", padding: 8
            }}
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* ── Navegación ── */}
      <nav 
        className="sidebar-nav"
        style={{ flex: 1, padding: "clamp(10px,1.5vw,16px) clamp(8px,1.2vw,14px)", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", overflowX: "hidden" }}
      >
        <p className="hidden md:block" style={{
          fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(246,244,239,0.35)", margin: "4px 8px 10px",
        }}>
          Menú principal
        </p>

        {filteredMenu.map((item: MenuItem, i: number) => {
          const Icon = item.icon;
          // Active if matches exactly or if it's a subroute (except for Inicio)
          const active = item.href === "/dashboard/inicio" 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          const hovered = hoveredHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-item"
              style={{ animationDelay: `${i * 0.06}s`, textDecoration: "none" }}
              onMouseEnter={() => setHoveredHref(item.href)}
              onMouseLeave={() => setHoveredHref(null)}
              onClick={onClose}
            >
              <div style={{
                position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 12,
                padding: "clamp(10px,1.1vw,13px) 14px", borderRadius: 12,
                background: active ? ROSE : hovered ? "rgba(246,244,239,0.08)" : "transparent",
                boxShadow: active ? "0 4px 14px rgba(183,110,121,0.35)" : "none",
                transition: "all 0.18s cubic-bezier(.22,1,.36,1)",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: "0 3px 3px 0", background: "rgba(246,244,239,0.8)" }} />}
                
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: active ? "rgba(255,255,255,0.18)" : hovered ? "rgba(183,110,121,0.15)" : "rgba(246,244,239,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={16} style={{ color: active ? BG : hovered ? ROSE : "rgba(246,244,239,0.65)" }} />
                </div>

                <span 
                  className="stella-nav-label" 
                  style={{
                  flex: 1, 
                  fontSize: "0.88rem", 
                  fontWeight: active ? 600 : 400,
                  color: active ? BG : "#f6f4ef", 
                  transition: "all 0.2s ease", 
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  opacity: 1,
                }}>
                  {item.label}
                </span>

                <ChevronRight size={13} className="hidden md:block" style={{
                  display: active ? "none" : "block", color: "rgba(246,244,239,0.3)", opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-4px)", transition: "all 0.18s ease",
                }} />
              </div>
            </Link>
          );
        })}

        <div style={{ height: 1, background: "rgba(246,244,239,0.08)", margin: "8px 4px" }} />

        <button
          onClick={() => router.push("/dashboard/cliente")}
          onMouseEnter={() => setShopHovered(true)}
          onMouseLeave={() => setShopHovered(false)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "clamp(10px,1.1vw,13px) 14px", borderRadius: 12,
            border: `1px solid ${shopHovered ? "rgba(183,110,121,0.4)" : "rgba(246,244,239,0.1)"}`,
            background: shopHovered ? "rgba(183,110,121,0.12)" : "rgba(246,244,239,0.04)",
            cursor: "pointer", transition: "all 0.18s ease", width: "100%",
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: shopHovered ? "rgba(183,110,121,0.2)" : "rgba(246,244,239,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShoppingBag size={16} style={{ color: shopHovered ? ROSE : "rgba(246,244,239,0.5)" }} />
          </div>
          <span className="stella-nav-label" style={{ flex: 1, fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.88rem", fontWeight: 400, color: shopHovered ? ROSE : "rgba(246,244,239,0.45)", whiteSpace: "nowrap", textAlign: "left" }}>
            Ir a la tienda
          </span>
        </button>
      </nav>

      {/* ── Footer usuario ── */}
      <div style={{ padding: "clamp(12px,1.5vw,18px) clamp(8px,1.2vw,14px)", borderTop: "1px solid rgba(246,244,239,0.08)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(183,110,121,0.2)", border: "1px solid rgba(183,110,121,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.1rem", fontWeight: 600, color: ROSE, fontStyle: "italic" }}>
              {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div style={{ overflow: "hidden", flex: 1 }} className="stella-nav-label">
            <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.88rem", fontWeight: 500, color: "rgba(246,244,239,0.85)", margin: 0, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{usuario?.nombre || roleLabel}</p>
            <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.68rem", color: "rgba(246,244,239,0.38)", margin: 0 }}>{roleLabel}</p>
          </div>
        </div>

        <button onClick={logout} className="logout-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px", borderRadius: 10, border: "1px solid rgba(246,244,239,0.1)", background: "rgba(246,244,239,0.04)", color: "rgba(246,244,239,0.45)", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.18s ease" }}>
          <LogOut size={16} className="logout-icon" />
          <span className="stella-nav-label">Cerrar sesión</span>
        </button>
      </div>
    </>
  );
}