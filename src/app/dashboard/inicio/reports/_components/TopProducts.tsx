import React, { useState } from "react";
import ProductModal from "./ProductModal";
import { Producto } from "../type";

export default function TopProducts() {
  const productos: Producto[] = [
    {
      id: 1,
      nombre: "Anillo 1ct",
      total: "$157,500",
      precio: "$157,500",
      costo: "$120,000",
      stock_actual: 10,
      stock_min: 2,
      categoria: "Anillos",
    },
    {
      id: 2,
      nombre: "Collar Perlas",
      total: "$33,820",
      precio: "$33,820",
      costo: "$20,000",
      stock_actual: 5,
      stock_min: 1,
      categoria: "Collares",
    },
    {
      id: 3,
      nombre: "Pulsera Tennis",
      total: "$114,400",
      precio: "$114,400",
      costo: "$90,000",
      stock_actual: 7,
      stock_min: 2,
      categoria: "Pulseras",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl md:text-2xl font-semibold text-[#708090]">
        Productos Más Vendidos
      </h3>

      <div className="space-y-3">
        {productos.map((p, i) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
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
                {p.nombre}
              </p>
            </div>

            <p className="font-bold text-lg md:text-xl text-[#708090]">
              {p.total}
            </p>
          </div>
        ))}
      </div>

      <ProductModal
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
