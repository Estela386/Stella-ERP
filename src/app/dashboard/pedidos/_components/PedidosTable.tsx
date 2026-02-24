"use client";

import { useState } from "react";
import { Pedido } from "../type";

type Props = {
  pedidos: Pedido[];
};

export default function PedidosTable({ pedidos }: Props) {
  const [selected, setSelected] = useState<Pedido | null>(null);

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
                <th className="w-[160px]">Cliente</th>

                {/* Oculta en laptops pequeñas */}
                <th className="hidden lg:table-cell w-[120px]">Tipo</th>

                {/* Solo pantallas muy grandes */}
                <th className="hidden xl:table-cell">Descripción</th>

                <th className="w-[130px]">Entrega</th>
                <th className="w-[130px]">Estado</th>

                {/* Oculta en md */}
                <th className="hidden lg:table-cell w-[120px]">Prioridad</th>

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
                  <td className="truncate">{p.cliente}</td>

                  <td className="hidden lg:table-cell">{p.tipo}</td>

                  <td className="hidden xl:table-cell truncate">
                    {p.descripcion}
                  </td>

                  <td>{p.entrega}</td>

                  <td>
                    <span className="bg-[#708090] text-[#F6F4EF] px-3 py-1 rounded-lg text-xs font-medium">
                      {p.estado.replace("_", " ")}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell">
                    <span className="bg-[#B76E79] text-[#F6F4EF] px-3 py-1 rounded-lg text-xs font-medium">
                      {p.prioridad}
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

                <span className="bg-[#708090] text-[#F6F4EF] px-3 py-1 rounded-lg text-xs">
                  {p.estado.replace("_", " ")}
                </span>
              </div>

              <p className="text-[#708090] text-sm">
                <span className="font-medium">Cliente:</span> {p.cliente}
              </p>

              <p className="text-[#708090] text-sm">
                <span className="font-medium">Tipo:</span> {p.tipo}
              </p>

              <p className="text-[#708090] text-sm">
                <span className="font-medium">Entrega:</span> {p.entrega}
              </p>

              <div className="flex justify-between items-center pt-2">
                <span className="bg-[#B76E79] text-[#F6F4EF] px-3 py-1 rounded-lg text-xs">
                  Prioridad: {p.prioridad}
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
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-[0_30px_70px_rgba(0,0,0,0.15)] space-y-4">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-[#708090]">
                Detalles del pedido
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="text-[#708090] hover:text-[#B76E79] text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#708090] text-sm">
              <p><b>ID:</b> {selected.id}</p>
              <p><b>Cliente:</b> {selected.cliente}</p>
              <p><b>Tipo:</b> {selected.tipo}</p>
              <p><b>Descripción:</b> {selected.descripcion}</p>
              <p><b>Entrega:</b> {selected.entrega}</p>
              <p><b>Estado:</b> {selected.estado.replace("_"," ")}</p>
              <p><b>Prioridad:</b> {selected.prioridad}</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 rounded-full bg-[#708090] text-[#F6F4EF] shadow-md shadow-[#8C9796]/40 hover:bg-[#5F6F7F] transition"
              >
                Cerrar
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