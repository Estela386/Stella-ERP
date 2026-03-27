"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onGuardar: (
    nombre: string,
    telefono: string,
    concepto: string,
    monto: number
  ) => Promise<{ error: string | null }>;
};

export default function ClientModal({ open, onClose, onGuardar }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGuardar = async () => {
    if (
      !nombre.trim() ||
      !telefono.trim() ||
      !concepto.trim() ||
      !monto ||
      Number(monto) <= 0
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await onGuardar(
      nombre,
      telefono,
      concepto,
      Number(monto)
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setNombre("");
    setTelefono("");
    setConcepto("");
    setMonto("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#f6f4ef] rounded-[32px] p-8 shadow-[0_40px_120px_rgba(140,137,118,0.35)] border border-[#8c8976]/30 space-y-5">
        <h2 className="text-2xl font-semibold text-[#708090]">
          Nuevo Cliente y Cuenta
        </h2>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        {[
          {
            label: "Nombre del cliente",
            value: nombre,
            setter: setNombre,
            type: "text",
          },
          {
            label: "Teléfono",
            value: telefono,
            setter: (v: string) => setTelefono(v.replace(/\D/g, "")),
            type: "tel",
            maxLength: 10,
          },
          {
            label: "Concepto",
            value: concepto,
            setter: setConcepto,
            type: "text",
          },
        ].map(({ label, value, setter, type, maxLength }) => (
          <div key={label} className="space-y-1">
            <label className="text-sm font-medium text-[#708090]">
              {label}
            </label>
            <input
              type={type}
              value={value}
              maxLength={maxLength}
              onChange={e => setter(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#8C8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#B76379] transition"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">
            Monto inicial
          </label>
          <input
            type="number"
            value={monto}
            min={1}
            onChange={e => setMonto(Number(e.target.value))}
            placeholder="0.00"
            className="w-full p-3 rounded-xl border border-[#8C8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#B76379] transition"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#708090] text-[#f6f4ef] hover:opacity-90 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[#B76379] text-[#f6f4ef] hover:scale-105 transition disabled:opacity-40"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
