"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";

const THEME = {
  roseGold: "#B76E79",
  deepCharcoal: "#4A5568",
  slate: "#708090",
  lightBeige: "#F6F3EF",
  accentGreen: "#8C9768",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.85)",
};

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-white/90 backdrop-blur-[20px] rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300"
      >
        {/* Accent Top Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1" 
          style={{ background: variant === "danger" ? "#E74C3C" : THEME.roseGold }}
        />

        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-2xl ${variant === "danger" ? 'bg-red-50 text-red-500' : 'bg-rose-50 text-[#B76E79]'}`}>
              <FiAlertTriangle size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#4A5568] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
                {title}
              </h3>
              <p className="text-sm text-[#708090] font-sans leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-[#708090] text-sm font-medium hover:bg-slate-50 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all active:scale-95 ${
                variant === "danger" 
                  ? 'bg-[#E74C3C] hover:bg-[#C0392B] shadow-red-100' 
                  : 'bg-[#B76E79] hover:bg-[#A45F69] shadow-rose-100'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
