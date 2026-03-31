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

  const handleReactivar = async (c: IConsignacion) => {
    try {
      const res = await fetch(`/api/consignaciones/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivar", admin_id: usuarioId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast("Consignación reactivada y stock asignado de nuevo");
      adminHook.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al reactivar", "err");
    }
  };

  const handleEliminarMayorista = async (m: import("@lib/models").IUsuarioMayorista) => {
    try {
      const res = await fetch(`/api/mayoristas/${m.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(`✓ ${m.nombre ?? "Mayorista"} ya no tiene rol de Mayorista`);
      adminHook.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al quitar mayorista", "err");
    }
  };

  const handleSuspenderMayorista = async (m: import("@lib/models").IUsuarioMayorista, motivo: string) => {
    try {
      const res = await fetch(`/api/mayoristas/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: false, motivo }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(`Cuenta de ${m.nombre ?? "Mayorista"} suspendida. Notificación enviada por email.`);
      adminHook.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al suspender", "err");
    }
  };

  const handleReactivarMayorista = async (m: import("@lib/models").IUsuarioMayorista) => {
    try {
      const res = await fetch(`/api/mayoristas/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(`✓ Cuenta de ${m.nombre ?? "Mayorista"} reactivada`);
      adminHook.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al reactivar", "err");
    }
  };

  // ─── Loading global ────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f4ef]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79]" />
          <p className="text-[#708090] font-medium tracking-widest uppercase text-xs" style={{ fontFamily: "var(--font-marcellus)" }}>Cargando Panel...</p>
        </div>
      </div>
    );
  }

  // ─── Vista Mayorista ───────────────────────────────────────────
  if (isMayorista) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f6f4ef]">
        <SidebarMenu />
        <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
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
      <div className="flex h-screen overflow-hidden bg-[#f6f4ef]">
        <SidebarMenu />

        <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-8">

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-[#B76E79]" />
                  <span 
                    className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium"
                    style={{ fontFamily: "var(--font-marcellus)" }}
                  >
                    Gestión de Consignaciones
                  </span>
                </div>
              </div>

              <TabBar
                active={activeTab}
                onSelect={setActiveTab}
                pendientes={solicitudesHook.pendientes}
              />
            </header>

            {/* Stats (solo en tab consignaciones) */}
            {activeTab === "consignaciones" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <StatsCards {...adminHook.stats} />
              </div>
            )}

            {/* Card principal */}
            <div
              className={`rounded-3xl bg-white p-5 md:p-10 shadow-lg border border-[#8c8976]/30 min-h-[500px] transition-all duration-500 ${activeTab !== 'consignaciones' ? 'mt-4' : ''}`}
            >
              {activeTab === "consignaciones" && (
                <ConsignacionesTable
                  consignaciones={adminHook.consignaciones}
                  loading={adminHook.loading}
                  onNueva={() => { setEditando(null); setModalConsignacion(true); }}
                  onEditar={c => { setEditando(c); setModalConsignacion(true); }}
                  onCancelar={handleCancelar}
                  onReactivar={handleReactivar}
                />
              )}

              {activeTab === "mayoristas" && (
                <MayoristasTable
                  mayoristas={adminHook.mayoristas}
                  consignaciones={adminHook.consignaciones}
                  loading={adminHook.loading}
                  onEliminar={handleEliminarMayorista}
                  onSuspender={handleSuspenderMayorista}
                  onReactivar={handleReactivarMayorista}
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
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-2">
                  <span>⚠️</span> {adminHook.error}
                </div>
              )}
              {activeTab === "solicitudes" && solicitudesHook.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-2">
                  <span>⚠️</span> {solicitudesHook.error}
                </div>
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
            className={`fixed bottom-8 right-8 z-[2000] px-6 py-4 rounded-2xl shadow-xl animate-in slide-in-from-right-10 duration-300 ${
              toast.tipo === "ok" ? "bg-[#1C1C1C] text-white" : "bg-red-600 text-white"
            }`}
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            <div className="flex items-center gap-3">
              <span>{toast.tipo === 'ok' ? '✓' : '✕'}</span>
              <p className="text-sm tracking-wide">{toast.msg}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Acceso no autorizado ──────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ef]">
      <SidebarMenu />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-10 text-center">
        <div className="text-6xl bg-white p-10 rounded-full shadow-sm border border-[#8c8976]/20">🔒</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>Acceso restringido</h2>
          <p className="text-[#8c8976]">No tienes permisos para ver esta sección administrativa.</p>
        </div>
      </main>
    </div>
  );
}
