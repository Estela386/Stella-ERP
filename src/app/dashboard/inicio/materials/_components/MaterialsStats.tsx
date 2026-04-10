"use client";

import { Insumo } from "@lib/models";
import { Package, AlertTriangle, XOctagon, Layers, TrendingUp } from "lucide-react";

type Filtro = "TODOS" | "BAJO" | "AGOTADO";

interface Props {
  materiales: Insumo[];
  onFilter: (filtro: Filtro) => void;
  activeFilter: Filtro;
}

export default function MaterialsStats({ materiales, onFilter, activeFilter }: Props) {
  const total = materiales.length;
  const stockBajo = materiales.filter(
    m => m.cantidad > 0 && m.cantidad < (m.stock_minimo || 5)
  ).length;
  const agotados = materiales.filter(m => m.cantidad === 0).length;
  
  // 4ta Estadística: Variedad de Categorías
  const categorias = Array.from(new Set(materiales.map(m => m.tipo).filter(Boolean))).length;

  const stats = [
    { 
      label: "Total de Insumos", 
      value: total, 
      type: "TODOS" as Filtro,
      icon: Package,
      gradient: "from-[#C07E88] to-[#B76E79]", // Rose Gold
      isActionButton: true
    },
    { 
      label: "Próximos a Agotarse", 
      value: stockBajo, 
      type: "BAJO" as Filtro,
      icon: AlertTriangle,
      gradient: "from-[#758390] to-[#657582]", // Charcoal
      isActionButton: true
    },
    { 
      label: "Sin Existencias", 
      value: agotados, 
      type: "AGOTADO" as Filtro,
      icon: XOctagon,
      gradient: "from-[#C07E88] to-[#B76E79]", // Rose Gold
      isActionButton: true
    },
    { 
      label: "Categorías Activas", 
      value: categorias, 
      type: null,
      icon: Layers,
      gradient: "from-[#758390] to-[#657582]", // Charcoal
      isActionButton: false
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.type && activeFilter === item.type;
        const CardWrapper = item.isActionButton ? 'button' : 'div';

        return (
          <CardWrapper
            key={idx}
            onClick={() => item.type && onFilter(item.type)}
            className={`relative group overflow-hidden rounded-[24px] p-6 text-left transition-all duration-500 ${
              item.isActionButton ? 'hover:-translate-y-1 cursor-pointer' : 'cursor-default'
            } ${
              isActive 
                ? 'shadow-2xl' 
                : 'shadow-lg hover:shadow-xl'
            }`}
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
                    {item.value}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-white/50 text-[0.7rem] font-medium">
                {item.isActionButton ? (
                  <>
                    <TrendingUp size={14} className="text-white/80" />
                    <span className="font-sans uppercase tracking-wider">Ver detalles</span>
                  </>
                ) : (
                  <span className="font-sans uppercase tracking-wider opacity-60">Variedad de Materiales</span>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            {isActive && (
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
            )}
          </CardWrapper>
        );
      })}
    </div>
  );
}
