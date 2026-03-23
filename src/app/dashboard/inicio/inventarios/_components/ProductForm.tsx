"use client";

import { useState, useEffect } from "react";
import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import { IProductoOpcion } from "@lib/models";
import { FiX, FiPlus, FiTrash2, FiImage, FiSettings, FiClock, FiBox } from "react-icons/fi";

export interface OpcionForm {
  nombre: string;
  tipo: IProductoOpcion["tipo"];
  obligatorio: boolean;
  valores: string[];
}

interface ProductFormProps {
  producto?: Producto;
  categorias: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[]
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  producto,
  categorias,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    precio: producto?.precio || 0,
    costo: producto?.costo || 0,
    costo_mayorista: producto?.costo_mayorista || 0,
    stock_actual: producto?.stock_actual || 0,
    stock_min: producto?.stock_min || 0,
    tiempo: producto?.tiempo || 0,
    id_categoria: producto?.id_categoria || categorias[0]?.id || 0,
    es_personalizable: producto?.es_personalizable || false,
    descripcion: producto?.descripcion || "",
  });

  const [opciones, setOpciones] = useState<OpcionForm[]>([]);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    producto?.url_imagen || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingOpciones, setLoadingOpciones] = useState(false);

  // ── Opciones ────────────────────────────────────────────────────
  const agregarOpcion = () => {
    setOpciones(prev => [
      ...prev,
      { nombre: "", tipo: "select", obligatorio: false, valores: [] },
    ]);
  };

  const eliminarOpcion = (i: number) => {
    setOpciones(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateOpcion = (i: number, field: keyof OpcionForm, value: any) => {
    setOpciones(prev =>
      prev.map((op, idx) => (idx === i ? { ...op, [field]: value } : op))
    );
  };

  const agregarValor = (i: number) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === i ? { ...op, valores: [...op.valores, ""] } : op
      )
    );
  };

  const updateValor = (opIdx: number, valIdx: number, value: string) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === opIdx
          ? {
              ...op,
              valores: op.valores.map((v, vi) => (vi === valIdx ? value : v)),
            }
          : op
      )
    );
  };

  const eliminarValor = (opIdx: number, valIdx: number) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === opIdx
          ? { ...op, valores: op.valores.filter((_, vi) => vi !== valIdx) }
          : op
      )
    );
  };

  // ── Handlers base ───────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "precio",
      "costo",
      "costo_mayorista",
      "stock_actual",
      "stock_min",
      "tiempo",
    ];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imagen: "Máximo 5MB" }));
      return;
    }
    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Requerido";
    if (formData.precio < 0) newErrors.precio = "Inválido";
    if (formData.costo < 0) newErrors.costo = "Inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData, imagenFile || undefined, opciones);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  useEffect(() => {
    if (!producto?.id) return;
    const cargarOpciones = async () => {
      try {
        setLoadingOpciones(true);
        const res = await fetch(`/api/productos/${producto.id}/opciones`);
        const data = await res.json();
        if (!res.ok || !data.opciones) return;
        const opcionesMapeadas: OpcionForm[] = data.opciones.map((op: any) => ({
          nombre: op.nombre,
          tipo: op.tipo,
          obligatorio: op.obligatorio,
          valores: op.valores?.map((v: any) => v.valor) ?? [],
        }));
        setOpciones(opcionesMapeadas);
      } catch (err) {
        console.error("Error cargando opciones:", err);
      } finally {
        setLoadingOpciones(false);
      }
    };
    cargarOpciones();
  }, [producto?.id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🧩 SECCIÓN 1: IDENTIDAD */}
      <div className="space-y-5">
        <h3 className="text-[0.65rem] font-bold text-[#8c9768] uppercase tracking-[0.2em] font-sans border-b border-[rgba(140,151,104,0.15)] pb-2 flex items-center gap-2">
          <FiBox className="text-[#b76e79]" /> Información General
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Nombre del Producto</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Anillo Solitario Oro 18k"
              className={`w-full border ${errors.nombre ? 'border-red-400' : 'border-[rgba(112,128,144,0.25)]'} rounded-[8px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Categoría</label>
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans appearance-none"
            >
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Tiempo Prod. (días)</label>
            <div className="relative">
              <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
              <input
                type="number"
                name="tiempo"
                value={formData.tiempo}
                onChange={handleChange}
                className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] pl-10 pr-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 💰 SECCIÓN 2: PRECIOS */}
      <div className="space-y-5">
        <h3 className="text-[0.65rem] font-bold text-[#8c9768] uppercase tracking-[0.2em] font-sans border-b border-[rgba(140,151,104,0.15)] pb-2 flex items-center gap-2">
          $ Estructura de Costos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Precio Venta</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] pl-8 pr-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans font-bold"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Costo Prod.</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] pl-8 pr-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Costo Mayoreo</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                name="costo_mayorista"
                value={formData.costo_mayorista}
                onChange={handleChange}
                className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] pl-8 pr-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📦 SECCIÓN 3: INVENTARIO */}
      <div className="space-y-5">
        <h3 className="text-[0.65rem] font-bold text-[#8c9768] uppercase tracking-[0.2em] font-sans border-b border-[rgba(140,151,104,0.15)] pb-2 flex items-center gap-2">
          Inventario & Stock
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Stock Actual</label>
            <input
              type="number"
              name="stock_actual"
              value={formData.stock_actual}
              onChange={handleChange}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-bold text-[#708090] uppercase tracking-wide font-sans">Stock Mínimo</label>
            <input
              type="number"
              name="stock_min"
              value={formData.stock_min}
              onChange={handleChange}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[8px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* 📝 SECCIÓN 4: DETALLES */}
      <div className="space-y-5">
        <h3 className="text-[0.65rem] font-bold text-[#8c9768] uppercase tracking-[0.2em] font-sans border-b border-[rgba(140,151,104,0.15)] pb-2">Descripción del Producto</h3>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          placeholder="Escribe los detalles aquí..."
          className="w-full border border-[rgba(112,128,144,0.25)] rounded-[12px] px-4 py-3 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans resize-none"
        />
      </div>

      {/* 🖼️ SECCIÓN 5: IMAGEN */}
      <div className="space-y-5">
        <h3 className="text-[0.65rem] font-bold text-[#8c9768] uppercase tracking-[0.2em] font-sans border-b border-[rgba(140,151,104,0.15)] pb-2 flex items-center gap-2">
          Visualización
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-48 aspect-square relative group">
            <div className="w-full h-full rounded-2xl bg-[#f6f4ef] border-2 border-dashed border-[rgba(112,128,144,0.2)] overflow-hidden flex items-center justify-center shadow-inner">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <FiImage className="text-[#708090] opacity-30 w-12 h-12" />
              )}
            </div>
            {previewUrl && (
              <button
                type="button"
                onClick={() => { setPreviewUrl(null); setImagenFile(null); }}
                className="absolute -top-2 -right-2 bg-white text-[#b76e79] p-1.5 rounded-full shadow-lg border border-rose-50 hover:bg-rose-50 transition-colors"
                title="Eliminar imagen"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-3 w-full">
            <label className="relative cursor-pointer w-full group">
              <div className="w-full py-8 border-2 border-dashed border-[rgba(112,128,144,0.2)] rounded-2xl bg-[#f6f4ef]/50 group-hover:bg-[#f6f4ef] group-hover:border-[#b76e79]/30 transition-all flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all text-[#b76e79]">
                  <FiPlus size={20} />
                </div>
                <span className="text-sm font-medium text-[#708090]">Seleccionar Imagen</span>
                <span className="text-[0.65rem] text-[#708090] opacity-60 uppercase tracking-tighter">JPG, PNG o WebP (Máx 5MB)</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* ⚙️ SECCIÓN 6: PERSONALIZACIÓN */}
      <div className="pt-6 space-y-6">
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div className="relative">
            <input
              type="checkbox"
              name="es_personalizable"
              checked={formData.es_personalizable}
              onChange={handleCheckboxChange}
              className="peer hidden"
            />
            <div className="w-10 h-6 bg-[rgba(112,128,144,0.15)] rounded-full peer-checked:bg-[#b76e79] transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
          </div>
          <span className="font-sans font-bold text-sm text-[#4a5568] group-hover:text-[#b76e79] transition-colors">Este producto es personalizable</span>
        </label>

        {formData.es_personalizable && (
          <div className="bg-[#f6f4ef]/50 border border-[rgba(112,128,144,0.15)] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#4a5568] font-sans">Opciones de Personalización</h4>
                <p className="text-[0.65rem] text-[#708090] uppercase tracking-wide">Define colores, tallas o textos</p>
              </div>
              <button
                type="button"
                onClick={agregarOpcion}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(112,128,144,0.2)] rounded-lg text-xs font-bold text-[#708090] hover:bg-[#b76e79] hover:text-white hover:border-[#b76e79] transition-all shadow-sm"
              >
                <FiPlus size={14} /> Nueva Opción
              </button>
            </div>

            {loadingOpciones ? (
              <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b76e79]" /></div>
            ) : opciones.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[rgba(112,128,144,0.1)] rounded-xl">
                <FiSettings className="mx-auto w-10 h-10 text-[#708090] opacity-20 mb-3" />
                <p className="text-sm text-[#708090] font-sans">Sin opciones configuradas aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {opciones.map((op, i) => (
                  <div key={i} className="bg-white border border-[rgba(112,128,144,0.15)] rounded-xl p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex-1 min-w-[200px]">
                        <input
                          placeholder="Nombre (ej: Color)"
                          value={op.nombre}
                          onChange={e => updateOpcion(i, "nombre", e.target.value)}
                          className="w-full bg-[#f6f4ef]/30 border-b border-[rgba(112,128,144,0.15)] py-1.5 focus:border-[#b76e79] focus:outline-none text-sm transition-colors font-sans"
                        />
                      </div>
                      <select
                        value={op.tipo}
                        onChange={e => updateOpcion(i, "tipo", e.target.value)}
                        className="bg-[#f6f4ef] px-3 py-1.5 rounded-lg border-none text-xs font-bold text-[#708090] focus:ring-1 focus:ring-[#b76e79]"
                      >
                        <option value="select">Lista Desplegable</option>
                        <option value="text">Texto Libre</option>
                        <option value="number">Numérico</option>
                      </select>
                      <label className="flex items-center gap-2 text-xs font-medium text-[#708090] mt-1.5">
                        <input type="checkbox" checked={op.obligatorio} onChange={e => updateOpcion(i, "obligatorio", e.target.checked)} className="accent-[#b76e79]" />
                        Obligatorio
                      </label>
                      <button onClick={() => eliminarOpcion(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors ml-auto"><FiTrash2 size={16} /></button>
                    </div>

                    {op.tipo !== "text" && (
                      <div className="pl-4 border-l-2 border-[#f6f4ef] space-y-3">
                        <p className="text-[0.6rem] font-bold text-[#b76e79] uppercase tracking-widest pl-1">Opciones Disponibles</p>
                        <div className="flex flex-wrap gap-2">
                          {op.valores.map((v, j) => (
                            <div key={j} className="flex items-center gap-2 bg-[#f6f4ef] rounded-lg px-2 py-1 pr-1 pl-3 group/val border border-[rgba(112,128,144,0.05)]">
                              <input
                                placeholder={`Valor ${j + 1}`}
                                value={v}
                                onChange={e => updateValor(i, j, e.target.value)}
                                className="bg-transparent text-xs font-sans text-[#4a5568] focus:outline-none min-w-[60px]"
                              />
                              <button onClick={() => eliminarValor(i, j)} className="text-[#708090] opacity-40 hover:opacity-100 hover:text-red-500 transition-all"><FiX size={12} /></button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => agregarValor(i)}
                            className="bg-white border border-dashed border-[rgba(112,128,144,0.3)] rounded-lg px-3 py-1 text-[0.65rem] font-bold text-[#b76e79] hover:border-[#b76e79] transition-all"
                          >
                            + Valor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🚀 ACCIONES */}
      <div className="flex gap-4 pt-8 border-t border-[rgba(112,128,144,0.1)] sticky bottom-0 bg-white pb-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-xl border-2 border-[#708090]/10 text-[#708090] text-sm font-bold font-sans hover:bg-[#708090]/5 active:scale-95 transition-all"
        >
          Descartar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-[#b76e79] text-white py-3 rounded-xl text-sm font-bold font-sans hover:shadow-[0_12px_28px_rgba(183,110,121,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_4px_16px_rgba(183,110,121,0.25)] disabled:opacity-50"
        >
          {loading ? "Procesando..." : producto ? "Guardar Cambios" : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
