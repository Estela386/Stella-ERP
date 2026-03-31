import { useState, useEffect } from "react";
import { ICuentasPorCobrar } from "@lib/models/CuentasPorCobrar";

type Props = {
  open: boolean;
  onClose: () => void;
  cuentas: ICuentasPorCobrar[];
  selectedCuentaId?: number | null;
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
  selectedCuentaId,
  onPago,
}: Props) {
  const [cuentaId, setCuentaId] = useState<number | "">("");

  useEffect(() => {
    if (open && selectedCuentaId) {
      setCuentaId(selectedCuentaId);
    } else if (open && !selectedCuentaId) {
      setCuentaId("");
    }
  }, [open, selectedCuentaId]);
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
      <div className="w-[750px] bg-white rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(112,128,144,0.3)] border border-[#8c8976]/20 space-y-6 animate-in zoom-in-95 duration-300">
        <h2 
          className="text-3xl font-bold text-[#708090] tracking-tight text-center mb-0"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Abonar a Cuenta
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-sm text-[#b76e79] bg-[#b76e79]/5 px-4 py-3 rounded-2xl border border-[#b76e79]/10">
            <span>{error}</span>
          </div>
        )}

        {/* Selector de cuenta */}
        <div className="space-y-2">
          <label 
            className="text-[10px] font-bold text-[#708090] uppercase tracking-widest ml-1"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            Seleccionar Cuenta
          </label>
          <select
            value={cuentaId}
            onChange={e => {
              setCuentaId(Number(e.target.value));
              setMonto("");
            }}
            className="w-full p-4 rounded-[1.25rem] border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3F3A34] text-base font-medium focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all appearance-none"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <option value="">Selecciona una cuenta...</option>
            {cuentasPendientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.cliente?.nombre} — {c.concepto}
              </option>
            ))}
          </select>
        </div>

        {cuentaSeleccionada && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#f6f4ef]/50 p-5 rounded-2xl border border-[#8c8976]/10">
                <p className="text-[9px] text-[#708090] uppercase font-bold tracking-widest mb-1">Saldo Actual</p>
                <p className="text-2xl font-bold text-[#b76e79]" style={{ fontFamily: "var(--font-poppins)" }}>
                  ${cuentaSeleccionada.monto_pendiente.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#708090]/5 p-5 rounded-2xl border border-[#708090]/10">
                <p className="text-[9px] text-[#708090] uppercase font-bold tracking-widest mb-1">Nuevo Saldo</p>
                <p className="text-2xl font-bold text-[#708090]" style={{ fontFamily: "var(--font-poppins)" }}>
                  ${Math.max(0, restante).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label 
                  className="text-[10px] font-bold text-[#708090] uppercase tracking-widest ml-1"
                  style={{ fontFamily: "var(--font-marcellus)" }}
                >
                  Monto del Abono
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8c8976] text-lg font-bold">$</span>
                  <input
                    type="number"
                    value={monto}
                    min={1}
                    max={cuentaSeleccionada.monto_pendiente}
                    onChange={e => setMonto(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full p-4 pl-10 rounded-[1.25rem] border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3d8c60] text-lg font-bold focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label 
                  className="text-[10px] font-bold text-[#708090] uppercase tracking-widest ml-1"
                  style={{ fontFamily: "var(--font-marcellus)" }}
                >
                  Método de pago
                </label>
                <select
                  value={metodo}
                  onChange={e => setMetodo(e.target.value)}
                  className="w-full p-4 rounded-[1.25rem] border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3F3A34] text-base font-medium focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all appearance-none"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label 
                className="text-[10px] font-bold text-[#708090] uppercase tracking-widest ml-1"
                style={{ fontFamily: "var(--font-marcellus)" }}
              >
                Observaciones (opcional)
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                placeholder="Ej: Pago quincenal"
                className="w-full p-4 rounded-[1.25rem] border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3F3A34] text-base focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all"
                style={{ fontFamily: "var(--font-poppins)" }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-[#8c8976]/10">
          <button
            onClick={onClose}
            className="px-8 py-3.5 rounded-2xl bg-[#f6f4ef] text-[#708090] font-bold text-base hover:bg-[#8c8976]/10 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading || !cuentaId}
            className="px-10 py-3.5 rounded-2xl bg-[#b76e79] text-white font-bold text-base shadow-[0_15px_30px_-5px_rgba(183,110,121,0.4)] hover:bg-[#a55a65] hover:shadow-xl transition-all active:scale-95 disabled:opacity-40"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            {loading ? "Procesando..." : "Confirmar Abono"}
          </button>
        </div>
      </div>
    </div>
  );
}
