"use client";

import { useState, useEffect } from "react";
import { createClient } from "@utils/supabase/client";
import { InsumoService } from "@lib/services/InsumoService";
import { ProveedorService } from "@lib/services/ProveedorService";
import { CreateInsumoDTO, Insumo, Proveedor } from "@lib/models";
import { FiX } from "react-icons/fi";

const CATEGORIAS = [
  "hilo", "balín", "argolla", "broche", "arete", "cristal", 
  "perla", "chaquira", "letra", "piedra", "alambre", "extensión", "otro"
];

const UNIDADES = [
  "unidad", "metro", "pieza", "pieza (par)", "gramos"
];

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
    unidad_medida: "",
    stock_minimo: 0,
    id_proveedor: undefined,
    activo: true,
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProveedores = async () => {
      const supabase = createClient();
      const service = new ProveedorService(supabase);
      const { proveedores: data } = await service.obtenerTodos();
      if (data) setProveedores(data);
    };
    cargarProveedores();
  }, []);

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
    <div className="fixed inset-0 bg-[#4a5568]/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
      <div className="bg-white p-8 rounded-[16px] w-full max-w-xl space-y-8 shadow-[0_20px_56px_rgba(140,151,104,0.22)] border border-[rgba(112,128,144,0.18)] relative my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#708090] hover:bg-gray-100 rounded-full transition-all"
        >
          <FiX size={20} />
        </button>

        <header className="space-y-1">
          <p className="text-[#8c9768] text-[0.65rem] font-medium uppercase tracking-[0.18em] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
            Materia Prima
          </p>
            <h2 className="text-3xl font-serif font-bold text-[#4a5568] tracking-tight">
              Nuevo <em className="text-[#b76e79] not-italic">Material</em>
            </h2>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg font-sans text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Nombre del material</label>
            <input
              value={form.nombre}
              onChange={e => handleChange("nombre", e.target.value)}
              placeholder="Ej. Balín de oro 4mm"
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Tipo (Select) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Categoría</label>
            <select
              value={form.tipo}
              onChange={e => handleChange("tipo", e.target.value)}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans appearance-none"
            >
              <option value="">Seleccionar categoría...</option>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Unidad de Medida</label>
            <select
              value={form.unidad_medida}
              onChange={e => handleChange("unidad_medida", e.target.value)}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans appearance-none"
            >
              <option value="">Seleccionar unidad...</option>
              {UNIDADES.map(u => (
                <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Stock Actual */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Stock Inicial</label>
            <input
              type="number"
              value={form.cantidad}
              onChange={e => handleChange("cantidad", Number(e.target.value))}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Stock Mínimo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Stock Mínimo (Alerta)</label>
            <input
              type="number"
              value={form.stock_minimo}
              onChange={e => handleChange("stock_minimo", Number(e.target.value))}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Precio de Compra</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={form.precio}
                onChange={e => handleChange("precio", Number(e.target.value))}
                className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] pl-8 pr-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
              />
            </div>
          </div>

          {/* Precio Sugerido */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Venta Sugerida (+50%)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#708090] text-sm opacity-60">$</span>
              <div className="w-full border border-[rgba(112,128,144,0.15)] rounded-[6px] pl-8 pr-4 py-2.5 text-sm text-[#708090] font-bold bg-[#708090]/5 font-sans">
                {(form.precio * 1.5).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Proveedor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Proveedor Asignado</label>
            <select
              value={form.id_proveedor || ""}
              onChange={e => handleChange("id_proveedor", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans appearance-none"
            >
              <option value="">Seleccionar...</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} {p.empresa ? `(${p.empresa})` : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[rgba(112,128,144,0.12)]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-[6px] border-[1.5px] border-[rgba(112,128,144,0.25)] text-[#708090] text-[0.8rem] font-sans tracking-[0.04em] hover:border-[#708090] hover:text-[#4a5568] hover:bg-[rgba(112,128,144,0.08)] transition-all duration-220"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#b76e79] text-[#f6f4ef] px-8 py-2.5 rounded-[6px] text-[0.8rem] font-sans tracking-[0.04em] hover:shadow-[0_10px_26px_rgba(183,110,121,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all duration-220 shadow-[0_3px_12px_rgba(183,110,121,0.22)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? "Registrando..." : "Crear Material"}
          </button>
        </div>
      </div>
    </div>
  );
}
