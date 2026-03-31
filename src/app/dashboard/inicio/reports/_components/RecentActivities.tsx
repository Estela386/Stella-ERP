"use client";

import { Check, XCircle, Clock } from "lucide-react";
import { Venta } from "@/lib/models/Venta";

interface RecentActivitiesProps {
  ventas: Venta[];
}

export default function RecentActivities({ ventas }: RecentActivitiesProps) {
  // Sort descending by date and take top 5
  const recent = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  function getTimeAgo(dateString: string) {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return `Hace 1 día`;
    return `Hace ${diffDays} días`;
  }

  function getStatusConfig(estado: string) {
    switch (estado) {
      case "aprobada":
        return { icon: Check, color: "#3d8c60", bg: "#EDF5F0", title: "Venta Completada", sub: "El pago fue aprobado" };
      case "pendiente":
        return { icon: Clock, color: "#b07830", bg: "#FDF3E7", title: "Venta Registrada", sub: "Esperando confirmación de pago" };
      case "cancelada":
      case "denegada":
        return { icon: XCircle, color: "#ff5c6b", bg: "#FFE8EA", title: "Venta Cancelada", sub: "La transacción falló o se anuló" };
      default:
        return { icon: Check, color: "#8A94A6", bg: "#F0F2F5", title: "Movimiento", sub: estado };
    }
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.03)",
      border: "1px solid rgba(0,0,0,0.04)",
      height: "100%",
    }}>
      <h3 style={{
        fontFamily: "var(--font-marcellus)",
        fontSize: "0.8rem", fontWeight: 700, color: "#2A2E34", margin: "0 0 20px 0",
      }}>
        Actividad Reciente
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {recent.length === 0 ? (
          <div style={{ color: "#8A94A6", fontSize: "0.75rem", fontFamily: "var(--font-poppins)" }}>No hay actividad en este periodo.</div>
        ) : (
          recent.map((v) => {
            const config = getStatusConfig(v.estado);
            const Icon = config.icon;
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.65rem",
                  color: "#8A94A6", width: 62, flexShrink: 0, marginTop: 4,
                }}>
                  {getTimeAgo(v.fecha)}
                </span>
                
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: config.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={14} color={config.color} />
                </div>

                <div>
                  <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.8rem", fontWeight: 600, color: "#2A2E34", margin: 0 }}>
                    {config.title} <span style={{fontSize: "0.7rem", color: "#8A94A6", fontWeight: 500, fontFamily: "var(--font-poppins)"}}>#{v.id}</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "#8A94A6", margin: "2px 0 0" }}>
                    {v.id_usuario && v.id_usuario !== "guest" ? `Cliente: ${v.id_usuario}` : config.sub}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
