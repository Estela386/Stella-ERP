"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  rating?: number;
  category?: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23e5d3c2' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%237c5c4a' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating = 5,
  category,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = !image || imageError ? PLACEHOLDER_IMAGE : image;

  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-[#e5d3c2] rounded-lg overflow-hidden mb-4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          priority={false}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div>
        {category && (
          <p className="text-xs text-[#7c5c4a] uppercase tracking-wider mb-1">
            {category}
          </p>
        )}
        <h3 className="text-sm font-medium text-[#7c5c4a] mb-2 group-hover:text-[#5c4a37] transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < rating ? "text-[#d4a574]" : "text-[#d6c1b1]"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-semibold text-[#7c5c4a]">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
