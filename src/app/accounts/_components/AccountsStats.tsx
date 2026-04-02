"use client";

import { ICuentasPorCobrar } from "@/lib/models";
import { WalletCards, HandCoins, ReceiptText } from "lucide-react";

interface Props {
  cuentas: ICuentasPorCobrar[];
}

export default function AccountsStats({ cuentas }: Props) {
  const safeCuentas = cuentas ?? [];
  const totalPendiente = safeCuentas.reduce(
    (acc, c) => acc + c.monto_pendiente,
    0
  );
  const totalPagado = safeCuentas.reduce((acc, c) => acc + c.monto_pagado, 0);
  const activas = safeCuentas.filter(c => c.estado !== "pagado").length;

  const cards = [
    {
      label: "Total pendiente",
      value: `$${totalPendiente.toLocaleString()}`,
      variant: "card-rose"
    },
    {
      label: "Total cobrado",
      value: `$${totalPagado.toLocaleString()}`,
      variant: "card-slate"
    },
    {
      label: "Cuentas pendientes",
      value: activas.toString(),
      variant: "card-rose"
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      width: "100%",
      boxSizing: "border-box",
    }} className="stella-accounts-stats">
      <style>{`
        @media (max-width: 1024px) { 
          .stella-accounts-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } 
        }
        @media (max-width: 600px)  { 
          .stella-accounts-stats { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important; 
          } 
        }
        
        .stat-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
      
      {cards.map((card, idx) => {
        const bgStart = card.variant === "card-rose" ? "#C07E88" : "#758390";
        const bgEnd   = card.variant === "card-rose" ? "#B76E79" : "#657582";
        let Icon = ReceiptText;
        if (card.label.includes("Total pendiente")) Icon = WalletCards;
        if (card.label.includes("cobrado")) Icon = HandCoins;

        return (
          <div
            key={idx}
            className="stat-card-hover"
            style={{
              background: `linear-gradient(to bottom right, ${bgStart}, ${bgEnd})`,
              borderRadius: 16,
              padding: "clamp(14px, 3.5vw, 24px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
              gap: 16,
              minHeight: "clamp(110px, 15vw, 130px)",
              cursor: "default",
            }}
          >
            {/* Header: Label + Small Icon */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
              <p style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
                margin: 0,
                lineHeight: 1.2,
                maxWidth: "80%",
              }}>
                {card.label}
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

            {/* Body: Value */}
            <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
              <p style={{
                fontFamily: "var(--font-marcellus, serif)",
                fontSize: "clamp(1.3rem, 4vw, 2.2rem)", 
                fontWeight: 400,
                margin: 0, 
                lineHeight: 1,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {card.value}
              </p>
            </div>

            {/* Decorative Background Icon */}
            <div style={{
              position: "absolute",
              right: "-10%",
              bottom: "-15%",
              opacity: 0.1,
              transform: "rotate(-15deg)",
              pointerEvents: "none",
              zIndex: 1
            }}>
              <Icon size={100} color="#FFFFFF" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
