"use client";

import { useState } from "react";

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

export interface CuentaPorCobrar {
  id: number;
  cliente: string;
  concepto: string;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: string;
  proximoPago?: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (cliente: Cliente, cuenta: CuentaPorCobrar) => void;
};

export default function NuevoClienteModal({ open, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [concepto, setConcepto] = useState("");
  const [montoInicial, setMontoInicial] = useState<number | "">("");

  if (!open) return null;

  const calcularProximaFecha = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    return fecha.toLocaleDateString("es-MX");
  };

  const handleGuardar = () => {
    if (
      !nombre.trim() ||
      !telefono.trim() ||
      !concepto.trim() ||
      montoInicial === "" ||
      montoInicial <= 0
    ) {
      alert(
        "Todos los campos son obligatorios y el monto inicial debe ser mayor a 0"
      );
      return;
    }

    const nuevoCliente: Cliente = {
      id: Date.now(),
      nombre,
      telefono,
    };

    const nuevaCuenta: CuentaPorCobrar = {
      id: Date.now(),
      cliente: nombre,
      concepto,
      monto_inicial: Number(montoInicial),
      monto_pagado: 0,
      monto_pendiente: Number(montoInicial),
      estado: "Pendiente",
      proximoPago: calcularProximaFecha(),
    };

    onSave(nuevoCliente, nuevaCuenta);

    setNombre("");
    setTelefono("");
    setConcepto("");
    setMontoInicial("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#f6f4ef] rounded-[32px] p-8 shadow-[0_10px_25px_rgba(140,137,118,0.35)] border border-[#8C8976]/30 space-y-5 transition-all duration-300">
        <h2 className="text-2xl font-semibold text-[#708090]">
          Nuevo Cliente y Cuenta
        </h2>

        {/* Cliente */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">
            Nombre del cliente
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#8C8976]/40 bg-[#f6f4ef] text-[#3F3A34] placeholder:text-[#708090] focus:outline-none focus:ring-2 focus:ring-[#B76379] focus:border-[#B76379] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            placeholder="Ej. 3312345678"
            maxLength={10} // límite opcional
            pattern="[0-9]*"
            onChange={e => {
              const valor = e.target.value.replace(/\D/g, ""); // elimina cualquier caracter que no sea número
              setTelefono(valor);
            }}
            className="w-full p-3 rounded-xl border border-[#8C8976]/40 bg-[#f6f4ef] text-[#3F3A34] placeholder:text-[#708090] focus:outline-none focus:ring-2 focus:ring-[#B76379] focus:border-[#B76379] transition"
          />
        </div>

        {/* Cuenta por Cobrar */}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">
            Monto inicial
          </label>
          <input
            type="number"
            value={montoInicial}
            min={1}
            step={1} // evita decimales si quieres solo enteros
            onChange={e => setMontoInicial(Number(e.target.value))}
           
            placeholder="0.00"
            className="w-full p-3 rounded-xl border border-[#8C8976]/40 bg-[#f6f4ef] text-[#3F3A34] placeholder:text-[#708090] focus:outline-none focus:ring-2 focus:ring-[#B76379] focus:border-[#B76379] transition"
          />
        </div>

        {/* Próxima Fecha de Pago */}
        <div className="bg-white p-3 rounded-xl border border-[#8C8976]/30">
          <p className="text-sm text-[#708090]">Próxima fecha de pago</p>
          <p className="font-semibold text-[#B76379]">
            {calcularProximaFecha()}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#708090] text-[#f6f4ef] hover:opacity-90 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleGuardar}
            className="px-5 py-2 rounded-xl bg-[#B76379] text-[#f6f4ef] shadow-[0_10px_25px_rgba(140,137,118,0.4)] hover:scale-105 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
