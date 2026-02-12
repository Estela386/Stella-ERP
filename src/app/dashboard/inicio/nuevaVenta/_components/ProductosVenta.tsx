export default function ProductosVenta() {
  return (
    <div className="bg-white rounded-2xl shadow-md shadow-[#8C9796]/20 overflow-hidden">
      <div className="bg-[#F6F4EF] px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#708090]">
          Productos en la Venta
        </h2>
      </div>

      <div className="p-6">
        <p className="text-[#8C9796] text-sm">Aún no hay productos agregados</p>
      </div>

      <div className="flex gap-4 p-6 border-t bg-[#F6F4EF]">
        <button
          className="
            bg-[#708090]
            text-[#F6F4EF]
            px-5 py-3
            rounded-xl
            font-medium
            hover:opacity-90
            transition
          "
        >
          Escanear 
        </button>

        <button
          className="
            bg-[#B76E79]
            text-white
            px-5 py-3
            rounded-xl
            font-medium
            hover:bg-[#a45f69]
            transition
          "
        >
          + Agregar 
        </button>
      </div>
    </div>
  );
}
