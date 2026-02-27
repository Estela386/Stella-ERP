"use client";

import { Producto } from "../type";
import StockBadge from "./StockBadge";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ProductRowProps {
  producto: Producto;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
}

export default function ProductRow({
  producto,
  onEdit,
  onDelete,
}: ProductRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-center">JOY-{producto.id}</td>
      <td className="px-4 py-3">{producto.nombre}</td>
      <td className="px-4 py-3">{producto.categoria.nombre}</td>
      <td className="px-4 py-3 text-center">{producto.stock_actual}</td>
      <td className="px-4 py-3 text-center">${producto.precio}</td>

      {/* 🔹 Badge de stock */}
      <td className="px-4 py-3 items-cente">
        <div className="flex justify-center items-center">
        <StockBadge
          actual={producto.stock_actual}
          minimo={producto.stock_min}
        />
        </div>
      </td>

      {/* 🔹 Ver */}
      <td className="px-4 py-3 flex justify-center items-center">
        <button className="text-[#708090] hover:text-[#B76E79] transition">
          <Eye size={18} />
        </button>
      </td>

      {/* 🔹 Editar / Eliminar */}
      <td className="px-4 py-3 text-right space-x-3">
        <button
          className="text-[#708090] hover:text-[#B76E79] transition"
          onClick={() => onEdit?.(producto)}
        >
          <Pencil size={18} />
        </button>

        <button
          className="text-[#708090] hover:text-red-600 transition"
          onClick={() => onDelete?.(producto.id)}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}