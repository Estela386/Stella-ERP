"use client"

import { X, MessageCircle } from "lucide-react"

interface Props{
  onClick:()=>void
  isOpen: boolean
}

export default function ChatBubble({ onClick, isOpen }:Props){
  return(
    <div className="fixed bottom-4 right-2 sm:bottom-8 sm:right-8 z-50">
      {/* Anillo pulsante externo */}
      <span className="
      ring-pulse
      absolute inset-0 rounded-full
      "/>

      <button
        onClick={onClick}
        className="
        relative
        w-14 h-14 sm:w-16 sm:h-16
        rounded-full
        flex items-center justify-center
        bg-[#708090]
        border border-[#708090]/50
        shadow-[0_8px_32px_rgba(140,151,104,0.3)]
        hover:shadow-[0_12px_40px_rgba(140,151,104,0.4)]
        hover:bg-[#b76e79] hover:border-[#b76e79]
        hover:scale-105 active:scale-95 transition-all duration-300
        "
      >
        <div 
          className={`
            transition-transform duration-500 absolute
            ${isOpen ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}
          `}
        >
          <MessageCircle className="w-6 h-6 text-[#f6f4ef] gem-float drop-shadow-sm" />
        </div>

        <div 
          className={`
            transition-transform duration-500 absolute
            ${isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-180 opacity-0 scale-50"}
          `}
        >
          <X size={26} color="#f6f4ef" />
        </div>
      </button>
    </div>
  )
}