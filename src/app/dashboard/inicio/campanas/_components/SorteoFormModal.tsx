"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Calendar, Trophy, Save, Sparkles, Search, Package, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  url_imagen: string;
}

interface Props {
  sorteo?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function SorteoFormModal({ sorteo, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [premiosSeleccionados, setPremiosSeleccionados] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: "",
    activo: true
  });

  useEffect(() => {
    cargarProductos();
    if (sorteo) {
      setFormData({
        nombre: sorteo.nombre || "",
        descripcion: sorteo.descripcion || "",
        fecha_inicio: sorteo.fecha_inicio?.split('T')[0] || "",
        fecha_fin: sorteo.fecha_fin?.split('T')[0] || "",
        activo: sorteo.activo ?? true
      });
      if (sorteo.premio) {
        setPremiosSeleccionados(sorteo.premio.split(", ").filter(Boolean));
      }
    }
  }, [sorteo]);

  const cargarProductos = async () => {
    try {
      const res = await fetch("/api/ventas/productos");
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  const addPremio = (nombre: string) => {
    if (!premiosSeleccionados.includes(nombre)) {
      setPremiosSeleccionados([...premiosSeleccionados, nombre]);
      toast.success(`Añadido: ${nombre}`);
    }
    setSearch("");
    setShowProductList(false);
  };

  const removePremio = (index: number) => {
    setPremiosSeleccionados(premiosSeleccionados.filter((_, i) => i !== index));
  };

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (premiosSeleccionados.length === 0) {
      return toast.error("Debes añadir al menos un premio del inventario");
    }

    setLoading(true);
    const toastId = toast.loading(sorteo ? "Actualizando sorteo..." : "Creando sorteo...");

    try {
      const method = sorteo ? "PATCH" : "POST";
      const payload = {
        ...formData,
        premio: premiosSeleccionados.join(", "),
        id: sorteo?.id,
        id_banner: sorteo?.id_banner
      };

      const res = await fetch("/api/sorteo", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(sorteo ? "Sorteo actualizado" : "¡Sorteo creado con éxito!", { id: toastId });
        onSaved();
      } else {
        toast.error(data.error || "Error al guardar el sorteo", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Fondo - Solo cierra si se hace click fuera */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al clickar dentro
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-8 border-b bg-[#fdfaf5] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#b76e79] rounded-2xl text-white shadow-lg shadow-[#b76e79]/20">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4a5568]">
                {sorteo ? "Editar Sorteo" : "Nuevo Sorteo"}
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Configuración de Premios</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[60vh]">
           <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nombre del Sorteo</label>
              <input 
                required
                className="w-full px-5 py-3.5 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                placeholder="Ej. Sorteo Premium"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Premios Seleccionados</label>
              
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {premiosSeleccionados.map((p, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2 bg-[#b76e79]/10 text-[#b76e79] px-3 py-2 rounded-xl text-xs font-bold border border-[#b76e79]/20"
                    >
                      <Trophy size={14} />
                      {p}
                      <button type="button" onClick={() => removePremio(idx)} className="hover:text-red-500 transition-colors ml-1">
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {premiosSeleccionados.length === 0 && (
                   <div className="text-xs text-gray-300 italic py-2 ml-2">No has añadido premios aún</div>
                )}
              </div>

              <div className="relative">
                 <input 
                  className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                  placeholder="Buscar en inventario..."
                  value={search}
                  onFocus={() => setShowProductList(true)}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowProductList(true);
                  }}
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* Resultados de búsqueda */}
              <AnimatePresence>
                {showProductList && search && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {filteredProducts.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => addPremio(p.nombre)}
                        className="p-3 hover:bg-[#fdfaf5] cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative">
                             {p.url_imagen && <Image src={p.url_imagen} alt={p.nombre} fill className="object-cover" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">{p.nombre}</p>
                            <p className="text-[10px] text-[#8c9768] font-bold">${p.precio}</p>
                          </div>
                        </div>
                        <Plus size={14} className="text-[#b76e79]" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Descripción Corta</label>
              <textarea 
                rows={2}
                className="w-full px-5 py-3 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm resize-none"
                placeholder="Ej. Gana un set exclusivo de joyería..."
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Inicia</label>
                <input 
                  required
                  type="date"
                  className="w-full px-5 py-3.5 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                  value={formData.fecha_inicio}
                  onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Termina</label>
                <input 
                  required
                  type="date"
                  className="w-full px-5 py-3.5 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                  value={formData.fecha_fin}
                  onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
                />
              </div>
           </div>

           <div className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-[#b76e79] hover:bg-[#a45f69] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b76e79]/20 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> {sorteo ? "Guardar Cambios" : "Crear Sorteo"}</>}
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
}
