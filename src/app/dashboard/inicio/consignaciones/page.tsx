"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import Skeleton from "@/app/_components/ui/Skeleton";
import { motion } from "framer-motion";

function ConsignacionHydrator({ isAdmin, onTrigger }: { isAdmin: boolean, onTrigger: (id: string) => void }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("pedidoId");

  useEffect(() => {
    if (isAdmin && id) {
      onTrigger(id);
    }
  }, [id, isAdmin]);

  return null;
}

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

  const [pedidoDeURL, setPedidoDeURL] = useState<string | null>(null);

  // La hidratación de URL ahora la controla ConsignacionHydrator

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
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--beige)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 1200, padding: 40 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
             <Skeleton width={150} height={40} borderRadius={12} />
             <div className="flex-1" />
             <Skeleton width={100} height={32} borderRadius={10} />
             <Skeleton width={100} height={32} borderRadius={10} />
             <Skeleton width={100} height={32} borderRadius={10} />
           </div>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
             <Skeleton height={140} borderRadius={24} />
             <Skeleton height={140} borderRadius={24} />
             <Skeleton height={140} borderRadius={24} />
           </div>
           <Skeleton height={500} borderRadius={24} />
        </div>
      </div>
    );
  }

  // ─── Vista Mayorista ───────────────────────────────────────────
  if (isMayorista) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
        <SidebarMenu />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
          <div className="mx-auto max-w-[1440px]">
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
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
        <SidebarMenu />

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
          <div className="mx-auto max-w-[1440px] space-y-8">

            <Suspense fallback={null}>
              <ConsignacionHydrator 
                 isAdmin={isAdmin} 
                 onTrigger={(id) => {
                   setPedidoDeURL(id);
                   setModalConsignacion(true);
                 }} 
              />
            </Suspense>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12" style={{ background: "var(--rose-gold)" }} />
                  <span 
                    className="text-xs tracking-[0.4em] uppercase font-medium"
                    style={{ fontFamily: "var(--font-marcellus)", color: "var(--rose-gold)" }}
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
              className={`rounded-3xl p-5 md:p-10 border transition-all duration-500 ${activeTab !== 'consignaciones' ? 'mt-4' : ''}`}
              style={{
                background: "var(--white)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-md)",
                minHeight: 500
              }}
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
          onClose={() => { setModalConsignacion(false); setEditando(null); setPedidoDeURL(null); }}
          onSuccess={() => adminHook.reload()}
          mayoristas={adminHook.mayoristas}
          adminId={usuarioId ?? 0}
          editando={editando}
          pedidoBaseId={pedidoDeURL}
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
            style={{ 
              fontFamily: "var(--font-sans)", 
              borderRadius: "var(--radius-lg)",
              border: toast.tipo === "ok" ? "1px solid rgba(255,255,255,0.1)" : "none"
            }}
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
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-10 text-center" style={{ background: "var(--beige)" }}>
        <div 
          className="text-6xl p-10 rounded-full border"
          style={{
            background: "var(--white)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          🔒
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-marcellus)", color: "var(--charcoal)" }}>Acceso restringido</h2>
          <p style={{ color: "var(--slate-light)" }}>No tienes permisos para ver esta sección administrativa.</p>
        </div>
      </main>
    </div>
  );
}
