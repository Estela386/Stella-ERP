"use client";

import { Producto } from "../type";
import StockBadge from "./StockBadge";

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
    <tr>
      <td className="px-4 py-3">JOY-{producto.id}</td>
      <td className="px-4 py-3">{producto.nombre}</td>
      <td className="px-4 py-3">{producto.categoria.nombre}</td>
      <td className="px-4 py-3">{producto.stock_actual}</td>
      <td className="px-4 py-3">${producto.precio}</td>
      <td className="px-4 py-3">
        <StockBadge
          actual={producto.stock_actual}
          minimo={producto.stock_min}
        />
      </td>
      <td className="px-4 py-3">
        <button className="text-blue-600 text-sm hover:underline">Ver</button>
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          className="text-blue-600 text-sm hover:underline"
          onClick={() => onEdit?.(producto)}
        >
          Editar
        </button>
        <button
          className="text-red-600 text-sm hover:underline"
          onClick={() => onDelete?.(producto.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
