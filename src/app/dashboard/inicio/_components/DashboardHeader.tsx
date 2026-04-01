"use client";

import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();
  return (
    <header className="space-y-6">
      {/* Línea decorativa */}
      <div className="flex items-center justify-between gap-6 flex-col md:flex-row">
        <div className="space-y-1">
            <h1
              style={{ fontFamily: "var(--font-marcellus)" }}
              className="
                text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Gestión de Ventas
            </h1>
  
            <p style={{ fontFamily: "var(--font-sans)" }} className="text-sm text-[#8C9796] mt-2">
              Registro y seguimiento de transacciones
            </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/inicio/nuevaVenta")}
          className="
        bg-[#B76E79]
        text-white
        px-6 py-3
        rounded-full
        text-sm font-medium
        shadow-sm
        hover:bg-[#A45F69]
        hover:shadow-md
        transition
      "
        >
          + Nueva Venta
        </button>
      </div>
    </header>
  );
}
