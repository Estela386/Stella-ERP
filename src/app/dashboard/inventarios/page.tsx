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
    <section className="bg-[#FAF6EA] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-xl font-semibold">Gestión de Inventario</h1>
          <p className="text-sm text-gray-500">
            Administrador del catálogo de joyas
          </p>
        </header>

        <InventoryStats productos={productos} />

        <InventoryToolbar search={search} onSearchChange={setSearch} />

        <ProductTable productos={productos} search={search} />
      </div>
    </section>
  );
}
