"use client";

import { PedidoEstado } from "../type";
import { Search, Filter, Settings2 } from "lucide-react";

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
  const estados: (PedidoEstado | "TODOS")[] = [
    "TODOS",
    "PENDIENTE",
    "EN_PRODUCCION",
    "EN_TALLER",
    "ENTREGADO",
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 w-full">
      
      {/* 🔎 Búsqueda con Icono Premium */}
      <div className="relative w-full md:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#94A3B8] group-focus-within:text-[#B76E79] transition-colors" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca por cliente, id o estado..."
          className="w-full bg-[#F8FAFC] border-2 border-transparent pl-14 pr-5 py-4 rounded-2xl text-sm font-bold text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#B76E79]/20 transition-all font-sans"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Settings2 className="h-5 w-5 text-[#94A3B8]/30 group-hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>

      {/* 🎛️ Filtros Rápidos */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        <div className="flex items-center gap-2 p-1.5 bg-[#F8FAFC] rounded-2xl border border-black/5">
            {estados.map((estado) => {
              const isSelected = filtro === estado;
    
              return (
                <button
                  key={estado}
                  onClick={() => setFiltro(estado)}
                  className={`
                    px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap
                    ${isSelected 
                      ? 'bg-white text-[#B76E79] shadow-sm scale-105 border border-[#B76E79]/10' 
                      : 'text-[#94A3B8] hover:text-[#708090] hover:bg-white/50'}
                  `}
                >
                  {estado.replace("_", " ")}
                </button>
              );
            })}
        </div>
        <button className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[#94A3B8] hover:text-[#B76E79] hover:border-[#B76E79]/30 transition-all shadow-sm">
            <Filter size={18} />
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
