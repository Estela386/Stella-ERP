"use client";

import { useState, Fragment } from "react";
import { ICuentasPorCobrar, IPago } from "@lib/models/CuentasPorCobrar";

interface Props {
  search: string;
  cuentas: ICuentasPorCobrar[];
  onVerPagos: (
    id_cuenta: number
  ) => Promise<{ pagos: IPago[] | null; error: string | null }>;
}

export default function AccountsTable({ search, cuentas, onVerPagos }: Props) {
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
      <div className="text-center py-10 text-[#708090]">
        No se encontraron resultados
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {/* Desktop */}
      <div className="hidden md:block bg-[#f6f4ef] rounded-2xl shadow-[0_20px_60px_rgba(140,137,118,0.35)] overflow-hidden border border-[#8c8976]/30">
        <table className="w-full text-left">
          <thead className="bg-[#708090]">
            <tr>
              <th className="p-4 text-[#f6f4ef] font-semibold">Cliente</th>
              <th className="text-[#f6f4ef] font-semibold">Concepto</th>
              <th className="text-[#f6f4ef] font-semibold">Monto</th>
              <th className="text-[#f6f4ef] font-semibold">Pagado</th>
              <th className="text-[#f6f4ef] font-semibold">Pendiente</th>
              <th className="text-[#f6f4ef] font-semibold">Estado</th>
              <th className="text-[#f6f4ef] font-semibold">Historial</th>
            </tr>
          </thead>
          <tbody className="text-[#708090]">
            {filtered.map(cuenta => (
              <Fragment key={cuenta.id}>
                <tr
                  key={cuenta.id}
                  className="border-t border-[#8c8976]/30 hover:bg-[#8c8976]/10 transition"
                >
                  <td className="p-4 font-medium">{cuenta.cliente?.nombre}</td>
                  <td>{cuenta.concepto}</td>
                  <td>${cuenta.monto_inicial.toLocaleString()}</td>
                  <td className="text-[#b76e79] font-semibold">
                    ${cuenta.monto_pagado.toLocaleString()}
                  </td>
                  <td className="font-semibold">
                    ${cuenta.monto_pendiente.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cuenta.estado === "pagado"
                          ? "bg-[#708090] text-[#f6f4ef]"
                          : "bg-[#b76e79] text-[#f6f4ef]"
                      }`}
                    >
                      {cuenta.estado === "pagado" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleExpandir(cuenta.id)}
                      className="text-xs text-[#b76e79] hover:underline"
                    >
                      {cuentaExpandida === cuenta.id ? "Ocultar" : "Ver pagos"}
                    </button>
                  </td>
                </tr>

                {/* Fila expandida de historial */}
                {cuentaExpandida === cuenta.id && (
                  <tr key={`historial-${cuenta.id}`} className="bg-white">
                    <td colSpan={7} className="p-4">
                      {loadingPagos ? (
                        <p className="text-sm text-[#708090]">Cargando...</p>
                      ) : pagos.length === 0 ? (
                        <p className="text-sm text-[#708090]">
                          Sin pagos registrados.
                        </p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[#8c8976]">
                              <th className="text-left pb-2">Fecha</th>
                              <th className="text-left pb-2">Monto</th>
                              <th className="text-left pb-2">Método</th>
                              <th className="text-left pb-2">Observaciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagos.map(pago => (
                              <tr
                                key={pago.id}
                                className="border-t border-[#8c8976]/20"
                              >
                                <td className="py-2 text-[#708090]">
                                  {new Date(pago.fecha_pago).toLocaleDateString(
                                    "es-MX"
                                  )}
                                </td>
                                <td className="py-2 text-[#b76e79] font-semibold">
                                  ${pago.monto_pago.toLocaleString()}
                                </td>
                                <td className="py-2 text-[#708090]">
                                  {pago.metodo_pago}
                                </td>
                                <td className="py-2 text-[#708090]">
                                  {pago.observaciones || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {filtered.map(cuenta => (
          <div
            key={cuenta.id}
            className="bg-[#f6f4ef] p-5 rounded-2xl border border-[#8c8976]/30 shadow-[0_15px_40px_rgba(140,137,118,0.3)]"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-[#708090]">
                {cuenta.cliente?.nombre}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cuenta.estado === "pagado"
                    ? "bg-[#708090] text-[#f6f4ef]"
                    : "bg-[#b76e79] text-[#f6f4ef]"
                }`}
              >
                {cuenta.estado === "pagado" ? "Pagado" : "Pendiente"}
              </span>
            </div>
            <p className="text-sm text-[#8c8976] mt-2">{cuenta.concepto}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-[#8c8976]">Monto</p>
                <p className="font-semibold text-[#708090]">
                  ${cuenta.monto_inicial.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[#8c8976]">Pagado</p>
                <p className="font-semibold text-[#b76e79]">
                  ${cuenta.monto_pagado.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[#8c8976]">Pendiente</p>
                <p className="font-semibold text-[#708090]">
                  ${cuenta.monto_pendiente.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleExpandir(cuenta.id)}
              className="mt-3 text-xs text-[#b76e79] hover:underline"
            >
              {cuentaExpandida === cuenta.id ? "Ocultar pagos" : "Ver pagos"}
            </button>
            {cuentaExpandida === cuenta.id && (
              <div className="mt-3 space-y-2">
                {loadingPagos ? (
                  <p className="text-sm text-[#708090]">Cargando...</p>
                ) : pagos.length === 0 ? (
                  <p className="text-sm text-[#708090]">
                    Sin pagos registrados.
                  </p>
                ) : (
                  pagos.map(pago => (
                    <div
                      key={pago.id}
                      className="bg-white p-3 rounded-xl border border-[#8c8976]/20 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-[#708090]">
                          {new Date(pago.fecha_pago).toLocaleDateString(
                            "es-MX"
                          )}
                        </span>
                        <span className="text-[#b76e79] font-semibold">
                          ${pago.monto_pago.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#8c8976] mt-1">{pago.metodo_pago}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
