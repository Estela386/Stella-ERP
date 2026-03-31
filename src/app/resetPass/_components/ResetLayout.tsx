"use client";

import Image from "next/image";

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
      El wrapper ocupa exactamente la pantalla sin scroll.
      En mobile: solo el form, centrado, con padding lateral.
      En desktop: card dividida en dos mitades, todo dentro de la pantalla.
    */
    <div
      className="h-dvh flex items-center justify-center px-4"
      style={{ background: "", overflow: "hidden" }}
    >
      {/* ── CARD ── */}
      <div
        className="
          relative w-full max-w-[1100px]
          bg-white rounded-3xl
          shadow-[0_32px_80px_rgba(0,0,0,0.11)]
          flex flex-col md:flex-row
          overflow-hidden
        "
        /*
          En mobile la altura se adapta al contenido del form.
          En desktop usamos 88dvh para que quepa en cualquier pantalla
          sin llegar a los bordes.
        */
        style={{ height: "auto", maxHeight: "88dvh" }}
      >
        {/* ── IZQUIERDA: FORMULARIO ── */}
        {/*
          "flex-1 min-h-0" hace que este panel nunca empuje
          al contenedor más allá de maxHeight.
          "overflow-hidden" en el panel + el form usa
          padding compacto para caber sin scroll.
        */}
        <div
          className="
            w-full md:w-1/2
            flex items-center justify-center
            overflow-hidden
          "
          style={{ padding: "clamp(16px, 3vw, 36px)" }}
        >
          {/*
            scale-down: si el form es más alto que el espacio disponible,
            el navegador lo escala hacia abajo automáticamente.
            Se mantiene legible hasta pantallas muy pequeñas.
          */}
          <div
            className="w-full"
            style={{
              maxWidth: 420,
              transformOrigin: "top center",
              /* Hace que el contenido se encoja si no cabe */
              zoom: "min(1, calc((88dvh - 32px) / 640px))",
            }}
          >
            {children}
          </div>
        </div>

        {/* ── DERECHA: GRADIENTE + LOGO ── */}
        {/* Oculto en mobile — el form ocupa todo el ancho */}
        <div
          className="hidden md:flex w-1/2 relative items-center justify-center"
        >
          {/* Gradiente de fondo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #B76E79 0%, #C9A99A 40%, #B76E79 170%)",
            }}
          />

          {/* Círculo decorativo */}
          <div
            className="absolute rounded-full"
            style={{
              width: "125%",
              paddingBottom: "125%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18) 0%, transparent 65%)",
              top: "-15%",
              left: "-15%",
            }}
          />

          {/* Logo + tagline */}
          <div className="relative z-10 flex flex-col items-center gap-3 text-center px-10">
            <Image
              src="/logo.png"
              alt="Stella"
              width={400}
              height={400}
              priority
              style={{
                objectFit: "contain",
                filter:
                  "invert(33%) sepia(14%) saturate(403%) hue-rotate(185deg) brightness(92%) contrast(90%)",
              }}
            />
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 240,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}