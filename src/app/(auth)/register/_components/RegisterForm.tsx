"use client";

import React, { useState } from "react";
import Link from "next/link";
import { register } from "@auth/actions";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted,    setAccepted]    = useState(false);

  return (
    <form
      action={register}
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
          Crear Cuenta
        </h2>
      </div>

      {/* NOMBRE */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">Nombre</label>
        <input
          name="nombre"
          type="text"
          required
          placeholder="Juan Pérez"
          className="
            w-full border border-[#B76E79]
            text-[#708090] placeholder-[#708090]/60
            rounded-full px-4 sm:px-6 py-2 sm:py-2.5
            text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-[#B76E79]/40
          "
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">Correo electrónico</label>
        <input
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          className="
            w-full border border-[#B76E79]
            text-[#708090] placeholder-[#708090]/60
            rounded-full px-4 sm:px-6 py-2 sm:py-2.5
            text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-[#B76E79]/40
          "
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">Contraseña</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            required
            placeholder="••••••••"
            className="
              w-full border border-[#B76E79]
              rounded-full px-4 sm:px-6 py-2 sm:py-2.5 pr-10 sm:pr-12
              text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-[#B76E79]/40
            "
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 sm:right-4 top-2.5 sm:top-3 text-[#708090]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="space-y-1">
        <label className="text-xs sm:text-sm text-[#708090]">Confirmar contraseña</label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            placeholder="••••••••"
            className="
              w-full border border-[#B76E79]
              text-[#708090] placeholder-[#708090]/60
              rounded-full px-4 sm:px-6 py-2 sm:py-2.5 pr-10 sm:pr-12
              text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-[#B76E79]/40
            "
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 sm:right-4 top-2.5 sm:top-3 text-[#708090]"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* TÉRMINOS Y CONDICIONES */}
      <div className="flex items-start gap-3">
        {/* checkbox custom */}
        <button
          type="button"
          role="checkbox"
          aria-checked={accepted}
          onClick={() => setAccepted(v => !v)}
          className="
            mt-0.5 flex-shrink-0
            w-5 h-5 rounded
            border-2 border-[#B76E79]
            flex items-center justify-center
            transition-colors duration-150
          "
          style={{
            background: accepted ? "#B76E79" : "transparent",
          }}
        >
          {accepted && (
            <svg
              width="11" height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4L4 7.5L10 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* texto */}
        <p className="text-xs sm:text-sm text-[#708090] leading-snug">
          He leído y acepto los{" "}
          <Link
            href="/terminos?from=registro"
            target="_blank"
            className="text-[#B76E79] font-medium underline underline-offset-2 hover:opacity-75 transition"
          >
            Términos y Condiciones
          </Link>{" "}
          y el{" "}
          <Link
            href="/terminos?from=registro#privacidad"
            target="_blank"
            className="text-[#B76E79] font-medium underline underline-offset-2 hover:opacity-75 transition"
          >
            Aviso de Privacidad
          </Link>{" "}
          de Stella Joyería Artesanal.
        </p>
      </div>

      {/* BOTÓN — deshabilitado si no acepta T&C */}
      <button
        type="submit"
        disabled={!accepted}
        className="
          w-full py-2.5 sm:py-3
          rounded-full text-white
          text-sm sm:text-base font-medium
          bg-gradient-to-r from-[#B76E79] to-[#B76E79]
          shadow-lg transition
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:opacity-90 disabled:hover:opacity-40
        "
      >
        Registrarme
      </button>

      {/* LOGIN */}
      <p className="text-center text-xs sm:text-sm text-[#708090]">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-[#B76E79] font-medium">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}