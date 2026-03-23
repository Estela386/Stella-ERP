"use client";

import { Package, Truck, CheckCircle2, Clock, MapPin, Box } from "lucide-react";
import Modal from "./Modal";
import { Order } from "../../type";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function TrackingModal({ isOpen, onClose, order }: TrackingModalProps) {
  // Mock tracking data based on order status
  const steps = [
    { title: "Entregado", description: "El paquete fue entregado con éxito.", date: order.fecha, icon: <CheckCircle2 size={18} />, completed: order.estado === "enviado" },
    { title: "En tránsito", description: "Llegó a la instalación local de Guadalajara.", date: "14 Mar 2024", icon: <MapPin size={18} />, completed: order.estado === "enviado" },
    { title: "Enviado", description: "El paquete ha salido del centro logístico Stella.", date: "12 Mar 2024", icon: <Truck size={18} />, completed: order.estado === "enviado" || order.estado === "pagado" },
    { title: "Procesado", description: "Tu joya ha sido empaquetada y está lista para el envío.", date: "11 Mar 2024", icon: <Box size={18} />, completed: order.estado !== "pendiente" && order.estado !== "cancelado" },
    { title: "Pago confirmado", description: "Hemos recibido tu pago correctamente.", date: "10 Mar 2024", icon: <CheckCircle2 size={18} />, completed: order.estado !== "pendiente" && order.estado !== "cancelado" },
    { title: "Pedido realizado", description: "Hemos recibido tu pedido.", date: "10 Mar 2024", icon: <Clock size={18} />, completed: true },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rastreo de Pedido #${order.id}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Status Header */}
        <div style={{
          background: "rgba(183, 110, 121, 0.05)",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid rgba(183, 110, 121, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{ 
            width: "40px", height: "40px", borderRadius: "50%", background: "#b76e79", 
            display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" 
          }}>
            <Truck size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#708090", fontWeight: 500 }}>Estado actual</p>
            <p style={{ margin: 0, fontSize: "1.05rem", color: "#4a5568", fontWeight: 700 }}>
              {order.estado === "enviado" ? "¡Tu pedido ha llegado!" : "En procesamiento"}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "32px" }}>
          {/* Vertical Line */}
          <div style={{
            position: "absolute",
            left: "11px",
            top: "10px",
            bottom: "10px",
            width: "2px",
            background: "rgba(112, 128, 144, 0.12)"
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {steps.map((step, index) => (
              <div key={index} style={{ position: "relative", display: "flex", gap: "16px", opacity: step.completed ? 1 : 0.4 }}>
                {/* Dot */}
                <div style={{
                  position: "absolute",
                  left: "-31px",
                  top: "4px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: step.completed ? "#b76e79" : "#ffffff",
                  border: `2px solid ${step.completed ? "#b76e79" : "rgba(112, 128, 144, 0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: step.completed ? "#ffffff" : "#708090",
                  zIndex: 1
                }}>
                  {step.completed ? <CheckCircle2 size={12} /> : <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#4a5568" }}>{step.title}</h4>
                    <span style={{ fontSize: "0.75rem", color: "#708090" }}>{step.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#708090", lineHeight: "1.4" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Summary */}
        <div style={{
          borderTop: "1px solid rgba(112, 128, 144, 0.08)",
          paddingTop: "20px"
        }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#4a5568", fontWeight: 600 }}>Artículos en este paquete</h4>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ 
                width: "64px", height: "64px", borderRadius: "8px", background: "#f6f4ef", 
                border: "1px solid rgba(112, 128, 144, 0.1)", overflow: "hidden", flexShrink: 0 
              }}>
                <img src={item.imagen_url || "/LogoM.svg"} alt={item.nombre_producto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
