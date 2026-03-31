"use client";

import { useState, useEffect } from "react";
import { createClient } from "@utils/supabase/client";
import { ProveedorService } from "@lib/services/ProveedorService";
import { Proveedor, CreateProveedorDTO } from "@lib/models";
import { FiX, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";

interface Props {
  onClose: () => void;
}

export default function SuppliersModal({ onClose }: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateProveedorDTO>({
    nombre: "",
    empresa: "",
    telefono: "",
    correo: "",
    direccion: "",
    activo: true,
  });

  const cargarProveedores = async () => {
    setLoading(true);
    const supabase = createClient();
    const service = new ProveedorService(supabase);
    const { proveedores: data } = await service.obtenerTodos();
    if (data) setProveedores(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const service = new ProveedorService(supabase);

    if (editingId) {
      await service.actualizar(editingId, form);
    } else {
      await service.crear(form);
    }

    setForm({ nombre: "", empresa: "", telefono: "", correo: "", direccion: "", activo: true });
    setEditingId(null);
    cargarProveedores();
  };

  const handleEdit = (p: Proveedor) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre,
      empresa: p.empresa || "",
      telefono: p.telefono || "",
      correo: p.correo || "",
      direccion: p.direccion || "",
      activo: p.activo,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      const supabase = createClient();
      const service = new ProveedorService(supabase);
      await service.eliminar(id);
      cargarProveedores();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#4a5568]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-[#f6f4ef] rounded-[24px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_56px_rgba(140,151,104,0.22)] border border-[rgba(112,128,144,0.18)]">
        
        {/* Header */}
        <header className="p-8 pb-6 border-b border-[rgba(112,128,144,0.12)] flex justify-between items-center bg-white">
          <div className="space-y-1">
            <p className="text-[#8c9768] text-[0.65rem] font-medium uppercase tracking-[0.18em] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
              Base de Datos
            </p>
            <h2 className="text-3xl font-serif font-bold text-[#4a5568] tracking-tight">Gestión de <em className="text-[#b76e79] not-italic">Proveedores</em></h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f6f4ef] rounded-full transition-all text-[#708090]">
            <FiX className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(140,151,104,0.08)] border border-[rgba(112,128,144,0.18)] sticky top-0">
              <h3 className="text-lg font-serif font-bold text-[#4a5568] mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-marcellus)" }}>
                {editingId ? <FiEdit2 className="text-[#b76e79]" /> : <FiPlus className="text-[#b76e79]" />}
                {editingId ? "Actualizar Proveedor" : "Registrar Proveedor"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Contacto Principal</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={e => setForm({...form, nombre: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#f6f4ef]/30 border border-[rgba(112,128,144,0.25)] rounded-xl focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] focus:outline-none transition-all font-sans text-sm text-[#4a5568]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Nombre Empresa</label>
                  <input
                    value={form.empresa}
                    onChange={e => setForm({...form, empresa: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#f6f4ef]/30 border border-[rgba(112,128,144,0.25)] rounded-xl focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] focus:outline-none transition-all font-sans text-sm text-[#4a5568]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Teléfono</label>
                  <input
                    value={form.telefono}
                    onChange={e => setForm({...form, telefono: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#f6f4ef]/30 border border-[rgba(112,128,144,0.25)] rounded-xl focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] focus:outline-none transition-all font-sans text-sm text-[#4a5568]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-medium text-[#708090] uppercase tracking-wide font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>Correo Electrónico</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={e => setForm({...form, correo: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#f6f4ef]/30 border border-[rgba(112,128,144,0.25)] rounded-xl focus:ring-2 focus:ring-[#b76e79]/30 focus:border-[#b76e79] focus:outline-none transition-all font-sans text-sm text-[#4a5568]"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#b76e79] text-[#f6f4ef] py-2.5 rounded-[6px] text-[0.8rem] font-sans tracking-[0.04em] hover:shadow-[0_10px_26px_rgba(183,110,121,0.32)] hover:-translate-y-0.5 transition-all shadow-[0_3px_12px_rgba(183,110,121,0.22)]"
                  >
                    {editingId ? "Guardar Cambios" : "Añadir Proveedor"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setForm({ nombre: "", empresa: "", telefono: "", correo: "", direccion: "", activo: true }); }}
                      className="px-4 py-2.5 bg-[#f6f4ef] text-[#708090] border border-[rgba(112,128,144,0.25)] rounded-[6px] hover:bg-white transition-all"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="text-center py-20 font-serif text-[#708090] text-xl" style={{ fontFamily: "var(--font-marcellus)" }}>Cargando proveedores...</div>
            ) : proveedores.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[rgba(112,128,144,0.25)] flex flex-col items-center gap-4">
                <p className="font-serif text-[#708090] text-xl" style={{ fontFamily: "var(--font-marcellus)" }}>No hay proveedores registrados aún.</p>
                <p className="text-sm text-[#708090]/60 max-w-xs font-sans">Comienza por añadir tu primer contacto en el formulario de la izquierda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 pb-12">
                {proveedores.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-[rgba(112,128,144,0.18)] shadow-[0_2px_12px_rgba(140,151,104,0.08)] group hover:shadow-[0_18px_40px_rgba(140,151,104,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-2 text-[#708090] hover:text-[#b76e79] hover:bg-[#f6f4ef] rounded-full transition-all">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-[#708090] hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-serif text-xl text-[#4a5568]" style={{ fontFamily: "var(--font-marcellus)" }}>{p.nombre}</h4>
                        {p.empresa && <p className="text-xs font-serif font-extrabold text-[#b76e79] uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>{p.empresa}</p>}
                      </div>
                      
                      <div className="space-y-1.5 border-t border-[rgba(112,128,144,0.08)] pt-3">
                        <div className="flex items-center gap-3 text-xs text-[#708090]">
                          <span className="w-16 font-serif font-extrabold uppercase tracking-tight opacity-40 text-[0.6rem]" style={{ fontFamily: "var(--font-marcellus)" }}>Teléfono:</span>
                          <span className="font-medium font-sans">{p.telefono || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#708090]">
                          <span className="w-16 font-serif font-extrabold uppercase tracking-tight opacity-40 text-[0.6rem]" style={{ fontFamily: "var(--font-marcellus)" }}>Correo:</span>
                          <span className="font-medium truncate font-sans">{p.correo || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
