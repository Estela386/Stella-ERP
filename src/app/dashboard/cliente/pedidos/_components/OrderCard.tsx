"use client";

import { Package, Truck, Calendar, MapPin, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Order, OrderStatus } from "../type";

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<OrderStatus, { bg: string, text: string, icon: any }> = {
  pendiente: { bg: "rgba(112,128,144,0.08)", text: "#708090", icon: <Clock size={14} /> },
  pagado: { bg: "rgba(140,151,104,0.08)", text: "#8c9768", icon: <CheckCircle2 size={14} /> },
  enviado: { bg: "rgba(183,110,121,0.08)", text: "#b76e79", icon: <Truck size={14} /> },
  cancelado: { bg: "rgba(0,0,0,0.05)", text: "#4a5568", icon: <Package size={14} /> },
};

export default function OrderCard({ order }: OrderCardProps) {
  const status = statusColors[order.estado] || statusColors.pendiente;

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "24px",
      boxShadow: "0 8px 24px rgba(112,128,144,0.06)",
      border: "1px solid rgba(112,128,144,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      transition: "all 0.3s ease",
      cursor: "pointer"
    }} onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 30px rgba(140,151,104,0.12)";
    }} onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(112,128,144,0.06)";
    }}>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: "0.75rem", color: "#708090", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Pedido #{order.id}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4a5568" }}>
            <Calendar size={14} />
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{order.fecha}</span>
          </div>
        </div>

        <div style={{
          padding: "6px 14px",
          background: status.bg,
          color: status.text,
          borderRadius: 20,
          fontSize: "0.75rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
          textTransform: "capitalize",
          border: `1px solid ${status.text}22`
        }}>
          {status.icon}
          {order.estado}
        </div>
      </div>

      {/* Products Slider/List */}
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ 
            minWidth: 100,
            display: "flex", 
            flexDirection: "column", 
            gap: 6,
            textAlign: "center"
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              background: "#f6f4ef", 
              borderRadius: 12, 
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid rgba(112,128,144,0.05)"
            }}>
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.nombre_producto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Package size={24} color="#b76e79" strokeWidth={1} />
              )}
            </div>
            <span style={{ fontSize: "0.7rem", color: "#708090", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.nombre_producto}
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4a5568" }}>
              x{item.cantidad}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{ 
        paddingTop: 16, 
        borderTop: "1px solid rgba(112,128,144,0.08)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-end" 
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {order.direccion_envio && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#708090" }}>
              <MapPin size={14} />
              <span style={{ fontSize: "0.8rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{order.direccion_envio}</span>
            </div>
          )}
          {order.metodo_pago && (
            <span style={{ fontSize: "0.75rem", color: "#8c9768", fontWeight: 500 }}>Pagado con {order.metodo_pago}</span>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.8rem", color: "#708090" }}>Total</div>
          <div style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: "1.6rem", 
            fontWeight: 600, 
            color: "#b76e79",
            fontStyle: "italic"
          }}>
            ${order.total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
