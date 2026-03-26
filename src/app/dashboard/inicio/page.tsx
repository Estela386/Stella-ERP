"use client";

import SidebarMenu       from "@/app/_components/SideBarMenu";
import DashboardTopBar   from "./_components/DashboardTopBar";
import DashboardStats    from "./_components/DashboardStats";
import RecentOrders      from "./_components/RecentOrders";
import StockAlerts       from "./_components/StockAlerts";
import SideWidgets       from "./_components/SideWidgets";

export default function InicioPage() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F6F3EF" }}>
      <SidebarMenu />

      <main style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        background: "#F6F3EF",
      }}>
        <div style={{
          padding: "clamp(14px, 2vw, 24px) clamp(14px, 2.5vw, 24px)",
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxSizing: "border-box",
          width: "100%",
        }}>
          {/* ── Top bar ── */}
          <DashboardTopBar />

          {/* ── Main Layout ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>
            
            {/* 1. KPI cards -> 4 columns full width */}
            <DashboardStats />

            <style>{`
              @media (max-width: 1100px) {
                .dash-row { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {/* 3. Bottom Row: Calendar & Events (SideWidgets now handles 1fr 1fr internally) */}
            <div style={{ minWidth: 0 }}>
              <SideWidgets />
            </div>
            
            {/* 2. Middle Row: Stock Alerts (left) & Recent Orders (right) */}
            <div className="dash-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                <RecentOrders />
              </div>
              <div style={{ minWidth: 0 }}>
                <StockAlerts />
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
