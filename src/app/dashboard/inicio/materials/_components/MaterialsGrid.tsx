import { useState } from "react";
import MaterialCard from "./MaterialCard";
import MaterialModal from "./MaterialModal";
import { Insumo } from "@lib/models";

type Props = {
  materiales: Insumo[];
  onUpdate: (material: Insumo) => void;
};

export default function MaterialsGrid({ materiales, onUpdate }: Props) {
  const [selected, setSelected] = useState<Insumo | null>(null);

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#8C9796]/20 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {materiales.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              onClick={() => setSelected(m)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <MaterialModal
          material={selected}
          onClose={() => setSelected(null)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}