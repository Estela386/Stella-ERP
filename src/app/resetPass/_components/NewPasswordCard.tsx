"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@utils/supabase/client";

// import { intercambiarCodigoPorSesion, actualizarContraseña } from "../actions";

export default function NewPasswordCard() {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Intercambiar código por sesión cuando se monta el componente
  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("Código inválido o faltante");
        return;
      }

      try {
        const supabase = createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setError(error.message);
          return;
        }

        setSessionReady(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      }
    };

    exchangeCode();
  }, [searchParams]);

  const match = pass === confirm && pass.length > 0;
  const strong = pass.length >= 8;

  const handleRestablecer = async () => {
    if (!match || !strong) return;

    setLoading(true);
    setError(null);

    const result = await actualizarContraseña(pass);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Mostrar success y redirigir
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (error) {
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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#708090]">Error</h2>
          <p className="text-sm text-[#8C8976]">{error}</p>
          <p className="text-xs text-[#B76E79]">
            Serás redirigido en segundos...
          </p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#D1BBAA] border-t-[#B76E79] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-semibold text-[#708090]">
            Verificando tu código...
          </h2>
          <p className="text-sm text-[#8C8976]">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (success) {
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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#708090]">¡Éxito!</h2>
          <p className="text-sm text-[#8C8976]">
            Tu contraseña ha sido actualizada. Redirigiendo a login...
          </p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
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
              disabled:opacity-50
            "
          />

          {/* ICONO VER */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-3 text-[#708090]"
            disabled={loading}
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
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
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
              disabled:opacity-50
            "
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-3 text-[#708090]"
            disabled={loading}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!match && confirm.length > 0 && (
          <p className="text-xs text-[#B76E79]">Las contraseñas no coinciden</p>
        )}
      </div>

      {/* BOTÓN */}
      <button
        onClick={handleRestablecer}
        disabled={!match || !strong || loading}
        className={`
          w-full
          py-3
          rounded-full
          text-white
          font-medium
          shadow-[0_18px_40px_rgba(0,0,0,0.22)]
          transition
          cursor-pointer
          ${
            match && strong && !loading
              ? "bg-[#B76E79] hover:bg-[#A45F69]"
              : "bg-[#708090] cursor-not-allowed opacity-50"
          }
        `}
      >
        {loading ? "Actualizando..." : "Restablecer contraseña"}
      </button>
    </div>
  );
}
