"use client";

import { Package, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  total: number;
  activas: number;
  finalizadas: number;
  canceladas: number;
}

export default function StatsCards(props: StatsCardsProps) {
  const stats = [
    { 
      label: "Total Consignaciones", 
      value: props.total, 
      icon: Package,
      gradient: "from-[#C07E88] to-[#B76E79]", // Rose Gold
    },
    { 
      label: "Consignaciones Activas", 
      value: props.activas, 
      icon: Clock,
      gradient: "from-[#758390] to-[#657582]", // Charcoal/Gray
    },
    { 
      label: "Ventas Finalizadas", 
      value: props.finalizadas, 
      icon: CheckCircle,
      gradient: "from-[#C07E88] to-[#B76E79]", // Rose Gold
    },
    { 
      label: "Entregas Canceladas", 
      value: props.canceladas, 
      icon: XCircle,
      gradient: "from-[#758390] to-[#657582]", // Charcoal/Gray
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
      {stats.map((item, idx) => {
        const Icon = item.icon;

        return (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-[24px] p-6 text-left transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-opacity duration-500`} />

            {/* Decorative Elements */}
            <div 
              className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"
              style={{ color: 'white' }}
            >
              <Icon size={120} strokeWidth={1} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[0.65rem] font-bold text-white/70 uppercase tracking-[0.2em] font-sans">
                    {item.label}
                  </p>
                  <h3 className="text-3xl font-bold text-white font-serif tracking-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
                    {item.value.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-white/50 text-[0.7rem] font-medium">
                <TrendingUp size={14} className="text-white/80" />
                <span className="font-sans uppercase tracking-wider">Historial Detallado</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
