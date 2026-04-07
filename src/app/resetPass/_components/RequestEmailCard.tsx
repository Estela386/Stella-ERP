"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@utils/supabase/client";

export default function RequestEmailCard({ onSend }: { onSend: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEnviar = async () => {
    if (!email.trim()) {
      setError("Por favor ingresa tu correo");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/resetPass/nueva-contrasena`,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Mostrar modal de éxito
      onSend();
    } catch (err) {
      setError("Ocurrió un error enviando el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-md space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold text-[#3F3A34]">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-[#6B645B]">
          Ingresa tu correo para recibir un enlace
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-[#6B645B]">
          Correo
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-[#3F3A34] outline-none focus:ring-2 focus:ring-[#B76E79] disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="bg-[#708090] text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-[#A45F69] transition cursor-pointer disabled:opacity-50"
          onClick={() => router.push("/login")}
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          onClick={handleEnviar}
          disabled={loading}
          className="bg-[#B76E79] text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-[#A45F69] transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </div>
    </div>
  );
}
