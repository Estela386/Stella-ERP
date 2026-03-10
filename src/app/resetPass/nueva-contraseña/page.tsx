"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetLayout from "../_components/ResetLayout";
import NewPasswordCard from "../_components/NewPasswordCard";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar que hay un token válido en la URL
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (token && type === "recovery") {
      setValidToken(true);
    } else {
      // Si no hay token válido, redirigir al inicio de reset
      setTimeout(() => {
        router.push("/resetPass");
      }, 2000);
    }

    setLoading(false);
  }, [searchParams, router]);

  if (loading) {
    return (
      <ResetLayout>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79]" />
        </div>
      </ResetLayout>
    );
  }

  if (!validToken) {
    return (
      <ResetLayout>
        <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-[#3F3A34]">
              Link inválido
            </h2>
            <p className="text-sm text-[#6B645B]">
              El link de recuperación ha expirado o no es válido. Serás
              redirigido...
            </p>
          </div>
        </div>
      </ResetLayout>
    );
  }

  return (
    <ResetLayout>
      <NewPasswordCard />
    </ResetLayout>
  );
}
