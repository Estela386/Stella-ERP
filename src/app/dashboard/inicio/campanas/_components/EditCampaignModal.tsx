"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Calendar, Link as LinkIcon, ImageIcon, Tag, Sparkles, Clock, ArrowRight, Eye, AlertCircle } from "lucide-react";
import { createClient } from "@utils/supabase/client";

interface Campana {
  id?: number;
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

interface Props {
  campana: Campana | null;
  onClose: () => void;
  onSaved: () => void;
}

const defaultForm: Campana = {
  titulo: "Especial Día de las Madres 💖",
  subtitulo: "Encuentra el regalo perfecto para mamá",
  tipo_promocion: "temporada",
  fecha_inicio: new Date().toISOString().slice(0, 16),
  fecha_fin: "2026-05-10T23:59",
  activo: true,
  cta_texto: "Ver regalos",
  cta_href: "/productos",
  url_imagen: "",
};

// ── Components ──

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 8 }}>
      <div style={{ color: "#b76e79", display: "flex", opacity: 0.8 }}>{icon}</div>
      <h3 style={{
        fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.15em", color: "#708090", margin: 0
      }}>
        {title}
      </h3>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "var(--font-poppins)", fontSize: "0.65rem", fontWeight: 600,
        color: "#9E9A95", marginLeft: 4
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(183,110,121,0.15)",
  background: "rgba(246,244,239,0.5)",
  fontFamily: "var(--font-poppins)",
  fontSize: "0.85rem",
  color: "#4a5568",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

export default function EditCampaignModal({ campana, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Campana>(campana ?? defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof Campana, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const guardar = async () => {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const payload = {
        ...form,
        fecha_inicio: new Date(form.fecha_inicio).toISOString(),
        fecha_fin: new Date(form.fecha_fin).toISOString(),
        url_imagen: form.url_imagen || null,
      };

      if (campana?.id) {
        const { error: e } = await supabase
          .from("campana_banner")
          .update(payload)
          .eq("id", campana.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase
          .from("campana_banner")
          .insert([payload]);
        if (e) throw e;
      }
      onSaved();
    } catch (e: any) {
      setError(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const ROSE = "#b76e79";
  const CHARCOAL = "#4a5568";
  const SLATE = "#708090";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, 
          background: "linear-gradient(135deg, rgba(30,20,20,0.4) 0%, rgba(50,40,40,0.6) 100%)",
          backdropFilter: "blur(12px)", zIndex: 200,
        }}
      />

      <div 
        style={{
          position: "fixed", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, pointerEvents: "none", padding: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          style={{
            zIndex: 301,
            width: "min(820px, 95vw)",
            maxHeight: "92vh",
            display: "flex", flexDirection: "column",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 32,
            boxShadow: "0 40px 120px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(183,110,121,0.1) inset",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "28px 40px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid rgba(183,110,121,0.08)",
            background: "rgba(255, 255, 255, 0.4)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 16, 
                background: "linear-gradient(135deg, #b76e79 0%, #d48b96 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", 
                color: "white", boxShadow: "0 8px 16px -4px rgba(183,110,121,0.3)"
              }}>
                <Sparkles size={22} fill="white" />
              </div>
              <div>
                <h2 style={{
                  fontFamily: "var(--font-marcellus), serif",
                  fontSize: "1.6rem", fontWeight: 400, color: CHARCOAL, margin: 0
                }}>
                  {campana ? "Editar Campaña" : "Nueva Campaña"}
                </h2>
                <p style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: SLATE, margin: 0, opacity: 0.8
                }}>
                  Diseña el próximo impacto visual de tu tienda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(183,110,121,0.05)", border: "none",
                borderRadius: "50%", width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: ROSE, transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ROSE;
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(183,110,121,0.05)";
                e.currentTarget.style.color = ROSE;
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 40px 40px" }} className="custom-scrollbar">
            
            {/* ────── VISTA PREVIA PREMIUM ────── */}
            <div style={{ marginTop: 28, marginBottom: 36 }}>
              <SectionTitle icon={<Eye size={14} />} title="Previsualización del Banner" />
              
              <div style={{ 
                position: "relative",
                padding: "24px",
                background: "linear-gradient(135deg, #f6f4ef 0%, #faf9f6 100%)",
                borderRadius: 24,
                border: "1px solid rgba(183,110,121,0.12)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                overflow: "hidden"
              }}>
                {/* Simulated CampaignTopBar */}
                <div style={{
                  background: "white",
                  borderRadius: 14,
                  border: "1px solid rgba(183,110,121,0.08)",
                  boxShadow: "0 15px 35px -10px rgba(183,110,121,0.12)",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  {/* Mesh BG in preview */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(183,110,121,0.02)", pointerEvents: "none" }} />
                  
                  <div style={{ 
                    padding: "12px 20px", 
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "relative", zIndex: 1
                  }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ 
                        background: ROSE, color: "white", padding: "3px 10px", 
                        borderRadius: 6, fontSize: "0.6rem", fontWeight: 800, 
                        textTransform: "uppercase", letterSpacing: "0.05em"
                      }}>
                        {form.tipo_promocion || "Promo"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.85rem", color: CHARCOAL, fontWeight: 600 }}>
                          {form.titulo || "Título de la campaña"}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: ROSE, fontWeight: 600 }}>
                          {form.subtitulo || "Describe tu oferta aquí"}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ 
                        fontSize: "0.7rem", color: SLATE, fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 6,
                        opacity: 0.7
                      }}>
                        <Clock size={12} /> <span>01d 12h 05m</span>
                      </div>
                      <div style={{ 
                        fontSize: "0.75rem", color: ROSE, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4,
                        borderBottom: `2px solid rgba(183,110,121,0.2)`
                      }}>
                        {form.cta_texto || "Ver más"} <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ 
                  textAlign: "center", fontSize: "0.65rem", color: SLATE, 
                  marginTop: 12, opacity: 0.6, letterSpacing: "0.02em" 
                }}>
                  EL BANNER SE ADAPTARÁ SEGÚN EL DISPOSITIVO DEL CLIENTE
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              
              {/* ────── SECCIÓN: CONTENIDO ────── */}
              <section>
                <SectionTitle icon={<Tag size={14} />} title="Contenido de Impacto" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <Field label="Titular Principal">
                      <input
                        value={form.titulo}
                        onChange={e => set("titulo", e.target.value)}
                        style={inputStylePremium}
                        placeholder="Ej: Joyería Exclusiva ✨"
                      />
                    </Field>
                    <Field label="Categoría / Tipo">
                      <div style={{ display: "flex", gap: 8, padding: "4px" }}>
                        {["temporada", "flash", "especial", "coleccion"].map(type => (
                          <button
                            key={type}
                            onClick={() => set("tipo_promocion", type)}
                            style={{
                              flex: 1, padding: "10px", borderRadius: 12, fontSize: "0.7rem",
                              fontFamily: "var(--font-poppins)", fontWeight: 600,
                              backgroundColor: form.tipo_promocion === type ? ROSE : "rgba(255,255,255,0.6)",
                              color: form.tipo_promocion === type ? "white" : SLATE,
                              border: `1px solid ${form.tipo_promocion === type ? ROSE : "rgba(183,110,121,0.1)"}`,
                              cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: form.tipo_promocion === type ? "0 4px 12px rgba(183,110,121,0.2)" : "none",
                              textTransform: "capitalize"
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <Field label="Call to Action (Subtítulo)">
                    <input
                      value={form.subtitulo}
                      onChange={e => set("subtitulo", e.target.value)}
                      style={inputStylePremium}
                      placeholder="Ej: Piezas únicas con hasta 20% de descuento"
                    />
                  </Field>
                </div>
              </section>

              {/* ────── SECCIÓN: TIEMPOS ────── */}
              <section>
                <SectionTitle icon={<Calendar size={14} />} title="Programación del Evento" />
                <div style={{ 
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
                  padding: "24px", background: "rgba(183,110,121,0.02)", borderRadius: 20,
                  border: "1px solid rgba(183,110,121,0.06)"
                }}>
                  <Field label="Fecha de Lanzamiento">
                    <input
                      type="datetime-local"
                      value={form.fecha_inicio}
                      onChange={e => set("fecha_inicio", e.target.value)}
                      style={{ ...inputStylePremium, background: "white" }}
                    />
                  </Field>
                  <Field label="Fin de Promoción">
                    <input
                      type="datetime-local"
                      value={form.fecha_fin}
                      onChange={e => set("fecha_fin", e.target.value)}
                      style={{ ...inputStylePremium, background: "white" }}
                    />
                  </Field>
                </div>
              </section>

              {/* ────── SECCIÓN: ACCIÓN ────── */}
              <section>
                <SectionTitle icon={<LinkIcon size={14} />} title="Destino y Conversión" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field label="Texto del Botón (CTA)">
                    <input
                      value={form.cta_texto}
                      onChange={e => set("cta_texto", e.target.value)}
                      style={inputStylePremium}
                      placeholder="Ej: Explorar Colección"
                    />
                  </Field>
                  <Field label="Ruta de Destino">
                    <input
                      value={form.cta_href}
                      onChange={e => set("cta_href", e.target.value)}
                      style={inputStylePremium}
                      placeholder="Ej: /productos/ofertas"
                    />
                  </Field>
                </div>
              </section>

              {/* ────── SECCIÓN: ESTADO ────── */}
              <section>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 28px", borderRadius: 24,
                  background: form.activo ? "linear-gradient(to right, rgba(183,110,121,0.06), transparent)" : "#f9f9f9",
                  border: `1px solid ${form.activo ? "rgba(183,110,121,0.15)" : "#eee"}`,
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: "50%", 
                      background: form.activo ? ROSE : SLATE, 
                      display: "flex", alignItems: "center", justifyContent: "center", 
                      color: "white", boxShadow: form.activo ? "0 4px 12px rgba(183,110,121,0.2)" : "none"
                    }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1rem", color: CHARCOAL, fontWeight: 600 }}>Campaña Activa</h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: SLATE, opacity: 0.8 }}>
                        {form.activo ? "Visible para todos los usuarios" : "Oculta temporalmente"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => set("activo", !form.activo)}
                    style={{
                      width: 60, height: 32, borderRadius: 100,
                      backgroundColor: form.activo ? ROSE : "#dfdfdf",
                      display: "flex", alignItems: "center", padding: "0 6px",
                      justifyContent: form.activo ? "flex-end" : "flex-start",
                      border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    }}
                  >
                    <motion.div 
                      layout
                      style={{ 
                        width: 20, height: 20, borderRadius: "50%", background: "white", 
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
                      }} 
                    />
                  </button>
                </div>
              </section>

            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "24px 40px",
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(183,110,121,0.08)",
            display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16
          }}>
            {error && (
              <div style={{ 
                marginRight: "auto", display: "flex", alignItems: "center", gap: 8,
                fontSize: "0.8rem", color: ROSE, fontWeight: 600,
                background: "rgba(183,110,121,0.05)", padding: "8px 16px", borderRadius: 12
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
            
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "12px 28px", borderRadius: 14, border: "none",
                background: "transparent", color: SLATE, fontSize: "0.9rem",
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = CHARCOAL}
            >
              Cerrar
            </button>
            <button
              onClick={guardar}
              disabled={saving}
              style={{
                padding: "14px 40px", borderRadius: 16, border: "none",
                background: ROSE, color: "white", fontSize: "0.9rem",
                fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 10px 25px -5px rgba(183,110,121,0.4)",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={e => {
                if(!saving) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(183,110,121,0.5)";
                }
              }}
              onMouseLeave={e => {
                if(!saving) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(183,110,121,0.4)";
                }
              }}
            >
              {saving ? <div className="animate-spin-custom" /> : <Save size={18} fill="white" />}
              {saving ? "Procesando..." : campana ? "Actualizar Campaña" : "Crear Campaña"}
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(183,110,121,0.1); borderRadius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(183,110,121,0.2); }
        
        @keyframes spinCustom { to { transform: rotate(360deg); } }
        .animate-spin-custom { 
          width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); 
          border-top-color: white; borderRadius: 50%; 
          animation: spinCustom 0.8s linear infinite; 
        }
      `}</style>
    </>
  );
}

const inputStylePremium: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: 14,
  border: "1px solid rgba(183,110,121,0.15)",
  background: "rgba(255,255,255,0.5)",
  fontFamily: "var(--font-poppins)",
  fontSize: "0.9rem",
  color: "#4a5568",
  outline: "none",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02) inset",
};
