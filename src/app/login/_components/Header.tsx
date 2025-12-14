
"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import PrimaryButton from "@/_components/PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  return (
    <header className="w-full bg-[#d6c1b1] flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Stella Logo" className="h-16" />
      </div>
      <div className="flex gap-2">
        <SecondaryButton
          className="w-full"
          selected={isLogin}
          disabled={isLogin}
          onClick={() => router.push("/login")}
        >
          Iniciar sesión
        </SecondaryButton>
        <PrimaryButton
          className={isRegister ? "opacity-80" : ""}
          disabled={isRegister}
          onClick={() => router.push("/register")}
        >
          Registrarse
        </PrimaryButton>
      </div>
    </header>
  );
}
