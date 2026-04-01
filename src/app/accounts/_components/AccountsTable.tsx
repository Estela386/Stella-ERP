"use client";

import { useState, Fragment, useMemo } from "react";
import { ICuentasPorCobrar, IPago } from "@lib/models/CuentasPorCobrar";
import { ChevronDown, ChevronUp, History, Info, AlertCircle, CheckCircle2, HandCoins, FileText } from "lucide-react";

interface Props {
  search: string;
  cuentas: ICuentasPorCobrar[];
  onVerPagos: (
    id_cuenta: number
  ) => Promise<{ pagos: IPago[] | null; error: string | null }>;
  onAddPayment: (id: number) => void;
}

// Tipo para un grupo de cuentas agrupado por cliente
interface ClienteGroup {
  clienteId: number;
  clienteNombre: string;
  clienteTelefono: string;
  cuentas: ICuentasPorCobrar[];
  totalMonto: number;
  totalPagado: number;
  totalPendiente: number;
  estado: "pagado" | "parcial" | "pendiente";
  numCuentas: number;
}

export default function AccountsTable({ 
  search, 
  cuentas, 
  onVerPagos,
  onAddPayment 
}: Props) {
  const [grupoExpandido, setGrupoExpandido] = useState<number | null>(null);
  const [pagosMap, setPagosMap] = useState<Record<number, IPago[]>>({});
  const [loadingPagos, setLoadingPagos] = useState(false);
  
  // Agrupar cuentas por cliente
  const grupos: ClienteGroup[] = useMemo(() => {
    const map = new Map<number, ClienteGroup>();

    cuentas.forEach(cuenta => {
      const cId = cuenta.cliente?.id ?? cuenta.id_cliente;
      if (!cId) return;

      if (!map.has(cId)) {
        map.set(cId, {
          clienteId: cId,
          clienteNombre: cuenta.cliente?.nombre ?? "Sin nombre",
          clienteTelefono: cuenta.cliente?.telefono ?? "",
          cuentas: [],
          totalMonto: 0,
          totalPagado: 0,
          totalPendiente: 0,
          estado: "pendiente",
          numCuentas: 0,
        });
      }

      const group = map.get(cId)!;
      group.cuentas.push(cuenta);
      group.totalMonto += cuenta.monto_inicial;
      group.totalPagado += cuenta.monto_pagado;
      group.totalPendiente += cuenta.monto_pendiente;
      group.numCuentas += 1;
    });

    // Calcular estado consolidado
    map.forEach(group => {
      if (group.totalPendiente <= 0) {
        group.estado = "pagado";
      } else if (group.totalPagado > 0) {
        group.estado = "parcial";
      } else {
        group.estado = "pendiente";
      }
    });

    return Array.from(map.values());
  }, [cuentas]);

  // Filtrar por búsqueda
  const filtered = grupos.filter(
    g =>
      g.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      g.clienteTelefono.includes(search) ||
      g.cuentas.some(c => c.concepto.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExpandir = async (clienteId: number) => {
    if (grupoExpandido === clienteId) {
      setGrupoExpandido(null);
      return;
    }
    setLoadingPagos(true);
    setGrupoExpandido(clienteId);

    const grupo = grupos.find(g => g.clienteId === clienteId);
    if (grupo) {
      const allPagos: Record<number, IPago[]> = {};
      for (const cuenta of grupo.cuentas) {
        const { pagos: pagosData } = await onVerPagos(cuenta.id);
        allPagos[cuenta.id] = pagosData || [];
      }
      setPagosMap(allPagos);
    }
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

  const estadoBadge = (estado: string) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      pagado: { bg: "bg-[#3d8c60]/10 text-[#3d8c60] border-[#3d8c60]/20", text: "text-[#3d8c60]", icon: <CheckCircle2 size={12} />, label: "Pagado" },
      parcial: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20", text: "text-amber-600", icon: <AlertCircle size={12} />, label: "Parcial" },
      pendiente: { bg: "bg-[#b76e79]/10 text-[#b76e79] border-[#b76e79]/20", text: "text-[#b76e79]", icon: <AlertCircle size={12} />, label: "Pendiente" },
    };
    const c = config[estado] || config.pendiente;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight border ${c.bg}`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {c.icon}
        {c.label}
      </span>
    );
  };

  return (
    <div className="w-full mt-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#8c8976]/20 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#708090]/5 border-b border-[#8c8976]/20">
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Cliente</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Cuentas</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Monto Total</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Pagado</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-marcellus)" }}>Pendiente</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider text-center" style={{ fontFamily: "var(--font-marcellus)" }}>Estado</th>
              <th className="p-5 text-[#708090] font-semibold text-sm uppercase tracking-wider text-right" style={{ fontFamily: "var(--font-marcellus)" }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8c8976]/10">
            {filtered.map(grupo => {
              const isExpanded = grupoExpandido === grupo.clienteId;
              const isPagado = grupo.estado === "pagado";
              
              return (
                <Fragment key={grupo.clienteId}>
                  <tr className={`hover:bg-[#f6f4ef]/50 transition-colors duration-200 ${isExpanded ? 'bg-[#f6f4ef]/30' : ''}`}>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#708090] text-base" style={{ fontFamily: "var(--font-marcellus)" }}>{grupo.clienteNombre}</span>
                        <span className="text-xs text-[#8c8976]">{grupo.clienteTelefono}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#708090]/10 text-[#708090] text-xs font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                        <FileText size={12} />
                        {grupo.numCuentas}
                      </span>
                    </td>
                    <td className="p-5 text-[#708090] font-medium" style={{ fontFamily: "var(--font-poppins)" }}>${grupo.totalMonto.toLocaleString()}</td>
                    <td className="p-5 text-[#3d8c60] font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>${grupo.totalPagado.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`font-bold ${grupo.totalPendiente > 0 ? 'text-[#b76e79]' : 'text-[#708090]'}`} style={{ fontFamily: "var(--font-poppins)" }}>
                        ${grupo.totalPendiente.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        {estadoBadge(grupo.estado)}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {!isPagado && (
                          <button
                            onClick={() => {
                              // Abonar a la cuenta con mayor pendiente
                              const cuentaConMasPendiente = grupo.cuentas
                                .filter(c => c.estado !== "pagado")
                                .sort((a, b) => b.monto_pendiente - a.monto_pendiente)[0];
                              if (cuentaConMasPendiente) onAddPayment(cuentaConMasPendiente.id);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 px-3 py-2 rounded-xl bg-[#b76e79] text-white hover:bg-[#a55a65] shadow-sm active:scale-95"
                          >
                            <HandCoins size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleExpandir(grupo.clienteId)}
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
                            <h4 className="font-semibold uppercase tracking-wider text-sm" style={{ fontFamily: "var(--font-marcellus)" }}>
                              Historial Completo — {grupo.clienteNombre}
                            </h4>
                          </div>
                          
                          {loadingPagos ? (
                            <div className="flex items-center gap-3 text-[#8c8976] py-4">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b76e79]" />
                              <span className="text-sm">Consultando movimientos...</span>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {grupo.cuentas.map(cuenta => {
                                const cuentaPagos = pagosMap[cuenta.id] || [];
                                const cuentaIsPagado = cuenta.estado === "pagado";
                                return (
                                  <div key={cuenta.id} className="overflow-hidden rounded-2xl border border-[#8c8976]/15 bg-white">
                                    {/* Encabezado de cuenta individual */}
                                    <div className="flex items-center justify-between px-5 py-3.5 bg-[#f6f4ef]/60 border-b border-[#8c8976]/10">
                                      <div className="flex items-center gap-3">
                                        <FileText size={14} className="text-[#8c8976]" />
                                        <span className="text-sm font-semibold text-[#708090]" style={{ fontFamily: "var(--font-marcellus)" }}>
                                          {cuenta.concepto}
                                        </span>
                                        <span className="text-[10px] text-[#8c8976]">
                                          {new Date(cuenta.fecha_registro).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-right">
                                          <span className="text-[9px] text-[#8c8976] uppercase tracking-widest font-bold block">Monto</span>
                                          <span className="text-sm font-bold text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_inicial.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-[9px] text-[#8c8976] uppercase tracking-widest font-bold block">Pagado</span>
                                          <span className="text-sm font-bold text-[#3d8c60]" style={{ fontFamily: "var(--font-poppins)" }}>${cuenta.monto_pagado.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-[9px] text-[#8c8976] uppercase tracking-widest font-bold block">Pendiente</span>
                                          <span className={`text-sm font-bold ${cuenta.monto_pendiente > 0 ? 'text-[#b76e79]' : 'text-[#708090]'}`} style={{ fontFamily: "var(--font-poppins)" }}>
                                            ${cuenta.monto_pendiente.toLocaleString()}
                                          </span>
                                        </div>
                                        {!cuentaIsPagado && (
                                          <button
                                            onClick={() => onAddPayment(cuenta.id)}
                                            className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#b76e79] text-white hover:bg-[#a55a65] transition-all active:scale-95"
                                          >
                                            <HandCoins size={12} />
                                            Abonar
                                          </button>
                                        )}
                                        {cuentaIsPagado && (
                                          <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#3d8c60]/10 text-[#3d8c60] border border-[#3d8c60]/20">
                                            <CheckCircle2 size={12} />
                                            Pagado
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Tabla de pagos */}
                                    {cuentaPagos.length > 0 ? (
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-[#f6f4ef]/20 text-[#8c8976] border-b border-[#8c8976]/10">
                                            <th className="p-3 pl-5 text-left font-medium uppercase tracking-tighter text-[11px]">Fecha</th>
                                            <th className="p-3 text-left font-medium uppercase tracking-tighter text-[11px]">Monto</th>
                                            <th className="p-3 text-left font-medium uppercase tracking-tighter text-[11px]">Método</th>
                                            <th className="p-3 pr-5 text-left font-medium uppercase tracking-tighter text-[11px]">Observaciones</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#8c8976]/5">
                                          {cuentaPagos.map(pago => (
                                            <tr key={pago.id} className="hover:bg-[#fcfbf9]">
                                              <td className="p-3 pl-5 text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>
                                                {new Date(pago.fecha_pago).toLocaleDateString("es-MX", { day: '2-digit', month: 'long', year: 'numeric' })}
                                              </td>
                                              <td className="p-3 text-[#3d8c60] font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                                                + ${pago.monto_pago.toLocaleString()}
                                              </td>
                                              <td className="p-3 text-[#708090]">
                                                <span className="px-2 py-1 bg-[#f6f4ef] rounded-md text-[10px] font-bold uppercase tracking-widest border border-[#8c8976]/10">
                                                  {pago.metodo_pago}
                                                </span>
                                              </td>
                                              <td className="p-3 pr-5 text-[#8c8976] italic text-xs">
                                                {pago.observaciones || "Sin comentarios"}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <div className="px-5 py-4 text-center">
                                        <p className="text-xs text-[#8c8976] italic">Sin abonos registrados en esta cuenta.</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
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
        {filtered.map(grupo => {
          const isExpanded = grupoExpandido === grupo.clienteId;
          const isPagado = grupo.estado === "pagado";

          return (
            <div
              key={grupo.clienteId}
              className="bg-white p-5 rounded-[1.5rem] border border-[#8c8976]/15 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-[#708090] text-base leading-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
                    {grupo.clienteNombre}
                  </h3>
                  <span className="text-[10px] text-[#8c8976] tracking-wider uppercase font-medium">
                    {grupo.numCuentas} cuenta{grupo.numCuentas > 1 ? "s" : ""}
                  </span>
                </div>
                {estadoBadge(grupo.estado)}
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#8c8976]/10 mb-5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Monto Total</span>
                  <span className="font-bold text-[#708090] text-base" style={{ fontFamily: "var(--font-poppins)" }}>${grupo.totalMonto.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5">Monto Pagado</span>
                  <span className="font-bold text-[#3d8c60] text-base" style={{ fontFamily: "var(--font-poppins)" }}>${grupo.totalPagado.toLocaleString()}</span>
                </div>
                <div className="flex flex-col col-span-2 pt-2 border-t border-[#8c8976]/5">
                  <span className="text-[9px] text-[#8c8976] uppercase font-bold tracking-wider mb-0.5 text-center">Saldo Pendiente</span>
                  <span className="font-black text-[#b76e79] text-xl text-center" style={{ fontFamily: "var(--font-poppins)" }}>${grupo.totalPendiente.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {!isPagado && (
                  <button
                    onClick={() => {
                      const cuentaConMasPendiente = grupo.cuentas
                        .filter(c => c.estado !== "pagado")
                        .sort((a, b) => b.monto_pendiente - a.monto_pendiente)[0];
                      if (cuentaConMasPendiente) onAddPayment(cuentaConMasPendiente.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all bg-[#b76e79] text-white shadow-[0_5px_15px_-5px_rgba(183,110,121,0.4)] active:scale-95"
                    style={{ fontFamily: "var(--font-marcellus)" }}
                  >
                    <HandCoins size={16} />
                    Registrar Abono
                  </button>
                )}
                <button
                  onClick={() => handleExpandir(grupo.clienteId)}
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
                <div className="mt-4 pt-4 border-t border-dashed border-[#8c8976]/30 space-y-4 animate-in fade-in duration-300">
                  {loadingPagos ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#b76e79]" />
                    </div>
                  ) : (
                    grupo.cuentas.map(cuenta => {
                      const cuentaPagos = pagosMap[cuenta.id] || [];
                      return (
                        <div key={cuenta.id} className="bg-[#f6f4ef]/50 rounded-2xl border border-[#8c8976]/10 overflow-hidden">
                          {/* Header cuenta */}
                          <div className="px-4 py-3 bg-[#f6f4ef]/80 border-b border-[#8c8976]/10">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-[#708090]" style={{ fontFamily: "var(--font-marcellus)" }}>{cuenta.concepto}</span>
                              <span className={`text-xs font-bold ${cuenta.monto_pendiente > 0 ? 'text-[#b76e79]' : 'text-[#3d8c60]'}`} style={{ fontFamily: "var(--font-poppins)" }}>
                                Pendiente: ${cuenta.monto_pendiente.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#8c8976]">
                              ${cuenta.monto_inicial.toLocaleString()} total · {new Date(cuenta.fecha_registro).toLocaleDateString("es-MX")}
                            </span>
                          </div>
                          {/* Pagos */}
                          {cuentaPagos.length > 0 ? (
                            <div className="divide-y divide-[#8c8976]/5">
                              {cuentaPagos.map(pago => (
                                <div key={pago.id} className="px-4 py-3 flex justify-between items-center">
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8976]">
                                      {new Date(pago.fecha_pago).toLocaleDateString("es-MX")}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-[#708090] ml-2">{pago.metodo_pago}</span>
                                  </div>
                                  <span className="text-sm font-bold text-[#3d8c60]" style={{ fontFamily: "var(--font-poppins)" }}>
                                    + ${pago.monto_pago.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="px-4 py-3 text-[11px] text-[#8c8976] italic text-center">Sin abonos aún.</p>
                          )}
                        </div>
                      );
                    })
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
