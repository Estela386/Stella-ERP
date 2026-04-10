"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Calendar, Link as LinkIcon, Image as ImageIcon, Tag } from "lucide-react";
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

// Reutilizable: input field
function Field({
  label, icon, children,
}: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
        fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
        fontSize: "0.62rem", fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#708090",
      }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid rgba(112,128,144,0.2)",
  background: "#f6f4ef",
  fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
  fontSize: "0.88rem",
  color: "#4a5568",
  outline: "none",
  transition: "border-color 0.2s",
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
      if (campana?.id) {
        // Actualizar
        const { error: e } = await supabase
          .from("campana_banner")
          .update({
            titulo: form.titulo,
            subtitulo: form.subtitulo,
            tipo_promocion: form.tipo_promocion,
            fecha_inicio: new Date(form.fecha_inicio).toISOString(),
            fecha_fin: new Date(form.fecha_fin).toISOString(),
            activo: form.activo,
            cta_texto: form.cta_texto,
            cta_href: form.cta_href,
            url_imagen: form.url_imagen || null,
          })
          .eq("id", campana.id);
        if (e) throw e;
      } else {
        // Crear
        const { error: e } = await supabase
          .from("campana_banner")
          .insert([{
            titulo: form.titulo,
            subtitulo: form.subtitulo,
            tipo_promocion: form.tipo_promocion,
            fecha_inicio: new Date(form.fecha_inicio).toISOString(),
            fecha_fin: new Date(form.fecha_fin).toISOString(),
            activo: form.activo,
            cta_texto: form.cta_texto,
            cta_href: form.cta_href,
            url_imagen: form.url_imagen || null,
          }]);
        if (e) throw e;
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(74,85,104,0.45)",
          backdropFilter: "blur(6px)", zIndex: 200,
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 300,
          width: "min(660px, 95vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(74,85,104,0.25), 0 8px 24px rgba(183,110,121,0.12)",
          border: "1px solid rgba(183,110,121,0.12)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(112,128,144,0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "white", zIndex: 1,
          borderRadius: "24px 24px 0 0",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-marcellus), 'Marcellus', serif",
              fontSize: "1.5rem", fontWeight: 400, color: "#4a5568",
              margin: "0 0 2px",
            }}>
              {campana ? "Editar Campaña" : "Nueva Campaña"}
            </h2>
            <p style={{
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: "0.75rem", color: "#708090", margin: 0,
            }}>
              {campana ? "Modifica los detalles de la campaña" : "Crea una nueva campaña especial"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(112,128,144,0.08)", border: "none",
              borderRadius: 10, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#708090",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Rose top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #b76e79, #d4a5a5)", marginBottom: 0 }} />

        {/* Body */}
        <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{
              background: "rgba(183,110,121,0.08)", border: "1px solid rgba(183,110,121,0.2)",
              borderRadius: 10, padding: "10px 16px",
              fontFamily: "var(--font-poppins), sans-serif", fontSize: "0.82rem", color: "#b76e79",
            }}>
              {error}
            </div>
          )}

          <Field label="Título de la campaña" icon={<Tag size={11} />}>
            <input
              value={form.titulo}
              onChange={e => set("titulo", e.target.value)}
              placeholder="Especial Día de las Madres 💖"
              style={inputStyle}
            />
          </Field>

          <Field label="Subtítulo" icon={<Tag size={11} />}>
            <input
              value={form.subtitulo}
              onChange={e => set("subtitulo", e.target.value)}
              placeholder="Encuentra el regalo perfecto para mamá"
              style={inputStyle}
            />
          </Field>

          <Field label="Tipo de promoción" icon={<Tag size={11} />}>
            <select
              value={form.tipo_promocion}
              onChange={e => set("tipo_promocion", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="temporada">Temporada</option>
              <option value="flash">Flash</option>
              <option value="especial">Especial</option>
              <option value="coleccion">Colección</option>
            </select>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Fecha inicio" icon={<Calendar size={11} />}>
              <input
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={e => set("fecha_inicio", e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Fecha fin" icon={<Calendar size={11} />}>
              <input
                type="datetime-local"
                value={form.fecha_fin}
                onChange={e => set("fecha_fin", e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Texto del botón CTA" icon={<LinkIcon size={11} />}>
              <input
                value={form.cta_texto}
                onChange={e => set("cta_texto", e.target.value)}
                placeholder="Ver regalos"
                style={inputStyle}
              />
            </Field>
            <Field label="URL del botón CTA" icon={<LinkIcon size={11} />}>
              <input
                value={form.cta_href}
                onChange={e => set("cta_href", e.target.value)}
                placeholder="/productos"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="URL de imagen (opcional)" icon={<ImageIcon size={11} />}>
            <input
              value={form.url_imagen ?? ""}
              onChange={e => set("url_imagen", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>

          {/* Toggle Activo */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            background: form.activo ? "rgba(183,110,121,0.05)" : "rgba(112,128,144,0.04)",
            border: `1.5px solid ${form.activo ? "rgba(183,110,121,0.2)" : "rgba(112,128,144,0.15)"}`,
            borderRadius: 14,
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: "0.85rem", fontWeight: 600, color: "#4a5568", margin: "0 0 2px",
              }}>
                Campaña activa
              </p>
              <p style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: "0.72rem", color: "#708090", margin: 0,
              }}>
                {form.activo ? "La campaña se mostrará si está dentro del rango de fechas" : "Campaña desactivada manualmente"}
              </p>
            </div>
            <button
              onClick={() => set("activo", !form.activo)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {form.activo
                ? <div style={{
                    width: 48, height: 26, borderRadius: 100, background: "#b76e79",
                    display: "flex", alignItems: "center", padding: "0 3px",
                    justifyContent: "flex-end", transition: "all 0.2s",
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white" }} />
                  </div>
                : <div style={{
                    width: 48, height: 26, borderRadius: 100, background: "#d1d5db",
                    display: "flex", alignItems: "center", padding: "0 3px",
                    justifyContent: "flex-start", transition: "all 0.2s",
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white" }} />
                  </div>
              }
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 4 }}>
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "1.5px solid rgba(112,128,144,0.25)",
                borderRadius: 12, padding: "10px 20px",
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: "0.82rem", fontWeight: 600, color: "#708090",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ y: -1, boxShadow: "0 8px 22px rgba(183,110,121,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={guardar}
              disabled={saving}
              style={{
                background: "#b76e79", color: "white", border: "none",
                borderRadius: 12, padding: "10px 24px",
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 8,
                opacity: saving ? 0.7 : 1,
                boxShadow: "0 4px 14px rgba(183,110,121,0.25)",
                transition: "all 0.25s ease",
              }}
            >
              <Save size={15} />
              {saving ? "Guardando..." : "Guardar Campaña"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
