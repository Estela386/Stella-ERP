"use client";

import { Package, CheckCircle, XCircle, Clock } from "lucide-react";

interface StatsCardsProps {
  total: number;
  activas: number;
  finalizadas: number;
  canceladas: number;
}

export default function StatsCards(props: StatsCardsProps) {
  const items = [
    { label: "Total Consignaciones", value: props.total, color: "bg-[#B76E79]" },
    { label: "Consignaciones Activas", value: props.activas, color: "bg-[#708090]" },
    { label: "Ventas Finalizadas", value: props.finalizadas, color: "bg-[#B76E79]" },
    { label: "Entregas Canceladas", value: props.canceladas, color: "bg-[#708090]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${item.color} rounded-[2rem] p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col items-start justify-center min-h-[140px]`}
        >
          <p
            className="text-white/70 text-[10px] tracking-[0.25em] uppercase font-bold mb-2"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            {item.label}
          </p>
          <p
            className="text-4xl font-bold text-white tracking-tight leading-none"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {item.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
