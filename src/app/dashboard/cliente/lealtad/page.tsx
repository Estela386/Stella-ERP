"use client";

import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { LoyaltyService } from "@/lib/services/LoyaltyService";
import { ILoyaltyProfile, ILoyaltyTransaction } from "@/lib/models/Loyalty";
import { useAuth } from "@/lib/hooks/useAuth";
import { Sparkles, Award, TrendingUp, History, Loader2 } from "lucide-react";
import HeaderClient from "@auth/_components/HeaderClient";
import ChatbotPage from "@/app/chatbot/page";

export default function LealtadPage() {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState<ILoyaltyProfile | null>(null);
  const [historial, setHistorial] = useState<ILoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!usuario?.id) return;

      const supabase = createClient();
      const loyaltyService = new LoyaltyService(supabase);

      const [perfilRes, historialData] = await Promise.all([
        loyaltyService.obtenerPerfilLealtad(usuario.id as unknown as number),
        loyaltyService.obtenerHistorial(usuario.id as unknown as number),
      ]);

      if (perfilRes.perfil) setPerfil(perfilRes.perfil);
      setHistorial(historialData);
      setLoading(false);
    };

    fetchLoyaltyData();
  }, [usuario]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-[#b76e79] h-12 w-12" />
      </div>
    );
  }

  // Cálculos para la barra de progreso
  const puntosActuales = perfil?.lifetime_points || 0;
  const puntosSiguiente = perfil?.proximo_nivel?.min_points || 1; // Evitar división por 0
  const puntosNivelActual = perfil?.nivel_actual?.min_points || 0;

  const porcentajeProgreso = perfil?.proximo_nivel
    ? Math.min(
        100,
        Math.max(
          0,
          ((puntosActuales - puntosNivelActual) /
            (puntosSiguiente - puntosNivelActual)) *
            100
        )
      )
    : 100; // Si es el nivel máximo

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--beige)",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      <HeaderClient />
      <ChatbotPage />
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#4a5568] flex items-center gap-3">
            Stella <span className="text-[#b76e79] italic">Rewards</span>{" "}
            <Sparkles className="text-[#b76e79]" />
          </h1>
          <p className="text-[#708090] mt-2">
            Acumula puntos en cada compra y desbloquea descuentos exclusivos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Tarjeta Nivel Actual */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#4a5568] to-[#2d3748] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-8">
              <Award size={180} />
            </div>

            <p className="text-sm uppercase tracking-widest text-[#f6f4ef]/70 font-semibold mb-1">
              Tu nivel actual
            </p>
            <h2 className="font-serif text-4xl italic text-[#e2c1c6] mb-6">
              {perfil?.nivel_actual?.name || "Stella Bronce"}
            </h2>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2 text-[#f6f4ef]/90">
                <span>{puntosActuales} pts</span>
                <span>
                  {perfil?.proximo_nivel
                    ? `${puntosSiguiente} pts`
                    : "Nivel Máximo"}
                </span>
              </div>
              <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#b76e79] transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${porcentajeProgreso}%` }}
                />
              </div>
            </div>

            {perfil?.proximo_nivel ? (
              <p className="text-sm text-[#f6f4ef]/80">
                Estás a{" "}
                <strong className="text-white">
                  {puntosSiguiente - puntosActuales} puntos
                </strong>{" "}
                de alcanzar el nivel {perfil.proximo_nivel.name}.
              </p>
            ) : (
              <p className="text-sm text-[#f6f4ef]/80">
                ¡Felicidades! Eres nivel máximo.
              </p>
            )}
          </div>

          {/* Tarjeta Puntos Disponibles */}
          <div className="bg-white border border-[#b76e79]/20 rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#b76e79]/10 flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-[#b76e79]" />
            </div>
            <p className="text-[#708090] text-sm uppercase font-semibold tracking-wider">
              Puntos para canjear
            </p>
            <p className="font-serif text-5xl font-bold text-[#b76e79] my-2">
              {perfil?.points || 0}
            </p>
            <p className="text-sm text-[#708090]">
              Tienes un{" "}
              <strong className="text-[#4a5568]">
                {perfil?.nivel_actual?.discount_percent}% de descuento
              </strong>{" "}
              permanente activo.
            </p>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-semibold text-[#4a5568] mb-6 flex items-center gap-2">
            <History size={20} className="text-[#b76e79]" /> Últimos Movimientos
          </h3>

          {historial.length === 0 ? (
            <p className="text-center text-[#708090] py-8">
              Aún no tienes movimientos en tu cuenta.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {historial.map(tx => (
                <div
                  key={tx.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-[#4a5568]">
                      {tx.description}
                    </p>
                    <p className="text-xs text-[#708090]">
                      {new Date(tx.created_at).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <div
                    className={`font-bold ${tx.points > 0 ? "text-[#8c9768]" : "text-[#4a5568]"}`}
                  >
                    {tx.points > 0 ? "+" : ""}
                    {tx.points} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
