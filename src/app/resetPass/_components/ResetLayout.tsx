"use client";

import Image from "next/image";

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F3EF] flex flex-col items-center justify-center px-4">

      {/* ===== LOGO Y MARCA ===== */}
      <div className="text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3">

        {/* LOGO RESPONSIVE */}
        <Image
          src="/LogoS.png"
          alt="Stella"
          width={220}
          height={220}
          priority
          className="
            mx-auto
            w-[120px]
            sm:w-[160px]
            md:w-[200px]
            lg:w-[220px]
            h-auto
          "
        />
          <h1
            className="
              font-serif
              text-4xl sm:text-5xl md:text-6xl
              text-[#3F3A34]
              tracking-wide
            "
          >
            Stella
          </h1>
      </div>

      {/* ===== TARJETA ===== */}
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-[40px]
          p-3
          shadow-[0_70px_140px_rgba(0,0,0,0.22)]
        "
      >
        {children}
      </div>

    </div>
  );
}