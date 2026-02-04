"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function NewProductModal({ onClose }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    costo: "",
    stock_actual: "",
    stock_min: "",
    id_categoria: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    const nuevoProducto = {
      nombre: form.nombre,
      precio: Number(form.precio),
      costo: Number(form.costo),
      stock_actual: Number(form.stock_actual),
      stock_min: Number(form.stock_min),
      id_categoria: Number(form.id_categoria),
    };

    console.log("Nuevo producto:", nuevoProducto);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-8 space-y-6 border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.15)]">
        {/* Accent line */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#B76E79]" />

        <h2 className="text-xl font-serif font-medium text-[#1C1C1C]">
          Nueva pieza
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <SelectCategoria value={form.id_categoria} onChange={handleChange} />

          <Input
            label="Precio"
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
          />

          <Input
            label="Costo"
            name="costo"
            type="number"
            value={form.costo}
            onChange={handleChange}
          />

          <Input
            label="Stock inicial"
            name="stock_actual"
            type="number"
            value={form.stock_actual}
            onChange={handleChange}
          />

          <Input
            label="Stock mínimo"
            name="stock_min"
            type="number"
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
            Crear pieza
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
  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-wide text-[#708090]">{label}</label>

      <input
        className="
          w-full
          rounded-lg
          border border-black/20
          px-3 py-2
          text-sm
          text-[#1C1C1C]
          placeholder:text-[#708090]/60
          focus:outline-none
          focus:ring-2
          focus:ring-[#B76E79]/40
          focus:border-[#B76E79]
        "
        {...props}
      />
    </div>
  );
}

function SelectCategoria({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-wide text-[#708090]">Categoría</label>

      <select
        name="id_categoria"
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-lg
          border border-black/20
          px-3 py-2
          text-sm
          text-[#1C1C1C]
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-[#B76E79]/40
          focus:border-[#B76E79]
        "
      >
        <option value="">Selecciona</option>
        <option value="1">Anillos</option>
        <option value="2">Collares</option>
        <option value="3">Pulseras</option>
        <option value="4">Aretes</option>
      </select>
    </div>
  );
}
