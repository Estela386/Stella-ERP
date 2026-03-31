"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
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
        .stats-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 24px !important; }
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr !important; } }
        .stats-loading { opacity: 0.6; pointer-events: none; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
      `}</style>
      <div
        className={`stats-grid ${loading ? "stats-loading" : ""}`}
        style={{
          display: "grid",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {kpis.map(k => {
          const Icon = k.icon;
          const theme = THEME[k.theme];

          return (
            <div
              key={k.label}
              onClick={() => router.push(k.href)}
              title={`Ir a ${k.label}`}
              style={{
                background: theme.bg,
                borderRadius: 14,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                cursor: "pointer",
                transition: "transform 0.15s, opacity 0.15s",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.02)";
                (e.currentTarget as HTMLElement).style.opacity = "0.95";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: 0,
                }}
              >
                {k.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display, Manrope, sans-serif)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {k.value}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
