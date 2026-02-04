"use client"

import { useState } from "react"

type Props = {
  onClose: () => void
}

export default function NewProductModal({ onClose }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    costo: "",
    stock_actual: "",
    stock_min: "",
    id_categoria: ""
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSave() {
    const nuevoProducto = {
      nombre: form.nombre,
      precio: Number(form.precio),
      costo: Number(form.costo),
      stock_actual: Number(form.stock_actual),
      stock_min: Number(form.stock_min),
      id_categoria: Number(form.id_categoria)
    }

    console.log("Nuevo producto:", nuevoProducto)
    // aquí va el insert a Supabase

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Nueva pieza</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <SelectCategoria value={form.id_categoria} onChange={handleChange} />

          <Input label="Precio" name="precio" value={form.precio} onChange={handleChange} />
          <Input label="Costo" name="costo" value={form.costo} onChange={handleChange} />

          <Input label="Stock inicial" name="stock_actual" value={form.stock_actual} onChange={handleChange} />
          <Input label="Stock mínimo" name="stock_min" value={form.stock_min} onChange={handleChange} />
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
            Crear pieza
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({
  label,
  ...props
}: {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        className="border rounded-lg px-3 py-2 text-sm w-full"
        {...props}
      />
    </div>
  )
}

function SelectCategoria({
  value,
  onChange
}: {
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">Categoría</label>
      <select
        name="id_categoria"
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 text-sm w-full"
      >
        <option value="">Selecciona</option>
        <option value="1">Anillos</option>
        <option value="2">Collares</option>
        <option value="3">Pulseras</option>
        <option value="4">Aretes</option>
      </select>
    </div>
  )
}
