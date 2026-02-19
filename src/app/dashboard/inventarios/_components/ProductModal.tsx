"use client";

import { useState } from "react";
import { Producto } from "../type";

type Props = {
  producto: Producto;
  onClose: () => void;
  onSave: (producto: Producto) => void;
};

export default function ProductModal({ producto, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nombre: producto.nombre,
    precio: producto.precio,
    costo: producto.costo,
    stock_actual: producto.stock_actual,
    stock_min: producto.stock_min,
    categoria: producto.categoria.nombre,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    onSave({
      ...producto,
      nombre: form.nombre,
      precio: Number(form.precio),
      costo: Number(form.costo),
      stock_actual: Number(form.stock_actual),
      stock_min: Number(form.stock_min),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-8 space-y-6 border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.15)]">
        {/* Accent line */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#B76E79]" />

        <h2 className="text-xl font-serif font-medium text-[#1C1C1C]">
          Editar producto
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Nombre"
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
          />

          <Input
            label="Categoría"
            name="categoria"
            value={form.categoria}
            disabled
          />

          <Input
            label="Precio"
            name="precio"
            value={form.precio || ""}
            onChange={handleChange}
          />

          <Input
            label="Costo"
            name="costo"
            value={form.costo}
            onChange={handleChange}
          />

          <Input
            label="Stock actual"
            name="stock_actual"
            value={form.stock_actual}
            onChange={handleChange}
          />

          <Input
            label="Stock mínimo"
            name="stock_min"
            value={form.stock_min}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            className="
              px-5 py-2 text-sm rounded-lg
              border border-black/20
              text-[#1C1C1C]
              hover:bg-black/5
              transition
            "
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="
              px-5 py-2 text-sm rounded-lg
              bg-[#B76E79]
              text-[#F8F6F2]
              hover:bg-[#a95f6a]
              transition
            "
            onClick={handleSave}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const isDisabled = props.disabled;

  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-wide text-[#708090]">{label}</label>

      <input
        className={`
          w-full
          rounded-lg
          px-3 py-2
          text-sm
          text-[#1C1C1C]
          border
          ${isDisabled ? "bg-black/5 border-black/10" : "border-black/20"}
          focus:outline-none
          focus:ring-2
          focus:ring-[#B76E79]/40
          focus:border-[#B76E79]
        `}
        {...props}
      />
    </div>
  );
}
