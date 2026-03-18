"use client"

import { Quote, Star } from "lucide-react"

export type Review = {
  id: number
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  platformIcon?: React.ElementType
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="
      relative
      bg-white
      rounded-2xl
      p-8 pt-10
      shadow-[0_15px_40px_rgba(140,151,104,0.12)]
      border border-[#708090]/10
      flex flex-col
      mt-8
      transition-transform duration-300 hover:-translate-y-2
    ">
      {/* Avatar flotante */}
      <div className="absolute -top-8 left-6">
        <div className="w-16 h-16 rounded-full border-4 border-[#f6f4ef] bg-white overflow-hidden shadow-sm">
          <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Header (Nombre, Rol, Plataforma) */}
      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
          <h3 className="text-lg font-bold text-[#708090]">{review.name}</h3>
          <p className="text-[11px] font-bold text-[#8c9768] uppercase tracking-wider mt-0.5">{review.role}</p>
        </div>
        {review.platformIcon && <review.platformIcon className="w-5 h-5 text-[#b76e79]" />}
      </div>

      {/* Estrellas */}
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < review.rating ? "#b76e79" : "transparent"} 
            className={i < review.rating ? "text-[#b76e79]" : "text-[#708090]/20"} 
          />
        ))}
      </div>

      {/* Quote symbol */}
      <div className="mb-3">
        <Quote className="w-6 h-6 text-[#708090]/15" fill="currentColor" />
      </div>

      {/* Text */}
      <p className="text-sm text-[#708090] leading-relaxed italic">
        "{review.text}"
      </p>
    </div>
  )
}
