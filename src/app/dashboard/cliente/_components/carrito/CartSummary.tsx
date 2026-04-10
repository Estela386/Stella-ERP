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
    <div className="bg-white rounded-[2rem] border border-black/5 p-6 lg:p-8 shadow-xl sticky top-24">
      <h2 className="text-xl font-bold text-[#708090] mb-6">
        Resumen de Pedido
      </h2>

      <div className="space-y-4 mb-8">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#8C9796] font-medium">Subtotal</span>
          <span className="text-[#708090] font-bold">${subtotal.toLocaleString()}</span>
        </div>

        {/* Descuento */}
        {descuento > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8C9796] font-medium">Descuento</span>
            <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              -${descuento.toLocaleString()}
            </span>
          </div>
        )}

        {/* IVA */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#8C9796] font-medium">IVA (19%)</span>
          <span className="text-[#708090] font-bold">${iva.toLocaleString()}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F6F4EF] pt-4 mt-2">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#708090]">Total Estimado</span>
            <span className="font-black text-2xl text-[#B76E79] font-mono">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-[#B76E79] to-[#8C525A] text-white py-4 rounded-[1.5rem] font-bold text-[15px] shadow-lg shadow-[#B76E79]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          Procesar Compra
        </button>

        {/* Raise Order Button for Wholesalers */}
        {isWholesaler && onRaiseOrder && (
          <button
            onClick={onRaiseOrder}
            className="w-full bg-[#f8f9fa] hover:bg-[#F6F4EF] text-[#708090] border border-black/5 font-bold py-4 px-4 rounded-[1.5rem] transition-all hover:-translate-y-0.5"
          >
            Levantar Pedido Interno
          </button>
        )}
      </div>

      {/* Info Text */}
      <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C9796] text-center mt-6">
        Procesamiento Seguro Garantizado
      </p>
    </div>
  );
}
