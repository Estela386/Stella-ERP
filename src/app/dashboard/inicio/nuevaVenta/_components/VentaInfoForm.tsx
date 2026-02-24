"use client";

import { useState } from "react";

export default function VentaInfoForm() {

  const hoy = new Date().toISOString().split("T")[0];

  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [estado, setEstado] = useState("COMPLETADA");

  const esNuevoCliente = cliente === "NUEVO";

  const esValido =
    cliente !== "" &&
    fecha !== "" &&
    (!esNuevoCliente || telefono.length >= 10);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 border border-[#8C9796]/20">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Cliente */}
        <div className="space-y-2">
          <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
            Cliente *
          </label>
          <select
            required
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          >
            <option value="">Seleccionar cliente</option>
            <option value="1">Cliente 1</option>
            <option value="2">Cliente 2</option>

            {/* NUEVO CLIENTE */}
            <option value="NUEVO">+ Nuevo cliente</option>
          </select>
        </div>

        {/* Teléfono solo si es nuevo */}
        {esNuevoCliente && (
          <div className="space-y-2">
            <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
              Teléfono *
            </label>
            <input
              type="tel"
              placeholder="10 dígitos"
              value={telefono}
              maxLength={10}
              pattern="[0-9]*"
              onChange={(e) =>
                setTelefono(e.target.value.replace(/\D/g, ""))
              }
              className="w-full bg-[#F6F4EF] border border-[#B76E79] rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>
        )}

        {/* Fecha */}
        <div className="space-y-2">
          <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
            Fecha *
          </label>
          <input
            type="date"
            required
            value={fecha}
            max={hoy}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          />
        </div>

        {/* Vendedor */}
        <div className="space-y-2">
          <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
            Vendedor
          </label>
          <input
            type="text"
            value="Usuario actual"
            disabled
            className="w-full bg-[#EAE7E1] border border-[#8C9796]/30 rounded-xl px-4 py-3 text-[#708090]"
          />
        </div>

      </div>

      {/* Mensaje */}
      {!esValido && (
        <p className="mt-4 text-sm text-[#B76E79] font-medium">
          Completa los campos obligatorios para continuar
        </p>
      )}
    </div>
  );
}