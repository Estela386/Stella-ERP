"use client";

import { useState } from "react";

type Cuenta = {
  id: number;
  usuario: string;
  monto: number;
  proximoPago?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PaymentModal({ open, onClose }: Props) {
  const [cuentas, setCuentas] = useState<Cuenta[]>([
    { id: 1, usuario: "Estela", monto: 1200 },
    { id: 2, usuario: "Administrador", monto: 850 },
    { id: 3, usuario: "Invitado", monto: 0 },
  ]);

  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<Cuenta | null>(
    null
  );
  const [montoPago, setMontoPago] = useState<number>(0);
  const [metodo, setMetodo] = useState("Efectivo");

  if (!open) return null;

  const cuentasQueDeben = cuentas.filter(c => c.monto > 0);

  const formatearMoneda = (valor: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);

  const calcularProximaFecha = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    return fecha.toLocaleDateString("es-MX");
  };

  const confirmarPago = () => {
    if (!cuentaSeleccionada) return;

    if (montoPago <= 0) {
      alert("Ingresa un monto válido mayor a 0");
      return;
    }

    if (montoPago > cuentaSeleccionada.monto) {
      alert("El monto no puede ser mayor al pendiente");
      return;
    }

    const restante = cuentaSeleccionada.monto - montoPago;

    setCuentas(prev =>
      prev.map(c =>
        c.id === cuentaSeleccionada.id
          ? {
              ...c,
              monto: restante,
              proximoPago: restante > 0 ? calcularProximaFecha() : undefined,
            }
          : c
      )
    );

    setMontoPago(0);
    setCuentaSeleccionada(null);
  };

  const restante =
    cuentaSeleccionada && montoPago > 0
      ? cuentaSeleccionada.monto - montoPago
      : (cuentaSeleccionada?.monto ?? 0);

  return (
    <div className="fixed inset-0 bg-[#708090]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#f6f4ef] rounded-[32px] p-8 shadow-[0_40px_120px_rgba(140,137,118,0.35)] border border-[#8c8976]/30 space-y-6 transition-all duration-300">
        <h2 className="text-2xl font-semibold text-[#708090]">
          Abonar a Cuenta
        </h2>

        <select
          value={cuentaSeleccionada?.id || ""}
          onChange={e => {
            const cuenta = cuentas.find(c => c.id === Number(e.target.value));
            setCuentaSeleccionada(cuenta || null);
            setMontoPago(0);
          }}
          className="w-full p-3 rounded-xl border border-[#8c8976]/40 bg-[#f6f4ef] text-[#3F3A34] focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-[#b76e79] transition"
        >
          <option value="">Selecciona usuario</option>
          {cuentasQueDeben.map(cuenta => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.usuario}
              {/* {cuenta.usuario} - {formatearMoneda(cuenta.monto)} */}
            </option>
          ))}
        </select>

        {/* INFO CUENTA */}
        {cuentaSeleccionada && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl border border-[#8c8976]/30">
              <p className="text-sm text-[#708090]">Debe actualmente</p>
              <p className="font-semibold text-[#B76379]">
                {formatearMoneda(cuentaSeleccionada.monto)}
              </p>
            </div>

            <p className="text-sm text-[#708090]">Monto a abonar</p>
            <input
              type="number"
              placeholder="Monto a abonar"
              value={montoPago}
              min={0}
              max={cuentaSeleccionada.monto}
              onChange={e => setMontoPago(Number(e.target.value))}
              className="
              w-full p-3 rounded-xl
              border border-[#8c8976]/40
              bg-[#f6f4ef] text-[#3F3A34]
              placeholder:text-[#708090]
              focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-[#b76e79]
              transition
            "
            />

            <div className="bg-white p-3 rounded-xl border border-[#8c8976]/30">
              <p className="text-sm text-[#708090]">
                Restante después del abono
              </p>
              <p className="font-semibold text-[#3F3A34]">
                {formatearMoneda(restante < 0 ? 0 : restante)}
              </p>
            </div>

            {restante > 0 && montoPago > 0 && (
              <div className="bg-[#fdf2f4] p-3 rounded-xl border border-[#b76e79]/30">
                <p className="text-sm text-[#708090]">Próxima fecha de pago</p>
                <p className="font-semibold text-[#b76e79]">
                  {calcularProximaFecha()}
                </p>
              </div>
            )}
            <div className="bg-white p-3 rounded-xl border border-[#8c8976]/30">
              <p className="text-sm text-[#708090]">Próxima fecha de pago</p>
              <p className="font-semibold text-[#b76e79]">
                {calcularProximaFecha()}
              </p>
            </div>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#708090] text-[#f6f4ef] hover:opacity-90 transition"
          >
            Cancelar
          </button>

          <button
            onClick={confirmarPago}
            disabled={!cuentaSeleccionada}
            className="px-5 py-2 rounded-xl bg-[#b76e79] text-[#f6f4ef] shadow-[0_10px_25px_rgba(140,137,118,0.4)] hover:scale-105 transition disabled:opacity-40"
          >
            Confirmar Abono
          </button>
        </div>
      </div>
    </div>
  );
}
