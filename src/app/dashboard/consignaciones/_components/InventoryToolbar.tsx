export default function InventoryToolbar({
  search,
  setSearch,
  rol,
}: {
  search: string;
  setSearch: (value: string) => void;
  rol: "admin" | "mayorista";
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      {/* Filtro */}
      <div className="flex items-center gap-5">
        <span className="text-sm font-medium text-[#708090]">  Filtrar</span>

        <input
          className="
            w-72
            rounded-lg
            px-3
            py-2
            bg-[#f6f4ef]
            border border-[#708090]
            shadow-sm shadow-[#8c8c76]
            text-[#2f2f2f]
            placeholder:text-[#708090]
            focus:outline-none
            focus:ring-2
            focus:ring-[#708090]
          "
          placeholder="Buscar por código o nombre"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Botón solo para admin */}
      {rol === "admin" && (
        <button
          className="
            flex items-center gap-2
            rounded-lg
            bg-[#B76E79]
            px-4
            py-2
            text-sm
            font-medium
            text-white
            shadow
            hover:bg-[#a85f69]
            transition
          "
        >
         + Nueva consignación
        </button>
      )}
    </div>
  );
}
