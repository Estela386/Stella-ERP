"use client";
import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Gem, Box, Sparkles } from "lucide-react";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      const errorMessages: Record<string, string> = {
        otp_expired:
          "El enlace de confirmación ha expirado. Intenta registrarte nuevamente.",
        access_denied: "Acceso denegado.",
        invalid_grant: "El enlace no es válido.",
      };

      setErrorMessage(
        errorMessages[errorCode || error] ||
          errorDescription ||
          "Ocurrió un error."
      );
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#faf7f4] text-[#7c5c4a] flex flex-col">
      {/* NAVBAR */}
      <nav className="border-b border-[#e5d3c2]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#7c5c4a] rounded-full" />
            <span className="font-semibold text-lg">Stella</span>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="text-sm hover:opacity-70"
          >
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <Image
          src="/logo.png"
          alt="Stella"
          width={110}
          height={110}
          className="mx-auto mb-6"
        />

        <p className="text-sm tracking-widest text-[#7c5c4a]/70 mb-3">
          JOYERÍA DE LUJO
        </p>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Descubre joyas
          <br />
          <span className="text-[#7c5c4a]">hechas para ti</span>
        </h1>

        <p className="max-w-xl mx-auto text-[#7c5c4a]/80 mb-10">
          Explora nuestra colección de joyería exclusiva con visualización 3D,
          personalización y pagos completamente seguros.
        </p>

        <div className="flex justify-center gap-4 mb-16">
          <PrimaryButton onClick={() => router.push("/register")}>
            Crear cuenta
          </PrimaryButton>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-full border border-[#7c5c4a] hover:bg-[#e5d3c2] transition"
          >
            Iniciar sesión
          </button>
        </div>

        {/* TARJETAS */}
        <div className="relative flex justify-center items-center h-[240px]">
          {/* CARD 1 */}
          <div className="absolute -rotate-6 bg-white shadow-xl rounded-2xl p-6 w-56 border border-[#e5d3c2]">
            <p className="text-sm opacity-70">Producto destacado</p>

            <p className="font-semibold mt-2">Anillo Stella</p>

            <p className="text-sm mt-1 opacity-70">$12,500 MXN</p>
          </div>

          {/* CARD 2 */}
          <div className="absolute rotate-6 bg-[#7c5c4a] text-white shadow-2xl rounded-2xl p-6 w-56">
            <p className="text-sm opacity-80">Stella Collection</p>

            <p className="font-semibold mt-2">Collar Diamante</p>

            <p className="text-sm mt-1 opacity-80">$18,900 MXN</p>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {errorMessage && (
        <div className="max-w-md mx-auto mb-8 px-6">
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-4 gap-8">
        <Feature
          icon={<ShieldCheck />}
          title="Pagos seguros"
          text="Tus compras están protegidas con sistemas de pago cifrados."
        />

        <Feature
          icon={<Gem />}
          title="Gran variedad"
          text="Explora una colección exclusiva de joyas."
        />

        <Feature
          icon={<Box />}
          title="Visualización 3D"
          text="Observa cada joya en detalle antes de comprar."
        />

        <Feature
          icon={<Sparkles />}
          title="Personalización"
          text="Diseña joyas únicas adaptadas a tu estilo."
        />
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e5d3c2] p-6 text-center shadow-sm">
      <div className="flex justify-center text-[#7c5c4a] mb-3">{icon}</div>

      <h3 className="font-semibold mb-2">{title}</h3>

      <p className="text-sm opacity-70">{text}</p>
    </div>
  );
}
