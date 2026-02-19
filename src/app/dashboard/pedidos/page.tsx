"use client";

import { useState } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import PedidosStats from "./_components/PedidosStats";
import PedidosToolbar from "./_components/PedidosToolbar";
import PedidosTable from "./_components/PedidosTable";
import { Pedido, PedidoEstado } from "./type";

const pedidosMock: Pedido[] = [
  {
    id: "PED-2501",
    cliente: "María García",
    tipo: "Personalizado",
    descripcion: "Anillo compromiso",
    entrega: "2025-11-25",
    estado: "EN_PRODUCCION",
    prioridad: "Alta",
  },
  {
    id: "PED-2502",
    cliente: "Juan Pérez",
    tipo: "Reparación",
    descripcion: "Cambio de engaste",
    entrega: "2025-11-20",
    estado: "EN_TALLER",
    prioridad: "Media",
  },
  {
    id: "PED-2503",
    cliente: "Laura Fernández",
    tipo: "Personalizado",
    descripcion: "Pulsera nombre",
    entrega: "2025-11-22",
    estado: "PENDIENTE",
    prioridad: "Media",
  },
];

export default function PedidosPage() {
  const [filtro, setFiltro] = useState<PedidoEstado | "TODOS">("TODOS");

  const pedidosFiltrados =
    filtro === "TODOS"
      ? pedidosMock
      : pedidosMock.filter((p) => p.estado === filtro);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* 🔥 HEADER estilo Consignaciones */}
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Pedidos
              </span>
            </div>

            <h1
              className="
                font-serif
                text-4xl sm:text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Gestión de pedidos
            </h1>

            <p className="text-[#8C8976]">
              Pedidos personalizados, reparaciones y ajustes
            </p>
          </header>

          {/* 🔥 CARD estilo Consignaciones */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-6 sm:p-8 md:p-10
              space-y-6
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >
            <PedidosStats pedidos={pedidosFiltrados} />

            <PedidosToolbar
              filtro={filtro}
              setFiltro={setFiltro}
            />

            <PedidosTable pedidos={pedidosFiltrados} />
          </div>

        </div>
      </main>
    </div>
  );
}
