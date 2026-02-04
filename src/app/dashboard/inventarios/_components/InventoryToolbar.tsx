"use client";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function InventoryToolbar({ search, onSearchChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-3 justify-between">
      <input
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="border rounded-lg px-4 py-2 text-sm w-full md:max-w-sm"
        placeholder="Buscar por nombre o código..."
      />

      <div className="flex gap-2">
        {/* <button className="border px-3 py-2 rounded-lg text-sm">
          Exportar
        </button> */}
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
          + Nueva Pieza
        </button>
      </div>
    </div>
  );
}
