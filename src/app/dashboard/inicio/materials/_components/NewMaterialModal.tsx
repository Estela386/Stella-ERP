"use client";

import { useState } from "react";
import { createClient } from "@utils/supabase/client";
import { InsumoService } from "@lib/services/InsumoService";
import { CreateInsumoDTO, Insumo } from "@lib/models/Insumo";

interface Props {
  onClose: () => void;
  onCreated: (insumo: Insumo) => void;
}

export default function NewMaterialModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateInsumoDTO>({
    nombre: "",
    tipo: "",
    cantidad: 0,
    precio: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateInsumoDTO, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const service = new InsumoService(supabase);

      const { insumo, error } = await service.crear(form);

      if (error || !insumo) {
        setError(error || "Error creando material");
        return;
      }

      onCreated(insumo);
      onClose();
    } catch {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#1C1C1C]">
          Nuevo material
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <input
            value={form.nombre}
            onChange={e => handleChange("nombre", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B76E79] focus:border-[#B76E79]"
          />
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tipo</label>
          <input
            value={form.tipo}
            onChange={e => handleChange("tipo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B76E79] focus:border-[#B76E79]"
          />
        </div>

        {/* Cantidad */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            value={form.cantidad}
            onChange={e => handleChange("cantidad", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B76E79] focus:border-[#B76E79]"
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            value={form.precio}
            onChange={e => handleChange("precio", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B76E79] focus:border-[#B76E79]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-[#B76E79] text-white font-medium hover:bg-[#A45F69] transition shadow-sm"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
