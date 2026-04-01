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
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-[0_40px_100px_rgba(112,128,144,0.25)] border border-[#8c8976]/20 space-y-6 animate-in zoom-in-95 duration-300">
        <h2 
          className="text-2xl font-bold text-[#708090] tracking-tight"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Nuevo Cliente y Cuenta
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-sm text-[#b76e79] bg-[#b76e79]/5 px-4 py-3 rounded-2xl border border-[#b76e79]/10">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {[
            {
              label: "Nombre del cliente",
              value: nombre,
              setter: setNombre,
              type: "text",
              placeholder: "Ej: Juan Pérez"
            },
            {
              label: "Teléfono",
              value: telefono,
              setter: (v: string) => setTelefono(v.replace(/\D/g, "")),
              type: "tel",
              maxLength: 10,
              placeholder: "10 dígitos"
            },
            {
              label: "Concepto de deuda",
              value: concepto,
              setter: setConcepto,
              type: "text",
              placeholder: "Ej: Venta de joyería"
            },
          ].map(({ label, value, setter, type, maxLength, placeholder }) => (
            <div key={label} className="space-y-1.5">
              <label 
                className="text-xs font-bold text-[#708090] uppercase tracking-widest ml-1"
                style={{ fontFamily: "var(--font-marcellus)" }}
              >
                {label}
              </label>
              <input
                type={type}
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={e => setter(e.target.value)}
                className="w-full p-4 rounded-2xl border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3F3A34] focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all"
                style={{ fontFamily: "var(--font-poppins)" }}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label 
              className="text-xs font-bold text-[#708090] uppercase tracking-widest ml-1"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              Monto Inicial
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8976] font-bold">$</span>
              <input
                type="number"
                value={monto}
                min={1}
                onChange={e => setMonto(Number(e.target.value))}
                placeholder="0.00"
                className="w-full p-4 pl-8 rounded-2xl border border-[#8c8976]/20 bg-[#fcfbf9] text-[#3F3A34] font-semibold focus:outline-none focus:ring-4 focus:ring-[#b76e79]/5 focus:border-[#b76e79] transition-all"
                style={{ fontFamily: "var(--font-poppins)" }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-8 py-3.5 rounded-2xl bg-[#f6f4ef] text-[#708090] font-bold hover:bg-[#8c8976]/10 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-[#b76e79] text-white font-bold shadow-[0_10px_20px_-5px_rgba(183,110,121,0.4)] hover:bg-[#a55a65] hover:shadow-lg transition-all active:scale-95 disabled:opacity-40"
            style={{ fontFamily: "var(--font-marcellus)" }}
          >
            {loading ? "Procesando..." : "Registrar Todo"}
          </button>
        </div>
      </div>
    </div>
  );
}
