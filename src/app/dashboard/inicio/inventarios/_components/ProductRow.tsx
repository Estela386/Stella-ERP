"use client";

import { Producto } from "../type";
import StockBadge from "./StockBadge";
import { Pencil, Trash2 } from "lucide-react";

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
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-sans)" }}>JOY-{producto.id}</td>
      <td className="px-4 py-3" style={{ fontFamily: "var(--font-marcellus)", fontSize: "1rem", fontWeight: 400 }}>{producto.nombre}</td>
      <td className="px-4 py-3" style={{ fontFamily: "var(--font-sans)" }}>{producto.categoria.nombre}</td>
      <td className="px-4 py-3 text-center">
        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
          producto.tipo === "fabricado" 
            ? "bg-[#8c9768]/15 text-[#8c9768]" 
            : "bg-[#b76e79]/15 text-[#b76e79]"
        }`} style={{ fontFamily: "var(--font-sans)" }}>
          {producto.tipo === "fabricado" ? "Fabricado" : "Revendido"}
        </span>
      </td>
      <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-sans)" }}>{producto.stock_actual}</td>
      <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-marcellus)", fontWeight: 400, fontSize: "1rem" }}>${producto.precio}</td>
      <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-sans)" }}>${producto.costo}</td>
      <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-sans)" }}>
        ${producto.costo_mayorista || "N/A"}
      </td>

      {/* Badge de stock */}
      <td className="px-4 py-3 items-cente">
        <div className="flex justify-center items-center">
          <StockBadge
            actual={producto.stock_actual}
            minimo={producto.stock_min}
          />
        </div>
      </td>

      {/* Personalizable */}
      <td className="px-4 py-3 flex justify-center items-center">
        <div
          className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
            producto.es_personalizable
              ? "bg-[#b76e79]/15 text-[#b76e79]"
              : "bg-gray-100 text-[#708090]"
          }`}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {producto.es_personalizable ? "Sí" : "No"}
        </div>
      </td>

      {/* Editar / Eliminar */}
      <td className="px-4 py-3 text-right space-x-3">
        <button
          className="text-[#708090] hover:text-[#B76E79] transition"
          onClick={() => onEdit?.(producto)}
        >
          <Pencil size={18} />
        </button>

        <button
          className="text-[#708090] hover:text-red-600 transition"
          onClick={() => onDelete?.(producto.id, producto.nombre || undefined)}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
