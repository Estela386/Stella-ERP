"use client";

import { useState } from "react";
import InventoryStats from "./_components/InventoryStats";
import InventoryToolbar from "./_components/InventoryToolbar";
import ProductTable from "./_components/ProductTable";
import { Producto } from "./type";

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Anillo Solitario Diamante",
    precio: 3500,
    costo: 1800,
    stock_actual: 5,
    stock_min: 2,
    categoria: { id: 1, nombre: "Anillos" },
  },
  {
    id: 2,
    nombre: "Pulsera Tennis Diamantes",
    precio: 5200,
    costo: 3100,
    stock_actual: 0,
    stock_min: 2,
    categoria: { id: 2, nombre: "Pulseras" },
  },
];

export default function InventariosPage() {
  const [search, setSearch] = useState("");

  return (
    <section className="min-h-screen bg-[#F8F6F2] px-8 py-14">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <header className="space-y-6">
          {/* Línea editorial */}
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#B76E79]" />
            <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
              Inventarios
            </span>
          </div>

          {/* Título principal */}
          <h1
            className="
              font-serif
              text-5xl md:text-6xl
              font-medium
              leading-tight
              text-[#708090]
            "
          >
            Consulta de Inventario
          </h1>

          {/* Subtle divider
          <div className="h-px w-full bg-black/5" /> */}
        </header>

        {/* Card principal */}
        <div
          className="
            relative
            rounded-3xl
            bg-white
            p-8
            space-y-8
            border border-black/10
            shadow-[0_30px_70px_rgba(0,0,0,0.12)]
          "
        >
          {/* Accent line */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-[#B76E79]" />

          <InventoryStats productos={productos} />

          <InventoryToolbar search={search} setSearch={setSearch} />

          <ProductTable productos={productos} search={search} />
        </div>
      </div>
    </section>
  );
}
