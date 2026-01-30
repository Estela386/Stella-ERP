"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ClientHeader() {
  const router = useRouter();

  const navItems = [
    { label: "Inicio", href: "/dashboard/cliente" },
    { label: "Catálogo", href: "/dashboard/cliente/catalogo" },
    { label: "Reseñas", href: "/dashboard/cliente/resenas" },
    { label: "Carrito", href: "/dashboard/cliente/carrito" },
    { label: "Contacto", href: "/dashboard/cliente/contacto" },
    { label: "Redes", href: "/dashboard/cliente/redes" },
  ];

  return (
    <header className="border-b border-[#d6c1b1] bg-[#d6c1b1]">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard/cliente")}
          >
            <div className="w-8 h-8 bg-[#7c5c4a] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-2xl font-light text-[#7c5c4a]">Stella</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="text-sm text-[#7c5c4a] hover:text-[#5c4a37] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/cliente/carrito")}
              className="relative text-[#7c5c4a] hover:text-[#5c4a37] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => router.push("/dashboard/cliente/perfil")}
              className="text-[#7c5c4a] hover:text-[#5c4a37] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
