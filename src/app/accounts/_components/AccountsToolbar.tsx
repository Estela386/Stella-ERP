"use client";

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
    <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
      {/* 🔍 BUSCADOR */}

      <div className="relative w-full lg:max-w-sm">
        {/* Icono */}

        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar cliente o cuenta..."
          className="
            w-full
            pl-10 pr-4 py-3
            rounded-xl
            bg-[#f6f4ef]
            border border-[#8c8976]/40
            text-[#708090]
            placeholder:text-[#8c8976]
            focus:outline-none
            focus:ring-2
            focus:ring-[#b76e79]
            focus:border-[#b76e79]
            shadow-[0_5px_15px_rgba(140,137,118,0.25)]
            transition
          "
        />
      </div>

      {/* BOTONES */}
      <div className="flex flex-wrap gap-3">
        {/* + Cliente */}
        {/* <button
          onClick={onAddClient}
          className="
            px-5 py-2.5
            rounded-xl
            border border-[#b76e79]/40
            bg-[#b76e79]
            text-[#f6f4ef]
            shadow-[0_5px_15px_rgba(140,137,118,0.25)]
            hover:bg-[#708090]
            hover:text-[#f6f4ef]
            transition
            cursor-pointer
          "
        >
          + Cliente
        </button> */}

        {/* + Cuenta */}
        <button
          onClick={onAddAccount}
          className="
            px-5 py-2.5
            rounded-xl
            bg-[#b76e79]
            text-[#f6f4ef]
            shadow-[0_10px_25px_rgba(140,137,118,0.4)]
            hover:scale-105
              hover:bg-[#708090]
            hover:text-[#f6f4ef]
            transition
            cursor-pointer
          "
        >
          + Cuenta
        </button>

        {/* + Abono */}
        <button
          onClick={onAddPayment}
          className="
            px-5 py-2.5
            rounded-xl
            bg-[#b76e79]
            text-[#f6f4ef]
            shadow-[0_10px_25px_rgba(140,137,118,0.4)]
            hover:scale-105
              hover:bg-[#708090]
            hover:text-[#f6f4ef]
            transition
            cursor-pointer
          "
        >
          + Abono
        </button>
      </div>
    </div>
  );
}
