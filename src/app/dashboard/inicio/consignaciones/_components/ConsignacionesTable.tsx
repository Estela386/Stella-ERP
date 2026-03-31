"use client";

import React, { useState } from "react";
import { IConsignacion, EstadoConsignacion } from "@lib/models";
import {
  Pencil, Ban, Search, Plus,
  ChevronDown, ChevronUp, Clock,
  CalendarDays, Package, User, RotateCcw,
} from "lucide-react";

const BADGE: Record<EstadoConsignacion, { bg: string; color: string; label: string; dot: string }> = {
  activa:     { bg: "rgba(183,110,121,0.1)",  color: "#B76E79", label: "Activa",     dot: "#B76E79" },
  finalizada: { bg: "rgba(112,128,144,0.1)",  color: "#708090", label: "Finalizada", dot: "#708090" },
  cancelada:  { bg: "rgba(192,133,109,0.1)",  color: "#c0856d", label: "Cancelada",  dot: "#c0856d" },
};

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

interface ConsignacionesTableProps {
  consignaciones: IConsignacion[];
  loading: boolean;
  onNueva: () => void;
  onEditar: (c: IConsignacion) => void;
  onCancelar: (c: IConsignacion) => void;
  onReactivar: (c: IConsignacion) => void;
}

export default function ConsignacionesTable({
  consignaciones,
  loading,
  onNueva,
  onEditar,
  onCancelar,
  onReactivar,
}: ConsignacionesTableProps) {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoConsignacion | "todas">("todas");
  const [expandido, setExpandido] = useState<number | null>(null);
  
  const [confirmandoCancelar, setConfirmandoCancelar] = useState<IConsignacion | null>(null);
  const [confirmandoReactivar, setConfirmandoReactivar] = useState<IConsignacion | null>(null);

  const filtradas = consignaciones.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.mayorista?.nombre?.toLowerCase().includes(q) ||
      c.estado.toLowerCase().includes(q) ||
      (c.detalles ?? []).some(d => d.producto?.nombre?.toLowerCase().includes(q));
    const matchEstado = filtroEstado === "todas" || c.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse text-[#8c8976]">
        <div className="h-10 w-10 border-4 border-[#B76E79]/20 border-t-[#B76E79] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Sincronizando Inventario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8976] transition-colors group-focus-within:text-[#b76e79]" size={18} />
          <input
            placeholder="Buscar por mayorista o producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F6F4EF]/50 border border-[#8c8976]/20 focus:outline-none focus:ring-4 focus:ring-[#b76e79]/10 focus:border-[#b76e79] transition-all text-sm font-medium text-[#708090]"
            style={{ fontFamily: "var(--font-poppins)" }}
          />
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={onNueva}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#b76e79] text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#a55a65] transition-all shadow-[0_8px_20px_-6px_rgba(183,110,121,0.4)] active:scale-95"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            <Plus size={16} />
            Nueva Consignación
          </button>
        </div>
      </div>

      {/* ─── FILTROS DE ESTADO ─── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {(["todas", "activa", "finalizada", "cancelada"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltroEstado(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              filtroEstado === f 
                ? "bg-[#708090] text-white shadow-md shadow-[#708090]/20" 
                : "bg-white text-[#8c8976] border border-[#8c8976]/20 hover:bg-[#f6f4ef]"
            }`}
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
          </button>
        ))}
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#8c8976]/20 bg-white shadow-sm transition-all duration-500">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#708090]/5 border-b border-[#8c8976]/20">
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Mayorista</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Periodo</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Items</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>Valor</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-marcellus)" }}>Estado</th>
              <th className="p-5 text-[#708090] font-bold text-[10px] uppercase tracking-widest text-right" style={{ fontFamily: "var(--font-marcellus)" }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8c8976]/10">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center text-[#8c8976] italic text-sm">No se encontraron consignaciones</td>
              </tr>
            ) : (
              filtradas.map(c => {
                const badge = BADGE[c.estado] ?? BADGE.activa;
                const totalItems = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) ?? 0;
                const totalVendidos = c.detalles?.reduce((acc, d) => acc + (d.cantidad_vendida ?? 0), 0) ?? 0;
                const valorM = c.detalles?.reduce((acc, d) => acc + d.cantidad * (d.precio_mayorista ?? 0), 0) ?? 0;
                const isExpanded = expandido === c.id;
                const retraso = c.estado === "activa" ? diasRetraso(c.fecha_fin) : 0;
                const vencida = retraso > 0;

                return (
                  <React.Fragment key={c.id}>
                    <tr className={`hover:bg-[#f6f4ef]/50 transition-colors duration-200 ${isExpanded ? 'bg-[#f6f4ef]/30' : ''}`}>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79]">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-[#708090] text-sm" style={{ fontFamily: "var(--font-marcellus)" }}>{c.mayorista?.nombre ?? "—"}</p>
                            <p className="text-[10px] text-[#8c8976] uppercase tracking-tighter">ID: #{c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col text-[11px] text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>
                          <span className="flex items-center gap-1.5"><CalendarDays size={12} className="text-[#8c8976]" /> {fmt(c.fecha_inicio)}</span>
                          <span className={`flex items-center gap-1.5 mt-0.5 ${vencida ? 'text-red-500 font-bold' : ''}`}>
                            <Clock size={12} className={vencida ? 'text-red-500' : 'text-[#8c8976]'} /> {fmt(c.fecha_fin)}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>{totalItems} <span className="text-[10px] font-normal uppercase opacity-60">uds</span></span>
                          {totalVendidos > 0 && <span className="text-[10px] font-bold text-[#3d8c60] uppercase">-{totalVendidos} vendidos</span>}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-sm font-bold text-[#b76e79]" style={{ fontFamily: "var(--font-poppins)" }}>${valorM.toLocaleString()}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                          style={{ backgroundColor: badge.bg, color: badge.color, borderColor: `${badge.color}20`, fontFamily: "var(--font-poppins)" }}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          {c.estado === "activa" ? (
                             <>
                               <button onClick={() => onEditar(c)} className="p-2.5 rounded-xl bg-[#708090]/10 text-[#708090] hover:bg-[#708090] hover:text-white transition-all shadow-sm">
                                 <Pencil size={14} />
                               </button>
                               <button onClick={() => setConfirmandoCancelar(c)} className="p-2.5 rounded-xl bg-[#c0856d]/10 text-[#c0856d] hover:bg-[#c0856d] hover:text-white transition-all shadow-sm">
                                 <Ban size={14} />
                               </button>
                             </>
                          ) : (
                            <button onClick={() => setConfirmandoReactivar(c)} className="p-2.5 rounded-xl bg-[#3d8c60]/10 text-[#3d8c60] hover:bg-[#3d8c60] hover:text-white transition-all shadow-sm">
                              <RotateCcw size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => setExpandido(isExpanded ? null : c.id)}
                            className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-[#1C1C1C] text-white shadow-md' : 'bg-[#F6F4EF] text-[#8c8976] hover:text-[#708090]'}`}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* DETAILS ROW */}
                    {isExpanded && (
                      <tr className="bg-[#fcfbf9]">
                        <td colSpan={6} className="p-0 overflow-hidden border-b border-[#8c8976]/20">
                          <div className="p-8 animate-in slide-in-from-top-4 duration-300">
                             <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[#708090] mb-2">
                                  <Package size={18} />
                                  <h4 className="font-bold text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-marcellus)" }}>Inventario Consignado</h4>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                   {c.detalles?.map(d => (
                                     <div key={d.id_producto} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#8c8976]/10 shadow-sm">
                                        <div className="flex flex-col">
                                           <span className="font-bold text-sm text-[#708090]" style={{ fontFamily: "var(--font-marcellus)" }}>{d.producto?.nombre}</span>
                                           <span className="text-[10px] text-[#8c8976] uppercase tracking-tighter">SKU: {d.id_producto}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                           <div className="text-right">
                                              <p className="text-[10px] text-[#8c8976] uppercase font-bold tracking-tighter">Precio May.</p>
                                              <p className="text-sm font-bold text-[#B76E79]" style={{ fontFamily: "var(--font-poppins)" }}>${d.precio_mayorista?.toLocaleString()}</p>
                                           </div>
                                           <div className="text-right px-4 border-l border-[#8c8976]/10">
                                              <p className="text-[10px] text-[#8c8976] uppercase font-bold tracking-tighter">Entregado</p>
                                              <p className="text-sm font-bold text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>{d.cantidad} <span className="text-[9px] opacity-40">uds</span></p>
                                           </div>
                                           {(d.cantidad_vendida ?? 0) > 0 && (
                                              <div className="text-right px-4 border-l border-[#8c8976]/10">
                                                <p className="text-[10px] text-[#3d8c60] uppercase font-bold tracking-tighter">Vendidos</p>
                                                <p className="text-sm font-black text-[#3d8c60]" style={{ fontFamily: "var(--font-poppins)" }}>{d.cantidad_vendida}</p>
                                              </div>
                                           )}
                                        </div>
                                     </div>
                                   ))}
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
        {filtradas.length === 0 ? (
          <div className="text-center py-20 text-[#8c8976] italic">No hay resultados</div>
        ) : (
          filtradas.map(c => {
            const badge = BADGE[c.estado] ?? BADGE.activa;
            const isExpanded = expandido === c.id;
            const totalItems = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) ?? 0;
            const valorM = c.detalles?.reduce((acc, d) => acc + d.cantidad * (d.precio_mayorista ?? 0), 0) ?? 0;
            const retraso = c.estado === "activa" ? diasRetraso(c.fecha_fin) : 0;
            const vencida = retraso > 0;

            return (
              <div key={c.id} className={`bg-white rounded-3xl border border-[#8c8976]/20 shadow-sm overflow-hidden transition-all ${vencida ? 'border-red-300 ring-2 ring-red-50' : ''}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79]">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1C1C1C] text-sm leading-tight" style={{ fontFamily: "var(--font-marcellus)" }}>{c.mayorista?.nombre ?? "—"}</span>
                        <span className="text-[9px] text-[#8c8976] uppercase tracking-widest mt-0.5">#{c.id}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                      style={{ backgroundColor: badge.bg, color: badge.color, borderColor: `${badge.color}20` }}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#8c8976]/10 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Items</span>
                      <span className="font-bold text-[#708090] text-sm" style={{ fontFamily: "var(--font-poppins)" }}>{totalItems} unidades</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Vencimiento</span>
                      <span className={`font-bold text-sm ${vencida ? 'text-red-500' : 'text-[#708090]'}`} style={{ fontFamily: "var(--font-poppins)" }}>{fmt(c.fecha_fin)}</span>
                    </div>
                    <div className="flex flex-col col-span-2 pt-2 border-t border-[#8c8976]/5">
                      <p className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5 text-center">Valor Consignado</p>
                      <p className="text-2xl font-black text-[#B76E79] text-center" style={{ fontFamily: "var(--font-poppins)" }}>${valorM.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => setExpandido(isExpanded ? null : c.id)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#F6F4EF] text-[#708090] text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>
                      <Package size={16} />
                      {isExpanded ? "Ocultar Productos" : `Ver ${c.detalles?.length} Productos`}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                       {c.estado === "activa" ? (
                         <>
                           <button onClick={() => onEditar(c)} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#708090] text-white text-[11px] font-bold uppercase" style={{ fontFamily: "var(--font-marcellus)" }}>
                             <Pencil size={14} /> Editar
                           </button>
                           <button onClick={() => setConfirmandoCancelar(c)} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#c0856d] text-white text-[11px] font-bold uppercase" style={{ fontFamily: "var(--font-marcellus)" }}>
                             <Ban size={14} /> Cancelar
                           </button>
                         </>
                       ) : (
                         <button onClick={() => setConfirmandoReactivar(c)} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#3d8c60] text-white text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-marcellus)" }}>
                           <RotateCcw size={14} /> Reactivar Consignación
                         </button>
                       )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-[#FAFAF8] p-5 space-y-3 animate-in fade-in duration-300">
                     {c.detalles?.map(d => (
                       <div key={d.id_producto} className="bg-white p-4 rounded-2xl border border-[#8c8976]/10 flex flex-col gap-1 shadow-sm">
                          <span className="font-bold text-[#1C1C1C] text-sm" style={{ fontFamily: "var(--font-marcellus)" }}>{d.producto?.nombre}</span>
                          <div className="flex justify-between items-end mt-1">
                             <div className="flex flex-col">
                                <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-tighter">Total Entregado</span>
                                <span className="font-bold text-[#708090] text-xs" style={{ fontFamily: "var(--font-poppins)" }}>{d.cantidad} unidades</span>
                             </div>
                             <div className="text-right">
                                <span className="text-[9px] text-[#B76E79] uppercase font-bold tracking-tighter">Precio Mayorista</span>
                                <p className="font-bold text-[#B76E79]" style={{ fontFamily: "var(--font-poppins)" }}>${d.precio_mayorista?.toLocaleString()}</p>
                             </div>
                          </div>
                          {(d.cantidad_vendida ?? 0) > 0 && (
                            <div className="mt-2 pt-2 border-t border-[#8c8976]/5 flex justify-between items-center text-[#3d8c60]">
                               <span className="text-[10px] font-black uppercase">Unidades Vendidas</span>
                               <span className="text-sm font-black" style={{ fontFamily: "var(--font-poppins)" }}>{d.cantidad_vendida}</span>
                            </div>
                          )}
                       </div>
                     ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── MODALES DE CONFIRMACIÓN (PRO) ─── */}
      {confirmandoCancelar && (
        <ConfirmActionModal
          title="Cancelar"
          message={<>¿Deseas cancelar la consignación <strong>#{confirmandoCancelar.id}</strong>? El stock volverá al inventario general.</>}
          confirmText="Sí, cancelar"
          confirmColor="#c0856d"
          icon={Ban}
          onCancel={() => setConfirmandoCancelar(null)}
          onConfirm={() => { onCancelar(confirmandoCancelar); setConfirmandoCancelar(null); }}
        />
      )}

      {confirmandoReactivar && (
        <ConfirmActionModal
          title="Reactivar"
          message={<>¿Volver a activar la consignación <strong>#{confirmandoReactivar.id}</strong>? Se reasignará el stock de inmediato.</>}
          confirmText="Sí, reactivar"
          confirmColor="#3d8c60"
          icon={RotateCcw}
          onCancel={() => setConfirmandoReactivar(null)}
          onConfirm={() => { onReactivar(confirmandoReactivar); setConfirmandoReactivar(null); }}
        />
      )}
    </div>
  );
}

function ConfirmActionModal({ title, message, confirmText, confirmColor, icon: Icon, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#8c8976]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#8c8976]/30">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-[#F6F4EF] flex items-center justify-center shadow-inner"
            style={{ color: confirmColor }}>
            <Icon size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>{title}</h3>
            <p className="text-sm text-[#8c8976] leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>{message}</p>
          </div>
          <div className="flex flex-col w-full gap-3">
             <button onClick={onConfirm} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-[.15em] text-white shadow-xl transition-all" style={{ backgroundColor: confirmColor, fontFamily: "var(--font-marcellus)" }}>
               {confirmText}
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
