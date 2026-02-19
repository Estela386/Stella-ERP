"use client";

import SidebarMenu from "@/app/_components/SideBarMenu";
import ReportStats from "./_components/ReportStats";
import ReportToolbar from "./_components/ReportToolbar";
import SalesChart from "./_components/SalesChart";
import TopProducts from "./_components/TopProducts";
import TopSellers from "./_components/TopSellers";

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* ===== HEADER IGUAL ===== */}
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Reportes
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
              Reportes y análisis del negocio
            </h1>
          </header>

          {/* ===== CARD PRINCIPAL ===== */}
          <div
            className="
    relative
    rounded-3xl
    bg-white
    p-10
    space-y-8
    border border-black/10
    shadow-[0_30px_70px_rgba(0,0,0,0.12)]
  "
          >
            <ReportStats
              data={{
                ingresos: 580000,
                margen: 54.3,
                productosVendidos: 856,
                tasaRetorno: 68,
              }}
            />

            <ReportToolbar />
            <SalesChart />

            <div className="grid md:grid-cols-2 gap-6">
              <TopProducts />
              <TopSellers />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
