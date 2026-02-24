"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function MaterialsToolbar({ search, setSearch }: Props) {
  return (
    <div
      className="
        bg-white
        p-5
        rounded-2xl
        border border-[#8C9796]/25
        flex flex-col md:flex-row
        gap-4
        justify-between
        items-stretch md:items-center
      "
    >
      {/* 🔎 FILTRO */}
      <div className="flex flex-col gap-1 w-full md:max-w-sm">
        <span className="text-xs tracking-wide text-[#8C9796] uppercase">
          Filtrar
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar material..."
          className="
            w-full
            rounded-full
            border border-[#E2E2E2]
            bg-[#F8F6F2]
            px-5 py-2.5
            text-sm text-[#1C1C1C]
            placeholder:text-[#9A9A9A]
            transition

            focus:outline-none
            focus:border-[#B76E79]
            focus:ring-1 focus:ring-[#B76E79]

            hover:border-[#C8B6B0]
          "
        />
      </div>

      {/* ➕ BOTONES */}
      <div className="flex gap-3">
        <button
          className="
            bg-[#708090]
            text-white
            px-5 py-2.5
            rounded-full
            text-sm font-medium
            shadow-sm
            hover:bg-[#5f6f7f]
            hover:shadow-md
            transition
          "
        >
          + Categoría
        </button>

        <button
          className="
            bg-[#B76E79]
            text-white
            px-5 py-2.5
            rounded-full
            text-sm font-medium
            shadow-sm
            hover:bg-[#A45F69]
            hover:shadow-md
            transition
          "
        >
          + Nuevo material
        </button>
      </div>
    </div>
  );
}