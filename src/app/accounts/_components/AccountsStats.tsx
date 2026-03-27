"use client";

import { ICuentasPorCobrar } from "@lib/models/CuentasPorCobrar";

interface Props {
  cuentas: ICuentasPorCobrar[];
}

export default function AccountsStats({ cuentas }: Props) {
  const safeCuentas = cuentas ?? [];
  const totalPendiente = safeCuentas.reduce(
    (acc, c) => acc + c.monto_pendiente,
    0
  );
  const totalPagado = safeCuentas.reduce((acc, c) => acc + c.monto_pagado, 0);
  const activas = safeCuentas.filter(c => c.estado !== "pagado").length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-[#708090] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">
          Total pendiente
        </p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">
          ${totalPendiente.toLocaleString()}
        </h3>
      </div>
      <div className="bg-[#b76e79] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">Total cobrado</p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">
          ${totalPagado.toLocaleString()}
        </h3>
      </div>
      <div className="bg-[#708090] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">
          Cuentas pendientes
        </p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">{activas}</h3>
      </div>
    </div>
  );
}
