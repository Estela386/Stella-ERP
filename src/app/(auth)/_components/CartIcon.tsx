"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";

export default function CartIcon() {
  const { items } = useCart();

  const totalProductos = items.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <div className="relative cursor-pointer">
      <ShoppingCart size={24} />

      {totalProductos > 0 && (
        <span
          className="
          absolute
          -top-2
          -right-2
          bg-[#7c5c4a]
          text-white
          text-xs
          w-5
          h-5
          flex
          items-center
          justify-center
          rounded-full
          "
        >
          {totalProductos}
        </span>
      )}
    </div>
  );
}
