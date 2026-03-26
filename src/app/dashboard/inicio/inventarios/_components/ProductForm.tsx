"use client";

import { useState, useEffect, useMemo } from "react";
import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import { IProductoOpcion } from "@lib/models";
import { createClient } from "@utils/supabase/client";
import { ProductoMaterialService } from "@lib/services";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  Box, 
  Package, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  Truck,
  Layers,
  ChevronRight,
  PlusCircle,
  Info,
  X as FiX
} from "lucide-react";

export interface OpcionForm {
  nombre: string;
  tipo: IProductoOpcion["tipo"];
  obligatorio: boolean;
  valores: string[];
}

interface ProductFormProps {
  producto?: Producto;
  categorias: any[];
  proveedores?: any[];
  insumosDisponibles?: any[];
  materialesDisponibles?: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[],
    relacionProveedor?: { id_proveedor: number; precio_compra: number; tiempo_entrega: number },
    insumosSeleccionados?: { id_insumo: number; cantidad_necesaria: number }[],
    materialesSeleccionados?: number[]
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  producto,
  categorias,
  proveedores = [],
  insumosDisponibles = [],
  materialesDisponibles = [],
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
    url_imagen: producto?.url_imagen || "",
    tipo: producto?.tipo || "fabricado",
    isManualPrecio: false,
    ganancia: 0,
    roi_porcentaje: 0,
  });

  const [proveedorRelacion, setProveedorRelacion] = useState({
    id_proveedor: 0,
    precio_compra: 0,
    tiempo_entrega: 0,
  });

  const [opciones, setOpciones] = useState<OpcionForm[]>([]);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    producto?.url_imagen || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingOpciones, setLoadingOpciones] = useState(false);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<{ id_insumo: number, cantidad_necesaria: number }[]>([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<number[]>([]);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const COSTO_MINUTO = 1.0; 

  // -- Opciones --
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

  const toggleMaterial = (id: number) => {
    setMaterialesSeleccionados(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  // -- Handlers base --
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

    let newValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Si el usuario edita el precio manualmente, marcamos como manual
      if (name === "precio") {
        updated.isManualPrecio = true;
      }
      
      return updated;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleInsumoChange = (idx: number, field: string, value: number) => {
    setInsumosSeleccionados(prev => prev.map((item, i) => 
      i === idx ? { ...item, [field]: value } : item
    ));
  };

  const agregarInsumo = () => {
    if (insumosDisponibles.length > 0) {
      setInsumosSeleccionados(prev => [...prev, { id_insumo: insumosDisponibles[0].id, cantidad_necesaria: 1 }]);
    }
  };

  const eliminarInsumo = (idx: number) => {
    setInsumosSeleccionados(prev => prev.filter((_, i) => i !== idx));
  };

  // -- Inteligencia de Precios & Rentabilidad --
  useEffect(() => {
    // Sincronizar costo si es revendido
    if (formData.tipo === "revendido") {
      if (proveedorRelacion.precio_compra !== formData.costo) {
        setFormData(prev => ({ ...prev, costo: proveedorRelacion.precio_compra }));
      }
    } else {
      // Calcular costo para fabricado: (tiempo * labor) + sum(insumos)
      const costoLabor = (Number(formData.tiempo) || 0) * COSTO_MINUTO;
      const costoMateriales = insumosSeleccionados.reduce((acc, sel) => {
        const insumo = insumosDisponibles.find(i => i.id === sel.id_insumo);
        return acc + (Number(insumo?.precio || 0) * sel.cantidad_necesaria);
      }, 0);
      
      const costoTotalCalculado = Number((costoLabor + costoMateriales).toFixed(2));
      
      if (Math.abs(costoTotalCalculado - formData.costo) > 0.01) {
        setFormData(prev => ({ ...prev, costo: costoTotalCalculado }));
      }
    }

    const costo = Number(formData.costo) || 0;
    const isManual = formData.isManualPrecio;
    
    // 1. Calcular Precio (Margen 60%) si no es manual
    let nuevoPrecio = formData.precio;
    if (!isManual && costo > 0) {
      nuevoPrecio = Number((costo / 0.4).toFixed(2));
    }

    // 2. Mayoreo siempre es 30% descuento del venta actual
    const nuevoMayoreo = Number((nuevoPrecio * 0.7).toFixed(2));

    // 3. Métricas
    const nuevaGanancia = Number((nuevoPrecio - costo).toFixed(2));
    const nuevoROI = costo > 0 ? Number(((nuevaGanancia / costo) * 100).toFixed(2)) : 0;

    // Actualizar solo si hay cambios reales
    if (
      Math.abs(nuevoPrecio - formData.precio) > 0.01 ||
      Math.abs(nuevoMayoreo - formData.costo_mayorista) > 0.01 ||
      Math.abs(nuevaGanancia - formData.ganancia) > 0.01 ||
      Math.abs(nuevoROI - formData.roi_porcentaje) > 0.1
    ) {
      setFormData(prev => ({
        ...prev,
        precio: nuevoPrecio,
        costo_mayorista: nuevoMayoreo,
        ganancia: nuevaGanancia,
        roi_porcentaje: nuevoROI
      }));
    }
  }, [formData.costo, formData.precio, formData.isManualPrecio, formData.tipo, formData.tiempo, proveedorRelacion.precio_compra, insumosSeleccionados, insumosDisponibles]);

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

  const handleProveedorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProveedorRelacion(prev => ({
      ...prev,
      [name]: name === "id_proveedor" ? parseInt(value) : parseFloat(value) || 0,
    }));
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

    // Filtrar campos que no van a la base de datos
    const { isManualPrecio, ganancia, roi_porcentaje, ...dataToSave } = formData;

    try {
      await onSubmit(
        dataToSave as any,
        imagenFile || undefined,
        opciones,
        formData.tipo === "revendido" ? proveedorRelacion : undefined,
        formData.tipo === "fabricado" ? insumosSeleccionados : undefined,
        materialesSeleccionados
      );
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  useEffect(() => {
    if (!producto?.id) return;
    const controller = new AbortController();
    
    const cargarDatos = async () => {
      try {
        setLoadingOpciones(true);
        // Cargar Opciones
        const resOp = await fetch(`/api/productos/${producto.id}/opciones`, { signal: controller.signal });
        const dataOp = await resOp.json();
        if (resOp.ok && dataOp.opciones) {
          const opcionesMapeadas: OpcionForm[] = dataOp.opciones.map((op: any) => ({
            nombre: op.nombre,
            tipo: op.tipo,
            obligatorio: op.obligatorio,
            valores: op.valores?.map((v: any) => v.valor) ?? [],
          }));
          setOpciones(opcionesMapeadas);
        }

        // Cargar Relación Proveedor if revendido
        if (producto.tipo === "revendido") {
          const resProv = await fetch(`/api/productos/${producto.id}/proveedor`, { signal: controller.signal });
          const dataProv = await resProv.json();
          if (resProv.ok && dataProv.relacion) {
            setProveedorRelacion({
              id_proveedor: dataProv.relacion.id_proveedor,
              precio_compra: dataProv.relacion.precio_compra,
              tiempo_entrega: dataProv.relacion.tiempo_entrega,
            });
          }
        }

        // Cargar Insumos if fabricado
        if (producto.tipo === "fabricado") {
          const resIns = await fetch(`/api/productos/${producto.id}/insumos`, { signal: controller.signal });
          const dataIns = await resIns.json();
          if (resIns.ok && dataIns.insumos) {
            console.log("Insumos cargados:", dataIns.insumos);
            setInsumosSeleccionados(dataIns.insumos.map((i: any) => ({
              id_insumo: i.id_insumo,
              cantidad_necesaria: Number(i.cantidad_necesaria)
            })));
          } else {
            console.warn("No se pudieron cargar insumos o están vacíos", dataIns);
          }
        }

        // Cargar Materiales seleccionados (siempre, para ambos tipos de producto)
        const supabase = createClient();
        const materialSvc = new ProductoMaterialService(supabase);
        const { materialesIds } = await materialSvc.obtenerPorProducto(producto.id);
        if (materialesIds && materialesIds.length > 0) {
          setMaterialesSeleccionados(materialesIds);
        }

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Error cargando datos del producto:", err);
        }
      } finally {
        setLoadingOpciones(false);
      }
    };
    cargarDatos();
    return () => controller.abort();
  }, [producto?.id, producto?.tipo]);

  // -- Render Helpers --
  const SectionHeader = ({ title, highlight, icon: Icon, children }: { title: string, highlight?: string, icon: any, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-12 group/header">
      <div className="flex items-center gap-6">
        <div 
          className="w-16 h-16 rounded-2xl bg-[#ffffff] flex items-center justify-center text-[#708090] border-2 border-[rgba(112,128,144,0.12)] transition-all group-hover/header:border-[#b76e79]/40 shadow-xl"
          style={{ boxShadow: "0 8px 30px rgba(140,151,104,0.12)" }}
        >
          <Icon size={28} strokeWidth={1.2} />
        </div>
        <div>
          <h3 
            className="text-[#4a5568] tracking-tight leading-tight" 
            style={{ fontFamily: "var(--font-display, Manrope, sans-serif)", fontSize: "1.8rem", fontWeight: 700 }}
          >
            {title} {highlight && <span className="text-[#b76e79] font-light italic ml-1">{highlight}</span>}
          </h3>
          <div className="w-12 h-1 bg-[#b76e79]/30 rounded-full mt-2 transition-all group-hover/header:w-20 group-hover/header:bg-[#b76e79]/60" />
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      {/* SECCIÓN 1: IDENTIDAD DEL PRODUCTO */}
      <div className="p-5 bg-[#ffffff] rounded-[20px] border-2 border-[rgba(112,128,144,0.12)] shadow-sm">
        {/* Tipo — toggles compactos en una sola fila */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest flex-shrink-0">Tipo</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipo: "fabricado" }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                formData.tipo === "fabricado"
                  ? "border-[#b76e79] bg-[#b76e79]/5 text-[#b76e79]"
                  : "border-[rgba(112,128,144,0.15)] text-[#708090] hover:border-[#708090]/30"
              }`}
            >
              <Layers size={14} strokeWidth={2} /> Fabricado
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipo: "revendido" }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                formData.tipo === "revendido"
                  ? "border-[#b76e79] bg-[#b76e79]/5 text-[#b76e79]"
                  : "border-[rgba(112,128,144,0.15)] text-[#708090] hover:border-[#708090]/30"
              }`}
            >
              <Truck size={14} strokeWidth={2} /> Revendido
            </button>
          </div>
        </div>
        {/* Nombre + Categoría en la misma fila */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest px-1">Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Collar Luna Plata"
              className={`w-full bg-[#f6f4ef]/50 border-2 ${errors.nombre ? 'border-red-400' : 'border-transparent'} rounded-[14px] px-4 py-3 text-base text-[#4a5568] placeholder-[#708090]/30 focus:outline-none focus:border-[#b76e79] focus:bg-white transition-all`}
              style={{ fontFamily: "var(--font-display, Manrope, sans-serif)", fontWeight: 600 }}
            />
          </div>
          <div className="flex flex-col gap-1" style={{ minWidth: '160px' }}>
            <label className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest px-1">Categoría</label>
            <div className="relative">
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                className="w-full bg-[#f6f4ef]/50 border-2 border-transparent rounded-[14px] px-4 py-3 text-sm text-[#4a5568] font-bold focus:outline-none focus:border-[#b76e79] focus:bg-white appearance-none cursor-pointer transition-all pr-8"
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <ChevronRight size={15} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#b76e79] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>


      {/* SECCIÓN 2: PERSONALIZACIÓN */}
      <div className="p-5 bg-[#ede9e3] rounded-[20px] border-2 border-[rgba(112,128,144,0.12)] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#708090] border border-[rgba(112,128,144,0.12)]">
              <Settings size={14} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-bold text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              Opciones <span className="text-[#b76e79]">Personalizables</span>
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-[#708090]">{formData.es_personalizable ? 'Activo' : 'Inactivo'}</span>
            <div className="relative flex items-center">
              <input type="checkbox" name="es_personalizable" checked={!!formData.es_personalizable} onChange={handleCheckboxChange} className="peer sr-only" />
              <div className="w-10 h-5 bg-[rgba(112,128,144,0.18)] rounded-full peer peer-checked:bg-[#b76e79] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </div>
          </label>
        </div>
        {!formData.es_personalizable && (
          <div className="py-4 flex items-center justify-center gap-2 border border-dashed border-[rgba(112,128,144,0.2)] rounded-[14px] bg-white/30 text-[#708090]/50">
            <Settings size={15} className="opacity-30" />
            <p className="text-xs">Activa el switch para agregar variaciones</p>
          </div>
        )}
        {formData.es_personalizable && (
          <div className="space-y-3">
            {opciones.map((opcion, index) => (
              <div key={index} className="bg-white p-4 rounded-[16px] border-2 border-[rgba(112,128,144,0.1)] relative group">
                <button type="button" onClick={() => eliminarOpcion(index)} className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#2d3748] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 border-2 border-white">
                  <Trash2 size={12} />
                </button>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-[0.55rem] font-bold text-[#b76e79] uppercase tracking-widest block mb-1">Atributo</label>
                    <input value={opcion.nombre} onChange={(e) => updateOpcion(index, "nombre", e.target.value)} placeholder="Metal, Talla..." className="w-full bg-[#f6f4ef]/70 border border-transparent rounded-[10px] px-3 py-2 text-sm text-[#4a5568] font-bold focus:border-[#b76e79] focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-[0.55rem] font-bold text-[#708090] uppercase tracking-widest block mb-1">Tipo</label>
                    <select value={opcion.tipo} onChange={(e) => updateOpcion(index, "tipo", e.target.value as any)} className="w-full bg-[#f6f4ef]/70 border border-transparent rounded-[10px] px-3 py-2 text-sm text-[#4a5568] font-bold focus:border-[#b76e79] focus:bg-white outline-none cursor-pointer appearance-none">
                      <option value="select">Lista</option>
                      <option value="color">Color</option>
                      <option value="text">Texto</option>
                      <option value="number">Número</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="relative flex items-center cursor-pointer gap-2">
                      <div className="relative">
                        <input type="checkbox" checked={opcion.obligatorio} onChange={(e) => updateOpcion(index, "obligatorio", e.target.checked)} className="peer sr-only" />
                        <div className="w-8 h-4 bg-[rgba(112,128,144,0.18)] rounded-full peer peer-checked:bg-[#8c9768] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                      </div>
                      <span className="text-[0.6rem] font-bold text-[#708090] uppercase">Requerido</span>
                    </label>
                  </div>
                </div>
                {opcion.tipo !== "text" && opcion.tipo !== "number" && (
                  <div className="pt-2 border-t border-[rgba(112,128,144,0.08)]">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {opcion.valores.map((val, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-1 bg-[#f6f4ef] px-3 py-1.5 rounded-xl border border-transparent hover:border-[#b76e79]/20">
                          <input value={val} onChange={(e) => updateValor(index, vIdx, e.target.value)} className="bg-transparent border-none p-0 text-xs font-bold text-[#4a5568] w-20 focus:ring-0 outline-none" />
                          <button type="button" onClick={() => eliminarValor(index, vIdx)} className="text-[#708090]/30 hover:text-rose-500"><PlusCircle size={11} className="rotate-45" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => agregarValor(index)} className="px-3 py-1.5 rounded-xl border border-dashed border-[#b76e79]/40 text-[#b76e79] text-xs font-bold hover:bg-[#b76e79]/5 transition-all flex items-center gap-1">
                        <Plus size={12} /> Valor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={agregarOpcion} className="w-full py-3 rounded-[14px] border-2 border-dashed border-[rgba(112,128,144,0.2)] text-[#708090] hover:border-[#b76e79] hover:text-[#b76e79] hover:bg-white transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <PlusCircle size={15} strokeWidth={1.5} /> Agregar opción
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN ESPECIAL: INFORMACIÓN DEL PROVEEDOR (Solo para Revendido) */}
      {formData.tipo === "revendido" && (
        <div className="relative p-8 bg-white rounded-[24px] border-2 border-[#b76e79]/20 shadow-md">
           <SectionHeader title="Datos del" highlight="Proveedor" icon={Truck} />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3 md:col-span-1">
                <label className="text-[0.7rem] font-bold text-[#708090] uppercase tracking-[0.15em] px-1" style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}>Proveedor</label>
                <div className="relative group">
                  <select
                    name="id_proveedor"
                    value={proveedorRelacion.id_proveedor}
                    onChange={handleProveedorChange}
                    className="w-full bg-[#f6f4ef]/30 border-2 border-transparent rounded-[20px] px-8 py-4 text-[#4a5568] font-bold focus:outline-none focus:border-[#b76e79] focus:bg-white appearance-none cursor-pointer transition-all shadow-inner"
                    style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
                  >
                    <option value={0}>Selecciona un proveedor...</option>
                    {proveedores.map(prov => (
                      <option key={prov.id} value={prov.id}>{prov.nombre} — {prov.empresa}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#b76e79]">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <label className="text-[0.7rem] font-bold text-[#708090] uppercase tracking-[0.15em] px-1" style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}>Costo de compra</label>
                 <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b76e79] font-bold">$</span>
                    <input
                      type="number"
                      name="precio_compra"
                      value={proveedorRelacion.precio_compra}
                      onChange={handleProveedorChange}
                      className="w-full bg-[#f6f4ef]/30 border-2 border-transparent rounded-[20px] px-12 py-4 text-xl text-[#4a5568] font-bold focus:outline-none focus:border-[#b76e79] focus:bg-white transition-all shadow-inner"
                      style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <label className="text-[0.7rem] font-bold text-[#708090] uppercase tracking-[0.15em] px-1" style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}>Días de entrega</label>
                 <div className="relative">
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#708090]/40 font-bold uppercase text-[0.6rem]">Días</span>
                    <input
                      type="number"
                      name="tiempo_entrega"
                      value={proveedorRelacion.tiempo_entrega}
                      onChange={handleProveedorChange}
                      className="w-full bg-[#f6f4ef]/30 border-2 border-transparent rounded-[20px] px-8 py-4 text-xl text-[#4a5568] font-bold focus:outline-none focus:border-[#b76e79] focus:bg-white transition-all shadow-inner"
                      style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                    />
                 </div>
              </div>
           </div>
        </div>      )}

      {/* SECCIÓN 3: INSUMOS / MATERIALES */}
      <div className="p-5 bg-[#ffffff] rounded-[20px] border-2 border-[rgba(112,128,144,0.12)] shadow-sm">
        
        {/* BLOQUE MATERIALES (Aplica a ambos tipos) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#f6f4ef] flex items-center justify-center text-[#708090]">
              <Layers size={14} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-bold text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              Materiales <span className="text-[#b76e79]">de Fabricación</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {materialesDisponibles.map((mat) => (
              <button
                key={mat.id}
                type="button"
                onClick={() => toggleMaterial(mat.id)}
                className={`
                  px-4 py-1.5 rounded-full border-2 text-xs font-bold transition-all
                  ${materialesSeleccionados.includes(mat.id)
                    ? 'bg-[#2d3748] text-white border-[#2d3748] shadow-md'
                    : 'bg-white text-[#708090] border-[rgba(112,128,144,0.15)] hover:border-[#b76e79]/40'}
                `}
              >
                {mat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Separador */}
        {formData.tipo === "fabricado" && <div className="h-px w-full bg-[rgba(112,128,144,0.1)] mb-6" />}

        {/* BLOQUE INSUMOS (Solo Fabricado) */}
        {formData.tipo === "fabricado" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f6f4ef] flex items-center justify-center text-[#708090]"><Package size={14} strokeWidth={1.5} /></div>
                <span className="text-sm font-bold text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>Insumos <span className="text-[#b76e79]">Configuración</span></span>
              </div>
              <button type="button" onClick={agregarInsumo} className="bg-[#2d3748] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black flex items-center gap-2">
                <PlusCircle size={13} /> Agregar
              </button>
            </div>

          {loadingOpciones ? (
            <div className="py-5 flex items-center justify-center gap-3 text-[#708090]/50">
              <div className="w-5 h-5 border-2 border-[rgba(112,128,144,0.1)] border-t-[#b76e79] rounded-full animate-spin" />
              <p className="text-xs">Cargando insumos...</p>
            </div>
          ) : insumosSeleccionados.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-[rgba(112,128,144,0.2)] rounded-[14px] bg-[#f6f4ef]/20">
              <p className="text-xs text-[#708090]/60">Sin insumos agregados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {insumosSeleccionados.map((sel, idx) => {
                const info = insumosDisponibles.find(i => i.id === sel.id_insumo);
                return (
                  <div key={idx} className="flex items-center gap-3 bg-[#f6f4ef]/50 px-4 py-2.5 rounded-[14px] border border-transparent hover:border-[#b76e79]/20 transition-all">
                    <div className="w-2 h-2 rounded-full bg-[#b76e79] flex-shrink-0" />
                    <select
                      value={sel.id_insumo}
                      onChange={(e) => handleInsumoChange(idx, "id_insumo", parseInt(e.target.value))}
                      className="flex-1 bg-transparent text-sm font-bold text-[#4a5568] focus:outline-none appearance-none cursor-pointer min-w-0"
                    >
                      {insumosDisponibles.map(ins => (
                        <option key={ins.id} value={ins.id}>{ins.nombre} — ${ins.precio}/{ins.unidad_medida}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="number" step="0.01"
                        value={sel.cantidad_necesaria}
                        onChange={(e) => handleInsumoChange(idx, "cantidad_necesaria", parseFloat(e.target.value) || 0)}
                        className="w-16 bg-white rounded-lg py-1.5 px-2 text-center text-sm font-black text-[#4a5568] border border-transparent focus:border-[#b76e79] outline-none"
                      />
                      <span className="text-xs font-bold text-[#b76e79] w-8">{info?.unidad_medida || 'u.'}</span>
                      <span className="text-sm font-black text-[#4a5568] w-14 text-right">${((info?.precio || 0) * sel.cantidad_necesaria).toFixed(2)}</span>
                      <button type="button" onClick={() => eliminarInsumo(idx)} className="p-1.5 text-[#708090]/30 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-end pt-2">
                <div className="bg-[#2d3748] px-5 py-2.5 rounded-xl flex items-center gap-3">
                  <p className="text-[0.6rem] font-bold text-[#b76e79] uppercase tracking-widest">Total</p>
                  <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
                    ${insumosSeleccionados.reduce((acc, sel) => {
                      const info = insumosDisponibles.find(i => i.id === sel.id_insumo);
                      return acc + (info?.precio || 0) * sel.cantidad_necesaria;
                    }, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </div>

      {/* SECCIÓN 4: PRECIOS Y RENTABILIDAD */}
      <div className="p-5 bg-[#ffffff] rounded-[20px] border-2 border-[rgba(243, 239, 239, 0.12)] shadow-sm">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#f6f4ef] flex items-center justify-center text-[#708090]">
            <TrendingUp size={14} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
            Precios <span className="text-[#b76e79]">y</span> Rentabilidad
          </span>
        </div>

        {/* Bloque oscuro: inputs en una fila */}
        <div className="bg-[#2d3748] rounded-[16px] p-4 mb-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Costo */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-white/40 uppercase tracking-widest">Costo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b76e79] font-bold text-xs">$</span>
                <input
                  type="number" name="costo" value={formData.costo} onChange={handleChange}
                  readOnly={formData.tipo === "revendido"}
                  className={`w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-6 pr-2 text-sm font-black text-white focus:outline-none focus:border-[#b76e79] transition-all ${
                    formData.tipo === "revendido" ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                />
              </div>
              <p className="text-[0.5rem] text-white/25 italic">{formData.tipo === "revendido" ? "Del proveedor" : "(min × $1) + mat."}</p>
            </div>

            {/* Tiempo — solo fabricado */}
            {formData.tipo === "fabricado" ? (
              <div className="flex flex-col gap-1">
                <label className="text-[0.55rem] font-bold text-white/40 uppercase tracking-widest">Minutos</label>
                <div className="relative">
                  <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="number" name="tiempo" value={formData.tiempo} onChange={handleChange}
                    className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-6 pr-2 text-sm font-black text-white focus:outline-none focus:border-[#b76e79] transition-all"
                    style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                  />
                </div>
                <p className="text-[0.5rem] text-white/25 italic">min fabricación</p>
              </div>
            ) : <div />}

            {/* Precio público */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-white/40 uppercase tracking-widest">Precio público</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b76e79] font-bold text-xs">$</span>
                <input
                  type="number" name="precio" value={formData.precio} onChange={handleChange}
                  className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-6 pr-2 text-sm font-black text-white focus:outline-none focus:border-[#b76e79] transition-all"
                  style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                />
                {!formData.isManualPrecio && formData.costo > 0 && (
                  <span className="absolute -top-2 right-1 bg-[#8c9768] text-white text-[0.45rem] px-1.5 py-0.5 rounded-full font-bold">Auto 60%</span>
                )}
              </div>
              <p className="text-[0.5rem] text-white/25 italic">60% margen</p>
            </div>

            {/* Precio mayoreo */}
            <div className="flex flex-col gap-1 opacity-60">
              <label className="text-[0.55rem] font-bold text-white/40 uppercase tracking-widest">Mayoreo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs">$</span>
                <input
                  type="number" readOnly value={formData.costo_mayorista}
                  className="w-full bg-white/5 border border-transparent rounded-lg py-2 pl-6 pr-2 text-sm font-bold text-white/50 cursor-not-allowed"
                  style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
                />
              </div>
              <p className="text-[0.5rem] text-white/25 italic">−30% del público</p>
            </div>
          </div>
        </div>

        {/* Métricas: fila de 4 pills delgadas */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#f6f4ef] rounded-[12px] px-3 py-2 text-center">
            <p className="text-[0.5rem] text-[#708090] font-bold uppercase mb-0.5">Costo</p>
            <p className="text-sm font-black text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              <span className="text-[0.6rem] text-[#b76e79]">$</span>{formData.costo}
            </p>
          </div>
          <div className="bg-[#f6f4ef] rounded-[12px] px-3 py-2 text-center">
            <p className="text-[0.5rem] text-[#708090] font-bold uppercase mb-0.5">Ganancia</p>
            <p className={`text-sm font-black ${formData.ganancia >= 0 ? 'text-[#8c9768]' : 'text-rose-500'}`} style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              <span className="text-[0.6rem] opacity-40">$</span>{formData.ganancia}
            </p>
          </div>
          <div className="bg-[#f6f4ef] rounded-[12px] px-3 py-2 text-center">
            <p className="text-[0.5rem] text-[#708090] font-bold uppercase mb-0.5">ROI</p>
            <p className={`text-sm font-black ${formData.roi_porcentaje >= 60 ? 'text-[#8c9768]' : 'text-amber-500'}`} style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              {formData.roi_porcentaje}<span className="text-[0.6rem] opacity-40">%</span>
            </p>
          </div>
          <div className="bg-[#f6f4ef] rounded-[12px] px-3 py-2 text-center">
            <p className="text-[0.5rem] text-[#708090] font-bold uppercase mb-0.5">Precio</p>
            <p className="text-sm font-black text-[#b76e79]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              <span className="text-[0.6rem] opacity-40">$</span>{formData.precio}
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: STOCK */}
      <div className="p-6 bg-[#ede9e3] rounded-[24px] border-2 border-[rgba(112,128,144,0.12)] shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#708090] border border-[rgba(112,128,144,0.12)] shadow-sm">
              <Package size={18} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold text-[#4a5568]" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>Control de Stock</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <label className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest">Stock actual</label>
              <input
                type="number"
                name="stock_actual"
                value={formData.stock_actual}
                onChange={handleChange}
                className="w-32 bg-white border-2 border-transparent focus:border-[#b76e79] rounded-xl py-2 px-4 text-xl font-black text-[#4a5568] outline-none transition-all text-right shadow-sm"
                style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
              />
            </div>
            <div className="w-px h-10 bg-[rgba(112,128,144,0.2)]" />
            <div className="flex flex-col items-end gap-1">
              <label className="text-[0.6rem] font-bold text-[#b76e79] uppercase tracking-widest">Stock mínimo</label>
              <input
                type="number"
                name="stock_min"
                value={formData.stock_min}
                onChange={handleChange}
                className="w-32 bg-white border-2 border-transparent focus:border-[#b76e79] rounded-xl py-2 px-4 text-xl font-black text-[#4a5568] outline-none transition-all text-right shadow-sm"
                style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 6: IMAGEN Y DESCRIPCIÓN */}
      <div className="p-6 bg-[#ffffff] rounded-[24px] border-2 border-[rgba(112,128,144,0.12)] shadow-md">
        <div className="flex items-start gap-6">

          {/* Imagen preview + upload — columna izquierda fija */}
          <div className="flex-shrink-0 flex flex-col gap-3" style={{ width: '160px' }}>
            <p className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest">Imagen</p>
            <div className="w-full aspect-square bg-[#f6f4ef] rounded-[20px] border-2 border-[rgba(112,128,144,0.12)] overflow-hidden relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#708090]/30">
                  <ImageIcon size={28} strokeWidth={1} />
                  <p className="text-[0.55rem] font-bold uppercase tracking-widest">Sin imagen</p>
                </div>
              )}
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(null); setImagenFile(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-[rgba(112,128,144,0.2)] rounded-[14px] cursor-pointer hover:bg-[#b76e79]/5 hover:border-[#b76e79]/30 transition-all">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Plus size={14} className="text-[#b76e79]" />
              <span className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest">Subir</span>
            </label>
          </div>

          {/* Descripción — columna derecha */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest">Descripción</p>
              <span className="text-[0.55rem] text-[#708090]/50">Opcional</span>
            </div>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={6}
              placeholder="Describe el producto..."
              className="w-full h-full bg-[#f6f4ef]/30 border-2 border-transparent rounded-[16px] p-4 text-sm text-[#4a5568] focus:border-[#b76e79] focus:bg-white outline-none transition-all resize-none shadow-inner"
              style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
            />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-6 pt-6 border-t-2 border-[rgba(112,128,144,0.08)]">
        <button
          type="button"
          onClick={onCancel}
          className="text-[0.75rem] font-bold text-[#708090] uppercase tracking-[0.25em] hover:text-[#b76e79] transition-all px-4 py-2"
          style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d3748] text-white px-20 py-6 rounded-full text-[0.8rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,55,72,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
          style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
        >
          {loading ? "Guardando..." : producto ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
