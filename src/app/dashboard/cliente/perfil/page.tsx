"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileStats from "./_components/ProfileStats";
import ProfileForm from "./_components/ProfileForm";
import { UserProfile, UserStats } from "./type";

export default function ProfilePage() {
  const { usuario, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [statsData, setStatsData] = useState<UserStats>({
    pedidosTotales: 0,
    montoPendiente: 0,
    puntosLealtad: 0
  });

  useEffect(() => {
    async function fetchProfileAndStats() {
      if (!usuario) return;

      try {
        const supabase = createClient();

        // 1. Obtener datos extendidos del cliente
        const { data: clienteData } = await supabase
          .from("cliente")
          .select("*")
          .eq("id_usuario", usuario.id)
          .single();

        // 2. Obtener estadísticas de ventas
        const { data: ventasData } = await supabase
          .from("ventas")
          .select("id, total")
          .eq("id_usuario", usuario.id);

        // 3. Obtener cuentas por cobrar (monto pendiente)
        const { data: cpcData } = await supabase
          .from("cuentasporcobrar")
          .select("monto_pendiente")
          .eq("id_cliente", clienteData?.id)
          .eq("estado", "pendiente");

        const montoPendiente = cpcData?.reduce((acc, curr) => acc + (Number(curr.monto_pendiente) || 0), 0) || 0;

        // Lógica de sanitización de datos
        const dbCorreo = usuario.correo || (usuario as any).email || "";
        const dbNombre = clienteData?.nombre || usuario.nombre || "";
        
        // Si el nombre parece un email y no tenemos correo, los intercambiamos o asignamos correctamente
        const finalCorreo = dbCorreo || (dbNombre.includes("@") ? dbNombre : "Sin correo");
        const finalNombre = (dbNombre.includes("@") && dbCorreo) ? "" : (dbNombre.includes("@") ? "Usuario Stella" : dbNombre);

        setProfileData({
          id: Number(usuario.id),
          clienteId: clienteData?.id || 0,
          nombre: finalNombre || "Usuario Stella",
          correo: finalCorreo,
          rol: usuario.id_rol === 1 ? "Administrador" : "Cliente Stella",
          activo: (usuario as any).activo ?? true,
          fechaRegistro: usuario.created_at ? new Date(usuario.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" }) : "Reciente"
        });

        setStatsData({
          pedidosTotales: ventasData?.length || 0,
          montoPendiente: montoPendiente,
          puntosLealtad: Math.floor((ventasData?.reduce((acc, v) => acc + (Number(v.total) || 0), 0) || 0) / 10) // 1 punto por cada 10 pesos
        });

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (usuario) {
        fetchProfileAndStats();
      } else {
        setLoading(false);
      }
    }
  }, [usuario, authLoading]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", color: "#708090" }}>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario || !profileData) {
    return (
      <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", color: "#708090" }}>No se pudo cargar la información del perfil.</p>
        <button onClick={() => window.location.href = "/dashboard/cliente"} style={{ padding: "10px 20px", background: "#b76e79", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", flexDirection: "column" }}>
      <style>{`
                @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <HeaderClient user={usuario} />

      <main style={{
        flex: 1,
        maxWidth: 1000,
        width: "100%",
        margin: "0 auto",
        padding: "40px 20px",
        animation: "fadeIn 0.6s ease-out"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <ProfileHeader profile={profileData} />
          <ProfileStats stats={statsData} />
          <ProfileForm profile={profileData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
