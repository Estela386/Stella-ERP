"use client";

import Link from "next/link";
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
} from "lucide-react";
import Image from "next/image";
import { BiMoney } from "react-icons/bi";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/app/(auth)/actions";

// ─── Design tokens Stella ─────────────────────────────────
const ROSE  = "#b76e79";
const SLATE = "#708090";
const DEEP  = "#4a5568";
const SAGE  = "#8c9768";
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

  const userType = usuario?.id_rol || 2;

  useEffect(() => {
    if (!loading && usuario?.id_rol === 2) {
      router.push("/dashboard/cliente");
    }
  }, [loading, usuario, router]);

  const filteredMenu = menuItems.filter(item => item.roles.includes(userType));

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
        <aside style={{
          width: "clamp(72px, 16vw, 256px)",
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

  if (usuario?.id_rol === 2) return null;

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
      `}</style>

      <aside
        style={{
          width: "clamp(72px, 16vw, 256px)",
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
        {/* Blobs decorativos */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(183,110,121,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(140,151,104,0.06)", pointerEvents: "none" }} />

        {/* ── Logo ── */}
        <div style={{
          padding: "clamp(16px,2vw,28px) clamp(12px,1.5vw,20px)",
          borderBottom: "1px solid rgba(246,244,239,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 8,
        }}>
          {/* Logo imagen + label — solo md+ */}
          <div className="hidden md:block" style={{ textAlign: "center" }}>
            <Image
              src="/logo.png"
              alt="Stella Logo"
              width={120}
              height={120}
              style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
            />
          </div>

          {/* Ícono S — solo mobile */}
          <div className="flex md:hidden" style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(183,110,121,0.15)",
            border: "1px solid rgba(183,110,121,0.3)",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 600, color: ROSE, fontStyle: "italic" }}>
              S
            </span>
          </div>
        </div>

        {/* ── Navegación ── */}
        <nav 
          style={{ 
            flex: 1, 
            padding: "clamp(10px,1.5vw,16px) clamp(8px,1.2vw,14px)", 
            display: "flex", 
            flexDirection: "column", 
            gap: 4,
            overflowY: "auto",
            overflowX: "hidden"
          }}
          className="sidebar-nav"
        >
          <p className="hidden md:block" style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.58rem", fontWeight: 500,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(246,244,239,0.35)",
            margin: "4px 8px 10px",
          }}>
            Menú principal
          </p>

          {filteredMenu.map((item, i) => {
            const Icon    = item.icon;
            const active  = pathname === item.href;
            const hovered = hoveredHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-item"
                style={{ animationDelay: `${i * 0.06}s`, textDecoration: "none" }}
                onMouseEnter={() => setHoveredHref(item.href)}
                onMouseLeave={() => setHoveredHref(null)}
              >
                <div style={{
                  position: "relative",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "clamp(8px,1vw,11px) clamp(8px,1.2vw,14px)",
                  borderRadius: 12,
                  background: active ? ROSE : hovered ? "rgba(246,244,239,0.08)" : "transparent",
                  boxShadow: active ? "0 4px 14px rgba(183,110,121,0.35)" : "none",
                  transition: "all 0.18s cubic-bezier(.22,1,.36,1)",
                  overflow: "hidden",
                }}>
                  {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: "0 3px 3px 0", background: "rgba(246,244,239,0.8)" }} />}
                  {active && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />}

                  {/* Icono */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: active ? "rgba(255,255,255,0.18)" : hovered ? "rgba(183,110,121,0.15)" : "rgba(246,244,239,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background 0.18s",
                  }}>
                    <Icon size={16} style={{ color: active ? BG : hovered ? ROSE : "rgba(246,244,239,0.65)" }} />
                  </div>

                  {/* Label — solo md+ */}
                  <span className="hidden md:block" style={{
                    flex: 1,
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.84rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? BG : hovered ? "rgba(246,244,239,0.9)" : "rgba(246,244,239,0.6)",
                    transition: "color 0.18s",
                    whiteSpace: "nowrap",
                  }}>
                    {item.label}
                  </span>

                  {/* Chevron hover — solo md+ */}
                  {!active && (
                    <ChevronRight size={13} className="hidden md:block" style={{
                      color: "rgba(246,244,239,0.3)",
                      opacity: hovered ? 1 : 0,
                      transform: hovered ? "translateX(0)" : "translateX(-4px)",
                      transition: "all 0.18s ease",
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              </Link>
            );
          })}

          {/* ── Separador ── */}
          <div style={{ height: 1, background: "rgba(246,244,239,0.08)", margin: "8px 4px" }} />

          {/* ── Botón ir a tienda ── */}
          <button
            onClick={() => router.push("/dashboard/cliente")}
            onMouseEnter={() => setShopHovered(true)}
            onMouseLeave={() => setShopHovered(false)}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "clamp(8px,1vw,11px) clamp(8px,1.2vw,14px)",
              borderRadius: 12,
              border: `1px solid ${shopHovered ? "rgba(183,110,121,0.4)" : "rgba(246,244,239,0.1)"}`,
              background: shopHovered ? "rgba(183,110,121,0.12)" : "rgba(246,244,239,0.04)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              width: "100%",
            }}
          >
            {/* Icono */}
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: shopHovered ? "rgba(183,110,121,0.2)" : "rgba(246,244,239,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.18s",
            }}>
              <ShoppingBag size={16} style={{ color: shopHovered ? ROSE : "rgba(246,244,239,0.5)" }} />
            </div>

            {/* Label — solo md+ */}
            <span className="hidden md:block" style={{
              flex: 1,
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.84rem",
              fontWeight: 400,
              color: shopHovered ? ROSE : "rgba(246,244,239,0.45)",
              transition: "color 0.18s",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}>
              Ir a la tienda
            </span>

            {/* Flecha — solo md+ */}
            <ChevronRight size={13} className="hidden md:block" style={{
              color: shopHovered ? ROSE : "rgba(246,244,239,0.2)",
              opacity: shopHovered ? 1 : 0.5,
              transition: "all 0.18s ease",
              flexShrink: 0,
            }} />
          </button>
        </nav>

        {/* ── Footer usuario ── */}
        <div style={{
          padding: "clamp(12px,1.5vw,18px) clamp(8px,1.2vw,14px)",
          borderTop: "1px solid rgba(246,244,239,0.08)",
        }}>

          {/* Avatar — SOLO MOBILE */}
          <div className="flex md:hidden" style={{
            alignItems: "center", justifyContent: "center",
            marginBottom: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(183,110,121,0.2)",
              border: "1px solid rgba(183,110,121,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.05rem", fontWeight: 600, color: ROSE, fontStyle: "italic" }}>
                {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>

          {/* Info usuario completa — solo md+ */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "rgba(183,110,121,0.2)",
              border: "1px solid rgba(183,110,121,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1rem", fontWeight: 600, color: ROSE, fontStyle: "italic" }}>
                {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.82rem", fontWeight: 500,
                color: "rgba(246,244,239,0.85)",
                margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {usuario?.nombre || roleLabel}
              </p>
              <p style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.64rem",
                color: "rgba(246,244,239,0.38)",
                margin: 0,
              }}>
                {roleLabel}
              </p>
            </div>
          </div>

          {/* Botón logout */}
          <button
            onClick={logout}
            className="logout-btn"
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "center",
              gap: 8, width: "100%",
              padding: "9px 12px", borderRadius: 10,
              border: "1px solid rgba(246,244,239,0.1)",
              background: "rgba(246,244,239,0.04)",
              color: "rgba(246,244,239,0.45)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.8rem", cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            <LogOut size={15} className="logout-icon" />
            <span className="hidden md:block">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}