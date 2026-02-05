"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  BarChart3,
  LogOut,
  LayoutListIcon,
} from "lucide-react";

const menuItems = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventario", href: "/dashboard/inventarios", icon: Boxes },
  {
    label: "Consignaciones",
    href: "/dashboard/consignaciones",
    icon: ShoppingCart,
  },
  { label: "Materiales", href: "/dashboard/materiales", icon: LayoutListIcon },
  { label: "Reportes", href: "/dashboard/reportes", icon: BarChart3 },
];

export default function SidebarMenu() {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-64 min-h-screen
        bg-[#708090]
        text-[#f6f4ef]
        flex flex-col
        shadow-[6px_0_30px_rgba(140,151,102,0.35)]
        animate-[slideIn_0.6s_ease-out]
        perspective-[1200px]
        preserve-3d
      "
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#f6f4ef]/15 animate-float">
        <h1 className="text-lg font-semibold tracking-wide">Stella Joyería</h1>
      </div>

      {/* Menú */}
      <nav className="px-3 py-5 space-y-3 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`
                group relative
                flex items-center gap-3 px-4 py-3 rounded-xl
                transform-gpu
                transition-all duration-300 ease-out
                animate-[slideIn_0.5s_ease-out]
                ${
                  active
                    ? `
                      bg-[#B76E79]
                      text-[#f6f4ef]
                      shadow-accent
                      translate-z-10
                    `
                    : `
                      text-[#f6f4ef]/80
                      hover:bg-[#f6f4ef]/10
                      hover:-translate-y-1
                      hover:rotate-x-6
                      hover:shadow-medium
                    `
                }
              `}
            >
              {/* Indicador activo */}
              {active && (
                <span
                  className="
                    absolute left-0 top-1/2 -translate-y-1/2
                    h-8 w-1 rounded-full
                    bg-[#f6f4ef]
                  "
                />
              )}

              {/* Brillo superior */}
              <span
                className="
                  pointer-events-none absolute inset-x-2 top-0 h-px
                  bg-white/40
                  opacity-0 group-hover:opacity-100
                  transition
                "
              />

              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#f6f4ef]/15">
        <div className="text-sm font-medium">Administrador</div>

        <button
          className="
            mt-4 flex items-center gap-2 text-sm
            text-[#f6f4ef]/70
            hover:text-[#B76E79]
            hover:translate-x-1
            transition
          "
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
