"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { logout } from "@auth/actions";
import {
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  Package,
  Heart,
  Home,
  Star,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import CartIcon from "@auth/_components/CartIcon";
import { motion, AnimatePresence } from "framer-motion";

// ─── tokens ───────────────────────────────────────────────
const ROSE      = "#B76E79";
const ROSE_BG   = "#FFF0F2";
const ROSE_DARK = "#C0404F";
const SLATE     = "#708090";
const MUTED     = "#9E9A95";
const BORDER    = "#E4E1DB";
const WHITE     = "#FFFFFF";
const DARK      = "#1A1A1A";

// ─── íconos por ruta ──────────────────────────────────────
const NAV_ICONS: Record<string, React.ReactNode> = {
  "/dashboard/cliente":       <Home        size={18} />,
  "categoria=personalizada":  <Sparkles    size={18} />,
  "categoria=nuevos":         <Star        size={18} />,
  "categoria=accesorios":     <Heart       size={18} />,
  "categoria=mayoreo":        <ShoppingBag size={18} />, // This entry is for the old href, keeping it for now as the instruction is ambiguous
  "/dashboard/cliente/mayoreo":       <ShoppingBag size={18} />,
  "/dashboard/cliente/faq":           <HelpCircle  size={18} />,
  "/dashboard/cliente/nosotros":                <MessageCircle size={18} />,
};

function getNavIcon(href: string): React.ReactNode {
  const match = Object.entries(NAV_ICONS).find(([key]) => href.includes(key));
  return match ? match[1] : null;
}

// ─── sub-components ───────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mx-1 mt-4 mb-2">
      <span
        className="text-[11px] font-bold tracking-[1.2px] uppercase whitespace-nowrap"
        style={{ color: ROSE }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "#F0E8E9" }} />
    </div>
  );
}

function NavBtn({
  icon,
  label,
  active = false,
  danger = false,
  badge,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 rounded-2xl border-none cursor-pointer font-medium mb-1 transition-colors duration-150"
      style={{
        padding: "14px 14px",
        fontSize: 16,
        fontWeight: active ? 600 : 500,
        background: active ? ROSE : danger ? ROSE_BG : "transparent",
        color: active ? WHITE : danger ? ROSE_DARK : SLATE,
        fontFamily: "inherit",
      }}
      onMouseEnter={e => {
        if (!active && !danger)
          (e.currentTarget as HTMLButtonElement).style.background = "#F5F0F1";
        if (danger)
          (e.currentTarget as HTMLButtonElement).style.background = "#FFE0E5";
      }}
      onMouseLeave={e => {
        if (!active && !danger)
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        if (danger)
          (e.currentTarget as HTMLButtonElement).style.background = ROSE_BG;
      }}
    >
      {icon && (
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: active ? "rgba(255,255,255,0.2)" : danger ? "#FFE0E5" : "#F5F0F1",
            color: active ? WHITE : danger ? ROSE_DARK : ROSE,
          }}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center"
          style={{
            background: active ? "rgba(255,255,255,0.3)" : ROSE,
            color: WHITE,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="h-px my-1.5" style={{ background: "#EDE9E3" }} />;
}

interface HeaderClientProps {
  user?: any;
}

export default function HeaderClient({ user: userProp }: HeaderClientProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string): boolean => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefQuery) {
      const [key, value] = hrefQuery.split("=");
      return pathname === hrefPath && searchParams.get(key) === value;
    }
    return pathname === hrefPath;
  };

  const { usuario: authUsuario, loading } = useAuth();
  const usuario = userProp || authUsuario;

  const id_rol = usuario?.id_rol || 0;
  const isUserLoaded =
    id_rol !== 0 && id_rol !== undefined && id_rol !== null && !loading;
  const isClientDashboard = id_rol === 1 || id_rol === 2 || id_rol === 3;

  const initials = usuario?.nombre?.charAt(0)?.toUpperCase() || "U";

  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const [cartCount,  setCartCount]  = useState(0);
  const [menuPos,    setMenuPos]    = useState({ top: 0, right: 0 });

  const userMenuRef   = useRef<HTMLDivElement>(null);
  const avatarBtnRef  = useRef<HTMLButtonElement>(null);

  if (pathname === "/login" || pathname === "/register") return null;

  const navItems = [
    { label: "Inicio",               href: "/dashboard/cliente" },
    { label: "Personalizados",       href: "/dashboard/cliente/catalogo?categoria=personalizada" },
    { label: "Nuevos",               href: "/dashboard/cliente/catalogo?categoria=nuevos" },
    { label: "Accesorios",           href: "/dashboard/cliente/catalogo?categoria=accesorios" },
    { label: "Mayoreo",              href: "/dashboard/cliente/mayoreo" },
    { label: "Preguntas frecuentes", href: "/dashboard/cliente/faq" },
    { label: "Contacto",             href: "/dashboard/cliente/nosotros" },
  ];

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("carrito") || "[]");
      setCartCount(cart.length);
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cartUpdated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cartUpdated", update);
    };
  }, []);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target as Node)
      ) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const handleToggleMenu = () => {
    setUserMenu(v => !v);
  };

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  // Si el rol es 0 o no ha cargado, permitimos que el esqueleto del header se vea
  // para evitar que el header "parpadee" o desaparezca en algunas pantallas.

  return (
    <>
      {/* ════════════════════════════════════════════════════
          HEADER — sin backdropFilter para evitar stacking context
          El blur se simula con un pseudo-elemento via CSS
      ════════════════════════════════════════════════════ */}
      <style>{`
        .header-blur-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(250,250,248,0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: -1;
        }
      `}</style>

      <header
        className="header-blur-bg sticky top-0 border-b"
        style={{
          /* ⚠️ SIN backdropFilter aquí — evita crear stacking context */
          background: "transparent",
          borderColor: BORDER,
          zIndex: 50,
          position: "sticky",
          top: 0,
          isolation: "auto", // NO crear stacking context
        }}
      >
        {/* ── TOP BAR ── */}
        <div className="grid grid-cols-3 items-center px-5 md:px-8 py-3">

          {/* Hamburger mobile */}
          <div className="flex items-center">
            <button
              className="flex md:hidden items-center justify-center rounded-xl border cursor-pointer"
              style={{ width: 40, height: 40, borderColor: BORDER, background: WHITE, color: SLATE }}
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Logo */}
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => router.push("/dashboard/cliente")}
          >
            <Image
              src="/LogoM.svg"
              alt="logo"
              width={320}
              height={90}
              className="w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] h-auto object-contain"
            />
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center justify-end gap-3">

            {/* Botón ERP */}
            {id_rol === 1 && (
              <button
                className="hidden sm:flex items-center gap-2 rounded-full border cursor-pointer transition-all duration-200 font-medium"
                style={{ padding: "8px 16px", fontSize: 14, borderColor: BORDER, background: WHITE, color: SLATE }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background  = ROSE;
                  b.style.color       = WHITE;
                  b.style.borderColor = ROSE;
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background  = WHITE;
                  b.style.color       = SLATE;
                  b.style.borderColor = BORDER;
                }}
                onClick={() => router.push("/dashboard/inicio")}
              >
                <LayoutDashboard size={16} />
                ERP
              </button>
            )}

            {/* Carrito */}
            {isClientDashboard && (
              <button
                className="relative cursor-pointer border-none bg-transparent"
                style={{ color: SLATE }}
                onClick={() => router.push("/dashboard/cliente/carrito")}
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-[10px] font-bold rounded-full text-center"
                    style={{ background: ROSE, color: WHITE, padding: "1px 5px", minWidth: 18 }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Avatar */}
            <div className="relative" ref={userMenuRef}>
              <button
                ref={avatarBtnRef}
                className="flex items-center justify-center rounded-full border-none cursor-pointer font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ 
                  width: 40, 
                  height: 40, 
                  background: isUserLoaded ? ROSE : "#E4E1DB", 
                  color: WHITE, 
                  fontSize: 16 
                }}
                onClick={handleToggleMenu}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  initials
                )}
              </button>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: "spring", damping: 24, stiffness: 300 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: 240,
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      borderRadius: 16,
                      overflow: "hidden",
                      zIndex: 9999,
                    }}
                  >
                    {/* Info usuario */}
                    <div
                      className="flex items-center gap-3 p-4"
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                        style={{ width: 38, height: 38, background: ROSE, color: WHITE, fontSize: 15 }}
                      >
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="m-0 font-semibold truncate" style={{ fontSize: 14, color: DARK }}>
                          {usuario?.nombre || "Mi cuenta"}
                        </p>
                        <p className="m-0 truncate" style={{ fontSize: 12, color: MUTED }}>
                          {usuario?.correo || ""}
                        </p>
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="p-2">
                      {isUserLoaded && (
                        <NavBtn 
                          icon={<User size={15} />} 
                          label="Mi perfil" 
                          onClick={() => { router.push("/dashboard/cliente/perfil"); setUserMenu(false); }}
                        />
                      )}
                      {isClientDashboard && (
                        <>
                          <NavBtn 
                            icon={<Package size={15} />} 
                            label="Mis pedidos" 
                            onClick={() => { router.push("/dashboard/cliente/pedidos"); setUserMenu(false); }}
                          />
                          <NavBtn icon={<Heart size={15} />}   label="Favoritos" />
                        </>
                      )}

                      {id_rol === 1 && (
                        <NavBtn
                          icon={<LayoutDashboard size={15} />}
                          label="Dashboard ERP"
                          onClick={() => { router.push("/dashboard/inicio"); setUserMenu(false); }}
                        />
                      )}

                      <Divider />
                      <NavBtn
                        icon={<LogOut size={15} />}
                        label="Cerrar sesión"
                        danger
                        onClick={handleLogout}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── NAV DESKTOP ── */}
        {isClientDashboard && (
          <nav
            className="hidden md:flex justify-center flex-wrap gap-1 px-8 py-3"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            {navItems.map(item => {
              const active = isActive(item.href);
              return (
                <motion.button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full cursor-pointer transition-colors duration-150 font-medium"
                  style={{
                    padding: "8px 20px",
                    fontSize: 14,
                    border: active ? `1.5px solid ${ROSE}` : "1.5px solid transparent",
                    background: active ? ROSE : "transparent",
                    color: active ? WHITE : SLATE,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.color       = ROSE;
                      b.style.background  = "#FFF5F6";
                      b.style.borderColor = "#F0D8DB";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.color       = SLATE;
                      b.style.background  = "transparent";
                      b.style.borderColor = "transparent";
                    }
                  }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        )}

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                style={{ background: "rgba(30,20,20,0.6)", backdropFilter: "blur(4px)" }}
                onClick={() => setMobileMenu(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed top-0 left-0 flex flex-col z-50"
                style={{
                  height: "100dvh",
                  width: "min(85vw, 300px)",
                  background: WHITE,
                  borderRight: `1.5px solid ${BORDER}`,
                  boxShadow: "8px 0 32px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="flex items-center px-5 py-5 flex-shrink-0"
                  style={{ borderBottom: `1.5px solid ${BORDER}`, background: WHITE }}
                >
                  <Image src="/LogoM.svg" alt="logo" width={130} height={44} />
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                  {isClientDashboard && (
                    <>
                      <SectionLabel>Navegación</SectionLabel>
                      {navItems.map(item => {
                        const active = isActive(item.href);
                        return (
                          <NavBtn
                            key={item.label}
                            icon={getNavIcon(item.href)}
                            label={item.label}
                            active={active}
                            onClick={() => { router.push(item.href); setMobileMenu(false); }}
                          />
                        );
                      })}
                      <Divider />
                    </>
                  )}

                  <SectionLabel>Mi cuenta</SectionLabel>

                  {id_rol === 1 && (
                    <NavBtn
                      icon={<LayoutDashboard size={18} />}
                      label="Dashboard ERP"
                      onClick={() => { router.push("/dashboard/inicio"); setMobileMenu(false); }}
                    />
                  )}

                   {isUserLoaded && (
                    <NavBtn 
                      icon={<User size={18} />} 
                      label="Mi perfil" 
                      onClick={() => { router.push("/dashboard/cliente/perfil"); setMobileMenu(false); }}
                    />
                  )}
                  {isClientDashboard && (
                    <>
                      <NavBtn 
                        icon={<Package size={18} />} 
                        label="Mis pedidos" 
                        badge={cartCount} 
                        onClick={() => { router.push("/dashboard/cliente/pedidos"); setMobileMenu(false); }}
                      />
                      <NavBtn icon={<Heart size={18} />}   label="Favoritos" />
                    </>
                  )}

                  <Divider />
                  <NavBtn
                    icon={<LogOut size={18} />}
                    label="Cerrar sesión"
                    danger
                    onClick={handleLogout}
                  />
                </div>

                <div
                  className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
                  style={{ borderTop: `1.5px solid ${BORDER}`, background: "#FAFAF8" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                    style={{ width: 42, height: 42, background: ROSE, color: WHITE, fontSize: 17 }}
                  >
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <p className="m-0 font-semibold truncate" style={{ fontSize: 15, color: DARK }}>
                      {usuario?.nombre || "Mi cuenta"}
                    </p>
                    <p className="m-0 truncate" style={{ fontSize: 12, color: MUTED }}>
                      {usuario?.correo || ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

    </>
  );
}