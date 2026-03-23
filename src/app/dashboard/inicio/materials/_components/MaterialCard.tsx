"use client";

import { Insumo } from "@lib/models";

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
      className="group cursor-pointer bg-white rounded-2xl p-6 border border-[rgba(112,128,144,0.18)] shadow-[0_2px_12px_rgba(140,151,104,0.08)] hover:shadow-[0_18px_40px_rgba(140,151,104,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
    >
      {/* Indicador de estado */}
      {(isLowStock || isAgotado) && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.6rem] font-medium uppercase tracking-wider text-white ${isAgotado ? 'bg-[#b76e79]' : 'bg-[#708090]'}`}>
          {isAgotado ? 'Agotado' : 'Bajo Stock'}
        </div>
      )}

      <header className="mb-4">
        <p className="text-[0.6rem] font-medium text-[#8c9768] uppercase tracking-[0.15em] font-sans mb-1">
          {material.tipo}
        </p>
        <h3 className="font-serif text-xl text-[#4a5568] leading-tight group-hover:text-[#b76e79] transition-colors">
          {material.nombre}
        </h3>
      </header>

      <div className="flex justify-between items-end border-t border-[rgba(112,128,144,0.08)] pt-4">
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-medium text-[#708090] uppercase tracking-wide font-sans opacity-60">Cantidad</span>
          <span className={`text-lg font-serif ${isAgotado ? 'text-red-500' : isLowStock ? 'text-[#b76e79]' : 'text-[#4a5568]'}`}>
            {material.cantidad} <span className="text-xs font-sans opacity-60">{material.unidad_medida || 'u'}</span>
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[0.6rem] font-medium text-[#708090] uppercase tracking-wide font-sans opacity-60">Precio</span>
          <span className="text-lg font-serif text-[#b76e79] font-medium">
            ${material.precio}
          </span>
        </div>
      </div>
    </div>
  );
}