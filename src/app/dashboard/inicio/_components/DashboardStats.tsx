"use client";
import { useEffect, useState } from "react";

import {
  ShoppingBag,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/app/_components/ui/Skeleton";

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
  roleId?: number;
}

const buildKPIs = (stats: StatsData): KPI[] => {
  const isWholesaler = stats.roleId === 3;

  const kpis: KPI[] = [
    {
      label: isWholesaler ? "Mis Compras Hoy" : "Ventas Hoy",
      value: `$${(stats.ventasHoy?.total || 0).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      })}`,
      sub: isWholesaler 
        ? `${stats.ventasHoy?.transacciones || 0} pedidos hoy`
        : `${stats.ventasHoy?.transacciones || 0} transacciones`,
      icon: DollarSign,
      theme: "gray",
      badgeLabel: isWholesaler ? "↑ activo" : "↑ alto",
      href: isWholesaler ? "/dashboard/inicio/pedidos" : "/dashboard/inicio/nuevaVenta",
    },
    {
      label: isWholesaler ? "Mi Ticket Promedio" : "Ticket Promedio",
      value: `$${(stats.ticketPromedio?.valor || 0).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      })}`,
      sub: isWholesaler 
        ? "Basado en tus compras"
        : `${stats.ticketPromedio?.ventasDelMes || 0} ventas del mes`,
      icon: ShoppingBag,
      theme: "rose",
      badgeLabel: "↑ estable",
      href: "/dashboard/inicio/reports",
    },
    {
      label: isWholesaler ? "Mis Pedidos Activos" : "Pedidos Pendientes",
      value: `${stats.pedidosPendientes || 0}`,
      sub: isWholesaler ? "En proceso / taller" : "Requieren atención",
      icon: Package,
      theme: "gray",
      badgeLabel: "! estado",
      href: "/dashboard/inicio/pedidos",
    },
  ];

  if (isWholesaler) {
    // Card adicional para Mayoristas: Descuentos o Perfil
    kpis.push({
      label: "Mi Nivel Stella",
      value: "Mayorista Gold",
      sub: "25% de descuento aplicado",
      icon: ShoppingBag,
      theme: "rose",
      badgeLabel: "★ VIP",
      href: "/dashboard/inicio/consignaciones",
    });
  } else {
    // Card estándar para Admin: Stock Bajo
    kpis.push({
      label: "Stock Bajo",
      value: `${stats.stockBajo || 0} artículos`,
      sub: "Productos e insumos bajo mínimo",
      icon: AlertTriangle,
      theme: "rose",
      badgeLabel: "↓ revisar",
      href: "/dashboard/inicio/inventarios",
    });
  }

  return kpis;
};


const THEME = {
  gray: {
    bg: "var(--slate)",
  },
  rose: {
    bg: "var(--rose-gold)",
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

  const statsRow = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

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
            padding: 0 4px;
          } 
        }
        
        .stat-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>

      {loading ? (
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} height="clamp(110px, 15vw, 150px)" borderRadius="var(--radius-lg)" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={statsRow}
          initial="hidden"
          animate="show"
          className="stats-grid"
        >
          {kpis.map(k => {
            const Icon = k.icon;
            const theme = THEME[k.theme];

            return (
              <motion.div
                key={k.label}
                variants={itemAnim}
                className="stat-card-hover"
                onClick={() => router.push(k.href)}
                title={`Ir a ${k.label}`}
                style={{
                  background: theme.bg,
                  borderRadius: "var(--radius-lg)",
                  padding: "clamp(16px, 3.5vw, 24px)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  gap: 16,
                  cursor: "pointer",
                  boxSizing: "border-box",
                  boxShadow: "var(--shadow-sm)",
                  minHeight: "clamp(110px, 15vw, 150px)",
                }}
              >
                {/* Header: Label + Small Icon */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans, Inter, sans-serif)",
                      fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.9)",
                      margin: 0,
                      lineHeight: 1.2,
                      maxWidth: "80%",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em"
                    }}
                  >
                    {k.label}
                  </p>
                  <div style={{ 
                    background: "rgba(255,255,255,0.15)", 
                    padding: "clamp(6px, 1.5vw, 8px)", 
                    borderRadius: 10, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Icon size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Body: Value + Sub */}
                <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-marcellus, serif)",
                      fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                      fontWeight: 400,
                      color: "var(--white)",
                      margin: 0,
                      lineHeight: 1,
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    {k.value}
                  </p>
                  {k.sub && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans, Inter, sans-serif)",
                        fontSize: "clamp(0.68rem, 2vw, 0.78rem)",
                        fontWeight: 400,
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "8px 0 0 0",
                        letterSpacing: "0.01em"
                      }}
                    >
                      {k.sub}
                    </p>
                  )}
                </div>

                {/* Decorative Background Icon */}
                <div style={{
                  position: "absolute",
                  right: "-5%",
                  bottom: "-10%",
                  opacity: 0.1,
                  transform: "rotate(-10deg)",
                  pointerEvents: "none",
                  zIndex: 1
                }}>
                  <Icon size={110} color="#FFFFFF" strokeWidth={1} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
