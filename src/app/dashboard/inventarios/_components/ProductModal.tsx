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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Editar producto</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            name="nombre"
            value={form.nombre}
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
            value={form.precio}
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

        <div className="flex justify-end gap-2 pt-4">
          <button
            className="px-4 py-2 text-sm border rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg"
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
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        className="border rounded-lg px-3 py-2 text-sm w-full"
        {...props}
      />
    </div>
  );
}
