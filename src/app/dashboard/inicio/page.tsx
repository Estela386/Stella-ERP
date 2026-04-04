"use client";

import SidebarMenu       from "@/app/_components/SideBarMenu";
import DashboardTopBar   from "./_components/DashboardTopBar";
import DashboardStats    from "./_components/DashboardStats";
import RecentOrders      from "./_components/RecentOrders";
import StockAlerts       from "./_components/StockAlerts";
import SideWidgets       from "./_components/SideWidgets";

import { useAuth } from "@/lib/hooks/useAuth";
import { ShoppingBag } from "lucide-react";

export default function InicioPage() {
  const { usuario, loading } = useAuth();
  const isWholesaler = usuario?.id_rol === 3;
  const isAdmin = !isWholesaler;

  if (loading) {
    return (
      <div style={{ 
        display: "flex", height: "100vh", width: "100%", 
        alignItems: "center", justifyContent: "center", background: "#F6F3EF" 
      }}>
        <div style={{ fontFamily: "var(--font-sans)", color: "#708090" }}>Cargando dashboard...</div>
      </div>
    );
  }

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

          {isWholesaler && (
            <div style={{
              padding: "16px 20px",
              background: "linear-gradient(90deg, #B76E79 0%, #D4A5A5 100%)",
              borderRadius: 16,
              color: "#fff",
              boxShadow: "0 4px 15px rgba(183,110,121,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8
            }}>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 10 }}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-marcellus)" }}>Panel de Mayorista</h2>
                <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.9 }}>Bienvenido a tu panel exclusivo. Aquí puedes rastrear tus pedidos y gestionar tu inventario en consignación.</p>
              </div>
            </div>
          )}

          {/* ── Main Layout ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>
            
            {/* 1. KPI cards -> 4 columns full width */}
            <DashboardStats />

            <style>{`
              @media (max-width: 1100px) {
                .dash-row { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {/* 3. Bottom Row: Calendar & Events */}
            <div style={{ minWidth: 0 }}>
              <SideWidgets />
            </div>
            
            {/* 2. Middle Row: Recent Orders & Stock Alerts (only for Admin) */}
            <div className="dash-row" style={{ 
              display: "grid", 
              gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", 
              gap: 24, 
              alignItems: "start" 
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                <RecentOrders />
              </div>
              {isAdmin && (
                <div style={{ minWidth: 0 }}>
                  <StockAlerts />
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

