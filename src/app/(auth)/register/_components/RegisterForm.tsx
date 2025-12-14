"use client";

import PrimaryButton from "@components/PrimaryButton";
import { register } from "@auth/actions";

export default function RegisterForm() {
  return (
    <form
      action={register}
      className="bg-white rounded-lg shadow p-8 w-full max-w-md flex flex-col gap-4"
    >
      <div>
        <label className="block text-[#7c5c4a] mb-1">Correo</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
          placeholder="estela@example.com"
        />
      </div>

      <div>
        <label className="block text-[#7c5c4a] mb-1">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
        />
      </div>

      <div>
        <label className="block text-[#7c5c4a] mb-1">
          Confirmar contraseña
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
        />
      </div>

      <PrimaryButton type="submit" className="mt-2">
        Registrar
      </PrimaryButton>
    </form>
  );
}
