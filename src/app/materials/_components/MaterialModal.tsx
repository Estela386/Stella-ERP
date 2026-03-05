"use client";

import { useState } from "react";
import { Insumo } from "@lib/models/Insumo";

type Props = {
  material: Insumo;
  onClose: () => void;
  onSave: (material: Insumo) => void;
};

export default function MaterialModal({ material, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    id: material.id,
    nombre: material.nombre,
    tipo: material.tipo,
    precio: material.precio,
    cantidad: material.cantidad,
  });

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const actualizado = new Insumo(form);
    onSave(actualizado);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-8 shadow-2xl space-y-8">
        <h2 className="text-3xl font-semibold text-[#708090]">
          Detalles del material
        </h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Nombre
            </label>
            <input
              value={form.nombre}
              onChange={e => handleChange("nombre", e.target.value)}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-white px-4 py-2.5 text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">Tipo</label>
            <input
              value={form.tipo}
              onChange={e => handleChange("tipo", e.target.value)}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-white px-4 py-2.5 text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Precio */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Precio por unidad
            </label>
            <input
              type="number"
              value={form.precio}
              onChange={e => handleChange("precio", Number(e.target.value))}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-white px-4 py-2.5 text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Cantidad */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Stock disponible
            </label>
            <input
              type="number"
              value={form.cantidad}
              onChange={e => handleChange("cantidad", Number(e.target.value))}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-white px-4 py-2.5 text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[#8C9796]/40 text-[#708090] hover:bg-[#F6F3EF] transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-[#B76E79] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#A45F69] transition"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
