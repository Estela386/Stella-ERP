"use client";

import React, { useState } from "react";
import { ISolicitudMayorista } from "@lib/models";
import {
  CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp,
  Mail, CalendarDays, UserPlus,
  ShieldCheck, ShieldX,
} from "lucide-react";

interface SolicitudesTableProps {
  solicitudes: ISolicitudMayorista[];
  loading: boolean;
  onAprobar: (s: ISolicitudMayorista) => void;
  onRechazar: (s: ISolicitudMayorista) => void;
}

function fmt(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function SolicitudesTable({
  solicitudes,
  loading,
  onAprobar,
  onRechazar,
}: SolicitudesTableProps) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [confirmando, setConfirmando] = useState<{ s: ISolicitudMayorista, action: 'aprobar' | 'rechazar' } | null>(null);

  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const procesadas = solicitudes.filter(s => s.estado !== "pendiente");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse text-[#8c8976]">
        <div className="h-10 w-10 border-4 border-[#B76E79]/20 border-t-[#B76E79] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Revisando Solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── PENDIENTES ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
            <Clock size={18} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>
            Solicitudes por Procesar
          </h3>
          {pendientes.length > 0 && (
            <span className="bg-amber-500 text-white rounded-full px-2 py-0.5 text-[10px] font-black animate-bounce shadow-sm">
              {pendientes.length}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-[2rem] p-10 flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                <CheckCircle size={32} />
             </div>
             <p className="font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>Bandeja de Entrada Limpia</p>
             <p className="text-sm text-[#8c8976] max-w-xs font-poppins">No hay nuevas aplicaciones de mayoristas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendientes.map(s => (
              <div key={s.id} className="bg-white rounded-[2rem] border border-amber-200 shadow-xl shadow-amber-900/5 overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-2xl duration-300">
                <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
                <div className="p-6 space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                           <UserPlus size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1C1C] text-lg leading-tight font-marcellus">{s.usuario?.nombre}</p>
                          <p className="text-xs text-[#8c8976] flex items-center gap-1 font-poppins"><Mail size={12} /> {s.usuario?.correo}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8c8976] font-bold uppercase tracking-tighter flex items-center gap-1 font-poppins"><CalendarDays size={12} /> {fmt(s.fecha_solicitud)}</span>
                   </div>

                   {s.mensaje && (
                     <div className="bg-[#F6F4EF] p-4 rounded-2xl border-l-4 border-amber-400">
                        <p className="text-sm text-[#708090] italic font-poppins leading-relaxed">"{s.mensaje}"</p>
                     </div>
                   )}

                   <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setConfirmando({ s, action: 'aprobar' })}
                        className="flex-1 py-3 bg-[#10b981] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 transition-all font-marcellus active:scale-95"
                      >
                         Aprobar
                      </button>
                      <button 
                        onClick={() => setConfirmando({ s, action: 'rechazar' })}
                        className="px-6 py-3 bg-[#f6f4ef] text-[#ef4444] rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all font-marcellus active:scale-95 border border-red-100"
                      >
                         Rechazar
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── HISTORIAL ─── */}
      {procesadas.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setMostrarHistorial(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F6F4EF] hover:bg-[#EFEBE5] rounded-xl transition-all border border-[#8c8976]/10"
          >
            {mostrarHistorial ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#708090]" style={{ fontFamily: "var(--font-marcellus)" }}>
              {mostrarHistorial ? "Ocultar Historial" : `Ver Historial (${procesadas.length})`}
            </span>
          </button>

          {mostrarHistorial && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-500">
              {procesadas.map(s => {
                const aprobado = s.estado === "aprobada";
                return (
                  <div key={s.id} className="bg-white border border-[#8c8976]/10 p-4 rounded-2xl flex items-center gap-4 transition-colors hover:bg-slate-50 shadow-sm">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${aprobado ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                       {aprobado ? <ShieldCheck size={20} /> : <ShieldX size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-[#1C1C1C] text-sm truncate font-marcellus">{s.usuario?.nombre}</p>
                       <p className="text-[10px] text-[#8c8976] font-poppins">{fmt(s.fecha_respuesta ?? s.fecha_solicitud)}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${aprobado ? 'text-emerald-700' : 'text-red-700'}`}>
                      {s.estado}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL DE CONFIRMACIÓN ─── */}
      {confirmando && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#8c8976]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={e => e.target === e.currentTarget && setConfirmando(null)}>
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#8c8976]/30">
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${confirmando.action === 'aprobar' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {confirmando.action === 'aprobar' ? <ShieldCheck size={32} /> : <ShieldX size={32} />}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>
                  {confirmando.action === 'aprobar' ? 'Confirmar Socio' : 'Rechazar Solicitud'}
                </h3>
                <p className="text-sm text-[#8c8976] leading-relaxed font-poppins">
                  ¿Deseas {confirmando.action === 'aprobar' ? 'aprobar' : 'rechazar'} la solicitud de <strong>{confirmando.s.usuario?.nombre}</strong>?
                </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                 <button 
                   onClick={() => {
                     if (confirmando.action === 'aprobar') onAprobar(confirmando.s);
                     else onRechazar(confirmando.s);
                     setConfirmando(null);
                   }}
                   className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-white shadow-xl transition-all active:scale-95 font-marcellus ${confirmando.action === 'aprobar' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-red-600 shadow-red-900/20'}`}
                 >
                   Confirmar {confirmando.action}
                 </button>
                 <button onClick={() => setConfirmando(null)} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-[#8c8976] hover:bg-[#F6F4EF] transition-all font-marcellus">
                   Descartar
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
