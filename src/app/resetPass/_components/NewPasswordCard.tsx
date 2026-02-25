"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function NewPasswordCard() {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const match = pass === confirm && pass.length > 0;
  const strong = pass.length >= 8;

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-10
        space-y-8
        border border-[#D1BBAA]/70
        shadow-[0_35px_90px_rgba(0,0,0,0.18)]
      "
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold text-[#708090]">
          Crear nueva contraseña
        </h2>
        <p className="text-sm text-[#8C8976]">
          Debe tener al menos 8 caracteres
        </p>
      </div>

      {/* ===== PASSWORD ===== */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-[#708090]">
          Nueva contraseña
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-3 text-[#B76E79]" size={18} />

          <input
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            className="
              w-full
              rounded-2xl
              bg-[#F6F3EF]
              border border-[#D1BBAA]
              pl-11 pr-11 py-3
              text-[#708090]
              shadow-[0_4px_14px_rgba(0,0,0,0.08)]
              focus:outline-none
              focus:border-[#B76E79]
              focus:ring-2 focus:ring-[#B76E79]/30
              transition
            "
          />

          {/* ICONO VER */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-3 text-[#708090]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* SEGURIDAD */}
        {!strong && pass.length > 0 && (
          <p className="text-xs text-[#B76E79]">
            La contraseña debe tener mínimo 8 caracteres
          </p>
        )}
      </div>

      {/* ===== CONFIRM ===== */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-[#708090]">
          Confirmar contraseña
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-3 text-[#708090]" size={18} />

          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="
              w-full
              rounded-2xl
              bg-[#F6F3EF]
              border border-[#D1BBAA]
              pl-11 pr-11 py-3
              text-[#708090]
              shadow-[0_4px_14px_rgba(0,0,0,0.08)]
              focus:outline-none
              focus:border-[#B76E79]
              focus:ring-2 focus:ring-[#B76E79]/30
              transition
            "
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-3 text-[#708090]"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!match && confirm.length > 0 && (
          <p className="text-xs text-[#B76E79]">
            Las contraseñas no coinciden
          </p>
        )}
      </div>

      {/* BOTÓN */}
      <button
        disabled={!match || !strong}
        className={`
          w-full
          py-3
          rounded-full
          text-white
          font-medium
          shadow-[0_18px_40px_rgba(0,0,0,0.22)]
          transition
          ${
            match && strong
              ? "bg-[#B76E79] hover:bg-[#A45F69]"
              : "bg-[#708090] cursor-not-allowed"
          }
        `}
      >
        Restablecer contraseña
      </button>
    </div>
  );
}