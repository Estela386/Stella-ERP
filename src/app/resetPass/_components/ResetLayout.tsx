"use client";
import Image from "next/image";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#F6F3EF]">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79] via-[#D1BBAA] to-[#708090]" />
        <div className="absolute inset-0">
          <div className="absolute w-[520px] h-[520px] bg-white/20 rounded-full -left-32 top-20 blur-md" />
          <div className="absolute w-[380px] h-[380px] bg-white/20 rounded-full left-40 bottom-10 blur-md" />
        </div>
        <div className="relative z-10 m-auto">
            <Image
              src="/stella logo.svg"
              alt="Stella"
              width={1500}
              height={1500}
              priority
              className="mx-auto w-[450px] h-auto"
            />
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        {children}
      </div>

    </div>
  );
}