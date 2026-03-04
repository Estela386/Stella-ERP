"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onNewMaterial: () => void; // 👈 nueva prop
}

export default function MaterialsToolbar({
  search,
  setSearch,
  onNewMaterial,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#8C9796]/25 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      
      {/* 🔎 FILTRO */}
      <div className="flex flex-col gap-1 w-full md:max-w-sm">
        <span className="text-xs tracking-wide text-[#8C9796] uppercase">
          Filtrar
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar material..."
          className="w-full rounded-full border border-[#E2E2E2] bg-[#F8F6F2] px-5 py-2.5 text-sm text-[#1C1C1C]"
        />
      </div>

      {/* ➕ BOTONES */}
      <div className="flex gap-3">
        <button
          className="bg-[#708090] text-white px-5 py-2.5 rounded-full text-sm"
        >
          + Categoría
        </button>

        <button
          onClick={onNewMaterial} // 👈 abre modal
          className="bg-[#B76E79] text-white px-5 py-2.5 rounded-full text-sm"
        >
          + Nuevo material
        </button>
      </div>
    </div>
  );
}