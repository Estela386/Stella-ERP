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
  const [email, setEmail] = useState("");

  return (
    <form
      action={login}
      onSubmit={onSubmit}
      className="
        w-full
        max-w-sm sm:max-w-md
        mx-auto
        px-4 sm:px-6
        py-6 sm:py-8
        space-y-5 sm:space-y-6
      "
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#B76E79] rounded-full mx-auto" />

        <h2 className="text-lg sm:text-xl font-semibold text-[#708090]">
          Iniciar sesión
        </h2>
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">
          Correo electrónico
        </label>

        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          onChange={e => setEmail(e.target.value)}
          className="
            w-full
            border
            border-[#B76E79]
            text-[#708090]
            placeholder-[#708090]/60
            rounded-full
            px-4 sm:px-6
            py-2 sm:py-2.5
            text-sm sm:text-base
            focus:outline-none
            focus:ring-2
            focus:ring-[#B76E79]/40
          "
        />
      </div>

      <div className="text-xs sm:text-sm text-[#B76E79] text-center">
        {error}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">
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
              px-4 sm:px-6
              py-2 sm:py-2.5
              pr-10 sm:pr-12
              text-sm sm:text-base
              focus:outline-none
              focus:ring-2
              focus:ring-[#B76E79]/40
            "
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="
              absolute
              right-3 sm:right-4
              top-2.5 sm:top-3
              text-[#708090]
            "
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* OPTIONS */}
      <div className="flex justify-between items-center text-xs sm:text-sm text-[#708090]">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Recordarme
        </label>

        <Link href="/resetPass" className="hover:underline text-right">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-xs sm:text-sm text-[#B76E79] text-center">
          {error}
        </div>
      )}

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="
          w-full
          py-2.5 sm:py-3
          rounded-full
          text-white
          text-sm sm:text-base
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

      {/* SIGN UP */}
      <p className="text-center text-xs sm:text-sm text-[#708090]">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-[#B76E79] font-medium">
          Regístrate
        </Link>
      </p>
    </form>
  );
}