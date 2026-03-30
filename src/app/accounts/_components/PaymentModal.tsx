"use client";

import { useState } from "react";
import { ICuentasPorCobrar } from "@lib/models/CuentasPorCobrar";

type Props = {
  open: boolean;
  onClose: () => void;
  cuentas: ICuentasPorCobrar[];
  onPago: (
    id_cuenta: number,
    monto: number,
    metodo: string,
    obs?: string
  ) => Promise<{ error: string | null }>;
};

export default function PaymentModal({
  open,
  onClose,
  cuentas,
  onPago,
}: Props) {
  const [cuentaId, setCuentaId] = useState<number | "">("");
  const [monto, setMonto] = useState<number | "">("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const cuentasPendientes = cuentas.filter(c => c.estado !== "pagado");
  const cuentaSeleccionada = cuentas.find(c => c.id === cuentaId);
  const restante = cuentaSeleccionada
    ? cuentaSeleccionada.monto_pendiente - (Number(monto) || 0)
    : 0;

  const handleConfirmar = async () => {
    if (!cuentaId || !monto || Number(monto) <= 0) {
      setError("Selecciona una cuenta e ingresa un monto válido");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await onPago(
      Number(cuentaId),
      Number(monto),
      metodo,
      observaciones || undefined
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setCuentaId("");
    setMonto("");
    setObservaciones("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#f6f4ef] rounded-[32px] p-8 shadow-[0_40px_120px_rgba(140,137,118,0.35)] border border-[#8c8976]/30 space-y-5">
        <h2 className="text-2xl font-semibold text-[#708090]">
          Abonar a Cuenta
        </h2>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        {/* Selector de cuenta */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#708090]">Cuenta</label>
          <select
            value={cuentaId}
            onChange={e => {
              setCuentaId(Number(e.target.value));
              setMonto("");
            }}
            className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
          >
            <option value="">Selecciona una cuenta...</option>
            {cuentasPendientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.cliente?.nombre} — {c.concepto} ($
                {c.monto_pendiente.toLocaleString()} pendiente)
              </option>
            ))}
          </select>
        </div>

        {cuentaSeleccionada && (
          <>
            <div className="bg-white p-3 rounded-xl border border-[#8c8976]/30">
              <p className="text-sm text-[#708090]">Saldo pendiente</p>
              <p className="font-semibold text-[#b76e79]">
                ${cuentaSeleccionada.monto_pendiente.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#708090]">
                Monto a abonar
              </label>
              <input
                type="number"
                value={monto}
                min={1}
                max={cuentaSeleccionada.monto_pendiente}
                onChange={e => setMonto(Number(e.target.value))}
                placeholder="0.00"
                className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#708090]">
                Método de pago
              </label>
              <select
                value={metodo}
                onChange={e => setMetodo(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#708090]">
                Observaciones (opcional)
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                placeholder="Ej: Pago parcial de quincena"
                className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] transition"
              />
            </div>

            {Number(monto) > 0 && (
              <div className="bg-white p-3 rounded-xl border border-[#8c8976]/30">
                <p className="text-sm text-[#708090]">
                  Restante después del abono
                </p>
                <p className="font-semibold text-[#3F3A34]">
                  ${Math.max(0, restante).toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 rounded-xl bg-[#708090] text-[#f6f4ef] hover:opacity-90 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading || !cuentaId}
            className="cursor-pointer px-5 py-2 rounded-xl bg-[#b76e79] text-[#f6f4ef] hover:scale-105 transition disabled:opacity-40"
          >
            {loading ? "Guardando..." : "Confirmar Abono"}
          </button>
        </div>
      </div>
    </div>
  );
}
