"use client";

import { useState } from "react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function InventoryToolbar({ search, setSearch }: Props) {
  const [openNew, setOpenNew] = useState(false);

  return (
    <div
      className="
       w-fit

    bg-white
    p-4
    rounded-2xl
    border border-[#8C9796]/25
    shadow-sm
      "
    >
      {/* BUSCADOR */}
      <div className="flex flex-col gap-1 w-[280px] sm:w-[340px] md:w-[380px]">
        <span className="text-xs tracking-wide text-[#8C9796] uppercase" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          Filtrar
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por código o nombre de la pieza"
          className="
            w-full
            h-10
            rounded-full
            border border-[#E2E2E2]
            bg-[#f6f4ef]
            px-5
            text-sm text-[#708090]
            placeholder:text-[#9A9A9A]
            transition-all duration-300
 
            focus:outline-none
            focus:border-[#B76E79]
            focus:ring-1 focus:ring-[#B76E79]
 
            hover:border-[#708090]/50
          "
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </div>
    </div>
  );
}