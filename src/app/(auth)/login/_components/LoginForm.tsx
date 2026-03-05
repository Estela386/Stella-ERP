"use client";

import React, { useState } from "react";
import Link from "next/link";
import { login } from "@auth/actions";
import { Facebook, Mail, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <form
      action={login}
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-6"
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#B76E79] rounded-full mx-auto" />

        <h2 className="text-xl font-semibold text-[#708090]">
          Iniciar sesión
        </h2>
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm text-[#708090]">
          Correo electrónico
        </label>

        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          className="
            w-full
            border
            border-[#B76E79]
            text-[#708090]
            placeholder-[#708090]/60
            rounded-full
            px-6
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-[#B76E79]/40
          "
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-sm text-[#708090]">
          Contraseña
        </label>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className="
              w-full
              border
              border-[#B76E79]
              text-[#708090]
              placeholder-[#708090]/60
              rounded-full
              px-6
              py-2
              pr-12
              focus:outline-none
              focus:ring-2
              focus:ring-[#B76E79]/40
            "
          />

          {/* BOTON VER PASSWORD */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-2.5 text-[#708090]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* OPTIONS */}
      <div className="flex justify-between text-sm text-[#708090]">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Recordarme
        </label>

        <Link href="/resetPass" className="hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-[#B76E79] text-center">
          {error}
        </div>
      )}

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="
          w-full
          py-3
          rounded-full
          text-white
          font-medium
          bg-gradient-to-r
          from-[#B76E79]
          to-[#B76E79]
          shadow-lg
          hover:opacity-90
          transition
        "
      >
        Ingresar
      </button>

      {/* SOCIAL
      <div className="text-center text-sm text-[#708090]">
        o continúa con
      </div>

      <div className="flex justify-center gap-4">
        <button className="p-2 bg-white rounded-full shadow">
          <Facebook size={18} />
        </button>

        <button className="p-2 bg-white rounded-full shadow">
          <Mail size={18} />
        </button>
      </div> */}

      {/* SIGN UP */}
      <p className="text-center text-sm text-[#708090]">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-[#B76E79] font-medium">
          Regístrate
        </Link>
      </p>
    </form>
  );
}