"use client";

import { Insumo } from "@lib/models";
import { FiPackage, FiActivity, FiAlertCircle, FiArrowRight } from "react-icons/fi";

type Props = {
  material: Insumo;
  onClick: () => void;
};

export default function MaterialCard({ material, onClick }: Props) {
  const isLowStock = material.cantidad > 0 && material.cantidad < (material.stock_minimo || 5);
  const isAgotado = material.cantidad === 0;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer bg-white rounded-[24px] p-6 border border-[rgba(112,128,144,0.12)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
    >
      {/* Decorative gradient corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${
        isAgotado ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
      }`} />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="p-3 rounded-2xl bg-[#F6F4EF] text-[#b76e79] group-hover:bg-[#b76e79] group-hover:text-white transition-colors duration-500 shadow-inner">
          <FiPackage size={22} />
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest ${
          isAgotado 
            ? 'bg-rose-100 text-rose-600 border border-rose-200' 
            : isLowStock 
              ? 'bg-amber-100 text-amber-600 border border-amber-200' 
              : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isAgotado ? 'bg-rose-600' : isLowStock ? 'bg-amber-600' : 'bg-emerald-600'
          }`} />
          {isAgotado ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'Disponible'}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <p className="text-[0.65rem] font-bold text-[#8C9768] uppercase tracking-[0.2em] font-sans opacity-80">
          {material.tipo}
        </p>
        <h3 className="text-xl font-bold text-[#4A5568] font-serif leading-tight group-hover:text-[#b76e79] transition-colors line-clamp-1" style={{ fontFamily: "var(--font-marcellus)" }}>
          {material.nombre}
        </h3>
      </div>

      {/* Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-[rgba(112,128,144,0.08)]">
        <div className="space-y-1">
          <span className="flex items-center gap-1 text-[0.6rem] font-bold text-[#708090] uppercase tracking-wider opacity-60">
            <FiActivity size={10} /> Cantidad
          </span>
          <p className={`text-lg font-bold font-serif ${isAgotado ? 'text-rose-500' : isLowStock ? 'text-amber-500' : 'text-[#4a5568]'}`} style={{ fontFamily: "var(--font-marcellus)" }}>
            {material.cantidad}
            <span className="text-[0.65rem] ml-1 font-sans font-medium text-[#708090]">{material.unidad_medida || 'u'}</span>
          </p>
        </div>

        <div className="space-y-1 text-right">
          <span className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-wider opacity-60">Precio Unit.</span>
          <p className="text-lg font-bold font-serif text-[#b76e79]" style={{ fontFamily: "var(--font-marcellus)" }}>
            ${material.precio.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer / Hover Action */}
      <div className="relative z-10 mt-6 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-widest text-[#708090] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="flex items-center gap-2">
          Ver Detalles <FiArrowRight className="translate-x-0 group-hover:translate-x-1 transition-transform" />
        </span>
        {isLowStock && <FiAlertCircle className="text-amber-500 animate-bounce" size={14} />}
      </div>

      {/* Glass gradient highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[rgba(183,110,121,0.03)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}