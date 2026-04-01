"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pedido } from "../type";

type Props = {
  pedidos: Pedido[];
  usuario?: any;
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
        setSelected({ ...selected, estado: nuevoEstado as any });
        if (onStatusChange) onStatusChange();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* CONTENEDOR */}
      <div className="bg-white rounded-2xl border border-[#8C9796]/30 shadow-md shadow-[#8C9796]/20 overflow-hidden">

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block">
          <table className="w-full table-fixed text-sm text-left border-collapse">
            
            {/* HEADER */}
            <thead className="bg-[#F6F4EF] text-[#708090] border-b border-[#8C9796]/40">
              <tr>
                <th className="py-4 px-4 w-[70px]">ID</th>
                <th className="w-[160px]">Solicitante</th>
                <th className="hidden lg:table-cell w-[120px]">Fecha</th>
                <th className="w-[130px]">Monto</th>
                <th className="w-[130px]">Estado</th>
                <th className="w-[150px] pr-4">Acciones</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {pedidos.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#8C9796]/20 text-[#708090] hover:bg-[#F6F4EF] transition"
                >
                  <td className="py-4 px-4 font-semibold">{p.id}</td>
                  <td className="truncate">{p.usuario?.nombre || "N/A"}</td>
                  <td className="hidden lg:table-cell">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                  <td className="font-medium text-[#B76E79]">${p.total_estimado?.toFixed(2) || "0.00"}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide shadow-sm ${
                      p.estado === 'PENDIENTE' ? 'bg-[#B76E79] text-white' : 'bg-[#708090] text-white'
                    }`}>
                      {p.estado.replace("_", " ")}
                    </span>
                  </td>

                  <td className="pr-4">
                    <button
                      onClick={() => setSelected(p)}
                      className="px-4 py-1.5 rounded-full bg-[#B76E79] text-[#F6F4EF] text-sm font-medium shadow-md shadow-[#8C9796]/40 hover:bg-[#A45F69] transition"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4 p-4">
          {pedidos.map((p) => (
            <div
              key={p.id}
              className="bg-[#F6F4EF] rounded-xl p-4 border border-[#8C9796]/25 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#708090]">{p.id}</span>

                <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide shadow-sm ${
                  p.estado === 'PENDIENTE' ? 'bg-[#B76E79] text-white' : 'bg-[#708090] text-white'
                }`}>
                  {p.estado.replace("_", " ")}
                </span>
              </div>

              <p className="text-[#708090] text-sm">
                <b>Solicitante:</b> {p.usuario?.nombre || "N/A"}
              </p>

              <p className="text-[#708090] text-sm">
                <b>Fecha:</b> {new Date(p.fecha_pedido).toLocaleDateString()}
              </p>

              <div className="flex justify-between items-center pt-2">
                <span className="bg-[#B76E79] text-[#F6F4EF] px-3 py-1 rounded-lg text-xs font-bold">
                  Total: ${p.total_estimado?.toFixed(2) || "0.00"}
                </span>

                <button
                  onClick={() => setSelected(p)}
                  className="px-4 py-1.5 rounded-full bg-[#B76E79] text-[#F6F4EF] text-sm font-medium shadow-md shadow-[#8C9796]/40 hover:bg-[#A45F69] transition"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
  <div className="fixed inset-0 z-[999] bg-[#1C1C1CB3] backdrop-blur-[6px] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
    
    {/* CONTENEDOR */}
    <div className="bg-[#F8FAFC] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-[0_40px_90px_-15px_rgba(0,0,0,0.5)] border border-white/20 animate-in zoom-in-95 duration-200">

      {/* ===== HEADER ELEGANTE ===== */}
      <div className="bg-white px-8 py-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#94A3B8] mb-1 font-sans">
            Información de la Solicitud
          </p>
          <h2 className="text-2xl md:text-3xl text-[#1C1C1C]" style={{ fontFamily: "var(--font-marcellus)" }}>
            Pedido #{selected.id}
          </h2>
        </div>

        <button
          onClick={() => setSelected(null)}
          className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-colors"
          title="Cerrar modal"
        >
          <span className="text-lg leading-none mt-[-2px]">✕</span>
        </button>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">

        {/* INFO CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8] mb-1">Solicitante</span>
            <span className="font-semibold text-[#334155] text-sm overflow-hidden text-ellipsis whitespace-nowrap">{selected.usuario?.nombre || "N/A"}</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8] mb-1">Fecha</span>
            <span className="font-semibold text-[#334155] text-sm">{new Date(selected.fecha_pedido).toLocaleDateString()}</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8] mb-1">Monto Estimado</span>
            <span className="font-semibold text-[#10B981] text-lg font-mono tracking-tight">${selected.total_estimado?.toFixed(2) || "0.00"}</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-center items-start">
             <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8] mb-2">Estado Inmediato</span>
             {usuario?.id_rol === 1 ? (
                <div className="w-full relative">
                  <select 
                    value={selected.estado} 
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updating}
                    className="w-full appearance-none bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold tracking-wide px-3 py-2 rounded-xl outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] cursor-pointer disabled:opacity-50 transition"
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_PRODUCCION">EN PRODUCCIÓN</option>
                    <option value="EN_TALLER">EN TALLER</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#64748B]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              ) : (
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest inline-block ${
                  selected.estado === 'PENDIENTE' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#E0F2FE] text-[#0369A1]'
                }`}>
                  {selected.estado.replace("_", " ")}
                </span>
              )}
          </div>
        
        </div>

        {/* OBSERVACIONES ALERT (if any) */}
        {selected.observaciones && selected.observaciones.trim() !== "" && (
          <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-5 shadow-sm">
             <span className="text-[10px] uppercase tracking-widest font-bold text-[#D97706] mb-1 block">Notas / Observaciones</span>
             <p className="text-sm text-[#92400E] leading-relaxed">{selected.observaciones}</p>
          </div>
        )}

        {/* ===== TABLA PRODUCTOS ===== */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden">
          
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="text-sm font-semibold text-[#334155] tracking-wide" style={{ fontFamily: "var(--font-marcellus)" }}>
              Artículos Solicitados ({selected.detalles?.length || 0})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FFFFFF] border-b border-[#F1F5F9]">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest">ID</th>
                  <th className="px-6 py-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest">Producto</th>
                  <th className="px-6 py-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest text-center">Cantidad</th>
                  <th className="px-6 py-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {selected.detalles?.map((det, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-[#64748B]">
                      #{det.id_producto}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#1E293B]">
                        {det.producto?.nombre || "Producto retirado del catálogo"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-[#F1F5F9] text-[#475569] font-bold text-xs h-7 min-w-[28px] px-2 rounded-lg">
                        {det.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: "var(--font-marcellus)" }}>
                        ${det.subtotal?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ===== PIE DE ACCIONES ===== */}
      <div className="bg-white px-6 py-5 border-t border-[#E2E8F0] sm:flex sm:items-center sm:justify-between shrink-0">
        
        {/* Acciones principales - Izquierda */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4 sm:mb-0">
          {usuario?.id_rol === 1 && (
            <>
              <button
                onClick={() => router.push(`/dashboard/inicio/nuevaVenta?pedidoId=${selected.id}`)}
                className="group relative px-6 py-2.5 rounded-xl bg-white border-2 border-[#B76E79] text-[#B76E79] text-sm font-bold shadow-sm hover:bg-[#B76E79] hover:text-white transition-all overflow-hidden"
              >
                <div className="absolute inset-0 w-0 bg-[#B76E79] transition-all duration-300 ease-out group-hover:w-full opacity-10"></div>
                <span className="relative">Generar Venta POS</span>
              </button>
              
              {selected.usuario?.id_rol === 3 && (
                <button
                  onClick={() => router.push(`/dashboard/inicio/consignaciones?pedidoId=${selected.id}`)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold shadow-md hover:bg-[#1E293B] transition-all transform hover:-translate-y-0.5"
                >
                  Mover a Consignación
                </button>
              )}
            </>
          )}
        </div>

        {/* Cerrar - Derecha */}
        <button
          onClick={() => setSelected(null)}
          className="px-8 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#475569] text-sm font-bold shadow-sm hover:bg-[#F1F5F9] transition-colors w-full sm:w-auto"
        >
          Cerrar Vista
        </button>

      </div>

    </div>
  </div>
)}

      {/* EMPTY STATE */}
      {pedidos.length === 0 && (
        <p className="text-center py-6 text-[#8C9796]">
          No hay pedidos con este filtro
        </p>
      )}
    </>
  );
}

/* INPUT COMPONENTE */
function Input({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-[#8C9796]">{label}</p>
      <input
        value={value}
        readOnly
        className="w-full bg-[#F6F4EF] border border-[#8C9796]/30 rounded-lg px-3 py-2 text-[#708090] font-medium"
      />
    </div>
  );
}