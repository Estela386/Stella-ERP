"use client";

import ProductCard from "./ProductCard";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Aretes Oro",
    price: 5100,
    image: "Aretes Oro",
    category: "Aretes",
    rating: 5,
  },
  {
    id: 2,
    name: "Pulsera oro",
    price: 14500,
    image: "Pulsera oro",
    category: "Pulseras",
    rating: 5,
  },
  {
    id: 3,
    name: "Collar rosado",
    price: 18000,
    image: "Collar rosado",
    category: "Collares",
    rating: 5,
  },
  {
    id: 4,
    name: "Aretes de oro",
    price: 8800,
    image: "Aretes de oro",
    category: "Aretes",
    rating: 5,
  },
];

export default function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-light text-[#7c5c4a] mb-2">
          Colección Destacada
        </h2>
        <p className="text-[#7c5c4a]">
          Nuestros productos más populares y recomendados
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {FEATURED_PRODUCTS.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border-2 border-[#7c5c4a] text-[#7c5c4a] rounded-lg hover:bg-[#e5d3c2] transition-colors font-medium">
          Ver Todo el Catálogo
        </button>
      </div>
    </section>
  );
}
