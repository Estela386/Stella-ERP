import { Search, Plus, HandCoins, UserPlus } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onAddAccount: () => void;
  onAddPayment: () => void;
  onAddClient: () => void;
}

export default function AccountsToolbar({
  search,
  onSearchChange,
  onAddAccount,
  onAddPayment,
  onAddClient,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center md:justify-between py-2">
      {/* 🔍 BUSCADOR */}
      <div className="relative w-full md:max-w-md group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8976] group-focus-within:text-[#b76e79] transition-colors">
          <Search size={18} />
        </div>
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar..."
          className="
            w-full
            pl-12 pr-4 py-3
            rounded-2xl
            bg-white
            border border-[#8c8976]/30
            text-sm text-[#708090]
            placeholder:text-[#8c8976]/60
            focus:outline-none
            focus:ring-4
            focus:ring-[#b76e79]/10
            focus:border-[#b76e79]
            shadow-sm
            hover:shadow-md
            transition-all
            duration-300
          "
          style={{ fontFamily: "var(--font-poppins)" }}
        />
      </div>

      {/* BOTONES */}
      <div className="grid grid-cols-2 lg:flex items-center gap-2 md:gap-3">
        <button
          onClick={onAddAccount}
          className="
            flex items-center justify-center gap-2
            px-4 md:px-6 py-3
            rounded-2xl
            bg-[#708090]
            text-white
            text-xs
            hover:bg-[#5a6a7a]
            hover:shadow-lg
            active:scale-95
            transition-all
            duration-300
            shadow-[0_8px_20px_-6px_rgba(112,128,144,0.4)]
          "
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          <Plus size={16} />
          <span>Nueva Cuenta</span>
        </button>

        <button
          onClick={onAddPayment}
          className="
            flex items-center justify-center gap-2
            px-4 md:px-6 py-3
            rounded-2xl
            bg-[#b76e79]
            text-white
            text-xs
            hover:bg-[#a55a65]
            hover:shadow-lg
            active:scale-95
            transition-all
            duration-300
            shadow-[0_8px_20px_-6px_rgba(183,110,121,0.4)]
          "
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          <HandCoins size={16} />
          <span>Registrar Abono</span>
        </button>
      </div>
    </div>
  );
}
