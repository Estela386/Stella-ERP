"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(74, 85, 104, 0.4)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      
      <div 
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          borderRadius: "16px",
          boxShadow: "0 20px 56px rgba(140, 151, 104, 0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(112, 128, 144, 0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff"
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#4a5568",
            margin: 0
          }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: "rgba(112, 128, 144, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#708090",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(183, 110, 121, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(112, 128, 144, 0.08)"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
