"use client";

import { Pedido } from "../type";

type Props = {
  pedidos: Pedido[];
};

export default function PedidosStats({ pedidos }: Props) {
  const enProduccion = pedidos.filter(
    p => p.estado === "EN_PRODUCCION"
  ).length;

  const pendientes = pedidos.filter(
    p => p.estado === "PENDIENTE"
  ).length;

  return (
    <div
      className="
        grid
        grid-cols-3
        gap-3
        w-full
      "
    >
      {/* Total */}
      <div className="bg-[#708090] p-3 sm:p-4 rounded-xl shadow-md shadow-[#8c8976]">
        <p className="text-xs sm:text-sm text-[#f6f4ef]">Total</p>
        <p className="text-lg sm:text-2xl font-bold text-[#f6f4ef]">
          {pedidos.length}
        </p>
      </div>

      {/* En producción */}
      <div className="bg-[#b76e79] p-3 sm:p-4 rounded-xl shadow-md shadow-[#8c8976]">
        <p className="text-xs sm:text-sm text-[#f6f4ef]">En producción</p>
        <p className="text-lg sm:text-2xl font-bold text-[#f6f4ef]">
          {enProduccion}
        </p>
      </div>

      {/* Pendientes */}
      <div className="bg-[#708090] p-3 sm:p-4 rounded-xl shadow-md shadow-[#8c8976]">
        <p className="text-xs sm:text-sm text-[#f6f4ef]">Pendientes</p>
        <p className="text-lg sm:text-2xl font-bold text-[#f6f4ef]">
          {pendientes}
        </p>
      </div>
    </div>
  );
}