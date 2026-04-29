"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Calendar, Trophy, Users, Tag, Gift } from "lucide-react";

interface Sorteo {
  id: number;
  nombre: string;
  premio: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  num_participantes: number;
  id_banner?: number;
}

interface Props {
  onManage: (id: number) => void;
  onEdit: (sorteo: any) => void;
  refreshTrigger: number;
}

export default function SorteoList({ onManage, onEdit, refreshTrigger }: Props) {
  const [sorteos, setSorteos] = useState<Sorteo[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    cargarSorteos();
  }, [refreshTrigger]);

  const cargarSorteos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sorteo");
      const data = await res.json();
      setSorteos(data.sorteos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (s: Sorteo) => {
    try {
      const res = await fetch("/api/sorteo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, id_banner: s.id_banner, activo: !s.activo })
      });
      if (res.ok) {
        setSorteos(prev => prev.map(item => item.id === s.id ? { ...item, activo: !item.activo } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLive = (s: Sorteo) => {
    const inicio = new Date(s.fecha_inicio);
    const fin = new Date(s.fecha_fin);
    return s.activo && now >= inicio && now <= fin;
  };

  if (loading) return (
    <div className="flex flex-col gap-6">
       {[1,2,3].map(i => (
         <div key={i} className="h-[140px] bg-white animate-pulse rounded-[24px] border border-gray-100" />
       ))}
    </div>
  );

  if (sorteos.length === 0) return (
    <div className="text-center p-20 border-2 border-dashed rounded-3xl bg-white" style={{ borderColor: "var(--border-subtle)" }}>
       <Trophy size={48} style={{ color: "var(--rose-gold)", opacity: 0.2, marginBottom: 20 }} className="mx-auto" />
       <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.5rem", color: "var(--charcoal)", margin: "0 0 8px" }}>
         No hay sorteos creados
       </p>
       <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--slate-light)" }}>
         Configura tu primer sorteo de captación de leads.
       </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
       <AnimatePresence>
          {sorteos.map((s) => {
            const live = isLive(s);
            const pasada = new Date(s.fecha_fin) < now;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border relative overflow-hidden transition-all"
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
                      {live ? "En vivo" : pasada ? "Finalizado" : "Pendiente"}
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
                      {s.nombre}
                    </p>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ 
                        fontFamily: "var(--font-poppins), sans-serif", 
                        fontSize: "0.72rem", color: "#708090",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Calendar size={11} />
                        {new Date(s.fecha_inicio).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                        {" → "}
                        {new Date(s.fecha_fin).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      </span>
                      <span style={{ 
                        fontFamily: "var(--font-poppins), sans-serif", 
                        fontSize: "0.72rem", color: "#8c9768",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Users size={11} />
                        {s.num_participantes} participantes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                  {/* Toggle activo */}
                  <button 
                    onClick={() => toggleActivo(s)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                    title={s.activo ? "Desactivar" : "Activar"}
                  >
                    {s.activo 
                      ? <ToggleRight size={28} color="#b76e79" /> 
                      : <ToggleLeft size={28} color="#708090" />
                    }
                  </button>

                  {/* Gestionar Sorteo */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onManage(s.id)}
                    style={{
                      background: "var(--rose-gold)", color: "white",
                      borderRadius: 12, padding: "10px 20px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: "0.75rem", fontWeight: 700, border: "none",
                      boxShadow: "0 4px 12px rgba(183,110,121,0.2)"
                    }}
                  >
                    <Trophy size={14} /> Ganador
                  </motion.button>

                  {/* Editar */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(s)}
                    style={{
                      background: "rgba(112,128,144,0.08)", border: "1.5px solid rgba(112,128,144,0.15)",
                      borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                      display: "flex", alignItems: "center",
                      color: "#708090",
                    }}
                  >
                    <Edit3 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
       </AnimatePresence>

       <style>{`
          @keyframes ringPulse {
            0% { box-shadow: 0 0 0 0px rgba(183,110,121, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(183,110,121, 0); }
            100% { box-shadow: 0 0 0 0px rgba(183,110,121, 0); }
          }
       `}</style>
    </div>
  );
}
