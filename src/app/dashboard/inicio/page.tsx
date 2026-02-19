"use client";

import SidebarMenu from "@/app/_components/SideBarMenu";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardStats from "./_components/DashboardStats";
import SalesChart from "./_components/SalesChart";
import RecentSalesTable from "./_components/RecentSalesTable";

export default function InicioPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      {" "}
      <SidebarMenu />
      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Bienvenido
              </span>
            </div>
          </header>

          <DashboardHeader />
          <DashboardStats />
          <SalesChart />
          <RecentSalesTable />
        </div>
      </main>
    </div>
  );
}
