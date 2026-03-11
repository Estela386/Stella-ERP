"use client"

import { X } from "lucide-react"

interface Props{
  onClose:()=>void
}

export default function ChatHeader({onClose}:Props){
  return(
    <div className="
    relative flex items-center gap-3 px-5 py-4
    bg-[#CBB2A1]/20
    border-b border-[#708090]/20
    shadow-[0_4px_12px_rgba(140,151,104,0.15)]
    z-20
    ">
      {/* Orbe decorativo izquierdo */}
      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-[#f6f3ef]/10 blur-xl pointer-events-none"/>
      {/* Orbe decorativo derecho */}
      <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-[#b76e79]/10 blur-xl pointer-events-none"/>

      {/* Línea shimmer en la parte superior */}
      <div className="shimmer-line absolute top-0 left-0 right-0 h-[2px]"/>

      {/* Avatar con animación float */}
      <div className="
      relative w-11 h-11 rounded-full shrink-0
      bg-[#708090]
      flex items-center justify-center
      shadow-[0_2px_8px_rgba(140,151,104,0.3)]
      ">
        {/* SVG Luna realista */}
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5 text-[#f6f4ef]"
          aria-hidden="true"
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.86 0 3.55.63 4.93 1.69-4.22.42-7.55 3.99-7.55 8.31 0 4.32 3.33 7.89 7.55 8.31C15.55 19.37 13.86 20 12 20z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-[15px] font-semibold text-[#708090] leading-tight tracking-wide">
          Asistente Luna
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b76e79] shadow-[0_0_6px_rgba(183,110,121,0.8)] animate-pulse"/>
          <p className="text-xs text-[#708090]">
            En línea · Joyería & Accesorios
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="
        relative z-10 w-8 h-8 shrink-0 rounded-full
        bg-[#B76E79]
        border border-[#708090]/20
        flex items-center justify-center
        text-[#f6f4ef]
        hover:bg-[#b76e79] hover:text-[#f6f4ef] hover:border-[#b76e79]
        hover:shadow-[0_2px_8px_rgba(183,110,121,0.3)]
        active:scale-90
        transition-all duration-200
        "
      >
        <X size={15} strokeWidth={2.5}/>
      </button>
    </div>
  )
}