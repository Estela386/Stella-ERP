"use client";

import { useState } from "react";
import MaterialsStats from "./_components/MaterialsStats";
import MaterialsToolbar from "./_components/MaterialsToolbar";
import MaterialsGrid from "./_components/MaterialsGrid";
import SidebarMenu from "@/app/_components/SideBarMenu";

const materialesMock = [
  { id: 1, nombre: "Oro", tipo: "Metal", cantidad: 10, precio: 500 },
  { id: 2, nombre: "Plata", tipo: "Metal", cantidad: 2, precio: 200 },
  { id: 3, nombre: "Perlas", tipo: "Piedra", cantidad: 0, precio: 100 },
];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("TODOS");

  const filtrados = materialesMock
    .filter(m =>
      m.nombre.toLowerCase().includes(search.toLowerCase())
    )
    .filter(m => {
      if (filtro === "BAJO") return m.cantidad < 5;
      if (filtro === "AGOTADO") return m.cantidad === 0;
      return true;
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* HEADER IGUAL */}
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Materiales
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
              Inventario de materia prima
            </h1>
          </header>

          {/* CARD BLANCA PRINCIPAL */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-10
              space-y-6
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >

            {/* STATS */}
            <MaterialsStats
              materiales={materialesMock}
              onFilter={setFiltro}
            />

            {/* TOOLBAR */}
            <MaterialsToolbar
              search={search}
              setSearch={setSearch}
            />

            {/* TARJETAS */}
            <MaterialsGrid materiales={filtrados} />

          </div>
        </div>
      </main>
    </div>
  );
}