"use client";

import { useState } from "react";
import { Producto } from "../type";
import StockBadge from "./StockBadge";
import ProductModal from "./ProductModal";

export default function ProductRow({ producto }: { producto: Producto }) {
  const [open, setOpen] = useState(false);

  function handleSave(updated: Producto) {
    console.log("Producto actualizado:", updated);
    // aquí luego va Supabase update TODO
    setOpen(false);
  }

  return (
    <>
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
          <button className="text-blue-600 text-sm">Ver</button>
        </td>
        <td className="px-4 py-3 text-right">
          <button
            className="text-gray-600 text-sm"
            onClick={() => setOpen(true)}
          >
            Editar
          </button>
        </td>
      </tr>

      {open && (
        <ProductModal
          producto={producto}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
