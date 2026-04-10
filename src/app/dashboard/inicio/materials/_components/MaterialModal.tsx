"use client";

import { useState, useEffect } from "react";
import { Insumo, Proveedor } from "@lib/models";
import { createClient } from "@utils/supabase/client";
import { ProveedorService } from "@lib/services/ProveedorService";
import { ProductoInsumoService } from "@lib/services/ProductoInsumoService";
import { FiX, FiPackage, FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../../_components/ConfirmationModal";


const CATEGORIAS = [
  "hilo", "balín", "argolla", "broche", "arete", "cristal", 
  "perla", "chaquira", "letra", "piedra", "alambre", "extensión", "otro"
];

const UNIDADES = [
  "unidad", "metro", "pieza", "pieza (par)", "gramos"
];

type Props = {
  material: Insumo;
  onClose: () => void;
  onSave: (material: Insumo) => void;
  onDelete?: (id: number) => void;
};

export default function MaterialModal({ material, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState({
    id: material.id,
    nombre: material.nombre,
    tipo: material.tipo,
    precio: material.precio,
    cantidad: material.cantidad,
    unidad_medida: material.unidad_medida || "",
    stock_minimo: material.stock_minimo || 0,
    id_proveedor: material.id_proveedor || 0,
    activo: material.activo ?? true,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosRelacionados, setProductosRelacionados] = useState<{
    cantidad_necesaria: number;
    producto: { id: number; nombre: string | null };
    opcion_valor?: { valor: string; opcion: { nombre: string } } | null;
  }[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  useEffect(() => {
    const cargarDatos = async () => {

      const supabase = createClient();
      
      // Cargar Proveedores
      const provService = new ProveedorService(supabase);
      const { proveedores: dataProv } = await provService.obtenerTodos();
      if (dataProv) setProveedores(dataProv);

      // Cargar Productos Relacionados
      if (material.id) {
        setLoadingProductos(true);
        const relService = new ProductoInsumoService(supabase);
        const { productos } = await relService.obtenerProductosPorInsumo(material.id);
        if (productos) setProductosRelacionados(productos as any[]); // Casting to any[] temporarily to match previous state if needed, but the type above is more correct. Actually let's just cast data to the correct type.
        setLoadingProductos(false);
      }
    };
    cargarDatos();
  }, [material.id]);


  const handleChange = (field: keyof typeof form, value: string | number | boolean | null) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const actualizado = new Insumo(form);
    onSave(actualizado);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && material.id) {
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (onDelete && material.id) {
      onDelete(material.id);
      setIsDeleteModalOpen(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#4a5568]/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[16px] w-full max-w-2xl p-8 shadow-[0_20px_56px_rgba(140,151,104,0.22)] border border-[rgba(112,128,144,0.18)] space-y-8 relative my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#708090] hover:bg-gray-100 rounded-full transition-all"
        >
          <FiX size={20} />
        </button>

        <header className="space-y-1">
          <p className="text-[#8c9768] text-[0.65rem] font-medium uppercase tracking-[0.18em] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
            Detalle de Inventario
          </p>
          <h2 className="text-3xl font-serif font-bold text-[#4a5568] tracking-tight">
            {material.nombre} <em className="text-[#b76e79] not-italic">Material</em>
          </h2>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Nombre */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
              Nombre
            </label>
            <input
              value={form.nombre}
              onChange={e => handleChange("nombre", e.target.value)}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Tipo (Select) */}
          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Unidad</label>
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

          {/* Precio */}
          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
              Precio unitario (Costo)
            </label>
            <input
              type="number"
              value={form.precio}
              onChange={e => handleChange("precio", Number(e.target.value))}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Precio Sugerido */}
          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif font-extrabold" style={{ fontFamily: "var(--font-marcellus)" }}>
              Venta Sugerida (+50%)
            </label>
            <div className="w-full border border-[rgba(112,128,144,0.15)] rounded-[6px] px-4 py-2.5 text-sm text-[#708090] font-bold bg-[#708090]/5 font-sans">
              ${(form.precio * 1.5).toFixed(2)}
            </div>
          </div>

          {/* Stock Actual */}
          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
              Stock actual
            </label>
            <input
              type="number"
              value={form.cantidad}
              onChange={e => handleChange("cantidad", Number(e.target.value))}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Stock Mínimo */}
          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
              Stock mínimo (Alerta)
            </label>
            <input
              type="number"
              value={form.stock_minimo}
              onChange={e => handleChange("stock_minimo", Number(e.target.value))}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans"
            />
          </div>

          {/* Proveedor */}
          <div className="space-y-1.5">
            <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Proveedor</label>
            <select
              value={form.id_proveedor || ""}
              onChange={e => handleChange("id_proveedor", e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-[rgba(112,128,144,0.25)] rounded-[6px] px-4 py-2.5 text-sm text-[#4a5568] bg-[#f6f4ef]/30 focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] transition-all font-sans appearance-none"
            >
              <option value="">Sin proveedor</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} {p.empresa ? `(${p.empresa})` : ''}</option>
              ))}
            </select>
          </div>
        </section>

        {/* 📋 Productos que usan este material */}
        <section className="space-y-4 pt-4 border-t border-[rgba(112,128,144,0.12)]">
          <div className="flex items-center gap-2">
            <FiPackage className="text-[#b76e79]" />
            <h3 className="text-sm font-bold text-[#4a5568] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Productos Vinculados</h3>
            <span className="bg-[#f6f4ef] text-[#708090] text-[0.65rem] px-2 py-0.5 rounded-full font-serif font-extrabold" style={{ fontFamily: "var(--font-marcellus)" }}>
              {productosRelacionados.length}
            </span>
          </div>

          <div className="bg-[#f6f4ef]/30 rounded-xl border border-[rgba(112,128,144,0.1)] overflow-hidden">
            {loadingProductos ? (
              <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b76e79] mx-auto" /></div>
            ) : productosRelacionados.length === 0 ? (
              <div className="p-8 text-center text-[0.7rem] text-[#708090] uppercase tracking-widest bg-white/50">
                Ningún producto utiliza este material actualmente
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f6f4ef]/50 border-b border-[rgba(112,128,144,0.05)]">
                    <th className="px-4 py-2.5 font-bold text-[#708090] uppercase tracking-tighter font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Producto</th>
                    <th className="px-4 py-2.5 font-bold text-[#708090] uppercase tracking-tighter text-right font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Cantidad</th>
                    <th className="px-4 py-2.5 font-bold text-[#708090] uppercase tracking-tighter font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Variante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(112,128,144,0.05)] bg-white/30">
                  {productosRelacionados.map((rel, idx) => (
                    <tr key={idx} className="hover:bg-white/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-[#4a5568] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>{rel.producto?.nombre}</td>
                      <td className="px-4 py-3 text-right font-bold text-[#b76e79] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
                        {rel.cantidad_necesaria} {material.unidad_medida}
                      </td>
                      <td className="px-4 py-3 text-[0.65rem] text-[#708090]">
                        {rel.opcion_valor 
                          ? `${rel.opcion_valor.opcion?.nombre}: ${rel.opcion_valor.valor}`
                          : <span className="opacity-30">---</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>


        <div className="flex justify-between items-center pt-4 border-t border-[rgba(112,128,144,0.12)]">
          <div>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-red-500 text-[0.8rem] font-medium hover:bg-red-50 transition-all"
              >
                <FiTrash2 size={16} />
                <span>Eliminar Material</span>
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-[6px] border-[1.5px] border-[rgba(112,128,144,0.25)] text-[#708090] text-[0.8rem] font-sans tracking-[0.04em] hover:border-[#708090] hover:text-[#4a5568] hover:bg-[rgba(112,128,144,0.08)] transition-all duration-220"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="bg-[#b76e79] text-[#f6f4ef] px-8 py-2.5 rounded-[6px] text-[0.8rem] font-sans tracking-[0.04em] hover:shadow-[0_10px_26px_rgba(183,110,121,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all duration-220 shadow-[0_3px_12px_rgba(183,110,121,0.22)]"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Material"
        message={`¿Estás seguro de que deseas eliminar "${material.nombre}"? Esta acción marcará el material como inactivo.`}
        confirmLabel="Eliminar"
        cancelLabel="Volver"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
}
