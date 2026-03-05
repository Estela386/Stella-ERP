"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  BarChart3,
  LogOut,
  LayoutListIcon,
  PackageIcon,
} from "lucide-react";
import Image from "next/image";
import { BiMoney } from "react-icons/bi";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/app/(auth)/actions";

/* 🔹 Menú con roles permitidos */
const menuItems = [
  {
    label: "Inicio",
    href: "/dashboard/inicio",
    icon: LayoutDashboard,
    roles: [1, 3],
  },
  {
    label: "Inventario",
    href: "/dashboard/inventarios",
    icon: Boxes,
    roles: [1],
  },
  {
    label: "Consignación",
    href: "/dashboard/consignaciones",
    icon: ShoppingCart,
    roles: [1, 3],
  },
  {
    label: "Pedidos",
    href: "/dashboard/pedidos",
    icon: PackageIcon,
    roles: [1, 3],
  },
  { label: "Materiales", href: "/materials", icon: LayoutListIcon, roles: [1] },
  {
    label: "Cuentas",
    href: "/accounts",
    icon: BiMoney,
    roles: [1, 3],
  },
  {
    label: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: [1, 3],
  },
];

export default function SidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, loading } = useAuth();

  const userType = usuario?.id_rol || 2; // Por defecto 2 (Cliente)

  useEffect(() => {
    // Esperar a que se cargue el usuario
    if (!loading && usuario) {
      // Si es cliente, redirigir a su dashboard
      if (usuario.id_rol === 2) {
        router.push("/dashboard/cliente");
      }
    }
  }, [loading, usuario, router]);
  const filteredMenu = menuItems.filter(item => item.roles.includes(userType));

  // Si aún está cargando, mostrar el estado de carga
  if (loading) {
    return (
      <aside
        className="
          w-20 md:w-56 lg:w-64
          min-h-screen
          bg-[#D1BBAA]
          text-[#f6f4ef]
          flex flex-col
          transition-all duration-300
          shadow-[6px_0_30px_rgba(183,110,121,0.35)]
          rounded-r-3xl
          justify-center items-center
        "
      >
        <div className="text-sm text-[#f6f4ef]/70">Cargando...</div>
      </aside>
    );
  }

  // Si es cliente, no renderizar sidebar (se redirigirá en el useEffect)
  if (usuario?.id_rol === 2) {
    return null;
  }

  return (
    <aside
      className="
        w-20 md:w-56 lg:w-64
        min-h-screen
        bg-[#D1BBAA]
        text-[#f6f4ef]
        flex flex-col
        transition-all duration-300
        shadow-[6px_0_30px_rgba(183,110,121,0.35)]
        rounded-r-3xl
      "
    >
      {/* 🔹 Logo */}
      <div className="hidden md:flex p-6 border-b border-[#f6f4ef] flex-col items-center">
        <Image
          src="/logo.png"
          alt="Stella Logo"
          width={100}
          height={100}
          className="mb-2"
        />
      </div>

      {/*  Navegación */}
      <nav className="px-2 md:px-2 py-5 space-y-2 flex-1">
        {filteredMenu.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative
                flex items-center justify-center md:justify-start
                gap-3 px-2 md:px-4 py-3 rounded-xl
                transition-all duration-300
                ${
                  active
                    ? "bg-[#B76E79] text-[#f6f4ef]"
                    : "text-[#f6f4ef]/80 hover:bg-[#f6f4ef]/10"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-[#f6f4ef]" />
              )}

              <Icon size={20} />

              <span className="hidden md:block font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 🔹 Usuario */}
      <div className="p-3 md:p-4 border-t border-[#f6f4ef]/15">
        <div className="hidden md:block text-sm font-medium truncate">
          {usuario?.nombre ||
            (userType === 1
              ? "Administrador"
              : userType === 3
                ? "Mayorista"
                : "Cliente")}
        </div>

        <div className="hidden md:block text-xs text-[#f6f4ef]/60 truncate">
          {userType === 1
            ? "Administrador"
            : userType === 3
              ? "Mayorista"
              : "Cliente"}
        </div>

        <button
          onClick={logout}
          className="
            mt-2 md:mt-4
            flex items-center justify-center md:justify-start
            gap-2 text-sm
            text-[#f6f4ef]/70
            hover:text-[#B76E79]
            transition
          "
        >
          <LogOut size={18} />
          <span className="hidden md:block">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
