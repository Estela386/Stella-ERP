"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@utils/supabase/client";
import { useRouter } from "next/navigation";

export default function NewPasswordCard() {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const match = useMemo(
    () => pass === confirm && pass.length > 0,
    [pass, confirm]
  );
  const strong = useMemo(() => pass.length >= 8, [pass]);

  const handleRestablecer = async () => {
    if (loading) return;
    if (!match || !strong) return;

    setLoading(true);

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.replace("/login?error=session_expired");
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: pass,
    });

    if (error) {
      console.error("Error actualizando contraseña:", error);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setSuccess(true);

    setTimeout(() => {
      router.replace("/login");
    }, 2000);
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-10 space-y-6 text-center border border-[#D1BBAA]/70 shadow-[0_35px_90px_rgba(0,0,0,0.18)]">
        <h2 className="text-2xl text-green-600 font-semibold">¡Éxito!</h2>
        <p className="text-sm text-[#8C8976]">Tu contraseña fue actualizada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-10 space-y-8 border border-[#D1BBAA]/70 shadow-[0_35px_90px_rgba(0,0,0,0.18)]">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-[#708090]">
          Nueva contraseña
        </h2>
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Lock className="absolute left-4 top-3 text-[#B76E79]" size={18} />
        <input
          type={showPass ? "text" : "password"}
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full pl-11 pr-11 py-3 bg-[#F6F3EF] border border-[#D1BBAA] rounded-2xl"
        />
        <button
          onClick={() => setShowPass(!showPass)}
          className="absolute right-4 top-3"
        >
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* CONFIRM */}
      <div className="relative">
        <Lock className="absolute left-4 top-3 text-[#708090]" size={18} />
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full pl-11 pr-11 py-3 bg-[#F6F3EF] border border-[#D1BBAA] rounded-2xl"
        />
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-4 top-3"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {!strong && pass.length > 0 && (
        <p className="text-xs text-[#B76E79]">Mínimo 8 caracteres</p>
      )}

      {!match && confirm.length > 0 && (
        <p className="text-xs text-[#B76E79]">No coinciden</p>
      )}

      <button
        onClick={handleRestablecer}
        disabled={!match || !strong || loading}
        className={`w-full py-3 rounded-full text-white ${
          match && strong
            ? "bg-[#B76E79] hover:bg-[#A45F69]"
            : "bg-[#708090] opacity-50"
        }`}
      >
        {loading ? "Actualizando..." : "Restablecer contraseña"}
      </button>
    </div>
  );
}
