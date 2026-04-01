"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResetLayout from "./_components/ResetLayout";
import RequestEmailCard from "./_components/RequestEmailCard";
import EmailSentModal from "./_components/EmailSentModal";
import NewPasswordCard from "./_components/NewPasswordCard";

function ResetPassContent() {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Verificar si viene del email de recuperación
  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setError(`Error: ${errorDescription || "Link inválido o expirado"}`);
      // Redirigir de vuelta después de 5 segundos
      setTimeout(() => {
        router.push("/resetPass");
      }, 5000);
      return;
    }

    // Si viene con código de Supabase, mostrar formulario de nueva contraseña
    if (code) {
      setShowPasswordForm(true);
    }
  }, [searchParams, router]);

  const handleEmailSent = () => {
    setShowModal(true);
  };

  if (error) {
    return (
      <ResetLayout>
        <div className="bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-[#3F3A34]">
              Link inválido
            </h2>
            <p className="text-sm text-[#6B645B]">{error}</p>
            <p className="text-xs text-[#8C8976]">
              Serás redirigido al inicio...
            </p>
          </div>
        </div>
      </ResetLayout>
    );
  }

  if (showPasswordForm) {
    return (
      <ResetLayout>
        <NewPasswordCard />
      </ResetLayout>
    );
  }

  return (
    <ResetLayout>
      {/* ===== PANTALLA SOLICITUD DE EMAIL ===== */}
      <RequestEmailCard onSend={handleEmailSent} />

      {/* ===== MODAL DE CONFIRMACIÓN ===== */}
      {showModal && (
        <EmailSentModal
          onAccept={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </ResetLayout>
  );
}

export default function ResetPassPageContent() {
  return (
    <Suspense fallback={<div>Cargando resetPass...</div>}>
      <ResetPassContent />
    </Suspense>
  );
}
