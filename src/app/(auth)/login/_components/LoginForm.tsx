"use client";

import React, { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { login } from "@auth/actions";
import { Facebook, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export default function LoginForm({ onSubmit, error: propError }: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");

  const [state, formAction, isPending] = useActionState(login, { success: true, message: "" });

  useEffect(() => {
    if (state?.success === false && state?.message) {
      toast.error(state.message, {
        description: "Verifica tus credenciales e inténtalo de nuevo.",
      });
    }
  }, [state]);

  const hasError = state?.success === false || !!propError;
  const errorMessage = propError || state?.message;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      action={formAction}
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

        <h2 className="text-lg sm:text-xl font-semibold text-[#708090] tracking-tight">
          Bienvenid@ de nuevo
        </h2>
        <p className="text-xs text-[#708090]/60">Ingresa tus datos para continuar</p>
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
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`
            w-full
            border
            ${hasError ? "border-red-400 ring-1 ring-red-100" : "border-[#B76E79] focus:ring-[#B76E79]/40"}
            text-[#708090]
            placeholder-[#708090]/40
            rounded-full
            px-4 sm:px-6
            py-2 sm:py-2.5
            text-sm sm:text-base
            focus:outline-none
            focus:ring-2
            transition-all
            duration-200
          `}
        />
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
            className={`
              w-full
              border
              ${hasError ? "border-red-400 ring-1 ring-red-100" : "border-[#B76E79] focus:ring-[#B76E79]/40"}
              text-[#708090]
              placeholder-[#708090]/40
              rounded-full
              px-4 sm:px-6
              py-2 sm:py-2.5
              pr-10 sm:pr-12
              text-sm sm:text-base
              focus:outline-none
              focus:ring-2
              transition-all
              duration-200
            `}
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

      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: [0, -4, 4, -4, 4, 0] // Shake animation
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-red-500 bg-red-50 py-2 px-4 rounded-lg font-medium border border-red-100"
          >
            <AlertCircle size={14} />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        disabled={isPending}
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
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isPending ? "Validando..." : "Ingresar"}
      </button>

      {/* SIGN UP */}
      <p className="text-center text-xs sm:text-sm text-[#708090]">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-[#B76E79] font-medium">
          Regístrate
        </Link>
      </p>
    </motion.form>
  );
}