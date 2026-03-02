"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PrimaryButton from "@/_components/PrimaryButton";
import SecondaryButton from "../../_components/SecondaryButton";
import Image from "next/image";
import { logout } from "@auth/actions";
import { ShoppingCart, User, LogOut } from "lucide-react";
interface HeaderClientProps {
  user: any; // Cambia esto al tipo correcto de usuario si lo tienes definido
}

export default function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const { id_rol } = user || 0;
  const isClientDashboard = id_rol === 1 || id_rol === 2; // Mostrar nav solo para admin y cliente

  const navItems = [
    { label: "Inicio", href: "/dashboard/cliente" },
    { label: "Catálogo", href: "/dashboard/cliente/catalogo" },
  ];

  useEffect(() => {
    if (userButtonRef.current && isMenuOpen) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <header className="w-full px-6 pt-4">
  {/* CONTENEDOR REDONDEADO */}
  <div
    className="
      bg-[#d6c1b1]
      rounded-2xl
      shadow-lg
      border border-[#cbb2a1]
      flex items-center justify-between
      px-10 py-3
    "
  >
    {/* LOGO */}
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.push("/dashboard/cliente")}
    >
      <Image src="/Logo.png" alt="Stella Logo" width={64} height={64} />
    </div>

    {/* NAV CENTER */}
    {isClientDashboard && (
      <nav className="hidden md:flex gap-8">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="
              text-sm
              text-[#7c5c4a]
              hover:text-[#5c4a37]
              hover:bg-white/30
              transition-all
              px-4 py-2
              rounded-lg
            "
          >
            {item.label}
          </button>
        ))}
      </nav>
    )}

    {/* RIGHT SECTION */}
    <div className="flex gap-4 items-center">
      {isClientDashboard && (
        <>
          {/* CARRITO */}
          <button
            onClick={() => router.push("/dashboard/cliente/carrito")}
            className="
              text-[#7c5c4a]
              hover:bg-white/30
              hover:text-[#5c4a37]
              transition-all
              p-2
              rounded-lg
            "
          >
            <ShoppingCart size={20} />
          </button>

          {/* USER MENU */}
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="
                text-[#7c5c4a]
                hover:bg-white/30
                hover:text-[#5c4a37]
                transition-all
                p-2
                rounded-lg
              "
            >
              <User size={20} />
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="
                  fixed w-48
                  bg-white
                  rounded-xl
                  shadow-2xl
                  border border-[#d6c1b1]
                  overflow-hidden
                "
                style={{
                  top: `${menuPosition.top}px`,
                  right: `${menuPosition.right}px`,
                  zIndex: 9999,
                }}
              >
                <button
                  onClick={() => {
                    router.push("/dashboard/inicio");
                    setIsMenuOpen(false);
                  }}
                  className="
                    w-full text-left px-4 py-3 text-sm
                    text-[#7c5c4a]
                    hover:bg-[#f5e6db]
                    flex items-center gap-2
                  "
                >
                  <User size={16} />
                  ERP
                </button>

                <div className="border-t border-[#e0ccc0]" />

                <button
                  onClick={handleLogout}
                  className="
                    w-full text-left px-4 py-3 text-sm
                    text-[#7c5c4a]
                    hover:bg-[#f5e6db]
                    flex items-center gap-2
                  "
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {!isClientDashboard && (
        <>
          <SecondaryButton
            selected={isLogin}
            disabled={isLogin}
            onClick={() => router.push("/login")}
          >
            Iniciar sesión
          </SecondaryButton>

          <PrimaryButton
            disabled={isRegister}
            onClick={() => router.push("/register")}
          >
            Registrarse
          </PrimaryButton>
        </>
      )}
    </div>
  </div>
</header>
  );
}