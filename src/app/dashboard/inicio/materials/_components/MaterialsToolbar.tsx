"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onNewMaterial: () => void;
  onManageSuppliers: () => void;
}

export default function MaterialsToolbar({
  search,
  setSearch,
  onNewMaterial,
  onManageSuppliers,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[rgba(112,128,144,0.18)] flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center shadow-[0_2px_12px_rgba(140,151,104,0.08)]">
      
      {/* 🔎 FILTRO */}
      <div className="flex flex-col gap-1.5 w-full md:max-w-sm">
        <span className="text-[0.65rem] font-medium text-[#8C9768] uppercase tracking-[0.18em] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
          Filtrar materiales
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full rounded-2xl border border-[rgba(112,128,144,0.25)] bg-[#f6f4ef] px-5 py-2.5 text-sm text-[#4a5568] font-sans focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-[#b76e79] transition-all"
        />
      </div>

      {/* ➕ BOTONES */}
      <div className="flex gap-4 items-end h-full">
        <button
          onClick={onManageSuppliers}
          className="px-6 py-2.5 rounded-[6px] border-[1.5px] border-[rgba(112,128,144,0.25)] text-[#708090] text-[0.8rem] font-serif tracking-[0.04em] hover:border-[#708090] hover:text-[#4a5568] hover:bg-[rgba(112,128,144,0.08)] transition-all duration-220" style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Gestionar Proveedores
        </button>

        <button
          onClick={onNewMaterial}
          className="bg-[#b76e79] text-[#f6f4ef] px-6 py-2.5 rounded-[6px] text-[0.8rem] font-serif tracking-[0.04em] hover:shadow-[0_10px_26px_rgba(183,110,121,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all duration-220 shadow-[0_3px_12px_rgba(183,110,121,0.22)]" style={{ fontFamily: "var(--font-marcellus)" }}
        >
          + Nuevo material
        </button>
      </div>
    </div>
  );
}
