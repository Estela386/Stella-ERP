import React from "react";
import PrimaryButton from "@components/PrimaryButton";
import Link from "next/link";
import { login } from "@auth/actions";

interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  return (
    <form
      action={login}
      className="bg-white rounded-lg shadow p-8 w-full max-w-2xl flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <div>
        <label className="block text-[#7c5c4a] mb-1">Correo</label>
        <input
          type="email"
          name="email"
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
          placeholder="estela@example.com"
        />
      </div>

      <div>
        <label className="block text-[#7c5c4a] mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
          placeholder="Escribe tu contraseña"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[#b97a7a] text-sm">
          <span>❗</span>
          <span>{error}</span>
        </div>
      )}

      <PrimaryButton type="submit" className="w-full mt-2">
        Ingresar
      </PrimaryButton>

       <Link
        href="/resetPass"
        className="text-sm text-[#7c5c4a] hover:underline mt-2 text-center"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}