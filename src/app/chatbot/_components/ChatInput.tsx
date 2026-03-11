"use client"

import { useState } from "react"
import { Send } from "lucide-react"

interface Props {
  onSend: (message: string) => void
}

export default function ChatInput({ onSend }: Props) {

  const [text, setText] = useState("")

  function handleSend() {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="
    p-4 bg-white/70 backdrop-blur-sm
    flex gap-3
    border-t border-[#708090]/10
    ">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        className="
        flex-1
        bg-[#f6f4ef]
        border border-[#708090]/20
        rounded-full
        px-4 py-2.5
        text-sm text-[#708090]
        placeholder:text-[#708090]/60
        outline-none
        focus:border-[#b76e79]/50
        focus:shadow-[0_0_0_3px_rgba(183,110,121,0.08)]
        transition-all duration-200
        "
      />
      <button
        onClick={handleSend}
        className="
        w-11 h-11
        rounded-full
        flex items-center justify-center
        bg-[#708090] text-[#f6f4ef]
        shadow-[0_4px_12px_rgba(140,151,104,0.2)]
        hover:shadow-[0_6px_16px_rgba(140,151,104,0.3)]
        hover:bg-[#b76e79]
        hover:scale-105
        active:scale-95
        transition-all duration-200
        "
      >
        <Send size={16} color="#f6f4ef"/>
      </button>
    </div>
  )
}