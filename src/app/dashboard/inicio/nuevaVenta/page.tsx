"use client";

import { useState } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaVentaHeader from "./_components/NuevaVentaHeader";
import VentaInfoForm from "./_components/VentaInfoForm";
import ProductosVenta from "./_components/ProductosVenta";
import VentaResumen from "./_components/VentaResumen";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

export default function NuevaVentaPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const agregarProducto = () => {
    const nuevo = {
      id: Date.now(),
      nombre: "Producto ejemplo",
      precio: 1000,
      cantidad: 1,
    };

    setProductos(prev => [...prev, nuevo]);
  };

  const eliminarProducto = (id: number) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl space-y-6">

          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 sm:w-12 bg-[#B76E79]" />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Gestión
              </span>
            </div>
          </header>

          <NuevaVentaHeader />
          <VentaInfoForm />

          <ProductosVenta
            productos={productos}
            onAgregar={agregarProducto}
            onEliminar={eliminarProducto}
          />

          <VentaResumen productos={productos} />

        </div>
      </main>
    </div>
  );
}
