"use client";

import NuevaConsignacionForm from "./_components/NuevaConsignacionForm";

export default function NuevaConsignacionPage() {
  return (
    <section className="min-h-screen bg-[#F6F3EF] px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#B76E79]" />
            <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
              consignación
            </span>
          </div>

          <h1
            className="
              font-serif
              text-4xl md:text-5xl
              font-medium
              leading-tight
              text-[#708090]
            "
          >
            Nueva consignación
          </h1>
        </header>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow border border-[#E2D6CC]">
          <NuevaConsignacionForm />
        </div>
      </div>
    </section>
  );
}
