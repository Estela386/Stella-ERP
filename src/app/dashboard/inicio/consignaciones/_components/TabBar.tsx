"use client";

const TABS = [
  { id: "consignaciones", label: "Consignaciones" },
  { id: "mayoristas", label: "Mayoristas" },
  { id: "solicitudes", label: "Solicitudes" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface TabBarProps {
  active: TabId;
  onSelect: (tab: TabId) => void;
  pendientes?: number;
}

export default function TabBar({ active, onSelect, pendientes = 0 }: TabBarProps) {
  return (
    <div className="flex w-full lg:w-auto bg-[#8c8976]/10 p-1 rounded-2xl border border-[#8c8976]/20 overflow-x-auto no-scrollbar">
      {TABS.map(tab => {
        const isActive = active === tab.id;
        const isSolicitudes = tab.id === "solicitudes";
        
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onSelect(tab.id)}
            className={`
              relative flex-1 lg:flex-none px-5 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap
              ${isActive 
                ? "bg-white text-[#b76e79] shadow-sm" 
                : "text-[#708090] hover:bg-white/50"
              }
            `}
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            {tab.label}
            {isSolicitudes && pendientes > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e53e3e] text-white rounded-full w-5 h-5 text-[9px] font-black flex items-center justify-center shadow-sm border-2 border-white animate-pulse">
                {pendientes > 9 ? "9+" : pendientes}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
