"use client";

import { Producto } from "@/lib/models";
import Image from "next/image";

interface CartItemProps {
  producto: Producto;
  cantidad: number;
  personalizacion?: Record<string, unknown>;
  onCantidadChange: (newCantidad: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  producto,
  cantidad,
  personalizacion,
  onCantidadChange,
  onRemove,
}: CartItemProps) {
  const subtotal = (producto.precio || 0) * cantidad;

  const handleIncrease = () => {
    onCantidadChange(cantidad + 1);
  };

  const handleDecrease = () => {
    if (cantidad > 1) {
      onCantidadChange(cantidad - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-[#e5d3c2]/50 last:border-b-0">
      
      {/* Top Section / Left Section */}
      <div className="flex gap-4 sm:gap-6 flex-1">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F6F4EF] rounded-[1.5rem] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner">
          <Image
            src={producto.url_imagen || "/images/placeholder.png"}
            alt={producto.nombre || "Producto"}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center flex-grow">
          <h3 className="text-sm sm:text-base font-bold text-[#708090] leading-tight mb-1">
            {producto.nombre}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#B76E79] mb-3">
            ${(producto.precio || 0).toLocaleString()} MXN
          </p>
          
          {/* Personalización */}
          {personalizacion && Object.keys(personalizacion).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {Object.entries(personalizacion).map(([key, value]) => {
                const valStr = String(value);
                const hasPipe = valStr.includes('|');
                const [name, colorHex] = hasPipe ? valStr.split('|') : [valStr, ''];
                const isColor = hasPipe && colorHex.startsWith('#');
                
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8C9796] bg-[#f8f9fa] border border-black/5 rounded-lg px-2 py-1 shadow-sm"
                  >
                    <span className="text-[#94A3B8] font-medium">{key}:</span>
                    {isColor && (
                        <span className="w-2.5 h-2.5 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: colorHex }} />
                    )}
                    {name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section / Right Section (Controls & Subtotal) */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 bg-[#f8f9fa] sm:bg-transparent p-3 sm:p-0 rounded-[1.5rem] sm:rounded-none">
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 bg-white sm:bg-transparent rounded-xl px-2 py-1 sm:p-0 shadow-sm sm:shadow-none border border-black/5 sm:border-transparent">
          <button
            onClick={handleDecrease}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#708090] hover:bg-[#F6F4EF] hover:text-[#B76E79] transition-all text-lg"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-bold text-[#708090]">
            {cantidad}
          </span>
          <button
            onClick={handleIncrease}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#708090] hover:bg-[#F6F4EF] hover:text-[#B76E79] transition-all text-lg"
          >
            +
          </button>
        </div>

        {/* Subtotal & Delete */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
          <p className="text-sm font-black text-[#708090] font-mono">
            ${subtotal.toLocaleString()}
          </p>
          <button
            onClick={onRemove}
            className="text-[10px] font-bold tracking-widest uppercase text-red-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

    </div>
  );
}
