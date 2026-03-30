"use client";

import { useState } from "react";
import { IUsuarioMayorista } from "@lib/models";
import { X, UserPlus } from "lucide-react";

interface PromoverMayoristaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuariosDisponibles: IUsuarioMayorista[];
}

export default function PromoverMayoristaModal({
  open,
  onClose,
  onSuccess,
  usuariosDisponibles,
}: PromoverMayoristaModalProps) {
  const [usuarioSel, setUsuarioSel] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSel) {
      setError("Selecciona un usuario");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mayoristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: parseInt(usuarioSel) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onSuccess();
      onClose();
      setUsuarioSel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg,#708090,#5a6a7a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserPlus size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1C1C1C", margin: 0 }}>
                Promover a Mayorista
              </h2>
              <p style={{ fontSize: "0.75rem", color: "#8C9796", margin: "3px 0 0" }}>
                Cambiará el rol del usuario a Mayorista (rol 3)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: "1px solid rgba(112,128,144,0.2)",
              background: "#F6F3EF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#708090",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              color: "#e53e3e",
              fontSize: "0.82rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#708090",
              }}
            >
              Seleccionar Usuario
            </label>
            <select
              value={usuarioSel}
              onChange={e => setUsuarioSel(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid rgba(112,128,144,0.25)",
                background: "#FAFAF8",
                fontSize: "0.85rem",
                color: "#1C1C1C",
                outline: "none",
                appearance: "auto",
              }}
            >
              <option value="">Seleccionar usuario...</option>
              {usuariosDisponibles.length === 0 ? (
                <option disabled>Sin usuarios disponibles</option>
              ) : (
                usuariosDisponibles.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre ?? u.correo}
                  </option>
                ))
              )}
            </select>
          </div>

          <div
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: "0.78rem",
              color: "#92400e",
            }}
          >
            ⚠️ Esta acción cambiará el rol del usuario a <strong>Mayorista</strong>. El usuario
            podrá ver sus consignaciones asignadas.
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid rgba(112,128,144,0.25)",
                background: "#fff",
                color: "#708090",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !usuarioSel}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background:
                  loading || !usuarioSel
                    ? "#ccc"
                    : "linear-gradient(135deg,#708090,#5a6a7a)",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: loading || !usuarioSel ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(112,128,144,0.3)",
              }}
            >
              {loading ? "Procesando..." : "Promover"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
