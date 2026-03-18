import React from "react";

interface Vendedor {
  id: number;
  nombre: string;
  total: string;
}

interface Props {
  vendedor: Vendedor | null;
  onClose: () => void;
}

export default function SellerModal({ vendedor, onClose }: Props) {
  if (!vendedor) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
        
        <h2 className="text-xl font-semibold mb-4 text-[#708090]">
          {vendedor.nombre}
        </h2>

        <p className="mb-4 text-gray-800">
          Total vendido:{" "}
          <span className="font-semibold text-[#708090]">
            {vendedor.total}
          </span>
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90"
          style={{ background: "#B76E79" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
