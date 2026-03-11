"use client"

import { Message } from "../type"
import TypingIndicator from "./TypingIndicator"
import MessageCard from "./MessageCard"
import { useEffect, useRef } from "react"

interface Props{
  messages: Message[]
  typing: boolean
  onSend: (message: string) => void
}

export default function ChatMessages({ messages, typing, onSend }: Props){
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  return(
    <div 
      ref={scrollRef}
      className="
      flex-1 px-4 py-5 space-y-4 overflow-y-auto
      bg-transparent
      scrollbar-thin scrollbar-thumb-[#708090]/30 scrollbar-track-transparent
      "
    >
      {messages.map((msg, i) => {

        if (msg.type === "card") {
          return (
            <div key={msg.id} className="chat-msg-enter" style={{ animationDelay: `0ms` }}>
              <MessageCard title={msg.data!.title} description={msg.data!.description}/>
            </div>
          )
        }

        return(
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "bot" ? "items-start" : "items-end"}`}
          >
            <div
              className={`
              chat-msg-enter
              max-w-[85%] sm:max-w-[80%] px-4 py-3 text-[14px] leading-relaxed
              ${msg.sender === "bot"
                ? `bg-white text-[#708090]
                   border border-[#708090]/15
                   shadow-[0_2px_12px_rgba(140,151,104,0.1)]
                   rounded-2xl rounded-bl-sm`
                : `bg-[#708090] text-[#f6f4ef]
                   shadow-[0_4px_16px_rgba(140,151,104,0.25)]
                   border border-[#708090]
                   rounded-2xl rounded-br-sm`
              }`}
            >
              {msg.text}
            </div>

            {/* Fichas interactivas (2x2 grid) en escritorio y móvil */}
            {msg.options && (
              <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-[95%] sm:max-w-[90%]">
                {msg.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(opt.message)}
                    className="
                    flex items-center justify-center text-center
                    text-[12px] sm:text-[13px] px-2 py-2.5 rounded-xl
                    bg-white border border-[#708090]/30
                    text-[#708090] font-medium leading-tight
                    shadow-[0_1px_4px_rgba(140,151,104,0.08)]
                    hover:bg-[#b76e79] hover:border-[#b76e79] hover:text-[#f6f4ef]
                    hover:shadow-[0_4px_12px_rgba(140,151,104,0.2)]
                    hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                    transition-all duration-300
                    chat-msg-enter
                    "
                    style={{ animationDelay: `${150 + idx * 75}ms` }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      })}

      {typing && (
        <div className="chat-msg-enter flex items-start">
          <TypingIndicator/>
        </div>
      )}
    </div>
  )
}