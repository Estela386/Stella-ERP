"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Pedido } from "../type";
import { X, ChevronRight, ShoppingBag, Clock, Truck, BadgeDollarSign } from "lucide-react";
import type { Usuario } from "@/lib/models";

type Props = {
  pedidos: Pedido[];
  usuario?: Usuario | null; 
  onStatusChange?: () => void;
};

export default function PedidosTable({ pedidos, usuario, onStatusChange }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async (nuevoEstado: string) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const resp = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, estado: nuevoEstado }),
      });
      if (resp.ok) {
        setSelected({ ...selected, estado: nuevoEstado as Pedido["estado"] });
        if (onStatusChange) onStatusChange();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const idRolUsuario = usuario?.id_rol;

  return (
    <>
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#F8FAFC] text-[#94A3B8] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-5 px-6 font-bold uppercase tracking-widest text-[10px]">ID</th>
                <th className="py-5 font-bold uppercase tracking-widest text-[10px]">Solicitante</th>
                <th className="py-5 hidden lg:table-cell font-bold uppercase tracking-widest text-[10px]">Fecha</th>
                <th className="py-5 font-bold uppercase tracking-widest text-[10px]">Monto Est.</th>
                <th className="py-5 font-bold uppercase tracking-widest text-[10px]">Estado</th>
                <th className="py-5 pr-6 text-right font-bold uppercase tracking-widest text-[10px]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9]">
              {pedidos.map((p) => (
                <tr key={p.id} className="group hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-5 px-6 font-mono text-xs text-[#64748B]">#{p.id}</td>
                  <td className="py-5">
                    <p className="font-bold text-[#1E293B]">{p.usuario?.nombre || "N/A"}</p>
                    <p className="text-[10px] text-[#94A3B8]">Rol: {p.usuario?.id_rol === 3 ? "Mayorista" : "Cliente"}</p>
                  </td>
                  <td className="py-5 hidden lg:table-cell text-[#64748B]">
                    {new Date(p.fecha_pedido).toLocaleDateString()}
                  </td>
                  <td className="py-5 font-black text-[#B76E79]">
                    ${p.total_estimado?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm inline-flex items-center gap-1.5 ${
                      p.estado === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.estado === 'PENDIENTE' ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`} />
                      {p.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-5 pr-6 text-right">
                    <button
                      onClick={() => setSelected(p)}
                      className="px-5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold hover:bg-[#B76E79] hover:text-white hover:border-[#B76E79] transition-all shadow-sm"
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-[#F8FAFC] rounded-2xl p-5 border border-black/5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#64748B]">#{p.id}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                  p.estado === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {p.estado.replace("_", " ")}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[#1E293B]">{p.usuario?.nombre || "N/A"}</p>
                <p className="text-xs text-[#94A3B8]">{new Date(p.fecha_pedido).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black text-[#B76E79]">${p.total_estimado?.toFixed(2) || "0.00"}</span>
                <button
                  onClick={() => setSelected(p)}
                  className="px-4 py-2 rounded-xl bg-[#B76E79] text-white text-[10px] font-bold shadow-lg shadow-[#B76E79]/20"
                >
                  Ver pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-[#F1F5F9] flex justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#B76E79] border border-black/5">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1E293B]" style={{ fontFamily: "var(--font-marcellus)" }}>Pedido #{selected.id}</h2>
                  <p className="text-xs text-[#94A3B8] font-medium font-sans uppercase tracking-[0.2em]">{new Date(selected.fecha_pedido).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="w-10 h-10 rounded-2xl bg-[#F8FAFC] hover:bg-red-50 text-[#94A3B8] hover:text-red-400 transition-colors flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-black/5">
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Solicitante</p>
                  <p className="font-bold text-[#1E293B] truncate">{selected.usuario?.nombre || "N/A"}</p>
                </div>
                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-black/5">
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Total Estimado</p>
                  <p className="font-bold text-[#10B981] text-xl font-mono">${selected.total_estimado?.toFixed(2)}</p>
                </div>
                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-black/5 lg:col-span-2">
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Estado del Pedido</p>
                  {idRolUsuario === 1 ? (
                    <div className="relative group">
                      <select 
                        value={selected.estado} 
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        disabled={updating}
                        className="w-full appearance-none bg-white border border-[#E2E8F0] p-2.5 rounded-xl text-xs font-bold text-[#1E293B] outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all cursor-pointer"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_PRODUCCION">EN PRODUCCIÓN</option>
                        <option value="EN_TALLER">EN TALLER</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] group-hover:text-[#B76E79] transition-colors rotate-90" size={14} />
                    </div>
                  ) : (
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase inline-block ${
                      selected.estado === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {selected.estado.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>

              {selected.observaciones && (
                <div className="bg-[#FFFBEB] border border-amber-200/50 p-5 rounded-2xl flex items-start gap-4">
                  <Clock className="text-amber-500 shrink-0" size={20} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Observaciones</p>
                    <p className="text-sm text-amber-900 leading-relaxed">{selected.observaciones}</p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#F1F5F9] rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                  <h3 className="text-sm font-bold text-[#1E293B]" style={{ fontFamily: "var(--font-marcellus)" }}>Artículos en el pedido</h3>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Item</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-center">Cant.</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {selected.detalles?.map((det, i) => (
                      <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-[#1E293B]">{det.producto?.nombre || "Producto retirado"}</p>
                          {det.personalizacion && Object.keys(det.personalizacion).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {Object.entries(det.personalizacion || {}).map(([key, val]) => {
                                const valStr = String(val);
                                const hasPipe = valStr.includes('|');
                                const [name, colorHex] = hasPipe ? valStr.split('|') : [valStr, ''];
                                const isColor = hasPipe && colorHex.startsWith('#');
                                
                                return (
                                  <span key={key} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-black/5 rounded-lg text-[10px] font-bold text-[#64748B] shadow-sm">
                                    <span className="text-[#94A3B8] font-medium">{key}:</span>
                                    {isColor && (
                                        <span className="w-2.5 h-2.5 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: colorHex }} />
                                    )}
                                    {name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center justify-center bg-[#F1F5F9] text-[#475569] font-black text-xs px-3 py-1 rounded-xl">
                            {det.cantidad}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-sm font-black text-[#1E293B]">${det.subtotal?.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 backdrop-blur-sm flex flex-wrap items-center justify-end gap-4">
              {idRolUsuario === 1 && (
                <>
                  <button
                    onClick={() => router.push(`/dashboard/inicio/nuevaVenta?pedidoId=${selected.id}`)}
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-200/50 hover:shadow-emerald-300/60 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                  >
                    <BadgeDollarSign size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>Convertir a Venta</span>
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/inicio/consignaciones?pedidoId=${selected.id}`)}
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#B76E79] to-[#8C525A] text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-200/50 hover:shadow-rose-300/60 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                  >
                    <Truck size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span>Enviar a Consignación</span>
                  </button>
                </>
              )}
              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
              <button 
                onClick={() => setSelected(null)}
                className="px-8 py-3.5 bg-white border border-slate-200 text-[#1E293B] rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #B76E79;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}