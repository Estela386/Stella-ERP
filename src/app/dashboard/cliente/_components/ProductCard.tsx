"use client";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating = 5,
  category,
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-[#e5d3c2] rounded-lg overflow-hidden mb-4">
        <div className="w-full h-full bg-gradient-to-br from-[#e5d3c2] to-[#d6c1b1] flex items-center justify-center">
          <span className="text-[#7c5c4a] text-sm">{image}</span>
        </div>
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
