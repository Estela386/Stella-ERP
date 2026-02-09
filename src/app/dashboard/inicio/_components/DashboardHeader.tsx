export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">
          Gestión de Ventas
        </h1>
        <p className="text-sm text-[#8C9796]">
          Registro y seguimiento de transacciones
        </p>
      </div>

      <button
        className="
          bg-[#E28A2D]
          text-white
          px-6 py-3
          rounded-full
          text-sm font-medium
          shadow
          hover:bg-[#CF7C24]
          transition
        "
      >
        + Nueva Venta
      </button>
    </div>
  );
}
