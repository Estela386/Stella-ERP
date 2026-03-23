"use client";

import { FC } from "react";
import { Producto, Categoria } from "@lib/models";

interface Props {
  categoria: Categoria & { productos: Producto[] };
  onClose: () => void;
}

const CategoryModal: FC<Props> = ({ categoria, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-[0_20px_56px_rgba(140,151,104,0.22)] border border-[rgba(112,128,144,0.18)] max-h-[90vh] flex flex-col">
        
        <header className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <p className="text-[#8c9768] text-[0.65rem] font-medium uppercase tracking-[0.18em] font-sans">Categoría</p>
            <h2 className="text-3xl font-serif text-[#4a5568]">
              {categoria.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all text-[#708090]"
          >
            &times;
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {categoria.productos.length === 0 ? (
            <div className="text-center py-12 bg-[#f6f4ef]/30 rounded-2xl border border-dashed border-[rgba(112,128,144,0.2)]">
              <p className="font-serif text-[#708090]">No hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categoria.productos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[rgba(112,128,144,0.12)] rounded-2xl p-5 shadow-[0_2px_12px_rgba(140,151,104,0.05)] hover:shadow-[0_12px_24px_rgba(140,151,104,0.12)] transition-all flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif text-[#4a5568] group-hover:text-[#b76e79] transition-colors">{p.nombre}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.65rem] font-medium text-[#708090] uppercase tracking-wide opacity-60">Stock Actual:</span>
                      <span className="text-sm font-sans font-medium text-[#4a5568]">{p.stock_actual}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#708090] opacity-60 uppercase tracking-tighter mb-0.5">Precio</p>
                    <span className="text-xl font-serif text-[#b76e79] font-medium">${p.precio}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-[rgba(112,128,144,0.12)] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-[#b76e79] text-[#f6f4ef] rounded-[6px] text-[0.8rem] font-sans tracking-[0.04em] hover:shadow-[0_10px_26px_rgba(183,110,121,0.32)] transition-all"
          >
            Cerrar sección
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;