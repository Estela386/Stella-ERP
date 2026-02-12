export default function VentaResumen() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 flex justify-between items-center">
      <div>
        <p className="text-sm text-[#708090]">Total</p>
        <p className="text-3xl font-semibold text-[#B76E79]">$0.00</p>
      </div>

      <button
        className="
          bg-[#B76E79]
          text-white
          px-8 py-4
          rounded-full
          text-sm font-medium
          shadow-md shadow-[#8C9796]/40
          hover:bg-[#a45f69]
          transition
        "
      >
        Confirmar Venta
      </button>
    </div>
  );
}
