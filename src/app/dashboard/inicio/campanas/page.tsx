"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Calendar, Tag, Gift, Layout, Trophy, Search, AlertCircle } from "lucide-react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import { useAuth } from "@lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@utils/supabase/client";
import CampanaFormModal from "./_components/CampanaFormModal";
import GestionSorteosModal from "./_components/GestionSorteosModal";
import Skeleton from "@/app/_components/ui/Skeleton";

interface Campana {
  id: number;
  titulo: string;
  subtitulo: string;
  tipo_promocion: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  cta_texto: string;
  cta_href: string;
  url_imagen?: string;
}

export default function CampanasPage() {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGestionModal, setShowGestionModal] = useState(false);
  const [selected, setSelected] = useState<Campana | null>(null);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loadingUser && usuario && !usuario.esAdmin()) {
      router.push("/dashboard/inicio");
    }
  }, [usuario, loadingUser, router]);

  const cargarCampanas = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("campana_banner")
        .select("*")
        .order("created_at", { ascending: false });
      setCampanas(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && usuario?.esAdmin()) {
      cargarCampanas();
    }
  }, [loadingUser, usuario]);

  const toggleActivo = async (campana: Campana) => {
    const supabase = createClient();
    await supabase
      .from("campana_banner")
      .update({ activo: !campana.activo })
      .eq("id", campana.id);
    
    // Si es sorteo, también actualizar la tabla sorteos
    if (campana.tipo_promocion === "sorteo") {
      await supabase
        .from("sorteos")
        .update({ activo: !campana.activo })
        .eq("id_banner", campana.id);
    }

    setCampanas(prev =>
      prev.map(c => c.id === campana.id ? { ...c, activo: !c.activo } : c)
    );
  };

  const eliminar = async (id: number, tipo: string) => {
    if (!confirm("¿Estás seguro de eliminar esta campaña?")) return;
    
    const supabase = createClient();
    if (tipo === "sorteo") {
      // Eliminar sorteo primero por constraints
      await supabase.from("sorteos").delete().eq("id_banner", id);
    }
    await supabase.from("campana_banner").delete().eq("id", id);
    setCampanas(prev => prev.filter(c => c.id !== id));
  };

  const now = new Date();
  const getStatus = (c: Campana) => {
    if (!c.activo) return "inactive";
    if (new Date(c.fecha_inicio) > now) return "pending";
    if (new Date(c.fecha_fin) < now) return "expired";
    return "live";
  };

  const filteredCampanas = campanas.filter(c => 
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo_promocion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingUser) return null;
  if (!usuario?.esAdmin()) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#fdfaf5]">
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-8">

          {/* ── Header Unificado ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-[#b76e79]" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#b76e79] font-serif">Marketing Hub</span>
              </div>
              <h1 className="text-4xl font-serif text-[#4a5568]">Gestión de <span className="italic text-[#b76e79]">Campañas</span></h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(null); setShowModal(true); }}
              className="px-8 py-4 bg-[#b76e79] text-white rounded-2xl font-bold shadow-xl shadow-[#b76e79]/20 flex items-center gap-3 transition-all"
            >
              <Plus size={20} /> Nueva Campaña
            </motion.button>
          </div>

          {/* ── Filtros y Buscador ── */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm text-gray-600"
                placeholder="Buscar por título o tipo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ── Lista Consolidada ── */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton height={120} borderRadius={24} />
                <Skeleton height={120} borderRadius={24} />
              </div>
            ) : filteredCampanas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                 <Layout size={48} className="mx-auto text-gray-200 mb-4" />
                 <p className="text-xl font-serif text-gray-400">No hay campañas que coincidan</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredCampanas.map((c) => {
                  const status = getStatus(c);
                  const isSorteo = c.tipo_promocion === "sorteo";
                  
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#b76e79]/20 transition-all flex flex-col md:flex-row items-center gap-6"
                    >
                      {/* Thumbnail */}
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden relative flex-shrink-0 border border-gray-50">
                        {c.url_imagen ? (
                          <img src={c.url_imagen} alt={c.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            {isSorteo ? <Trophy size={32} /> : <Layout size={32} />}
                          </div>
                        )}
                        {status === "live" && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                           <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isSorteo ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                             {isSorteo ? "Sorteo de Leads" : "Banner Informativo"}
                           </span>
                           <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             status === 'live' ? 'bg-green-100 text-green-600' : 
                             status === 'expired' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                           }`}>
                             {status === 'live' ? 'En vivo' : status === 'expired' ? 'Finalizada' : 'Pendiente/Inactiva'}
                           </span>
                        </div>
                        <h3 className="text-xl font-serif text-[#4a5568]">{c.titulo}</h3>
                        <p className="text-xs text-gray-400 font-medium italic">{c.subtitulo}</p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                              <Calendar size={12} className="text-[#b76e79]" />
                              {new Date(c.fecha_inicio).toLocaleDateString()} - {new Date(c.fecha_fin).toLocaleDateString()}
                           </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleActivo(c)}
                          className={`p-2 rounded-xl transition-colors ${c.activo ? 'text-[#b76e79] hover:bg-red-50' : 'text-gray-300 hover:bg-gray-50'}`}
                        >
                          {c.activo ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>

                        <button 
                          onClick={() => { setSelected(c); setShowModal(true); }}
                          className="p-3 bg-gray-50 text-gray-500 hover:bg-[#b76e79] hover:text-white rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit3 size={18} />
                        </button>

                        {isSorteo && (
                          <button 
                            onClick={() => { setSelectedBannerId(c.id); setShowGestionModal(true); }}
                            className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all"
                            title="Gestionar Ganadores"
                          >
                            <Trophy size={18} />
                          </button>
                        )}

                        <button 
                          onClick={() => eliminar(c.id, c.tipo_promocion)}
                          className="p-3 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Modal Unificado */}
      <AnimatePresence>
        {showModal && (
          <CampanaFormModal 
            campana={selected}
            onClose={() => setShowModal(false)}
            onSaved={() => {
              setShowModal(false);
              cargarCampanas();
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de Ganadores */}
      <AnimatePresence>
        {showGestionModal && selectedBannerId && (
          <GestionSorteosModal 
            bannerId={selectedBannerId}
            onClose={() => setShowGestionModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
