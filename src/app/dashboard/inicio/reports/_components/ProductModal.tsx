import React, { useState } from "react";
import { Producto } from "../type";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onSave?: (producto: Producto) => void;
}

export default function ProductModal({
  producto,
  onClose,
  onSave,
}: ProductModalProps) {
  if (!producto) return null;

  const [form, setForm] = useState<Producto>({ ...producto });

  const handleChange = (field: keyof Producto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        {/* Nombre */}
        <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Nombre</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg border-gray-300 text-[#708090]"
          style={{ fontFamily: "var(--font-poppins)" }}
        />

        {/* Imagen */}
        {form.url_imagen && (
          <img
            src={form.url_imagen}
            alt={form.nombre}
            className="w-full h-40 object-cover rounded mb-4"
          />
        )}

        {/* Campos en 2 columnas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Total vendido</label>
            <input
              type="number"
              value={form.total ?? 0}
              onChange={(e) => handleChange("total", Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>

          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Precio</label>
            <input
              type="number"
              value={form.precio ?? 0}
              onChange={(e) => handleChange("precio", Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>

          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Costo</label>
            <input
              type="number"
              value={form.costo ?? 0}
              onChange={(e) => handleChange("costo", Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>

          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Stock actual</label>
            <input
              type="number"
              value={form.stock_actual ?? 0}
              onChange={(e) => handleChange("stock_actual", Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>

          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Stock mínimo</label>
            <input
              type="number"
              value={form.stock_min ?? 0}
              onChange={(e) => handleChange("stock_min", Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>

          <div>
            <label className="block text-[#708090] font-semibold mb-1" style={{ fontFamily: "var(--font-marcellus)" }}>Categoría</label>
            <input
              type="text"
              value={form.categoria ?? ""}
              onChange={(e) => handleChange("categoria", e.target.value)}
              className="w-full p-2 border rounded-lg border-gray-300 text-[#708090]"
              style={{ fontFamily: "var(--font-poppins)" }}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90"
            style={{ background: "#B76E79", fontFamily: "var(--font-marcellus)" }}
          >
            Cerrar
          </button>

          {onSave && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90"
              style={{ background: "#708090", fontFamily: "var(--font-marcellus)" }}
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}