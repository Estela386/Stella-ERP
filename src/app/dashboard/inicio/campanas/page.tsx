"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Calendar, Tag } from "lucide-react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import { useAuth } from "@lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@utils/supabase/client";
import EditCampaignModal from "./_components/EditCampaignModal";
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
  const [selected, setSelected] = useState<Campana | null>(null);

  // Guard: solo admin
  useEffect(() => {
    if (!loadingUser && usuario && !usuario.esAdmin()) {
      router.push("/dashboard/inicio");
    }
  }, [usuario, loadingUser, router]);

  // Cargar campañas
  const cargarCampanas = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("campana_banner")
      .select("*")
      .order("created_at", { ascending: false });
    setCampanas(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      if (!loadingUser && usuario?.esAdmin()) {
        await cargarCampanas();
      }
    };
    init();
  }, [loadingUser, usuario]);

  const toggleActivo = async (campana: Campana) => {
    const supabase = createClient();
    await supabase
      .from("campana_banner")
      .update({ activo: !campana.activo })
      .eq("id", campana.id);
    setCampanas(prev =>
      prev.map(c => c.id === campana.id ? { ...c, activo: !c.activo } : c)
    );
  };

  const eliminar = async (id: number) => {
    const supabase = createClient();
    await supabase.from("campana_banner").delete().eq("id", id);
    setCampanas(prev => prev.filter(c => c.id !== id));
  };

  const now = new Date();
  const isLive = (c: Campana) =>
    c.activo && new Date(c.fecha_inicio) <= now && new Date(c.fecha_fin) >= now;

  if (loadingUser) return null;
  if (!usuario?.esAdmin()) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <div className="mx-auto max-w-[1440px] space-y-10">

          {/* ── Header ── */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="h-px w-12" style={{ background: "var(--rose-gold)" }} />
                <span className="text-xs tracking-[0.4em] uppercase font-medium" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-marcellus)" }}>
                  Marketing · ERP
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl" style={{
                fontFamily: "var(--font-marcellus)",
                fontWeight: 400,
                color: "var(--charcoal)",
                margin: 0,
                lineHeight: 1.1,
              }}>
                Campañas <span style={{ color: "var(--rose-gold)", fontStyle: "italic" }}>Especiales</span>
              </h1>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelected(null); setShowModal(true); }}
              className="px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition duration-300 shadow-sm hover:shadow-lg"
              style={{
                background: "var(--rose-gold)",
                color: "var(--beige)",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
              }}
            >
              <Plus size={16} />
              Nueva Campaña
            </motion.button>
          </header>

          {loading ? (
            <div className="flex flex-col gap-6">
              <Skeleton height={140} borderRadius={24} />
              <Skeleton height={140} borderRadius={24} />
              <Skeleton height={140} borderRadius={24} />
            </div>
          ) : campanas.length === 0 ? (
            <div className="text-center p-20 border-2 border-dashed rounded-3xl" style={{
              borderColor: "var(--border-subtle)",
              background: "var(--white)"
            }}>
              <Tag size={48} style={{ color: "var(--rose-gold)", opacity: 0.2, marginBottom: 20 }} />
              <p style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "1.5rem", color: "var(--charcoal)", margin: "0 0 8px",
              }}>No hay campañas creadas</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--slate-light)" }}>
                Crea tu primera campaña de visualización para la tienda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {campanas.map((c) => {
                  const live = isLive(c);
                  const pasada = new Date(c.fecha_fin) < now;
                  return (
                      <motion.div
                        key={c.id}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border relative overflow-hidden"
                        style={{
                          background: "var(--white)",
                          borderRadius: 24,
                          borderColor: live ? "rgba(183,110,121,0.3)" : "var(--border-subtle)",
                          boxShadow: live ? "0 8px 32px rgba(183,110,121,0.08)" : "var(--shadow-sm)"
                        }}
                      >
                      {/* Live glow */}
                      {live && (
                        <div style={{
                          position: "absolute", top: 0, left: 0, width: "100%", height: 3,
                          background: "linear-gradient(90deg, #b76e79, #d4a5a5, #b76e79)",
                        }} />
                      )}

                      {/* Left: Info */}
                      <div style={{ display: "flex", gap: 20, alignItems: "center", minWidth: 0 }}>
                        {/* Status pill */}
                        <div style={{
                          flexShrink: 0,
                          padding: "6px 14px",
                          borderRadius: 100,
                          background: live
                            ? "rgba(183,110,121,0.1)"
                            : pasada
                              ? "rgba(112,128,144,0.08)"
                              : "rgba(140,151,104,0.1)",
                          border: live
                            ? "1px solid rgba(183,110,121,0.25)"
                            : pasada
                              ? "1px solid rgba(112,128,144,0.15)"
                              : "1px solid rgba(140,151,104,0.2)",
                          display: "flex", alignItems: "center", gap: 6,
                        }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: live ? "#b76e79" : pasada ? "#708090" : "#8c9768",
                            animation: live ? "ringPulse 2s ease-out infinite" : "none",
                          }} />
                          <span style={{
                            fontFamily: "var(--font-poppins), sans-serif",
                            fontSize: "0.6rem", fontWeight: 700,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            color: live ? "#b76e79" : pasada ? "#708090" : "#8c9768",
                          }}>
                            {live ? "En vivo" : pasada ? "Finalizada" : "Pendiente"}
                          </span>
                        </div>

                        {/* Text info */}
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                            fontSize: "clamp(1rem, 2vw, 1.25rem)",
                            color: "#4a5568", margin: "0 0 4px",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {c.titulo}
                          </p>
                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <span style={{
                              fontFamily: "var(--font-poppins), sans-serif",
                              fontSize: "0.72rem", color: "#708090",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <Calendar size={11} />
                              {new Date(c.fecha_inicio).toLocaleDateString("es-MX", { day:"numeric", month:"short" })}
                              {" → "}
                              {new Date(c.fecha_fin).toLocaleDateString("es-MX", { day:"numeric", month:"short" })}
                            </span>
                            <span style={{
                              fontFamily: "var(--font-poppins), sans-serif",
                              fontSize: "0.72rem", color: "#8c9768",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <Tag size={11} />
                              {c.tipo_promocion}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                        {/* Toggle activo */}
                        <button
                          onClick={() => toggleActivo(c)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                          title={c.activo ? "Desactivar" : "Activar"}
                        >
                          {c.activo
                            ? <ToggleRight size={28} color="#b76e79" />
                            : <ToggleLeft size={28} color="#708090" />
                          }
                        </button>

                        {/* Editar */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setSelected(c); setShowModal(true); }}
                          style={{
                            background: "rgba(112,128,144,0.08)", border: "1.5px solid rgba(112,128,144,0.15)",
                            borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6,
                            fontFamily: "var(--font-poppins), sans-serif",
                            fontSize: "0.72rem", fontWeight: 600, color: "#708090",
                          }}
                        >
                          <Edit3 size={14} /> Editar
                        </motion.button>

                        {/* Eliminar */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => eliminar(c.id)}
                          style={{
                            background: "rgba(183,110,121,0.06)", border: "1.5px solid rgba(183,110,121,0.15)",
                            borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                            display: "flex", alignItems: "center",
                            color: "#b76e79",
                          }}
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Modal de edición */}
      <AnimatePresence>
        {showModal && (
          <EditCampaignModal
            campana={selected}
            onClose={() => setShowModal(false)}
            onSaved={() => { setShowModal(false); cargarCampanas(); }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.9s linear infinite; }
      `}</style>
    </div>
  );
}
