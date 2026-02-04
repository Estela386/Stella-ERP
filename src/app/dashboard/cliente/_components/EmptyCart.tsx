"use client";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Empty Cart Icon */}
      <div className="w-20 h-20 bg-[#e5d3c2] rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🛒</span>
      </div>

      {/* Messages */}
      <h2 className="text-xl font-medium text-[#7c5c4a] mb-2">
        Tu carrito está vacío
      </h2>
      <p className="text-sm text-[#a89080] mb-6">
        Explora nuestros catálogos y encuentra la opción perfecta
      </p>

      {/* Action Button */}
      <button className="bg-[#b8696c] hover:bg-[#9d5559] text-white font-medium py-2 px-6 rounded-lg transition-colors">
        Añadir compras
      </button>
    </div>
  );
}
