"use client";

import { useState } from "react";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import { useConsignaciones, useConsignacionesMayorista } from "@lib/hooks/useConsignaciones";
import { useSolicitudes } from "@lib/hooks/useSolicitudes";
import { SolicitudMayoristaService } from "@lib/services/SolicitudMayoristaService";

import SidebarMenu from "@/app/_components/SideBarMenu";
import StatsCards from "./_components/StatsCards";
import TabBar, { TabId } from "./_components/TabBar";
import ConsignacionesTable from "./_components/ConsignacionesTable";
import MayoristasTable from "./_components/MayoristasTable";
import SolicitudesTable from "./_components/SolicitudesTable";
import CreateConsignacionModal from "./_components/CreateConsignacionModal";
import PromoverMayoristaModal from "./_components/PromoverMayoristaModal";
import MayoristaView from "./_components/MayoristaView";

import { IConsignacion, ISolicitudMayorista } from "@lib/models";

export default function ConsignacionesPage() {
  const { usuario, loading: authLoading } = useAuth();

  // ─── Admin state ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>("consignaciones");
  const [modalConsignacion, setModalConsignacion] = useState(false);
  const [editando, setEditando] = useState<IConsignacion | null>(null);
  const [modalPromover, setModalPromover] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);

  const showToast = (msg: string, tipo: "ok" | "err" = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  // Hooks según rol
  const isAdmin = usuario?.id_rol === 1;
  const isMayorista = usuario?.id_rol === 3;
  const usuarioId = typeof usuario?.id === "string"
    ? parseInt(usuario.id)
    : (usuario?.id as number | undefined) ?? null;

  const adminHook = useConsignaciones();
  const mayoristaHook = useConsignacionesMayorista(isMayorista ? usuarioId : null);
  const solicitudesHook = useSolicitudes();

  // ─── Handlers admin ────────────────────────────────────────────

  const handleAprobar = async (s: ISolicitudMayorista) => {
    const supabase = createClient();
    const service = new SolicitudMayoristaService(supabase);
    const { success, error } = await service.aprobar(s.id, usuarioId!);
    if (success) {
      showToast(`✓ ${s.usuario?.nombre ?? "Usuario"} promovido a Mayorista`);
      solicitudesHook.reload();
      adminHook.reload();
    } else {
      showToast(error ?? "Error al aprobar", "err");
    }
  };

  const handleRechazar = async (s: ISolicitudMayorista) => {
    const supabase = createClient();
    const service = new SolicitudMayoristaService(supabase);
    const { success, error } = await service.rechazar(s.id, usuarioId!);
    if (success) {
      showToast("Solicitud rechazada");
      solicitudesHook.reload();
    } else {
      showToast(error ?? "Error al rechazar", "err");
    }
  };

  const handleCancelar = async (c: IConsignacion) => {
    if (!confirm(`¿Cancelar la consignación #${c.id}? Se devolverá el stock al inventario.`)) return;
    try {
      const res = await fetch(`/api/consignaciones/${c.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: usuarioId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast("Consignación cancelada y stock devuelto");
      adminHook.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error", "err");
    }
  };

  // ─── Loading global ────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#8C9796" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>⏳</div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // ─── Vista Mayorista ───────────────────────────────────────────
  if (isMayorista) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F6F3EF" }}>
        <SidebarMenu />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <MayoristaView
              consignaciones={mayoristaHook.consignaciones}
              loading={mayoristaHook.loading}
              stats={mayoristaHook.stats}
              nombre={usuario?.nombre?.split(" ")[0] ?? "Mayorista"}
            />
          </div>
        </main>
      </div>
    );
  }

  // ─── Vista Admin ───────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F6F3EF" }}>
        <SidebarMenu />

        <main style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ height: 1, width: 40, background: "#B76E79", display: "block" }} />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#B76E79",
                      fontWeight: 700,
                    }}
                  >
                    Gestión
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "clamp(1.4rem,3vw,2rem)",
                    fontWeight: 800,
                    color: "#1C1C1C",
                    margin: "4px 0 0",
                    fontFamily: "Manrope,sans-serif",
                  }}
                >
                  Consignaciones
                </h1>
              </div>

              <TabBar
                active={activeTab}
                onSelect={setActiveTab}
                pendientes={solicitudesHook.pendientes}
              />
            </div>

            {/* Stats (solo en tab consignaciones) */}
            {activeTab === "consignaciones" && (
              <StatsCards {...adminHook.stats} />
            )}

            {/* Card principal */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "24px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                border: "1px solid rgba(112,128,144,0.12)",
              }}
            >
              {activeTab === "consignaciones" && (
                <ConsignacionesTable
                  consignaciones={adminHook.consignaciones}
                  loading={adminHook.loading}
                  onNueva={() => { setEditando(null); setModalConsignacion(true); }}
                  onEditar={c => { setEditando(c); setModalConsignacion(true); }}
                  onCancelar={handleCancelar}
                />
              )}

              {activeTab === "mayoristas" && (
                <MayoristasTable
                  mayoristas={adminHook.mayoristas}
                  loading={adminHook.loading}
                  onPromover={() => setModalPromover(true)}
                />
              )}

              {activeTab === "solicitudes" && (
                <SolicitudesTable
                  solicitudes={solicitudesHook.solicitudes}
                  loading={solicitudesHook.loading}
                  onAprobar={handleAprobar}
                  onRechazar={handleRechazar}
                />
              )}

              {/* Error messages */}
              {activeTab === "consignaciones" && adminHook.error && (
                <p style={{ color: "#e53e3e", fontSize: "0.82rem", marginTop: 10 }}>
                  ⚠️ {adminHook.error}
                </p>
              )}
              {activeTab === "solicitudes" && solicitudesHook.error && (
                <p style={{ color: "#e53e3e", fontSize: "0.82rem", marginTop: 10 }}>
                  ⚠️ {solicitudesHook.error}
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Modals */}
        <CreateConsignacionModal
          open={modalConsignacion}
          onClose={() => { setModalConsignacion(false); setEditando(null); }}
          onSuccess={() => adminHook.reload()}
          mayoristas={adminHook.mayoristas}
          adminId={usuarioId ?? 0}
          editando={editando}
        />

        <PromoverMayoristaModal
          open={modalPromover}
          onClose={() => setModalPromover(false)}
          onSuccess={() => { adminHook.reload(); solicitudesHook.reload(); }}
          usuariosDisponibles={solicitudesHook.usuariosNormales}
        />

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: toast.tipo === "ok" ? "#1C1C1C" : "#e53e3e",
              color: "#fff",
              borderRadius: 12,
              padding: "12px 20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              zIndex: 2000,
              maxWidth: 340,
              animation: "slideIn 0.25s ease",
            }}
          >
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  // ─── Acceso no autorizado ──────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F6F3EF" }}>
      <SidebarMenu />
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          color: "#8C9796",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1C1C1C" }}>
          Acceso restringido
        </h2>
        <p style={{ fontSize: "0.85rem" }}>
          No tienes permisos para ver esta sección.
        </p>
      </main>
    </div>
  );
}
