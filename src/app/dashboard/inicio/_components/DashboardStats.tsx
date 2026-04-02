"use client";
import { useEffect, useState } from "react";

import {
  ShoppingBag,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface KPI {
  label: string;
  value: string;
  sub: string;
  theme: "gray" | "rose";
  icon: React.ElementType;
  badgeLabel: string;
  href: string;
}

interface StatsData {
  ventasHoy?: { total: number; transacciones: number };
  ticketPromedio?: { valor: number; ventasDelMes: number };
  pedidosPendientes?: number;
  stockBajo?: number;
}

const buildKPIs = (stats: StatsData): KPI[] => [
  {
    label: "Ventas Hoy",
    value: `$${(stats.ventasHoy?.total || 0).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    })}`,
    sub: `${stats.ventasHoy?.transacciones || 0} transacciones`,
    icon: DollarSign,
    theme: "gray",
    badgeLabel: "↑ alto",
    href: "/dashboard/inicio/nuevaVenta",
  },
  {
    label: "Ticket Promedio",
    value: `$${(stats.ticketPromedio?.valor || 0).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    })}`,
    sub: `${stats.ticketPromedio?.ventasDelMes || 0} ventas del mes`,
    icon: ShoppingBag,
    theme: "rose",
    badgeLabel: "↑ estable",
    href: "/dashboard/inicio/reports",
  },
  {
    label: "Pedidos Pendientes",
    value: `${stats.pedidosPendientes || 0}`,
    sub: "Requieren atención",
    icon: Package,
    theme: "gray",
    badgeLabel: "! acción",
    href: "/dashboard/inicio/pedidos",
  },
  {
    label: "Stock Bajo",
    value: `${stats.stockBajo || 0} piezas`,
    sub: "Requieren reposición",
    icon: AlertTriangle,
    theme: "rose",
    badgeLabel: "↓ revisar",
    href: "/dashboard/inicio/inventarios",
  },
];

const THEME = {
  gray: {
    bg: "#708090",
  },
  rose: {
    bg: "#B76E79",
  },
};

export default function DashboardStats() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    ventasHoy: { total: 0, transacciones: 0 },
    ticketPromedio: { valor: 0, ventasDelMes: 0 },
    pedidosPendientes: 0,
    stockBajo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Error fetching stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Actualizar cada 30s

    return () => clearInterval(interval);
  }, []);

  const kpis = buildKPIs(stats);

    return (
      <>
        <style>{`
          .stats-grid { 
            display: grid;
            grid-template-columns: repeat(4, 1fr); 
            gap: 24px; 
            width: 100%;
          }
          @media (max-width: 1200px) { 
            .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } 
          }
          @media (max-width: 600px) { 
            .stats-grid { 
              grid-template-columns: repeat(2, 1fr); 
              gap: 12px; 
              padding: 0 4px; /* Un poco de margen en móviles muy pequeños */
            } 
          }
          .stats-loading { opacity: 0.6; pointer-events: none; animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
          
          .stat-card-hover {
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          }
          .stat-card-hover:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
        `}</style>
        <div
          className={`stats-grid ${loading ? "stats-loading" : ""}`}
        >
        {kpis.map(k => {
          const Icon = k.icon;
          const theme = THEME[k.theme];

          return (
            <div
              key={k.label}
              className="stat-card-hover"
              onClick={() => router.push(k.href)}
              title={`Ir a ${k.label}`}
              style={{
                background: theme.bg,
                borderRadius: 16,
                padding: "clamp(14px, 3.5vw, 24px)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                gap: 16,
                cursor: "pointer",
                boxSizing: "border-box",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header: Label + Small Icon */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.95)",
                    margin: 0,
                    lineHeight: 1.2,
                    maxWidth: "80%", // Prevenir que colisione con el ícono
                  }}
                >
                  {k.label}
                </p>
                <div style={{ 
                  background: "rgba(255,255,255,0.15)", 
                  padding: "clamp(4px, 1.5vw, 8px)", 
                  borderRadius: 10, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={18} color="#FFFFFF" strokeWidth={2} />
                </div>
              </div>

              {/* Body: Value + Sub */}
              <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
                <p
                  style={{
                    fontFamily: "var(--font-marcellus, serif)",
                    fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {k.value}
                </p>
                {k.sub && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans, Inter, sans-serif)",
                      fontSize: "clamp(0.65rem, 2vw, 0.8rem)",
                      fontWeight: 400,
                      color: "rgba(255, 255, 255, 0.75)",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {k.sub}
                  </p>
                )}
              </div>

              {/* Decorative Background Icon */}
              <div style={{
                position: "absolute",
                right: "-10%",
                bottom: "-15%",
                opacity: 0.08,
                transform: "rotate(-15deg)",
                pointerEvents: "none",
                zIndex: 1
              }}>
                <Icon size={120} color="#FFFFFF" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
