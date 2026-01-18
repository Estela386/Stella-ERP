"use client";

import ReviewCard from "./ReviewCard";

const RECENT_REVIEWS = [
  {
    id: 1,
    author: "Rosario",
    rating: 5,
    title: "Amor los productos",
    comment:
      "Excelente calidad de los productos y una atención excepcional. Muy recomendado.",
    avatar: "R",
  },
  {
    id: 2,
    author: "Ariana",
    rating: 5,
    title: "Excelentes aretes",
    comment:
      "Los aretes son hermosos, el envío fue rápido y la calidad excepcional. Volveré a comprar.",
    avatar: "A",
  },
  {
    id: 3,
    author: "Adriana",
    rating: 5,
    title: "Me gustó la variedad",
    comment:
      "Amplia variedad de productos y buenos precios. Definitivamente voy a volver a comprar aquí.",
    avatar: "A",
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full bg-[#e5d3c2] bg-opacity-30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-[#7c5c4a] mb-2">
            Últimas Reseñas
          </h2>
          <p className="text-[#7c5c4a]">
            Lo que nuestros clientes dicen sobre nosotros
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {RECENT_REVIEWS.map(review => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="text-[#7c5c4a] hover:text-[#5c4a37] font-medium text-sm">
            Ver todas las reseñas →
          </button>
        </div>
      </div>
    </section>
  );
}
