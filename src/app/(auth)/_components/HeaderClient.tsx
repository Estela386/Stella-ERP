"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import PrimaryButton from "@/_components/PrimaryButton";
import SecondaryButton from "../../_components/SecondaryButton";
import Image from "next/image";
import { logout } from "@auth/actions";

interface HeaderClientProps {
  user: any;
}

export default function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isClientDashboard = pathname.startsWith("/dashboard/cliente");

  const navItems = [
    { label: "Inicio", href: "/dashboard/cliente" },
    { label: "Catálogo", href: "/dashboard/cliente/catalogo" },
    { label: "Reseñas", href: "/dashboard/cliente/resenas" },
    { label: "Carrito", href: "/dashboard/cliente/carrito" },
    { label: "Contacto", href: "/dashboard/cliente/contacto" },
    { label: "Redes", href: "/dashboard/cliente/redes" },
  ];

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <header className="w-full bg-[#d6c1b1] flex items-center justify-between px-8 py-3">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/dashboard/cliente")}
      >
        <Image src="/logo.png" alt="Stella Logo" width={64} height={64} />
      </div>

      {isClientDashboard ? (
        <nav className="hidden md:flex gap-8">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="text-sm text-[#7c5c4a] hover:text-[#5c4a37] hover:bg-[#7c5c4a] hover:bg-opacity-10 transition-all px-3 py-2 rounded-md !cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}

      <div className="flex gap-2 items-center">
        {isClientDashboard && (
          <button
            onClick={handleLogout}
            className="text-sm text-[#7c5c4a] hover:text-[#5c4a37] hover:bg-[#7c5c4a] hover:bg-opacity-10 transition-all px-3 py-2 rounded-md !cursor-pointer"
          >
            Cerrar sesión
          </button>
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
              className={isRegister ? "opacity-80" : ""}
              disabled={isRegister}
              onClick={() => router.push("/register")}
            >
              Registrarse
            </PrimaryButton>
          </>
        )}
      </div>
    </header>
  );
}
