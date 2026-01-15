"use client";
import Image from "next/image";
import PrimaryButton from "@/_components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      // Mapear códigos de error a mensajes amigables
      const errorMessages: Record<string, string> = {
        otp_expired:
          "El enlace de confirmación ha expirado. Por favor, intenta registrarte de nuevo.",
        access_denied:
          "Acceso denegado. Verifica el enlace o intenta de nuevo.",
        invalid_grant: "El enlace no es válido. Por favor, solicita uno nuevo.",
        invalid_credentials: "Email o contraseña incorrectos.",
        password_mismatch: "Las contraseñas no coinciden.",
        signup_failed: "Error al registrarse. Intenta de nuevo.",
        database_error: "Error en la base de datos. Intenta de nuevo.",
      };

      setErrorMessage(
        errorMessages[errorCode || error] ||
          errorDescription ||
          "Ocurrió un error. Por favor, intenta de nuevo."
      );
    }
  }, [searchParams]);

  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-800">{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage("");
                window.history.replaceState({}, "", "/");
              }}
              className="mt-3 w-full text-sm text-red-600 hover:text-red-800 underline"
            >
              Descartar
            </button>
          </div>
        )}

        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Stella Logo" width={200} height={200} />
          <PrimaryButton className="mt-6" onClick={() => router.push("/login")}>
            Inicia sesión
          </PrimaryButton>
          <button
            onClick={() => router.push("/register")}
            className="mt-3 w-full text-center text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </main>
  );
}
