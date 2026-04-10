"use client";

import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

interface Campana {
  id: number;
  titulo: string;
  subtitulo: string;
  tipo_promocion: string;
  cta_texto: string;
  cta_href: string;
  url_imagen: string | null;
}

export default function CampaignTopBar() {
  const [campana, setCampana] = useState<Campana | null>(null);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("campana_banner")
        .select("*")
        .eq("activo", true)
        .order("id", { ascending: false })
        .limit(1)
        .single();
      
      if (data) setCampana(data);
    };
    load();
  }, []);

  if (!campana || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          background: "linear-gradient(135deg, #ede8e1 0%, #e3dbce 100%)",
          color: "#4a5568",
          position: "relative",
          zIndex: 60,
          overflow: "hidden",
          borderBottom: "1px solid rgba(183,110,121,0.2)"
        }}
      >
        <div style={{
          maxWidth: 1440, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16
        }}>
          
          {/* Elemento SVG Decorativo Profesional */}
          <div style={{ display: "flex", alignItems: "center", color: "#b76e79" }}>
            {campana.url_imagen ? (
               <img src={campana.url_imagen} alt="Campaña" style={{ height: 24, objectFit: "contain" }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L14.7 8.3L22 11L14.7 13.7L12 21L9.3 13.7L2 11L9.3 8.3L12 1Z" fill="currentColor" opacity="0.8"/>
                <path d="M5.5 4.5L6.5 7L9 8L6.5 9L5.5 11.5L4.5 9L2 8L4.5 7L5.5 4.5Z" fill="currentColor" opacity="0.6"/>
              </svg>
            )}
          </div>

          {/* Texto de la Campaña */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-marcellus), serif", fontSize: "0.95rem", fontWeight: 600, color: "#2d3748" }}>
              {campana.titulo}
            </span>
            {campana.subtitulo && (
              <>
                <span style={{ fontSize: "1.2rem", fontWeight: 300, color: "rgba(112,128,144,0.4)" }}>|</span>
                <span style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#708090" }}>
                  {campana.subtitulo}
                </span>
              </>
            )}
          </div>

          {/* Botón CTA */}
          <button
            onClick={() => router.push(campana.cta_href)}
            style={{
              background: "#b76e79", color: "white", border: "none", borderRadius: 20,
              padding: "4px 14px", fontSize: "0.72rem", fontWeight: 700,
              fontFamily: "var(--font-poppins), sans-serif", letterSpacing: "0.05em",
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(183,110,121,0.25)"
            }}
          >
            {campana.cta_texto} <ArrowRight size={12} />
          </button>
          
        </div>

        {/* Cierre */}
        <button
          onClick={() => setVisible(false)}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#8c9768",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
