"use client";

import { Producto } from "../type";
import StockBadge from "./StockBadge";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductRowProps {
  producto: Producto;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number, nombre?: string) => void;
}

export default function ProductRow({
  producto,
  onEdit,
  onDelete,
}: ProductRowProps) {
  return (
    <tr className="border-b border-[rgba(112,128,144,0.08)] hover:bg-[#F8F6F4]/60 transition-all group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 rounded-xl overflow-hidden bg-[#F6F4EF] border border-[rgba(112,128,144,0.12)] flex-shrink-0 flex items-center justify-center text-[#708090]/40 group-hover:scale-105 transition-transform">
            {producto.url_imagen ? (
              <img 
                src={producto.url_imagen} 
                alt={producto.nombre || ""} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={20} strokeWidth={1.5} />
            )}
          </div>
          <span className="font-bold text-[#1C1C1C] text-sm tracking-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
            {producto.nombre}
          </span>
        </div>
      </td>
      <td className="px-4 py-4" style={{ fontFamily: "var(--font-sans)" }}>
        <span className="text-[#4a5568] font-medium text-sm">{producto.categoria?.nombre}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className={`px-3 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest ${
          producto.tipo === "fabricado" 
            ? "bg-[#8c9768]/10 text-[#8c9768]" 
            : "bg-[#b76e79]/10 text-[#b76e79]"
        }`} style={{ fontFamily: "var(--font-sans)" }}>
          {producto.tipo === "fabricado" ? "Fabricado" : "Revendido"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="font-bold text-[#4a5568] text-sm">{producto.stock_actual}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-[#b76e79] font-black text-base" style={{ fontFamily: "var(--font-marcellus)" }}>${producto.precio?.toFixed(2)}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-[#708090] font-medium text-xs">${producto.costo?.toFixed(2)}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-[#708090] font-medium text-xs">
          ${producto.costo_mayorista ? producto.costo_mayorista.toFixed(2) : "N/A"}
        </span>
      </td>

      {/* Badge de stock */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <StockBadge
            actual={producto.stock_actual || 0}
            minimo={producto.stock_min || 0}
          />
        </div>
      </td>

      {/* Personalizable */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <div
            className={`px-3 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest ${
              producto.es_personalizable
                ? "bg-[#b76e79]/15 text-[#b76e79] border border-[#b76e79]/20"
                : "bg-[rgba(112,128,144,0.08)] text-[#708090]"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {producto.es_personalizable ? "Sí" : "No"}
          </div>
        </div>
      </td>

      {/* Editar / Eliminar */}
      <td className="px-4 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#708090] hover:bg-[#b76e79] hover:text-white transition-all shadow-sm border border-[rgba(112,128,144,0.08)]"
            onClick={() => onEdit?.(producto)}
          >
            <Pencil size={15} />
          </button>

          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#708090] hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-[rgba(112,128,144,0.08)]"
            onClick={() => onDelete?.(producto.id, producto.nombre || undefined)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
