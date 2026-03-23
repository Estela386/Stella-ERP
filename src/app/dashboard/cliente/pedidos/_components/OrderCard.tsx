"use client";

import { useState } from "react";
import { Package, Truck, Calendar, MapPin, CheckCircle2, Clock, ChevronRight, Star, FileText } from "lucide-react";
import { Order, OrderStatus } from "../type";

// Import Modals
import TrackingModal from "./modals/TrackingModal";
import ReviewModal from "./modals/ReviewModal";
import ReceiptModal from "./modals/ReceiptModal";
import OrderDetailsModal from "./modals/OrderDetailsModal";

interface OrderCardProps {
  order: Order;
  activeTab: "pedidos" | "comprar_nuevo" | "cancelados";
}

const COLORS = {
  bg: "#f6f4ef",
  bgAlt: "#ede9e3",
  white: "#ffffff",
  slate: "#708090",
  slateDeep: "#4a5568",
  rose: "#b76e79",
  slateBorder: "rgba(112,128,144,0.18)",
  slateMid: "rgba(112,128,144,0.25)",
  sageSm: "rgba(140,151,104,0.08)",
  sageLg: "rgba(140,151,104,0.22)",
  roseMid: "rgba(183,110,121,0.32)",
};

const statusConfig: Record<OrderStatus, { text: string, icon: any, label: string }> = {
  pendiente: { text: COLORS.slateDeep, icon: <Clock size={20} color={COLORS.slate} />, label: "Pendiente" },
  pagado: { text: COLORS.slateDeep, icon: <CheckCircle2 size={20} color={COLORS.slate} />, label: "Preparando envío" },
  enviado: { text: COLORS.rose, icon: <Truck size={20} color={COLORS.slate} />, label: "Entregado" },
  cancelado: { text: COLORS.slate, icon: <Package size={20} color={COLORS.slate} />, label: "Cancelado" },
};

export default function OrderCard({ order, activeTab }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeModal, setActiveModal] = useState<"tracking" | "review" | "receipt" | "details" | null>(null);

  const status = statusConfig[order.estado] || statusConfig.pendiente;

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.slateBorder}`,
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: isHovered ? `0 18px 40px ${COLORS.sageLg}` : `0 2px 12px ${COLORS.sageSm}`,
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",
          transition: "all 0.22s ease",
          position: "relative"
        }}
      >
        {/* Header */}
        <div style={{
          background: COLORS.bgAlt,
          padding: "clamp(12px, 2vw, 18px) clamp(18px, 2.2vw, 26px)",
          borderBottom: `1px solid ${COLORS.slateBorder}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.68rem", color: COLORS.slateDeep, textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.05em" }}>
                Pedido Realizado
              </span>
              <span style={{ fontSize: "0.86rem", color: COLORS.slate }}>{order.fecha}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.68rem", color: COLORS.slateDeep, textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.05em" }}>
                Total
              </span>
              <span style={{ fontSize: "0.86rem", color: COLORS.slate }}>${order.total.toLocaleString()}</span>
            </div>

            {order.direccion_envio && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: "0.68rem", color: COLORS.slateDeep, textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.05em" }}>
                  Enviar a
                </span>
                <span style={{ fontSize: "0.86rem", color: COLORS.rose, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  Stella Cliente <ChevronRight size={14} />
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flex: 1 }}>
            <span style={{ fontSize: "0.68rem", color: COLORS.slateDeep, textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.05em" }}>
              Pedido n.º {order.id}
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setActiveModal("details")}
                style={{ background: "none", border: "none", padding: 0, fontSize: "0.84rem", color: COLORS.rose, cursor: "pointer" }}
              >
                Detalles del pedido
              </button>
              <span style={{ color: COLORS.slateBorder, fontSize: "0.84rem" }}>|</span>
              <button 
                onClick={() => setActiveModal("receipt")}
                style={{ background: "none", border: "none", padding: 0, fontSize: "0.84rem", color: COLORS.rose, cursor: "pointer" }}
              >
                Ver recibo
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "clamp(18px, 2.2vw, 26px)", display: "flex", flexDirection: "column", gap: 24 }}>
          
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.35rem",
            fontWeight: 600,
            color: status.text,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            {status.icon}
            {order.estado === "enviado" ? `Entregado ${order.fecha}` : status.label}
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 16 }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: "12px", overflow: "hidden",
                    background: COLORS.bg, flexShrink: 0, border: `1px solid ${COLORS.slateBorder}`
                  }}>
                    <img src={item.imagen_url || "/LogoM.svg"} alt={item.nombre_producto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                    <span style={{ fontSize: "0.94rem", color: COLORS.rose, fontWeight: 400 }}>{item.nombre_producto}</span>
                    <span style={{ fontSize: "0.82rem", color: COLORS.slate }}>Cantidad: {item.cantidad}</span>
                    
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button style={{
                        background: activeTab === "comprar_nuevo" ? COLORS.rose : "transparent", 
                        border: activeTab === "comprar_nuevo" ? "none" : `1.5px solid ${COLORS.slateMid}`,
                        borderRadius: "6px", padding: "6px 12px",
                        fontSize: "0.78rem", color: activeTab === "comprar_nuevo" ? COLORS.white : COLORS.slate,
                        fontWeight: 400, cursor: "pointer", transition: "all 0.22s ease", letterSpacing: "0.04em"
                      }}>
                        {activeTab === "comprar_nuevo" ? "Agregar al carrito" : "Comprar de nuevo"}
                      </button>
                      
                      <button style={{
                        background: "transparent", border: `1.5px solid ${COLORS.slateMid}`, borderRadius: "6px", padding: "6px 12px",
                        fontSize: "0.78rem", color: COLORS.slate, fontWeight: 400, cursor: "pointer"
                      }}>
                        Ver tu artículo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
               <button 
                 onClick={() => setActiveModal("tracking")}
                 style={{
                   width: "100%", padding: "10px 16px", background: order.estado === "cancelado" ? "transparent" : COLORS.rose,
                   color: order.estado === "cancelado" ? COLORS.slate : COLORS.white,
                   border: order.estado === "cancelado" ? `1.5px solid ${COLORS.slateMid}` : "none",
                   borderRadius: "6px", fontSize: "0.83rem", cursor: "pointer", textAlign: "center", transition: "all 0.22s ease"
                 }}
                 onMouseEnter={(e) => { if (order.estado !== "cancelado") e.currentTarget.style.boxShadow = `0 10px 26px ${COLORS.roseMid}`; }}
                 onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
               >
                 {order.estado === "enviado" ? "Rastrear paquete" : "Ver estado"}
               </button>

               {order.estado === "enviado" && (
                 <button 
                   onClick={() => setActiveModal("review")}
                   style={{
                     width: "100%", padding: "10px 16px", background: "transparent",
                     color: COLORS.slate, border: `1.5px solid ${COLORS.slateMid}`,
                     borderRadius: "6px", fontSize: "0.83rem", cursor: "pointer", textAlign: "center", transition: "all 0.22s ease"
                   }}
                 >
                   Dejar reseña del producto
                 </button>
               )}

               <button 
                 onClick={() => setActiveModal("details")}
                 style={{
                   width: "100%", padding: "10px 16px", background: "transparent",
                   color: COLORS.slate, border: `1.5px solid ${COLORS.slateMid}`,
                   borderRadius: "6px", fontSize: "0.83rem", cursor: "pointer", textAlign: "center", transition: "all 0.22s ease"
                 }}
               >
                 Ver detalles del pedido
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals Injected */}
      <TrackingModal 
        isOpen={activeModal === "tracking"} 
        onClose={() => setActiveModal(null)} 
        order={order} 
      />
      <ReviewModal 
        isOpen={activeModal === "review"} 
        onClose={() => setActiveModal(null)} 
        order={order} 
      />
      <ReceiptModal 
        isOpen={activeModal === "receipt"} 
        onClose={() => setActiveModal(null)} 
        order={order} 
      />
      <OrderDetailsModal 
        isOpen={activeModal === "details"} 
        onClose={() => setActiveModal(null)} 
        order={order} 
      />
    </>
  );
}
