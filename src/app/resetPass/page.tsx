"use client";

import { useState } from "react";
import { createClient } from "@utils/supabase/client";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async () => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetPass/nueva-contrasena`,
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EF]">
      <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-[#3F3A34]">
            Recuperar contraseña
          </h2>
          <p className="text-sm text-[#6B645B]">
            Ingresa tu correo para enviarte un enlace
          </p>
        </div>

        {sent ? (
          <div className="text-center text-sm text-[#6B645B]">
            Revisa tu correo 📩
          </div>
        ) : (
          <>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl bg-[#F6F3EF] border border-[#D1BBAA] px-4 py-3 text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
            />

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-[#B76E79] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] hover:bg-[#A45F69] transition"
            >
              Enviar enlace
            </button>
          </>
        )}
      </div>
    </div>
  );
}
