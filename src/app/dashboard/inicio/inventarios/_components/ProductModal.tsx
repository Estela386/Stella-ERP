"use client";

import { useState } from "react";
import { Producto } from "../type";
import { FiX } from "react-icons/fi";

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
    categoria: producto.categoria?.nombre || "",
    es_personalizable: producto.es_personalizable || false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  }

  function handleSave() {
    onSave({
      ...producto,
      nombre: form.nombre,
      precio: Number(form.precio),
      costo: Number(form.costo),
      stock_actual: Number(form.stock_actual),
      stock_min: Number(form.stock_min),
      es_personalizable: form.es_personalizable,
    });
  }

  return (
    <div className="fixed inset-0 bg-[#4a5568]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-10 overflow-hidden shadow-[0_30px_70px_rgba(140,151,104,0.3)] border border-[rgba(112,128,144,0.12)]">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b76e79] via-[#ede9e3] to-[#8c9768]/30" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#708090] hover:bg-[#f6f4ef] rounded-full transition-all"
        >
          <FiX size={24} />
        </button>

        <header className="mb-8 space-y-1">
          <p className="text-[#8c9768] text-[0.65rem] font-bold uppercase tracking-[0.2em] font-sans">
            Catálogo de Inventario
          </p>
          <h2 className="text-4xl font-sans font-bold text-[#4a5568] tracking-tight">
            Editar <em className="text-[#b76e79] not-italic">Producto</em>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Nombre del Producto" className="md:col-span-2">
            <input
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              className="w-full bg-[#f6f4ef]/50 border border-[rgba(112,128,144,0.15)] rounded-xl px-4 py-3 text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all"
            />
          </InputGroup>

          <InputGroup label="Categoría (Lectura)">
            <input
              value={form.categoria}
              disabled
              className="w-full bg-[#f6f4ef]/30 border border-transparent rounded-xl px-4 py-3 text-sm text-[#708090] font-medium cursor-not-allowed"
            />
          </InputGroup>

          <InputGroup label="Precio de Venta">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b76e79] font-bold">$</span>
              <input
                name="precio"
                value={form.precio || ""}
                onChange={handleChange}
                className="w-full bg-[#f6f4ef]/50 border border-[rgba(112,128,144,0.15)] rounded-xl pl-8 pr-4 py-3 text-sm text-[#4a5568] font-bold focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all"
              />
            </div>
          </InputGroup>

          <InputGroup label="Costo de Producción">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                name="costo"
                value={form.costo || ""}
                onChange={handleChange}
                className="w-full bg-[#f6f4ef]/50 border border-[rgba(112,128,144,0.15)] rounded-xl pl-8 pr-4 py-3 text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all"
              />
            </div>
          </InputGroup>

          <InputGroup label="Stock Actual">
            <input
              name="stock_actual"
              value={form.stock_actual || ""}
              onChange={handleChange}
              className="w-full bg-[#f6f4ef]/50 border border-[rgba(112,128,144,0.15)] rounded-xl px-4 py-3 text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all"
            />
          </InputGroup>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <input
            type="checkbox"
            id="es_personalizable"
            name="es_personalizable"
            checked={form.es_personalizable}
            onChange={handleCheckboxChange}
            className="w-6 h-6 rounded-lg cursor-pointer accent-[#b76e79] border-[rgba(112,128,144,0.2)]"
          />
          <label htmlFor="es_personalizable" className="text-sm font-bold text-[#4a5568] cursor-pointer">
            Producto Personalizable
          </label>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-[#708090] rounded-xl border-2 border-[#708090]/10 hover:bg-[#708090]/5 transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-3 text-sm font-bold text-white bg-[#b76e79] rounded-xl shadow-[0_10px_25px_rgba(183,110,121,0.3)] hover:shadow-[0_15px_30px_rgba(183,110,121,0.4)] hover:-translate-y-0.5 transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[0.65rem] font-bold text-[#708090] uppercase tracking-wider pl-1">{label}</label>
      {children}
    </div>
  );
}
