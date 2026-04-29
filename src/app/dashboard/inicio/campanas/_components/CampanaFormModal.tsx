"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Calendar, Layout, Trophy, Search, Plus, Trash2, ImageIcon, Sparkles, AlertCircle, Upload } from "lucide-react";
import { createClient } from "@utils/supabase/client";
import Image from "next/image";
import { toast } from "sonner";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  url_imagen: string;
  stock: number;
}

interface Props {
  campana?: any; // Puede ser el banner o null para nuevo
  onClose: () => void;
  onSaved: () => void;
}

export default function CampanaFormModal({ campana, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<"banner" | "sorteo">(campana?.tipo_promocion === "sorteo" ? "sorteo" : "banner");
  
  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    fecha_inicio: new Date().toISOString().slice(0, 16),
    fecha_fin: "",
    activo: true,
    cta_texto: "Ver más",
    cta_href: "/productos",
    url_imagen: ""
  });

  // Estado específico para sorteos
  const [premiosSeleccionados, setPremiosSeleccionados] = useState<string[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    cargarProductos();
    if (campana) {
      setFormData({
        titulo: campana.titulo || "",
        subtitulo: campana.subtitulo || "",
        fecha_inicio: campana.fecha_inicio ? new Date(campana.fecha_inicio).toISOString().slice(0, 16) : "",
        fecha_fin: campana.fecha_fin ? new Date(campana.fecha_fin).toISOString().slice(0, 16) : "",
        activo: campana.activo ?? true,
        cta_texto: campana.cta_texto || "Ver más",
        cta_href: campana.cta_href || "/productos",
        url_imagen: campana.url_imagen || ""
      });

      if (campana.tipo_promocion === "sorteo") {
        cargarDatosSorteo(campana.id);
      }
    }
  }, [campana]);

  const cargarDatosSorteo = async (bannerId: number) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sorteos")
      .select("*")
      .eq("id_banner", bannerId)
      .maybeSingle();
    
    if (data && data.premio) {
      setPremiosSeleccionados(data.premio.split(", ").filter(Boolean));
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch("/api/ventas/productos");
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `campanas/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product_images")
        .upload(path, file);
      
      if (upErr) throw upErr;
      
      const { data } = supabase.storage.from("product_images").getPublicUrl(path);
      setFormData(prev => ({ ...prev, url_imagen: data.publicUrl }));
      toast.success("Imagen subida con éxito");
    } catch (e: any) {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === "sorteo" && premiosSeleccionados.length === 0) {
      return toast.error("Añade al menos un premio para el sorteo");
    }

    setLoading(true);
    const toastId = toast.loading("Guardando campaña...");

    try {
      const supabase = createClient();
      
      // Convertir fechas locales del input a ISO UTC para la base de datos
      const isoInicio = new Date(formData.fecha_inicio).toISOString();
      const isoFin = new Date(formData.fecha_fin).toISOString();

      const payload = {
        ...formData,
        tipo_promocion: tipo,
        fecha_inicio: isoInicio,
        fecha_fin: isoFin,
      };

      let bannerId = campana?.id;

      // 1. Guardar/Actualizar Banner
      if (bannerId) {
        const { error } = await supabase.from("campana_banner").update(payload).eq("id", bannerId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("campana_banner").insert([payload]).select().single();
        if (error) throw error;
        bannerId = data.id;
      }

      // 2. Si es Sorteo, sincronizar tabla 'sorteos'
      if (tipo === "sorteo") {
        const payloadSorteo = {
          nombre: formData.titulo,
          descripcion: formData.subtitulo,
          premio: premiosSeleccionados.join(", "),
          fecha_inicio: isoInicio, // Usar la misma fecha exacta
          fecha_fin: isoFin,      // Usar la misma fecha exacta
          activo: formData.activo,
          id_banner: bannerId
        };

        // Verificar si ya existe
        const { data: existingSorteo } = await supabase.from("sorteos").select("id").eq("id_banner", bannerId).maybeSingle();

        if (existingSorteo) {
          await supabase.from("sorteos").update(payloadSorteo).eq("id", existingSorteo.id);
        } else {
          await supabase.from("sorteos").insert([payloadSorteo]);
        }
      }

      toast.success("Campaña guardada correctamente", { id: toastId });
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 15);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b bg-[#fdfaf5] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#b76e79] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#b76e79]/20">
                {tipo === 'banner' ? <Layout size={24} /> : <Trophy size={24} />}
             </div>
             <div>
                <h2 className="text-2xl font-serif text-[#4a5568]">
                  {campana ? "Editar" : "Nueva"} <span className="text-[#b76e79] italic">Campaña</span>
                </h2>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Marketing & Promociones</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
             <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Selector de Tipo */}
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100">
             <button 
              type="button"
              onClick={() => setTipo("banner")}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${tipo === 'banner' ? 'bg-white text-[#b76e79] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <Layout size={18} /> Banner Informativo
             </button>
             <button 
              type="button"
              onClick={() => setTipo("sorteo")}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${tipo === 'sorteo' ? 'bg-white text-amber-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <Trophy size={18} /> Sorteo de Leads
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Titulo */}
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Título de la Campaña</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                  placeholder="Ej. Colección de Verano ☀️"
                  value={formData.titulo}
                  onChange={e => setFormData({...formData, titulo: e.target.value})}
                />
             </div>

             {/* Subtitulo */}
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Subtítulo / Mensaje</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                  placeholder="Ej. Gana un set exclusivo de joyería..."
                  value={formData.subtitulo}
                  onChange={e => setFormData({...formData, subtitulo: e.target.value})}
                />
             </div>
          </div>

          {/* Sección de Imagen */}
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Imagen del Banner</label>
             <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-48 bg-gray-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 relative group">
                   {formData.url_imagen ? (
                      <>
                        <img src={formData.url_imagen} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, url_imagen: ""})}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <Trash2 size={24} />
                        </button>
                      </>
                   ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200/50 transition-colors">
                         {uploading ? <div className="w-6 h-6 border-2 border-[#b76e79] border-t-transparent rounded-full animate-spin" /> : <Upload size={32} className="text-gray-300" />}
                         <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Subir Imagen</span>
                         <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                      </label>
                   )}
                </div>
                <div className="flex-1 space-y-4">
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                      <Sparkles className="text-amber-500 shrink-0" size={20} />
                      <p className="text-xs text-amber-800 leading-relaxed italic">
                        Usa imágenes horizontales (16:9) para que luzcan perfectas en el banner de la tienda.
                      </p>
                   </div>
                   <input 
                    className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-[10px] font-mono"
                    placeholder="O pega una URL externa aquí..."
                    value={formData.url_imagen}
                    onChange={e => setFormData({...formData, url_imagen: e.target.value})}
                   />
                </div>
             </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Fecha Inicio</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                  value={formData.fecha_inicio}
                  onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Fecha Fin</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                  value={formData.fecha_fin}
                  onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
                />
             </div>
          </div>

          {/* Sección Dinámica: Sorteo */}
          <AnimatePresence>
            {tipo === "sorteo" && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-visible space-y-6 pt-4 border-t border-dashed border-gray-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-gray-700">Premios del Sorteo</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {premiosSeleccionados.map((p, idx) => {
                      const productInfo = productos.find(prod => prod.nombre === p);
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl text-[11px] font-bold border border-amber-100 shadow-sm">
                          {productInfo?.url_imagen ? (
                            <img src={productInfo.url_imagen} className="w-6 h-6 rounded-md object-cover shadow-sm" />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center border border-amber-200">
                              <Trophy size={10} className="text-amber-400" />
                            </div>
                          )}
                          <span>{p}</span>
                          <button type="button" onClick={() => setPremiosSeleccionados(premiosSeleccionados.filter((_, i) => i !== idx))} className="hover:text-red-500 transition-colors ml-1 p-0.5">
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                    {premiosSeleccionados.length === 0 && <p className="text-[10px] text-gray-400 italic">No hay premios seleccionados aún...</p>}
                  </div>

                  <div className="relative">
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                      placeholder="Escribe un premio y presiona Enter o busca un producto..."
                      value={search}
                      onFocus={() => setShowResults(true)}
                      onBlur={() => setTimeout(() => setShowResults(false), 200)}
                      onChange={e => setSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = search.trim();
                          if (val && !premiosSeleccionados.includes(val)) {
                            setPremiosSeleccionados([...premiosSeleccionados, val]);
                          }
                          setSearch("");
                        }
                      }}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    
                    {(search || showResults) && (
                      <div className="absolute z-[200] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredProducts.length === 0 && (
                            <div className="p-4 text-center text-xs text-gray-400 italic">
                              No se encontraron productos...
                            </div>
                          )}
                          {filteredProducts.map(p => (
                            <div 
                              key={p.id}
                              onClick={() => {
                                if(!premiosSeleccionados.includes(p.nombre)) {
                                  setPremiosSeleccionados([...premiosSeleccionados, p.nombre]);
                                }
                                setSearch("");
                              }}
                              className="p-3 hover:bg-amber-50 cursor-pointer flex items-center justify-between border-b border-gray-50 group"
                            >
                              <div className="flex items-center gap-3">
                                {p.url_imagen ? <img src={p.url_imagen} className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-110 transition-transform" /> : <div className="w-8 h-8 rounded-lg bg-gray-100" />}
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-600">{p.nombre}</span>
                                  <span className={`text-[10px] ${p.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                                    {p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}
                                  </span>
                                </div>
                              </div>
                              <Plus size={16} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                        
                        {/* Opción para añadir personalizado siempre al final si hay búsqueda */}
                        {search && (
                          <div 
                            onClick={() => {
                              const val = search.trim();
                              if(val && !premiosSeleccionados.includes(val)) {
                                setPremiosSeleccionados([...premiosSeleccionados, val]);
                              }
                              setSearch("");
                            }}
                            className="p-3 hover:bg-amber-50 cursor-pointer flex items-center justify-between bg-amber-50/50 border-t border-amber-100"
                          >
                            <span className="text-xs font-bold text-amber-600 italic">Añadir "{search}" como premio manual</span>
                            <Plus size={16} className="text-amber-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Configuración de Botón y Enlace (Solo para Banner) */}
          {tipo === "banner" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-200">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Texto del Botón (CTA)</label>
                  <input 
                    className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                    placeholder="Ej. Explorar ahora"
                    value={formData.cta_texto}
                    onChange={e => setFormData({...formData, cta_texto: e.target.value})}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Enlace de Destino</label>
                  <input 
                    className="w-full px-6 py-4 bg-gray-50 border-transparent focus:border-[#b76e79] focus:bg-white rounded-2xl outline-none transition-all text-sm"
                    placeholder="Ej. /productos/ofertas"
                    value={formData.cta_href}
                    onChange={e => setFormData({...formData, cta_href: e.target.value})}
                  />
               </div>
            </div>
          )}

          {/* Footer de Acciones */}
          <div className="pt-6 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, activo: !formData.activo})}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${formData.activo ? 'bg-[#b76e79]' : 'bg-gray-300'}`}
                >
                   <motion.div 
                    animate={{ x: formData.activo ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                   />
                </button>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Activar Campaña</span>
             </div>

             <button
              disabled={loading}
              type="submit"
              className="px-12 py-5 bg-[#b76e79] hover:bg-[#a45f69] text-white rounded-[2rem] font-bold transition-all shadow-xl shadow-[#b76e79]/20 flex items-center gap-3 disabled:opacity-50"
             >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> {campana ? "Guardar Cambios" : "Lanzar Campaña"}</>}
             </button>
          </div>
        </form>
      </motion.div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fdfaf5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e0; }
      `}</style>
    </div>
  );
}
