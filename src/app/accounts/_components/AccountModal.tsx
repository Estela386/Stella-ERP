"use client";

import { useState } from "react";

type Cuenta = {
  id: number;
  usuario: string;
  correo: string;
  activa: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountModal({ open, onClose }: Props) {
  const [cuentas, setCuentas] = useState<Cuenta[]>([
    { id: 1, usuario: "Estela", correo: "estela@mail.com", activa: true },
    { id: 2, usuario: "Administrador", correo: "admin@mail.com", activa: true },
    { id: 3, usuario: "Invitado", correo: "guest@mail.com", activa: false },
  ]);

  const [seleccionada, setSeleccionada] = useState<Cuenta | null>(null);

  if (!open) return null;

  const cuentasActivas = cuentas.filter((c) => c.activa);

  const guardarCambios = () => {
    if (!seleccionada) return;

    setCuentas((prev) =>
      prev.map((c) => (c.id === seleccionada.id ? seleccionada : c))
    );

    setSeleccionada(null);
  };

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#f6f4ef] rounded-[32px] p-10 shadow-[0_40px_120px_rgba(140,137,118,0.35)] border border-[#8c8976]/30 space-y-8">

        <h2 className="text-3xl font-semibold text-[#708090]">
          Cuentas Activas
        </h2>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuentasActivas.map((cuenta) => (
            <div
              key={cuenta.id}
              onClick={() => setSeleccionada(cuenta)}
              className="p-6 bg-white rounded-2xl border border-[#8c8976]/30 shadow-md hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-[#708090]">
                {cuenta.usuario}
              </h3>
              <p className="text-sm text-[#8c8976]">
                {cuenta.correo}
              </p>
            </div>
          ))}
        </div>

        {/* PANEL DE EDICIÓN */}
        {seleccionada && (
          <div className="bg-[#ffffff] p-8 rounded-2xl border-2 border-[#b76e79]/40 shadow-lg space-y-6">

            <h3 className="text-2xl font-semibold text-[#b76e79]">
              Editar Cuenta
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#708090]">
                Usuario
              </label>
              <input
                value={seleccionada.usuario}
                onChange={(e) =>
                  setSeleccionada({ ...seleccionada, usuario: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-[#8c8976]/50 bg-white text-[#333] focus:ring-2 focus:ring-[#b76e79] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#708090]">
                Correo
              </label>
              <input
                value={seleccionada.correo}
                onChange={(e) =>
                  setSeleccionada({ ...seleccionada, correo: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-[#8c8976]/50 bg-white text-[#333] focus:ring-2 focus:ring-[#b76e79] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setSeleccionada(null)}
                className="px-6 py-2 rounded-xl bg-[#708090] text-[#f6f4ef] hover:opacity-90 transition"
              >
                Cancelar
              </button>

              <button
                onClick={guardarCambios}
                className="px-6 py-2 rounded-xl bg-[#b76e79] text-[#f6f4ef] shadow-[0_10px_25px_rgba(140,137,118,0.4)] hover:scale-105 transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#8c8976] text-[#f6f4ef] hover:opacity-90"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}