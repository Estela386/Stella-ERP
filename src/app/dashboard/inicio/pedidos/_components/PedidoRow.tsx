"use client";

import { useState } from "react";
import { Pedido } from "../type";
import EstadoBadge from "./EstadoBadge";

export default function PedidoRow({ pedido }: { pedido: Pedido }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== FILA ===== */}
      <tr className="border-b border-[#8C8976]/30 text-[#708090] hover:bg-[#F6F3EF] transition">
        <td className="py-3 whitespace-nowrap font-medium">{pedido.id}</td>
        <td>{pedido.cliente}</td>
        <td>{pedido.tipo}</td>
        <td className="max-w-[200px] truncate">{pedido.descripcion}</td>
        <td>{pedido.entrega}</td>

        <td>
          <EstadoBadge estado={pedido.estado} />
        </td>

        <td>{pedido.prioridad}</td>

        <td>
          <button
            onClick={() => setOpen(true)}
            className="
              px-4 py-1.5
              rounded-full
              text-sm font-medium
              bg-[#B76E79]
              text-[#F6F4EF]
              shadow-md shadow-[#8C8976]/40
              hover:bg-[#A45F69]
              transition
              whitespace-nowrap
            "
          >
            Ver detalles
          </button>
        </td>
      </tr>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden">
            {/* ===== HEADER ===== */}
            <div className="bg-[#708090] text-[#F6F4EF] p-6 flex justify-between items-start">
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wider">
                  Pedido
                </p>

                <h2 className="text-2xl font-bold">{pedido.id}</h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-[#F6F4EF] text-2xl font-light hover:opacity-70"
              >
                ✕
              </button>
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className="p-6 space-y-6">
              {/* ESTADO + PRIORIDAD */}
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#708090] text-[#F6F4EF] px-4 py-1 rounded-full text-xs font-medium">
                  {pedido.estado.replace("_", " ")}
                </span>

                <span className="bg-[#B76E79] text-[#F6F4EF] px-4 py-1 rounded-full text-xs font-medium">
                  Prioridad: {pedido.prioridad}
                </span>
              </div>

              {/* TARJETA DE INFO */}
              <div className="bg-[#F6F4EF] rounded-2xl p-5 border border-[#8C8976]/25 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#708090]">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8C8976]">
                      Cliente
                    </p>
                    <p className="font-semibold">{pedido.cliente}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8C8976]">
                      Tipo
                    </p>
                    <p className="font-semibold">{pedido.tipo}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8C8976]">
                      Fecha de entrega
                    </p>
                    <p className="font-semibold">{pedido.entrega}</p>
                  </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8C8976]">
                    Descripción
                  </p>

                  <p className="text-[#708090] mt-1">{pedido.descripcion}</p>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#708090]/30 text-[#708090] font-medium hover:bg-[#F6F4EF] transition"
                >
                  Cerrar
                </button>

                <button className="px-5 py-2 rounded-full bg-[#B76E79] text-[#F6F4EF] font-medium shadow-md shadow-[#8C8976]/40 hover:bg-[#A45F69] transition">
                  Editar pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
