"use client";

import { useState, Fragment } from "react";
import { ICuentasPorCobrar, IPago } from "@lib/models/CuentasPorCobrar";
import { ChevronDown, ChevronUp, History, Info, AlertCircle, CheckCircle2, HandCoins } from "lucide-react";

interface Props {
  search: string;
  cuentas: ICuentasPorCobrar[];
  onVerPagos: (
    id_cuenta: number
  ) => Promise<{ pagos: IPago[] | null; error: string | null }>;
  onAddPayment: (id: number) => void;
}

export default function AccountsTable({ 
  search, 
  cuentas, 
  onVerPagos,
  onAddPayment 
}: Props) {
  const [cuentaExpandida, setCuentaExpandida] = useState<number | null>(null);
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [loadingPagos, setLoadingPagos] = useState(false);
  
  const filtered = cuentas.filter(
    c =>
      c.cliente?.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.concepto.toLowerCase().includes(search.toLowerCase())
  );

  const handleExpandir = async (id: number) => {
    if (cuentaExpandida === id) {
      setCuentaExpandida(null);
      return;
    }
    setLoadingPagos(true);
    setCuentaExpandida(id);
    const { pagos: pagosData } = await onVerPagos(id);
    setPagos(pagosData || []);
    setLoadingPagos(false);
  };

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#8c8976] space-y-4">
        <div className="bg-[#f6f4ef] p-6 rounded-full">
          <Info size={48} strokeWidth={1.5} />
        </div>
        <p 
          className="text-lg font-medium"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          No se encontraron resultados
        </p>
        <p className="text-sm opacity-70">Intenta con otros términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#8c8976]/20 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#708090]/5 border-b border-[#8c8976]/20">
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Cliente</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Concepto</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Monto</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Pagado</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Pendiente</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider text-center" style={{ fontFamily: "var(--font-marcellus)" }}>Estado</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider text-right" style={{ fontFamily: "var(--font-marcellus)" }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8c8976]/10">
            {filtered.map(cuenta => {
              const isExpanded = cuentaExpandida === cuenta.id;
              const isPagado = cuenta.estado === "pagado";
              
              return (
                <Fragment key={cuenta.id}>
                  <tr className={`hover:bg-[#f6f4ef]/50 transition-colors duration-200 ${isExpanded ? 'bg-[#f6f4ef]/30' : ''}`}>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#708090] text-base" style={{ fontFamily: "var(--font-marcellus)" }}>{cuenta.cliente?.nombre}</span>
                        <span className="text-xs text-[#8c8976]">{cuenta.cliente?.telefono}</span>
                      </div>
                    </td>
                    <td className="p-5 text-[#708090] text-sm" style={{ fontFamily: "var(--font-poppins)" }}>{cuenta.concepto}</td>
                    <td className="p-5 text-[#708090] font-medium" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_inicial.toLocaleString()}</td>
                    <td className="p-5 text-[#3d8c60] font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_pagado.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`font-bold ${cuenta.monto_pendiente > 0 ? 'text-[#b76e79]' : 'text-[#708090]'}`} style={{ fontFamily: "var(--font-poppins)" }}>
                        ${cuenta.monto_pendiente.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight ${
                            isPagado
                              ? "bg-[#3d8c60]/10 text-[#3d8c60] border border-[#3d8c60]/20"
                              : "bg-[#b76e79]/10 text-[#b76e79] border border-[#b76e79]/20"
                          }`}
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {isPagado ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {isPagado ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {!isPagado && (
                          <button
                            onClick={() => onAddPayment(cuenta.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 px-3 py-2 rounded-xl bg-[#b76e79] text-white hover:bg-[#a55a65] shadow-sm active:scale-95"
                     
                          >
                            <HandCoins size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleExpandir(cuenta.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 px-3 py-2 rounded-xl ${
                            isExpanded 
                              ? "bg-[#708090] text-white" 
                              : "text-[#708090] hover:bg-[#708090]/10"
                          }`}
                          style={{ fontFamily: "var(--font-marcellus)" }}
                        >
                          <History size={14} />
                          {isExpanded ? "Cerrar" : "Historial"}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded History Row */}
                  {isExpanded && (
                    <tr className="bg-[#fcfbf9]">
                      <td colSpan={7} className="p-0 border-b border-[#8c8976]/20">
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-2 text-[#708090]">
                            <History size={18} />
                            <h4 className="font-semibold uppercase tracking-wider text-sm" style={{ fontFamily: "var(--font-marcellus)" }}>Registro de Abonos</h4>
                          </div>
                          
                          {loadingPagos ? (
                            <div className="flex items-center gap-3 text-[#8c8976] py-4">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b76e79]" />
                              <span className="text-sm">Consultando movimientos...</span>
                            </div>
                          ) : pagos.length === 0 ? (
                            <div className="bg-white rounded-2xl p-6 border border-dashed border-[#8c8976]/30 text-center">
                              <p className="text-sm text-[#8c8976]">No se han registrado abonos en esta cuenta todavía.</p>
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-2xl border border-[#8c8976]/10 bg-white">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-[#f6f4ef]/30 text-[#8c8976] border-b border-[#8c8976]/10">
                                    <th className="p-4 text-left font-medium uppercase tracking-tighter">Fecha</th>
                                    <th className="p-4 text-left font-medium uppercase tracking-tighter">Monto</th>
                                    <th className="p-4 text-left font-medium uppercase tracking-tighter">Método de Pago</th>
                                    <th className="p-4 text-left font-medium uppercase tracking-tighter">Observaciones</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#8c8976]/5">
                                  {pagos.map(pago => (
                                    <tr key={pago.id} className="hover:bg-[#fcfbf9]">
                                      <td className="p-4 text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>
                                        {new Date(pago.fecha_pago).toLocaleDateString("es-MX", { day: '2-digit', month: 'long', year: 'numeric' })}
                                      </td>
                                      <td className="p-4 text-[#3d8c60] font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                                        + ${pago.monto_pago.toLocaleString()}
                                      </td>
                                      <td className="p-4 text-[#708090]">
                                        <span className="px-2 py-1 bg-[#f6f4ef] rounded-md text-[10px] font-bold uppercase tracking-widest border border-[#8c8976]/10">
                                          {pago.metodo_pago}
                                        </span>
                                      </td>
                                      <td className="p-4 text-[#8c8976] italic text-xs">
                                        {pago.observaciones || "Sin comentarios"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Experience */}
      <div className="md:hidden space-y-6">
        {filtered.map(cuenta => {
          const isExpanded = cuentaExpandida === cuenta.id;
          const isPagado = cuenta.estado === "pagado";

          return (
            <div
              key={cuenta.id}
              className="bg-white p-5 rounded-[1.5rem] border border-[#8c8976]/15 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-[#708090] text-base leading-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
                    {cuenta.cliente?.nombre}
                  </h3>
                  <span className="text-[10px] text-[#8c8976] tracking-wider uppercase font-medium">{cuenta.concepto}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    isPagado ? "bg-[#3d8c60]/10 text-[#3d8c60]" : "bg-[#b76e79]/10 text-[#b76e79]"
                  }`}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {isPagado ? "Pagado" : "Pendiente"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#8c8976]/10 mb-5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Monto Total</span>
                  <span className="font-bold text-[#708090] text-base" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_inicial.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Monto Pagado</span>
                  <span className="font-bold text-[#3d8c60] text-base" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_pagado.toLocaleString()}</span>
                </div>
                <div className="flex flex-col col-span-2 pt-2 border-t border-[#8c8976]/5">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5 text-center">Saldo Pendiente</span>
                  <span className="font-black text-[#b76e79] text-xl text-center" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_pendiente.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {!isPagado && (
                  <button
                    onClick={() => onAddPayment(cuenta.id)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all bg-[#b76e79] text-white shadow-[0_5px_15px_-5px_rgba(183,110,121,0.4)] active:scale-95"
                    style={{ fontFamily: "var(--font-marcellus)" }}
                  >
                    <HandCoins size={16} />
                    Registrar Abono
                  </button>
                )}
                <button
                  onClick={() => handleExpandir(cuenta.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                    isExpanded ? "bg-[#708090] text-white" : "bg-[#f6f4ef] text-[#708090] hover:bg-[#8c8976]/10"
                  }`}
                  style={{ fontFamily: "var(--font-marcellus)" }}
                >
                  <History size={16} />
                  {isExpanded ? "Ocultar Historial" : "Ver Historial"}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-dashed border-[#8c8976]/30 space-y-3 animate-in fade-in duration-300">
                   {loadingPagos ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#b76e79]" />
                    </div>
                  ) : pagos.length === 0 ? (
                    <p className="text-[11px] text-[#8c8976] text-center italic">Sin registros de pago.</p>
                  ) : (
                    pagos.map(pago => (
                      <div key={pago.id} className="bg-[#f6f4ef]/50 p-4 rounded-2xl border border-[#8c8976]/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-[#8c8976]">
                            {new Date(pago.fecha_pago).toLocaleDateString("es-MX")}
                          </span>
                          <span className="text-sm font-bold text-[#3d8c60]" style={{ fontFamily: "var(--font-poppins)" }}>
                            + ${pago.monto_pago.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-widest font-black text-[#708090]">{pago.metodo_pago}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
