"use client";

import { useRef } from "react";
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
  {
    id: 4,
    author: "A",
    rating: 5,
    title: "Me gustó la variedad",
    comment:
      "Amplia variedad de productos y buenos precios. Definitivamente voy a volver a comprar aquí.",
    avatar: "A",
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full py-24 bg-[##F6F3EF]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-semibold text-[#708090]">
              Últimas reseñas
            </h2>
            <p className="text-[#708090]">
              Opiniones recientes de clientes
            </p>
          </div>
        </div>

        {/* PANEL */}
        <div className="
          bg-[#e9edf1]
          rounded-[36px]
          p-10
          shadow-inner
          border border-[#708090]/20
        ">

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-8">

            {RECENT_REVIEWS.map(review => (
              <div
                key={review.id}
                className="
                  bg-white
                  rounded-2xl
                  p-6
                  shadow-lg
                  border border-[#708090]/20
                  hover:shadow-2xl
                  hover:-translate-y-1
                  transition-all
                "
              >
                {/* STARS */}
                <div className="text-[#B76E79] mb-3 text-lg">
                  ★★★★★
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-[#708090] mb-2">
                  {review.title}
                </h3>

                {/* COMMENT */}
                <p className="text-[#708090]/90 mb-6">
                  {review.comment}
                </p>

                {/* AUTHOR */}
                <div className="flex items-center gap-3 border-t pt-4 border-[#e5e7eb]">
                  <div className="
                    w-10 h-10 rounded-full
                    bg-[#B76E79]/20
                    text-[#B76E79]
                    flex items-center justify-center
                    font-semibold
                  ">
                    {review.avatar}
                  </div>

                  <span className="text-[#708090] font-medium">
                    {review.author}
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* BUTTON */}
        <div className="text-center mt-14">
          <button className="
            bg-[#B76E79]
            text-white
            px-8 py-3
            rounded-full
            font-medium
            shadow-lg
            hover:bg-[#a85f6a]
            hover:shadow-xl
            transition-all
          ">
            Ver todas las reseñas
          </button>
        </div>

      </div>
    </section>
  );
}