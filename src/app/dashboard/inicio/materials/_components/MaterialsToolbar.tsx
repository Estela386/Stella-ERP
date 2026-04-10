"use client";

import { FiSearch, FiPlus, FiFilter, FiBriefcase } from "react-icons/fi";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onNewMaterial: () => void;
  onManageSuppliers: () => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

export default function MaterialsToolbar({
  search,
  setSearch,
  onNewMaterial,
  onManageSuppliers,
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-end">
        
        {/* Left Side: Filters */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {/* 🔎 Search Bar */}
          <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
            <label className="text-[0.65rem] font-bold text-[#708090] uppercase tracking-[0.2em] font-sans px-1">
              Buscar Insumos
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#708090] group-focus-within:text-[#b76e79] transition-colors">
                <FiSearch size={18} />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre del material..."
                className="w-full h-[52px] pl-12 pr-6 rounded-[16px] border border-[rgba(112,128,144,0.15)] bg-white text-sm text-[#4a5568] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79]"
              />
            </div>
          </div>

          {/* 🏷️ Category Filter */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-[0.65rem] font-bold text-[#708090] uppercase tracking-[0.2em] font-sans px-1">
              Categoría
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#708090] group-focus-within:text-[#b76e79] transition-colors">
                <FiFilter size={16} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-[52px] pl-11 pr-10 rounded-[16px] border border-[rgba(112,128,144,0.15)] bg-white text-sm text-[#4a5568] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] appearance-none cursor-pointer"
              >
                <option value="TODAS">Todas las categorías</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b76e79] pointer-events-none">
                <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-4 items-center h-[52px]">
          <button
            onClick={onManageSuppliers}
            className="flex items-center gap-2 h-full px-6 rounded-[16px] border border-[rgba(112,128,144,0.3)] bg-white text-[#708090] text-xs font-bold uppercase tracking-wider hover:bg-[#F6F4EF] hover:border-[#708090] hover:text-[#4a5568] transition-all shadow-sm"
          >
            <FiBriefcase size={16} />
            <span className="hidden sm:inline">Proveedores</span>
          </button>

          <button
            onClick={onNewMaterial}
            className="flex items-center gap-2 h-full px-8 rounded-[16px] bg-[#b76e79] text-white text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#a45f69] hover:shadow-[0_10px_20px_rgba(183,110,121,0.25)] hover:-translate-y-0.5 transition-all shadow-lg active:scale-95"
          >
            <FiPlus size={18} />
            <span>Nuevo Material</span>
          </button>
        </div>
      </div>
      
      {/* Decorative underline */}
      <div className="h-px w-full bg-gradient-to-r from-[rgba(112,128,144,0.1)] via-[rgba(112,128,144,0.1)] to-transparent" />
    </div>
  );
}
