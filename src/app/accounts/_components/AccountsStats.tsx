"use client";

import { ICuentasPorCobrar } from "@lib/models/CuentasPorCobrar";
import { HandCoins, Receipt, UserCheck } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {/* Pendiente */}
      <div 
        className="bg-[#B76E79] rounded-[2rem] p-6 shadow-md shadow-[#B76E79]/10 flex flex-col items-start justify-center transition duration-300 hover:scale-[1.02]"
      >
        <p 
          className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-bold mb-1"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Total pendiente
        </p>
        <h3 
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          ${totalPendiente.toLocaleString()}
        </h3>
      </div>

      {/* Cobrado */}
      <div 
        className="bg-[#708090] rounded-[2rem] p-6 shadow-md shadow-[#708090]/10 flex flex-col items-start justify-center transition duration-300 hover:scale-[1.02]"
      >
        <p 
          className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-bold mb-1"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Total cobrado
        </p>
        <h3 
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          ${totalPagado.toLocaleString()}
        </h3>
      </div>

      {/* Activas */}
      <div 
        className="bg-[#B76E79] rounded-[2rem] p-6 shadow-md shadow-[#B76E79]/10 flex flex-col items-start justify-center transition duration-300 hover:scale-[1.02]"
      >
        <p 
          className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-bold mb-1"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Cuentas pendientes
        </p>
        <h3 
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {activas}
        </h3>
      </div>
    </div>
  );
}
