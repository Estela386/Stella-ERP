import React from "react";
import PrimaryButton from "@components/PrimaryButton";

interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  action?: (formData: FormData) => Promise<void>;
}

export default function LoginForm({ onSubmit, error, action }: LoginFormProps) {
  return (
    <form
      action={action}
      className="bg-white rounded-lg shadow p-8 w-full max-w-md flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <div>
        <label className="block text-[#7c5c4a] mb-1">Correo</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 text-[#3a2a1a] placeholder-[#a89b8a]"
          placeholder="estela@example.com"
        />
      </div>
      <div>
        <label className="block text-[#7c5c4a] mb-1">Contraseña</label>
        <input
          type="password"
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
    </form>
  );
}
