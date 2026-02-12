"use client";

import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaConsignacionForm from "./_components/NuevaConsignacionForm";

export default function NuevaConsignacionPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F3EF]">

      <SidebarMenu />

      <main className="flex-1 px-3 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">

          {/* Header decorativo consistente */}
          <header className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 sm:w-12 bg-[#B76E79]" />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Consignación
              </span>
            </div>

            <h1
              className="
                font-serif
                text-3xl sm:text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Nueva consignación
            </h1>
          </header>

          {/* Card principal responsive */}
          <div
            className="
              relative
              rounded-2xl sm:rounded-3xl
              bg-white
              p-6 sm:p-10
              border border-black/10
              shadow-md sm:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >
            <NuevaConsignacionForm />
          </div>

        </div>
      </main>
    </div>
  );
}
