"use client";

import Image from "next/image";

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EF] overflow-hidden">
      {/* CONTENEDOR */}
      <div className="relative w-[1100px] h-[620px] bg-white rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.15)] flex overflow-hidden">
        {/* IZQUIERDA (FORMULARIO) */}
        <div className="w-1/2 flex items-center justify-center p-12">
          {children}
        </div>

        {/* DERECHA (CIRCULO GRADIENTE) */}
        <div className="w-1/2 relative flex items-center justify-center">
          {/* CIRCULO */}
          {/* <div className="
            absolute
            w-[700px]
            h-[700px]
            rounded-full
            bg-gradient-to-br
            from-[#B76E79]
            to-[#708090]
            right-[-200px]
            top-[-50px]
          "/> */}
          <div
            className="absolute  w-[800px]
            h-[800px]  rounded-full inset-0 bg-gradient-to-br from-[#B76E79] via-[#D1BBAA] to-[#708090] 
            top-[-95px] "
          />

          {/* TEXTO */}
          <div className="relative text-white max-w-sm text-center space-y-4">
          
            <Image
              src="/logo.png"
              alt="Stella"
              width={1500}
              height={1500}
              priority
              className="mb-2"
              style={{
                filter:
                  "invert(33%) sepia(14%) saturate(403%) hue-rotate(185deg) brightness(92%) contrast(90%)",
              }}
            />
            {/* <h1 className="text-4xl  text-[#F6F3EF] font-semibold  ">
              Restablecer acceso
            </h1>

            <p className="text-sm opacity-90 leading-relaxed ">
              Recupera el acceso a tu cuenta en pocos pasos. Sigue las
              instrucciones enviadas a tu correo electrónico.
            </p> */}

            {/* <button
              className="
              mt-4
              px-6 py-2
              rounded-full
              bg-white/20
              backdrop-blur
              hover:bg-white/30
              transition
            "
            >
              Saber más
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
