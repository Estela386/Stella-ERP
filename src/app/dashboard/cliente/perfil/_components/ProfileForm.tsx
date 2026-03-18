"use client";

import { User, Mail, Phone, Edit2, Shield } from "lucide-react";
import { UserProfile } from "../type";

interface ProfileFormProps {
  profile: UserProfile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 10px 30px rgba(112,128,144,0.08)",
      border: "1px solid rgba(112,128,144,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#4a5568",
          margin: 0
        }}>Información Personal</h2>
        <button style={{
          padding: "8px 16px",
          background: "rgba(183,110,121,0.08)",
          border: "1px solid rgba(183,110,121,0.22)",
          borderRadius: 8,
          color: "#b76e79",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s ease"
        }} onMouseOver={(e) => {
          e.currentTarget.style.background = "#b76e79";
          e.currentTarget.style.color = "#ffffff";
        }} onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(183,110,121,0.08)";
          e.currentTarget.style.color = "#b76e79";
        }}>
          <Edit2 size={14} />
          Editar Perfil
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {/* Name Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#708090",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>Nombre Completo</label>
          <div style={{
            padding: "12px 16px",
            background: "#f6f4ef",
            borderRadius: 10,
            color: "#4a5568",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(112,128,144,0.08)"
          }}>
            <User size={18} color="#b76e79" />
            <span style={{ fontSize: "0.95rem" }}>{profile.nombre}</span>
          </div>
        </div>

        {/* Email Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#708090",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>Correo Electrónico</label>
          <div style={{
            padding: "12px 16px",
            background: "#f6f4ef",
            borderRadius: 10,
            color: "#4a5568",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(112,128,144,0.08)"
          }}>
            <Mail size={18} color="#b76e79" />
            <span style={{ fontSize: "0.95rem" }}>{profile.correo}</span>
          </div>
        </div>

        {/* Phone Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#708090",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>Teléfono de Contacto</label>
          <div style={{
            padding: "12px 16px",
            background: "#f6f4ef",
            borderRadius: 10,
            color: "#4a5568",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(112,128,144,0.08)"
          }}>
            <Phone size={18} color="#b76e79" />
            <span style={{ fontSize: "0.95rem" }}>{profile.telefono || "Sin asignar"}</span>
          </div>
        </div>

        {/* Account Type Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#708090",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>Tipo de Cuenta</label>
          <div style={{
            padding: "12px 16px",
            background: "rgba(140,151,104,0.05)",
            borderRadius: 10,
            color: "#4a5568",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(140,151,104,0.15)"
          }}>
            <Shield size={18} color="#8c9768" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{profile.rol}</span>
              <span style={{ fontSize: "0.7rem", color: "#8c9768" }}>Activo desde {profile.fechaRegistro}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
