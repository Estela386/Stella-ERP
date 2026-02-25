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
                <th className="hidden lg:table-cell w-[120px]">Tipo</th>
                <th className="w-[130px]">Entrega</th>
                <th className="w-[130px]">Estado</th>
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
                <b>Cliente:</b> {p.cliente}
              </p>

              <p className="text-[#708090] text-sm">
                <b>Entrega:</b> {p.entrega}
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
  <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    
    {/* CONTENEDOR */}
    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.25)]">

      {/* ===== HEADER ELEGANTE ===== */}
      <div className="bg-gradient-to-r from-[#708090] to-[#708090] text-[#F6F4EF] p-6 flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-80">
            Pedido
          </p>
          <h2 className="text-2xl font-bold">{selected.id}</h2>
        </div>

        <button
          onClick={() => setSelected(null)}
          className="text-2xl font-light hover:opacity-70"
        >
          ✕
        </button>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="p-6 space-y-6 bg-[#F6F4EF]">

        {/* BADGES */}
        <div className="flex gap-3">
          <span className="bg-[#708090] text-white px-5 py-1 rounded-full text-xs font-medium shadow">
            {selected.estado.replace("_", " ")}
          </span>

          <span className="bg-[#B76E79] text-white px-4 py-1 rounded-full text-xs font-medium shadow">
            Prioridad: {selected.prioridad}
          </span>
        </div>

        {/* ===== TARJETA INFO ===== */}
        <div className="bg-white rounded-2xl p-5 shadow border border-[#8C9796]/20 space-y-4">
          
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#708090]">
            <Input label="Cliente" value={selected.cliente} />
            <Input label="Tipo" value={selected.tipo} />
            <Input label="Entrega" value={selected.entrega} />
          </div>

        </div>

        {/* ===== TABLA PRODUCTOS ===== */}
        <div className="bg-white rounded-2xl shadow border border-[#8C9796]/20 overflow-hidden">
          
          <div className="px-5 py-3 border-b bg-[#F6F4EF]">
            <p className="text-xs uppercase tracking-wide text-[#8C9796]">
              Productos del pedido
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-[#708090]">
              
              <thead className="bg-[#708090] text-[#F6F4EF] text-xs uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                {selected.productos?.map((prod, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#8C9796]/20 hover:bg-[#F6F4EF]"
                  >
                    <td className="px-4 py-2 font-medium">
                      {prod.codigo}
                    </td>
                    <td className="px-4 py-2">{prod.nombre}</td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {prod.cantidad}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* BOTÓN */}
        <div className="flex justify-end">
          <button
            onClick={() => setSelected(null)}
            className="px-6 py-2 rounded-full bg-[#B76E79] text-[#F6F4EF] font-medium shadow-md shadow-[#8C9796]/40 hover:bg-[#A45F69] transition"
          >
            Cerrar
          </button>
        </div>

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