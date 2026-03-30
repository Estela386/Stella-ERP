"use client";

import { useState } from "react";
import { ICliente } from "@lib/models/Cliente";

type Props = {
  open: boolean;
  onClose: () => void;
  clientes: ICliente[];
  onGuardar: (
    id_cliente: number,
    concepto: string,
    monto: number
  ) => Promise<{ error: string | null }>;
};

export default function AccountModal({
  open,
  onClose,
  clientes,
  onGuardar,
}: Props) {
  const [clienteId, setClienteId] = useState<number | "">("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGuardar = async () => {
    if (!clienteId || !concepto.trim() || !monto || Number(monto) <= 0) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await onGuardar(
      Number(clienteId),
      concepto,
      Number(monto)
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setClienteId("");
    setConcepto("");
    setMonto("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#f6f4ef] rounded-[32px] p-8 shadow-[0_40px_120px_rgba(140,137,118,0.35)] border border-[#8c8976]/30 space-y-5">
        <h2 className="text-2xl font-semibold text-[#708090]">
          Nueva Cuenta por Cobrar
        </h2>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">Cliente</label>
          <select
            value={clienteId}
            onChange={e => setClienteId(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
          >
            <option value="">Selecciona un cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.telefono}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">Concepto</label>
          <input
            type="text"
            value={concepto}
            onChange={e => setConcepto(e.target.value)}
            placeholder="Ej: Venta de productos"
            className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">Monto</label>
          <input
            type="number"
            value={monto}
            min={1}
            onChange={e => setMonto(Number(e.target.value))}
            placeholder="0.00"
            className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
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
            className="px-5 py-2 rounded-xl bg-[#b76e79] text-[#f6f4ef] hover:scale-105 transition disabled:opacity-40"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
