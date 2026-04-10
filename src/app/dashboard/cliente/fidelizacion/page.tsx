"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@supabase/supabase-js";
import SidebarMenu from "@/app/_components/SideBarMenu";
import NivelCard from "./_components/NivelCard";
import RuletaWheel from "./_components/RuletaWheel";
import MisCodigosPanel from "./_components/MisCodigosPanel";
import OfertasInteligentes from "./_components/OfertasInteligentes";
import type { ILoyaltySummary, NivelProgreso } from "@/lib/models/Fidelizacion";
import type { IUserPromoCode } from "@/lib/models/Promocion";
import type { IRuletaReward, ResultadoGiro, TipoRuleta } from "@/lib/models/RuletaSpin";
import type { ProductoRotacionAnalisis } from "@/lib/models/ProductoDescuento";

const ROSE = "#b76e79";
const DEEP = "#4a5568";

export default function FidelizacionPage() {
  const { usuario, loading } = useAuth();
  const [summary, setSummary] = useState<ILoyaltySummary | null>(null);
  const [progreso, setProgreso] = useState<NivelProgreso | null>(null);
  const [codigos, setCodigos] = useState<IUserPromoCode[]>([]);
  const [rewards, setRewards] = useState<IRuletaReward[]>([]);
  const [ruletaDisponible, setRuletaDisponible] = useState(false);
  const [proximoGiro, setProximoGiro] = useState<string | undefined>();
  const [ofertas, setOfertas] = useState<ProductoRotacionAnalisis[]>([]);
  const [tabActiva, setTabActiva] = useState<"resumen" | "ruleta" | "codigos" | "ofertas">("resumen");
  const [cargando, setCargando] = useState(true);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // Obtener token de sesión para las llamadas API
  const getToken = useCallback(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, []);

  const cargarDatos = useCallback(async () => {
    if (!usuario) return;
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [summaryRes, codigosRes, rewardsRes, disponRes, ofertasRes] = await Promise.all([
        fetch("/api/fidelizacion?vista=summary", { headers }).then((r) => r.json()),
        fetch("/api/promociones?vista=mis_codigos", { headers }).then((r) => r.json()),
        fetch("/api/ruleta?vista=rewards", { headers }).then((r) => r.json()),
        fetch("/api/ruleta?vista=disponibilidad", { headers }).then((r) => r.json()),
        fetch("/api/inventario-inteligente?vista=ofertas", { headers }).then((r) => r.json()),
      ]);

      setSummary(summaryRes.summary);
      setProgreso(summaryRes.progreso);
      setCodigos(codigosRes.codigos ?? []);
      setRewards(rewardsRes.rewards ?? []);
      setRuletaDisponible(disponRes.disponibilidad?.diaria_disponible ?? false);
      setProximoGiro(disponRes.disponibilidad?.diaria_proximo_giro);
      setOfertas(ofertasRes.productos ?? []);
    } finally {
      setCargando(false);
    }
  }, [usuario, getToken]);

  useEffect(() => {
    if (!loading && usuario) cargarDatos();
  }, [loading, usuario, cargarDatos]);

  const handleGiro = useCallback(async (tipo: TipoRuleta): Promise<ResultadoGiro | null> => {
    const token = await getToken();
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    // Paso 1: Solicitar token de giro
    const tokenRes = await fetch("/api/ruleta", {
      method: "POST",
      headers,
      body: JSON.stringify({ accion: "solicitar_token", tipo_ruleta: tipo }),
    }).then((r) => r.json());

    if (tokenRes.error || !tokenRes.token) {
      setNotificacion(tokenRes.error ?? "No disponible");
      return null;
    }

    // Paso 2: Ejecutar giro con token
    const giroRes = await fetch("/api/ruleta", {
      method: "POST",
      headers,
      body: JSON.stringify({ accion: "girar", tipo_ruleta: tipo, spin_token: tokenRes.token }),
    }).then((r) => r.json());

    if (giroRes.error) {
      setNotificacion(giroRes.error);
      return null;
    }

    // Recargar datos después del giro
    await cargarDatos();
    setRuletaDisponible(false);
    return giroRes.resultado as ResultadoGiro;
  }, [getToken, cargarDatos]);

  const handleCopiar = (codigo: string) => {
    setNotificacion(`✅ Código ${codigo} copiado al portapapeles`);
    setTimeout(() => setNotificacion(null), 3000);
  };

  if (loading || cargando) {
    return (
      <div style={{ display:"flex", height:"100vh" }}>
        <SidebarMenu />
        <main style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#f6f4ef" }}>
          <div style={{ fontFamily:"var(--font-sans)", color:"#708090" }}>Cargando tu perfil de fidelización...</div>
        </main>
      </div>
    );
  }

  const tabs: { id: typeof tabActiva; label: string; emoji: string }[] = [
    { id:"resumen",  label:"Mi Perfil",  emoji:"👤" },
    { id:"ruleta",   label:"Ruleta",     emoji:"🎰" },
    { id:"codigos",  label:"Mis Códigos",emoji:"🎁" },
    { id:"ofertas",  label:"Ofertas",    emoji:"🔥" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#f6f4ef" }}>
      <SidebarMenu />

      <main style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
        {/* Notificación toast */}
        {notificacion && (
          <div style={{
            position:"fixed", top:20, right:20, zIndex:9999,
            background:"#fff",
            border:"1.5px solid rgba(183,110,121,0.3)",
            borderRadius:12,
            padding:"12px 20px",
            boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
            fontFamily:"var(--font-sans)",
            fontSize:"0.88rem",
            color:"#1a1a2e",
            animation:"fadeSlideIn 0.3s ease both",
          }}>
            {notificacion}
          </div>
        )}

        <div style={{ padding:"clamp(16px,2vw,28px)", maxWidth:900, margin:"0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom:24 }}>
            <p style={{ margin:0, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"#708090", fontFamily:"var(--font-sans)" }}>
              Sistema de Fidelización
            </p>
            <h1 style={{ margin:"4px 0 0", fontSize:"clamp(1.6rem,3vw,2.2rem)", fontFamily:"var(--font-serif)", color:"#1a1a2e" }}>
              Mi Club Stella ✨
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:24, background:"rgba(255,255,255,0.6)", borderRadius:14, padding:4, border:"1px solid rgba(183,110,121,0.1)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-fidelizacion-${tab.id}`}
                onClick={() => setTabActiva(tab.id)}
                style={{
                  flex:1,
                  padding:"10px 8px",
                  borderRadius:10,
                  border:"none",
                  background: tabActiva === tab.id
                    ? "linear-gradient(135deg, #b76e79, #d4a5a5)"
                    : "transparent",
                  color: tabActiva === tab.id ? "#fff" : "#708090",
                  fontFamily:"var(--font-sans)",
                  fontSize:"clamp(0.7rem,1.2vw,0.85rem)",
                  fontWeight: tabActiva === tab.id ? 700 : 400,
                  cursor:"pointer",
                  transition:"all 0.2s ease",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  gap:4,
                  boxShadow: tabActiva === tab.id ? "0 3px 12px rgba(183,110,121,0.3)" : "none",
                }}
              >
                <span>{tab.emoji}</span>
                <span className="hidden md:inline">{tab.label}</span>
                {tab.id === "codigos" && codigos.length > 0 && (
                  <span style={{
                    background: tabActiva === tab.id ? "rgba(255,255,255,0.3)" : ROSE,
                    color:"#fff", borderRadius:999, padding:"0 5px",
                    fontSize:"0.65rem", fontWeight:700, minWidth:16, textAlign:"center"
                  }}>{codigos.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Contenido por tab */}
          {tabActiva === "resumen" && summary && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <NivelCard summary={summary} progreso={progreso} />

              {/* Beneficios del nivel */}
              <div style={{ background:"#fff", borderRadius:16, padding:"20px 24px", border:"1px solid rgba(183,110,121,0.1)" }}>
                <h3 style={{ margin:"0 0 16px", fontFamily:"var(--font-display)", fontSize:"1rem", color:DEEP }}>
                  🎖️ Tus Beneficios Actuales
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10 }}>
                  {[
                    { emoji:"💰", label:`${summary.descuento_base}% descuento base` },
                    { emoji:"⭐", label:`${(summary.puntos_disponibles ?? 0).toLocaleString()} puntos` },
                    summary.acceso_mayoreo && { emoji:"🏷️", label:"Precio mayoreo" },
                    { emoji:"🎰", label:"Ruleta diaria" },
                    { emoji:"👥", label:"Programa referidos" },
                  ].filter(Boolean).map((b, i) => (
                    <div key={i} style={{
                      background:"rgba(246,244,239,0.8)",
                      borderRadius:10,
                      padding:"10px 12px",
                      display:"flex",
                      alignItems:"center",
                      gap:8,
                      border:"1px solid rgba(183,110,121,0.1)"
                    }}>
                      <span style={{ fontSize:"1.2rem" }}>{(b as { emoji:string;label:string }).emoji}</span>
                      <span style={{ fontSize:"0.78rem", color:DEEP, fontFamily:"var(--font-sans)", fontWeight:500 }}>
                        {(b as { emoji:string;label:string }).label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Código de referido */}
              <div style={{
                background:"linear-gradient(135deg, #f6f4ef, #fff)",
                borderRadius:16,
                padding:"16px 20px",
                border:"1.5px dashed rgba(183,110,121,0.3)",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:12,
                flexWrap:"wrap"
              }}>
                <div>
                  <p style={{ margin:0, fontSize:"0.72rem", color:"#708090", fontFamily:"var(--font-sans)", fontWeight:700, letterSpacing:"0.1em" }}>
                    TU CÓDIGO DE REFERIDO
                  </p>
                  <p style={{ margin:"4px 0 0", fontSize:"1.4rem", fontWeight:800, color:ROSE, fontFamily:"var(--font-display)", letterSpacing:"0.08em" }}>
                    {summary.codigo_referido ?? "—"}
                  </p>
                  <p style={{ margin:"2px 0 0", fontSize:"0.72rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
                    Comparte y gana puntos por cada amigo que compre
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (summary.codigo_referido) {
                      navigator.clipboard.writeText(summary.codigo_referido);
                      setNotificacion("✅ Código de referido copiado");
                      setTimeout(() => setNotificacion(null), 3000);
                    }
                  }}
                  style={{
                    background:`linear-gradient(135deg, ${ROSE}, #d4a5a5)`,
                    color:"#fff",
                    border:"none",
                    borderRadius:10,
                    padding:"10px 20px",
                    fontFamily:"var(--font-sans)",
                    fontWeight:700,
                    fontSize:"0.85rem",
                    cursor:"pointer",
                  }}
                >
                  Copiar 👥
                </button>
              </div>
            </div>
          )}

          {tabActiva === "ruleta" && (
            <div style={{ background:"#fff", borderRadius:20, padding:"28px", border:"1px solid rgba(183,110,121,0.1)", textAlign:"center" }}>
              <h3 style={{ margin:"0 0 8px", fontFamily:"var(--font-serif)", fontSize:"1.5rem", color:"#1a1a2e" }}>
                🎰 Ruleta Diaria
              </h3>
              <p style={{ margin:"0 0 24px", fontSize:"0.85rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
                Gira cada día y gana premios exclusivos
              </p>
              <RuletaWheel
                rewards={rewards}
                disponible={ruletaDisponible}
                proximoGiro={proximoGiro}
                onGiro={handleGiro}
              />
            </div>
          )}

          {tabActiva === "codigos" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ margin:0, fontFamily:"var(--font-display)", fontSize:"1rem", color:DEEP }}>
                🎁 Mis Códigos Activos ({codigos.length})
              </h3>
              <MisCodigosPanel codigos={codigos} onCopiar={handleCopiar} />
            </div>
          )}

          {tabActiva === "ofertas" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{
                background:"linear-gradient(135deg, #fff5e6, #fff)",
                borderRadius:14,
                padding:"14px 18px",
                border:"1px solid rgba(253,126,20,0.2)"
              }}>
                <p style={{ margin:0, fontSize:"0.85rem", color:"#fd7e14", fontFamily:"var(--font-sans)", fontWeight:600 }}>
                  🔥 Ofertas Inteligentes — Descuentos automáticos por baja rotación
                </p>
                <p style={{ margin:"4px 0 0", fontSize:"0.75rem", color:"#708090" }}>
                  Estos productos tienen descuentos especiales. ¡No los dejes pasar!
                </p>
              </div>
              <OfertasInteligentes productos={ofertas} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
