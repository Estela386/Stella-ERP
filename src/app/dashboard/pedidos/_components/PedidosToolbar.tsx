"use client";

import { PedidoEstado } from "../type";

type Props = {
  filtro: PedidoEstado | "TODOS";
  setFiltro: (value: PedidoEstado | "TODOS") => void;
  search: string;
  setSearch: (value: string) => void;
};

export default function PedidosToolbar({
  filtro,
  setFiltro,
  search,
  setSearch,
}: Props) {
  const estados = [
    "TODOS",
    "PENDIENTE",
    "EN_PRODUCCION",
    "EN_TALLER",
    "ENTREGADO",
  ];

  return (
    <div
      className="
        bg-[#F6F4EF]
        p-4 sm:p-5
        rounded-2xl
        border border-[#8C9796]/40
        shadow-sm
        flex flex-col gap-4
      "
    >
      {/* 🔎 Buscador */}
      <div className="flex flex-col gap-1 w-full sm:max-w-sm">
        <span className="text-xs tracking-wide text-[#708090] uppercase">
          Buscar pedido
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cliente o código"
          className="
            w-full
            rounded-full
            border border-[#8C9796]/40
            bg-white
            px-5 py-2.5
            text-sm text-[#708090]
            placeholder:text-[#8C9796]
            transition
            focus:outline-none
            focus:border-[#B76E79]
            focus:ring-1 focus:ring-[#B76E79]
            shadow-sm
          "
        />
      </div>

      {/* 🎛️ Filtros */}
      <div
        className="
          flex
          gap-2
          overflow-x-auto
          pb-2
          scrollbar-hide
        "
      >
        {estados.map((estado) => (
          <button
            key={estado}
            onClick={() =>
              setFiltro(estado as PedidoEstado | "TODOS")
            }
            className={`
              whitespace-nowrap
              px-3 sm:px-4
              py-2
              rounded-xl
              text-xs sm:text-sm
              font-medium
              transition
              shadow-sm
              ${
                filtro === estado
                  ? "bg-[#B76E79] text-[#F6F4EF]"
                  : "bg-[#708090] text-[#F6F4EF] hover:bg-[#5f6f7f]"
              }
            `}
          >
            {estado.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
