"use client";

import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaVentaHeader from "./_components/NuevaVentaHeader";
import VentaInfoForm from "./_components/VentaInfoForm";
import ProductosVenta from "./_components/ProductosVenta";
import VentaResumen from "./_components/VentaResumen";

export default function NuevaVentaPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F3EF]">

      <SidebarMenu />

      <main className="flex-1 px-3 sm:px-6 py-6 sm:py-8">
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
          <ProductosVenta />
          <VentaResumen />

        </div>
      </main>
    </div>
  );
}
