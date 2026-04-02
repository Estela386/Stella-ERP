"use client";

import React, { useState } from "react";
import { IUsuarioMayorista, IConsignacion } from "@lib/models";
import {
  UserCheck, Search, Mail,
  ChevronDown, ChevronUp, AlertTriangle, Package,
  Trash2, ShieldOff, ShieldCheck,
} from "lucide-react";

interface MayoristasTableProps {
  mayoristas: IUsuarioMayorista[];
  consignaciones: IConsignacion[];
  loading: boolean;
  onEliminar: (m: IUsuarioMayorista) => void;
  onSuspender: (m: IUsuarioMayorista, motivo: string) => Promise<void>;
  onReactivar: (m: IUsuarioMayorista) => Promise<void>;
}

function fmt(date: string) {
  if (!date) return "—";
  const raw = date.split("T")[0];
  return new Date(raw + "T12:00:00Z").toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Mexico_City",
  });
}

function diasRetraso(fechaFin: string): number {
  if (!fechaFin) return 0;
  const fin = new Date(fechaFin.split("T")[0] + "T12:00:00Z");
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  return Math.floor((hoy.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MayoristasTable({ 
  mayoristas, 
  consignaciones, 
  loading, 
  onEliminar, 
  onSuspender, 
  onReactivar 
}: MayoristasTableProps) {
  const [search, setSearch] = useState("");
  const [expandido, setExpandido] = useState<string | number | null>(null);
  const [confirmando, setConfirmando] = useState<IUsuarioMayorista | null>(null);
  const [suspendiendo, setSuspendiendo] = useState<IUsuarioMayorista | null>(null);
  const [suspLoading, setSuspLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const filtrados = mayoristas.filter(m => {
    const q = search.toLowerCase();
    return m.nombre?.toLowerCase().includes(q) || m.correo?.toLowerCase().includes(q);
  });

  const handleConfirmarEliminar = async () => {
    if (!confirmando) return;
    setDelLoading(true);
    await onEliminar(confirmando);
    setDelLoading(false);
    setConfirmando(null);
  };

  const handleConfirmarSuspender = async (motivo: string) => {
    if (!suspendiendo) return;
    setSuspLoading(true);
    await onSuspender(suspendiendo, motivo);
    setSuspLoading(false);
    setSuspendiendo(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse text-[#8c8976]">
        <div className="h-10 w-10 border-4 border-[#B76E79]/20 border-t-[#B76E79] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Cargando Red de Mayoristas...</p>
      </div>
    );
  }

  const mConRetraso = mayoristas.filter(m =>
    consignaciones.some(c =>
      c.id_mayorista === m.id && c.estado === "activa" && diasRetraso(c.fecha_fin) > 0
    )
  );

  return (
    <div className="space-y-6">
      {/* ─── ALERTAS GLOBALES ─── */}
      {mConRetraso.length > 0 && (
        <div className="flex items-center gap-4 bg-red-50 border border-red-200/50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 shadow-sm">
             <AlertTriangle size={20} />
           </div>
           <p className="text-sm font-bold text-red-700" style={{ fontFamily: "var(--font-marcellus)" }}>
             {mConRetraso.length} mayorista{mConRetraso.length > 1 ? "s" : ""} con consignaciones vencidas
           </p>
        </div>
      )}

      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/group text-[#8c8976] transition-colors group-focus-within:text-[#b76e79]" size={18} />
          <input
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F6F3EF]/50 border border-[#8c8976]/20 focus:outline-none focus:ring-4 focus:ring-[#b76e79]/10 focus:border-[#b76e79] transition-all text-sm font-medium text-[#708090]"
            style={{ fontFamily: "var(--font-poppins)" }}
          />
        </div>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#8c8976]/20 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#708090]/5 border-b border-[#8c8976]/20">
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Mayorista</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-marcellus)" }}>Consignaciones</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-marcellus)" }}>Estado</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest text-right" style={{ fontFamily: "var(--font-marcellus)" }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8c8976]/10">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-[#8c8976] italic text-sm">No hay resultados</td>
              </tr>
            ) : (
              filtrados.map(m => {
                const cMayorista = consignaciones.filter(c => c.id_mayorista === m.id);
                const activas = cMayorista.filter(c => c.estado === "activa");
                const conRetraso = activas.filter(c => diasRetraso(c.fecha_fin) > 0);
                const isExpanded = expandido === m.id;

                return (
                  <React.Fragment key={m.id}>
                    <tr className={`hover:bg-[#f6f4ef]/50 transition-colors ${isExpanded ? 'bg-[#f6f4ef]/30' : ''} ${conRetraso.length > 0 ? 'bg-red-50/20' : ''}`}>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79] shadow-sm">
                              <UserCheck size={18} />
                           </div>
                           <div>
                             <p className="font-bold text-[#1C1C1C] text-sm" style={{ fontFamily: "var(--font-marcellus)" }}>{m.nombre ?? "—"}</p>
                             <p className="text-[10px] text-[#8c8976] flex items-center gap-1"><Mail size={10} /> {m.correo}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                         <div className="flex flex-col items-center gap-1">
                           <span className="text-sm font-bold text-[#708090]">{activas.length} Activas</span>
                           {conRetraso.length > 0 && (
                             <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">
                               {conRetraso.length} vencidas
                             </span>
                           )}
                         </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          m.activo 
                            ? "bg-[#B76E79]/10 text-[#B76E79] border-[#B76E79]/20" 
                            : "bg-[#708090]/10 text-[#708090] border-[#708090]/20"
                        }`} style={{ fontFamily: "var(--font-poppins)" }}>
                          {m.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => m.activo ? setSuspendiendo(m) : onReactivar(m)} 
                             className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                m.activo 
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white" 
                                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                             }`} title={m.activo ? "Suspender cuenta" : "Reactivar cuenta"}>
                             {m.activo ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                           </button>
                           <button onClick={() => setConfirmando(m)} className="p-2.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Quitar mayorista">
                             <Trash2 size={14} />
                           </button>
                           {cMayorista.length > 0 && (
                             <button onClick={() => setExpandido(isExpanded ? null : m.id)} className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-[#1C1C1C] text-white' : 'bg-[#F6F4EF] text-[#8c8976]'}`}>
                               {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-[#fcfbf9]">
                        <td colSpan={4} className="p-0 overflow-hidden border-b border-[#8c8976]/20">
                          <div className="p-8 animate-in slide-in-from-top-4 duration-300">
                             <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[#708090] mb-2 uppercase tracking-[0.2em] font-bold text-[10px]" style={{ fontFamily: "var(--font-marcellus)" }}>
                                  <Package size={16} /> Consignaciones del Socio
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                   {cMayorista.map(c => {
                                      const retraso = diasRetraso(c.fecha_fin);
                                      const vencida = c.estado === "activa" && retraso > 0;
                                      return (
                                        <div key={c.id} className={`flex justify-between items-center p-4 bg-white rounded-2xl border transition-all ${vencida ? 'border-red-300 shadow-red-50 shadow-sm' : 'border-[#8c8976]/10'}`}>
                                           <div className="flex flex-col">
                                              <span className="font-bold text-sm text-[#708090]" style={{ fontFamily: "var(--font-marcellus)" }}>Consig. #{c.id}</span>
                                              <span className="text-[10px] text-[#8c8976] uppercase tracking-tighter tabular-nums">{fmt(c.fecha_inicio)} → {fmt(c.fecha_fin)}</span>
                                           </div>
                                           <div className="text-right">
                                              {vencida ? (
                                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{retraso} días retraso</span>
                                              ) : (
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${c.estado === 'activa' ? 'text-emerald-600' : 'text-[#708090]'}`}>{c.estado}</span>
                                              )}
                                           </div>
                                        </div>
                                      );
                                   })}
                                </div>
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── MOBILE EXPERIENCE ─── */}
      <div className="md:hidden space-y-4 pb-10">
        {filtrados.map(m => {
          const cMayorista = consignaciones.filter(c => c.id_mayorista === m.id);
          const activas = cMayorista.filter(c => c.estado === "activa");
          const conRetraso = activas.filter(c => diasRetraso(c.fecha_fin) > 0);
          const isExpanded = expandido === m.id;

          return (
            <div key={m.id} className={`bg-white rounded-3xl border border-[#8c8976]/20 shadow-sm overflow-hidden transition-all ${conRetraso.length > 0 ? 'border-red-300 ring-2 ring-red-50' : ''}`}>
              <div className="p-5">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79]">
                          <UserCheck size={18} />
                       </div>
                       <div className="flex flex-col">
                         <span className="font-bold text-[#1C1C1C] text-sm leading-tight uppercase font-marcellus">{m.nombre}</span>
                         <span className="text-[10px] text-[#8c8976]">{m.correo}</span>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${m.activo ? 'bg-[#B76E79]/10 text-[#B76E79]' : 'bg-[#708090]/10 text-[#708090]'}`}>
                      {m.activo ? "Activo" : "Suspendido"}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#8c8976]/10 mb-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Activas</span>
                       <span className="font-bold text-[#708090] text-sm font-poppins">{activas.length} consignaciones</span>
                    </div>
                    <div className="flex flex-col text-right">
                       <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Problemas</span>
                       <span className={`font-bold text-sm ${conRetraso.length > 0 ? 'text-red-500' : 'text-[#3d8c60]'} font-poppins`}>{conRetraso.length > 0 ? `${conRetraso.length} vencidas` : 'Ninguno'}</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                    <button onClick={() => setExpandido(isExpanded ? null : m.id)} className="w-full py-3 rounded-2xl bg-[#F6F4EF] text-[#708090] text-[11px] font-bold uppercase tracking-widest font-marcellus">
                       {isExpanded ? "Ocultar Historial" : `Ver Historial (${cMayorista.length})`}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => m.activo ? setSuspendiendo(m) : onReactivar(m)} 
                          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold uppercase ${m.activo ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} font-marcellus`}>
                          {m.activo ? <ShieldOff size={14} /> : <ShieldCheck size={14} />} 
                          {m.activo ? "Suspender" : "Reactivar"}
                       </button>
                       <button onClick={() => setConfirmando(m)} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-100 text-red-700 text-[11px] font-bold uppercase font-marcellus">
                          <Trash2 size={14} /> Quitar
                       </button>
                    </div>
                 </div>
              </div>

              {isExpanded && (
                <div className="bg-[#FAFAF8] p-5 space-y-2 animate-in fade-in duration-300 border-t border-[#8c8976]/10">
                   {cMayorista.map(c => {
                      const dist = diasRetraso(c.fecha_fin);
                      const isVencida = c.estado === "activa" && dist > 0;
                      return (
                        <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#8c8976]/10 flex justify-between items-center shadow-sm">
                           <div className="flex flex-col">
                              <span className="font-bold text-[#1C1C1C] text-[11px] font-marcellus">ID: #{c.id}</span>
                              <span className="text-[10px] text-[#8c8976]">{fmt(c.fecha_fin)}</span>
                           </div>
                           <span className={`text-[10px] font-black uppercase ${isVencida ? 'text-red-500' : 'text-[#708090]'}`}>
                              {isVencida ? `${dist} DÍAS RETRASO` : c.estado}
                           </span>
                        </div>
                      );
                   })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── MODALES PRO ─── */}
      {confirmando && (
        <ConfirmActionModal
          title="Quitar Rol"
          message={<>¿Deseas quitar el rol de mayorista a <strong>{confirmando.nombre}</strong>? La cuenta volverá a ser Cliente.</>}
          confirmText="Sí, quitar rol"
          confirmColor="#ef4444"
          icon={Trash2}
          onCancel={() => setConfirmando(null)}
          onConfirm={handleConfirmarEliminar}
          loading={delLoading}
        />
      )}

      {suspendiendo && (
        <SuspendActionModal
          mayorista={suspendiendo}
          onCancel={() => setSuspendiendo(null)}
          onConfirm={handleConfirmarSuspender}
          loading={suspLoading}
        />
      )}
    </div>
  );
}

// Subcomponente de Modal para Suspender con Motivo
function SuspendActionModal({ mayorista, onConfirm, onCancel, loading }: { 
  mayorista: IUsuarioMayorista;
  onConfirm: (motivo: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [motivo, setMotivo] = useState("");
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#8c8976]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#8c8976]/30">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                <ShieldOff size={28} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>Suspender Socio</h3>
               <p className="text-[10px] text-[#8c8976] uppercase font-bold tracking-widest mt-0.5">Acción Preventiva</p>
             </div>
          </div>
          
          <p className="text-sm text-[#8c8976] leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
            Explica brevemente el motivo para <strong>{mayorista.nombre}</strong>. Se incluirá en la notificación.
          </p>

          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Ej: Retraso en liquidaciones..."
            className="w-full p-4 rounded-2xl bg-[#F6F4EF] border border-[#8c8976]/20 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm font-medium resize-none"
            rows={3}
            style={{ fontFamily: "var(--font-poppins)" }}
          />

          <div className="flex flex-col w-full gap-3">
             <button onClick={() => onConfirm(motivo)} disabled={loading} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-white bg-amber-600 shadow-xl shadow-amber-600/20 active:scale-95 transition-all disabled:opacity-50" style={{ fontFamily: "var(--font-marcellus)" }}>
               {loading ? "Procesando..." : "Confirmar Suspensión"}
             </button>
             <button onClick={onCancel} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-[#8c8976] hover:bg-[#F6F4EF] transition-all" style={{ fontFamily: "var(--font-marcellus)" }}>
               Descartar
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmActionModal({ title, message, confirmText, confirmColor, icon: Icon, onConfirm, onCancel, loading }: {
  title: string;
  message: React.ReactNode;
  confirmText: string;
  confirmColor: string;
  icon: React.ElementType;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#8c8976]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#8c8976]/30">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-[#F6F4EF] flex items-center justify-center shadow-inner" style={{ color: confirmColor }}>
            <Icon size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>{title}</h3>
            <p className="text-sm text-[#8c8976] leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>{message}</p>
          </div>
          <div className="flex flex-col w-full gap-3">
             <button onClick={onConfirm} disabled={loading} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-white shadow-xl transition-all disabled:opacity-50" style={{ backgroundColor: confirmColor, fontFamily: "var(--font-marcellus)" }}>
               {loading ? "Eliminando..." : confirmText}
             </button>
             <button onClick={onCancel} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-[#8c8976] hover:bg-[#F6F4EF] transition-all" style={{ fontFamily: "var(--font-marcellus)" }}>
               Descartar
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
