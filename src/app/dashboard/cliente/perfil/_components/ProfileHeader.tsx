"use client";

import { User, ShieldCheck } from "lucide-react";
import { UserProfile } from "../type";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div style={{
      position: "relative",
      padding: "40px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      background: "linear-gradient(180deg, rgba(183,110,121,0.05) 0%, rgba(246,244,239,0) 100%)",
      borderRadius: "24px 24px 0 0",
      marginBottom: 32
    }}>
      {/* Avatar Container */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid rgba(183,110,121,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 24px rgba(140,151,104,0.08)",
          overflow: "hidden"
        }}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: "3.5rem", 
              fontWeight: 600, 
              color: "#b76e79",
              fontStyle: "italic"
            }}>
              {profile.nombre.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.4rem",
          fontWeight: 500,
          color: "#4a5568",
          margin: "0 0 6px 0",
          fontStyle: "italic"
        }}>
          {profile.nombre}
        </h1>
        
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          background: "rgba(183,110,121,0.08)",
          borderRadius: 20,
          border: "1px solid rgba(183,110,121,0.22)"
        }}>
          <ShieldCheck size={14} color="#b76e79" />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#b76e79",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            {profile.rol}
          </span>
        </div>
      </div>
    </div>
  );
}
