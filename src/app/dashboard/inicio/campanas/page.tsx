"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Calendar, Tag, Clock } from "lucide-react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import { useAuth } from "@lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@utils/supabase/client";
import EditCampaignModal from "./_components/EditCampaignModal";

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
    if (!loadingUser && usuario?.esAdmin()) cargarCampanas();
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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f6f4ef" }}>
      <SidebarMenu />

      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(16px,3vw,40px)" }}>

          {/* ── Header ── */}
          <header style={{ marginBottom: 40, borderBottom: "1px solid rgba(112,128,144,0.12)", paddingBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ height: 1, width: 32, background: "#b76e79", display: "block" }} />
                  <span style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em",
                    textTransform: "uppercase", color: "#8c9768",
                  }}>
                    Marketing · ERP
                  </span>
                </div>
                <h1 style={{
                  fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400,
                  color: "#4a5568", margin: 0, lineHeight: 1.1,
                }}>
                  Campañas <span style={{ color: "#b76e79", fontStyle: "italic" }}>Especiales</span>
                </h1>
              </div>

              <motion.button
                whileHover={{ y: -2, boxShadow: "0 12px 28px rgba(183,110,121,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSelected(null); setShowModal(true); }}
                style={{
                  background: "#b76e79", color: "#f6f4ef", border: "none",
                  borderRadius: 14, padding: "12px 24px",
                  fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                  fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 14px rgba(183,110,121,0.25)",
                  transition: "all 0.25s ease",
                }}
              >
                <Plus size={16} />
                Nueva Campaña
              </motion.button>
            </div>
          </header>

          {/* ── Lista de campañas ── */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{ width: 40, height: 40, border: "3px solid rgba(183,110,121,0.2)", borderTopColor: "#b76e79", borderRadius: "50%" }}
                className="animate-spin" />
            </div>
          ) : campanas.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "white", borderRadius: 24,
              border: "2px dashed rgba(112,128,144,0.15)",
            }}>
              <Tag size={40} style={{ color: "rgba(183,110,121,0.3)", marginBottom: 16 }} />
              <p style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "1.3rem", color: "#4a5568", margin: "0 0 8px",
              }}>No hay campañas creadas</p>
              <p style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "0.85rem", color: "#708090" }}>
                Crea tu primera campaña de Día de las Madres
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <AnimatePresence>
                {campanas.map((c, i) => {
                  const live = isLive(c);
                  const pasada = new Date(c.fecha_fin) < now;
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        background: "white",
                        borderRadius: 20,
                        border: live
                          ? "1.5px solid rgba(183,110,121,0.3)"
                          : "1.5px solid rgba(112,128,144,0.12)",
                        padding: "clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 32px)",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 20,
                        alignItems: "center",
                        boxShadow: live
                          ? "0 8px 28px rgba(183,110,121,0.1)"
                          : "0 2px 12px rgba(140,151,104,0.06)",
                        position: "relative",
                        overflow: "hidden",
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
