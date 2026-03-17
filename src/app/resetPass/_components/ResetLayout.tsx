"use client";

import Image from "next/image";

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden px-4">
      {/* CONTENEDOR */}
      <div
        className="
        relative
        w-full
        max-w-[1100px]
        h-auto
        md:h-[620px]
        bg-white
        rounded-3xl
        shadow-[0_40px_120px_rgba(0,0,0,0.15)]
        flex
        flex-col md:flex-row
        overflow-hidden
      "
      >
        {/* IZQUIERDA (FORMULARIO) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          {children}
        </div>

        {/* DERECHA (CIRCULO GRADIENTE) */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center mt-6 md:mt-0">
          {/* CIRCULO */}
          <div
            className="
              absolute
              w-[600px] sm:w-[700px] md:w-[800px]
              h-[600px] sm:h-[700px] md:h-[800px]
              rounded-full
              inset-0
              bg-gradient-to-br
              from-[#B76E79]
              via-[#D1BBAA]
              to-[#708090]
              top-[-80px] md:top-[-95px]
              right-[-50px] md:right-[-0px]
            "
          />

          {/* TEXTO */}
          <div className="relative text-white max-w-sm text-center space-y-4 px-4">
            <Image
              src="/logo.png"
              alt="Stella"
              width={1500}
              height={1500}
              priority
              className="mx-auto mb-2 w-32 h-32 sm:w-36 sm:h-36"
              style={{
                filter:
                  "invert(33%) sepia(14%) saturate(403%) hue-rotate(185deg) brightness(92%) contrast(90%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
