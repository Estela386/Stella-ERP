import { useState } from "react";
import MaterialCard from "./MaterialCard";
import MaterialModal from "./MaterialModal";

export default function MaterialsGrid({ materiales }: any) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      {/* CONTENEDOR */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-[#8C9796]/20
          shadow-[0_20px_50px_rgba(0,0,0,0.08)]
          p-6
        "
      >
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {materiales.map((m: any) => (
            <MaterialCard
              key={m.id}
              material={m}
              onClick={() => setSelected(m)}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <MaterialModal
          material={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}