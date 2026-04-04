"use client";

interface CartSummaryProps {
  subtotal: number;
  descuento?: number;
  iva: number;
  total: number;
  onCheckout: () => void;
  onRaiseOrder?: () => void;
  isWholesaler?: boolean;
}

export default function CartSummary({
  subtotal,
  descuento = 0,
  iva,
  total,
  onCheckout,
  onRaiseOrder,
  isWholesaler = false,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-[#d6c1b1] p-6 sticky top-20">
      <h2 className="text-lg font-semibold text-[#7c5c4a] mb-5">
        Resumen de Pedido
      </h2>

      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#7c5c4a]">Subtotal</span>
          <span className="text-[#7c5c4a]">${subtotal.toLocaleString()}</span>
        </div>

        {/* Descuento */}
        {descuento > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#7c5c4a]">Descuento</span>
            <span className="text-green-600">
              -${descuento.toLocaleString()}
            </span>
          </div>
        )}

        {/* IVA */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#7c5c4a]">IVA (19%)</span>
          <span className="text-[#7c5c4a]">${iva.toLocaleString()}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#d6c1b1]"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#7c5c4a]">Total</span>
          <span className="font-bold text-lg text-[#7c5c4a]">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-[#b8696c] hover:bg-[#9d5559] text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
      >
        Procesar Compra
      </button>

      {/* Raise Order Button for Wholesalers */}
      {isWholesaler && onRaiseOrder && (
        <button
          onClick={onRaiseOrder}
          className="w-full bg-[#708090] hover:bg-[#4a5568] text-white font-medium py-3 px-4 rounded-lg transition-colors border border-black/10"
        >
          Levantar Pedido
        </button>
      )}

      {/* Info Text */}
      <p className="text-xs text-[#a89080] text-center mt-4">
        El pago se procesará de forma segura
      </p>
    </div>
  );
}
