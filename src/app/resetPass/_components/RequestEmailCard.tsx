"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestEmailCard({ onSend }: { onSend: () => void }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-md space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold text-[#3F3A34]">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-[#6B645B]">
          Ingresa tu correo para recibir un código
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
          className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B76E79]"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="bg-[#708090] text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-[#A45F69] transition"
          onClick={() => router.push("/login")}
        >
          Cancelar
        </button>

        <button
          onClick={onSend}
          className="bg-[#B76E79] text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-[#A45F69] transition"
        >
          Enviar código
        </button>
      </div>
    </div>
  );
}
