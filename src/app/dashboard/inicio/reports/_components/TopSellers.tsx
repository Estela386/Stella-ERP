import React, { useState } from "react";
import SellerModal from "./SellerModal";

interface Vendedor {
  id: number;
  nombre: string;
  total: string;
}

export default function TopSellers() {
  const vendedores: Vendedor[] = [
    { id: 1, nombre: "Ana Martínez", total: "$226,800" },
    { id: 2, nombre: "Carlos López", total: "$198,600" },
    { id: 3, nombre: "María Torres", total: "$169,200" },
  ];

  const [selectedSeller, setSelectedSeller] = useState<Vendedor | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl md:text-2xl font-semibold text-[#708090]">
        Mejores Vendedores
      </h3>

      <div className="space-y-3">
        {vendedores.map((v, i) => (
          <div
            key={v.id}
            onClick={() => setSelectedSeller(v)}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-xl border bg-white transition hover:shadow-lg cursor-pointer"
            style={{
              borderColor: "#B76E79",
              boxShadow: "0 8px 18px rgba(140,151,150,0.35)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm"
                style={{ background: "#B76E79", color: "#F6F4EF" }}
              >
                {i + 1}
              </span>

              <p className="text-base md:text-lg font-medium text-[#708090]">
                {v.nombre}
              </p>
            </div>

            <p className="font-bold text-lg md:text-xl text-[#708090]">
              {v.total}
            </p>
          </div>
        ))}
      </div>

      <SellerModal
        vendedor={selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />
    </div>
  );
}
