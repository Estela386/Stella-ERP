"use client";

import { Producto } from "@/lib/models";
import { useState } from "react";

interface CartItemProps {
  producto: Producto;
  cantidad: number;
  onCantidadChange: (newCantidad: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  producto,
  cantidad,
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
    <div className="flex items-center gap-6 pb-6 border-b border-[#d6c1b1] last:border-b-0">
      {/* Product Image */}
      <div className="w-24 h-24 bg-[#e5d3c2] rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-[#7c5c4a] text-sm text-center px-2">
          {producto.url_imagen || "Imagen"}
        </span>
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-[#7c5c4a] mb-1">
          {producto.nombre}
        </h3>
        <p className="text-xs text-[#a89080] mb-3">
          ${(producto.precio || 0).toLocaleString()}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="w-6 h-6 rounded border border-[#c4b0a1] flex items-center justify-center text-[#7c5c4a] hover:bg-[#f5efe8] transition-colors text-sm"
          >
            −
          </button>
          <span className="w-8 text-center text-sm text-[#7c5c4a]">
            {cantidad}
          </span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 rounded border border-[#c4b0a1] flex items-center justify-center text-[#7c5c4a] hover:bg-[#f5efe8] transition-colors text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex flex-col items-end gap-3">
        <p className="text-sm font-semibold text-[#7c5c4a]">
          ${subtotal.toLocaleString()}
        </p>
        <button
          onClick={onRemove}
          className="text-xs text-[#b8696c] hover:text-[#9d5559] transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
