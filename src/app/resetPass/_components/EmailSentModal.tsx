"use client";

import { X, MailCheck } from "lucide-react";

export default function EmailSentModal({
  onAccept,
  onClose,
}: {
  onAccept: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40 backdrop-blur-md
        flex items-center justify-center
        px-4
      "
    >
      {/* CARD */}
      <div
        className="
          w-full max-w-md
          bg-[#F6F3EF]
          rounded-3xl
          p-8
          space-y-6
          border border-[#D1BBAA]/60
          shadow-[0_40px_90px_rgba(0,0,0,0.25)]
          relative
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-[#708090]
            hover:text-[#B76E79]
            transition
          "
        >
          <X size={22} />
        </button>

        {/* ICON */}
        <div className="flex justify-center">
          <div
            className="
              bg-[#B76E79]/15
              p-4
              rounded-full
              shadow-inner
            "
          >
            <MailCheck size={38} className="text-[#B76E79]" />
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-2xl font-semibold text-[#708090] text-center">
          Código enviado
        </h3>

        {/* TEXT */}
        <p className="text-sm text-[#708090]/90 text-center leading-relaxed">
          Hemos enviado un enlace a tu correo para restablecer tu contraseña.
          <br />
          <strong>Haz clic en el enlace del email</strong> para continuar con el
          cambio de contraseña.
          <br />
          <span className="text-xs text-[#8C8976]">
            Revisa tu bandeja de entrada o spam si no lo ves.
          </span>
        </p>

        {/* BUTTON */}
        <button
          onClick={onAccept}
          className="
            w-full
            py-3
            rounded-full
            bg-[#708090]
            text-white
            font-medium
            shadow-[0_12px_24px_rgba(0,0,0,0.2)]
            hover:bg-[#5F6F7F]
            active:scale-[0.98]
            transition
          "
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
