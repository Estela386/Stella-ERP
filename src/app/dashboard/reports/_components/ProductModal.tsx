import React from "react";
import { Producto } from "../type";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
}

export default function ProductModal({
  producto,
  onClose,
}: ProductModalProps) {
  if (!producto) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
        
        <h2 className="text-xl font-semibold mb-4 text-[#708090]">
          {producto.nombre}
        </h2>

        {producto.url_imagen && (
          <img
            src={producto.url_imagen}
            alt={producto.nombre}
            className="w-full h-40 object-cover rounded mb-4"
          />
        )}

        <div className="space-y-2 text-gray-800">
          <p>
            Total vendido:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.total ?? "$0"}
            </span>
          </p>

          <p>
            Precio:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.precio ?? "$0"}
            </span>
          </p>

          <p>
            Costo:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.costo ?? "$0"}
            </span>
          </p>

          <p>
            Stock actual:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.stock_actual ?? 0}
            </span>
          </p>

          <p>
            Stock mínimo:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.stock_min ?? 0}
            </span>
          </p>

          <p>
            Categoría:{" "}
            <span className="font-semibold text-[#708090]">
              {producto.categoria ?? "N/A"}
            </span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90"
          style={{ background: "#B76E79" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
