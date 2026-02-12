"use client";

import { useState } from "react";
import { Consignacion, Usuario } from "./type";
import InventoryStats from "./_components/InventoryStats";
import InventoryToolbar from "./_components/InventoryToolbar";
import ProductTable from "./_components/ProductTable";
import SidebarMenu from "@/app/_components/SideBarMenu";

const usuarioMock: Usuario = {
  id: 1,
  nombre: "Administrador",
  rol: "admin",
};

const consignacionesMock: Consignacion[] = [
  {
    id: 1,
    cliente: { id: 1, nombre: "Joyería Aurora" },
    producto: { id: 101, nombre: "Anillo Plata", precio: 1200 },
    cantidad: 10,
    precio_consignado: 1100,
    fecha_inicio: "2025-01-01",
    fecha_fin: "2025-03-01",
    estado: "ACTIVA",
  },
  {
    id: 2,
    cliente: { id: 1, nombre: "Joyería Aurora" },
    producto: { id: 102, nombre: "Pulsera Oro", precio: 3500 },
    cantidad: 5,
    precio_consignado: 3300,
    fecha_inicio: "2025-01-01",
    fecha_fin: "2025-03-01",
    estado: "ACTIVA",
  },
  {
    id: 3,
    cliente: { id: 2, nombre: "Boutique Luna" },
    producto: { id: 201, nombre: "Collar Perla", precio: 2800 },
    cantidad: 3,
    precio_consignado: 2600,
    fecha_inicio: "2024-11-10",
    fecha_fin: "2025-01-10",
    estado: "VENCIDA",
  },
];

export default function ConsignacionesPage() {
  const [search, setSearch] = useState("");

  const filtradas = consignacionesMock.filter(
    c =>
      c.producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.cliente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Consignaciones
              </span>
            </div>

            <h1
              className="
                font-serif
                text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Control de productos entregados
            </h1>
          </header>

          {/* Card */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-10
              space-y-3
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >
            {usuarioMock.rol === "admin" && (
              <InventoryStats consignaciones={filtradas} />
            )}

            <InventoryToolbar
              search={search}
              setSearch={setSearch}
              rol={usuarioMock.rol}
            />

            <ProductTable consignaciones={filtradas} usuario={usuarioMock} />
          </div>
        </div>
      </main>
    </div>
  );
}
