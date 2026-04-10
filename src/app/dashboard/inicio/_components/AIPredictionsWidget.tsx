"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, TrendingDown, ArrowRight } from "lucide-react";
import { PredictionInsight } from "@/backend/ai/predictions/PredictionEngine";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/app/_components/ui/Skeleton";

export default function AIPredictionsWidget() {
  const [data, setData] = useState<PredictionInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/predictions")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.error || "No se pudieron obtener las predicciones.");
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        background: "var(--white)", 
        borderRadius: "var(--radius-xl)", 
        padding: "24px 28px", 
        border: "1px solid var(--border-subtle)",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Skeleton width={32} height={32} borderRadius={10} />
          <div>
            <Skeleton width={150} height={14} style={{ marginBottom: 6 }} />
            <Skeleton width={200} height={10} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <Skeleton height={100} borderRadius={16} />
          <Skeleton height={100} borderRadius={16} />
          <Skeleton height={100} borderRadius={16} />
        </div>
      </div>
    );
  }

  if (error || !data) return null; // Fallback silencioso si falla la predicción

  const trending = data.trending_products[0];
  const lowRotation = data.low_rotation_products[0];
  const demand = data.demand_predictions[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        background: "linear-gradient(145deg, var(--white) 0%, var(--beige-light) 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "24px 28px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decors */}
      <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.04, color: "var(--rose-gold)", pointerEvents: "none" }}>
        <Sparkles size={140} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: "rgba(183,110,121,0.1)", padding: 8, borderRadius: 10, color: "var(--rose-gold)", display: "flex" }}>
          <Sparkles size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1.1rem", color: "var(--charcoal)" }}>
            Asistente de Negocio
          </h3>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--slate-light)" }}>
            Insights predictivos generados en tiempo real
          </p>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } }
        }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, zIndex: 1 }}
      >
        
        {/* Insight 1: Alta Demanda */}
        {trending && (
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            style={{ background: "var(--white)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(16,185,129,0.03)" }}
          >
             <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>
               <TrendingUp size={14} /> Fuerte Tracción
             </span>
             <p style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1rem", color: "var(--charcoal)", lineHeight: 1.2 }}>
               {trending.nombre}
             </p>
             <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--slate-light)" }}>
               Posible agotamiento cercano.
             </p>
          </motion.div>
        )}

        {/* Insight 2: Baja Demanda */}
        {lowRotation && (
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            style={{ background: "var(--white)", border: "1px solid rgba(245,158,11,0.1)", borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(245,158,11,0.03)" }}
          >
             <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>
               <AlertCircle size={14} /> Atascamiento
             </span>
             <p style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1rem", color: "var(--charcoal)", lineHeight: 1.2 }}>
               {lowRotation.nombre}
             </p>
             <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--slate-light)" }}>
               {lowRotation.dias_sin_venta} días sin rotación.
             </p>
          </motion.div>
        )}

        {/* Insight 3: Proyeccion de abastecimiento */}
        {demand && demand.predicted_demand_next_30_days > 0 && (
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            style={{ background: "var(--white)", border: "1px solid rgba(183,110,121,0.1)", borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(183,110,121,0.03)" }}
          >
             <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--rose-gold)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>
               <TrendingDown size={14} /> Sugerencia de Inventario
             </span>
             <p style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1rem", color: "var(--charcoal)", lineHeight: 1.2 }}>
               {demand.nombre}
             </p>
             <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--slate-light)" }}>
               Prever ~{demand.predicted_demand_next_30_days} uds este mes.
             </p>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}
