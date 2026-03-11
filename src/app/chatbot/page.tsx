"use client";

import { useState, useEffect } from "react";
import ChatBubble from "./_components/ChatBubble";
import ChatWindow from "./_components/ChatWindow";

export default function ChatbotPage() {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);

  // Efecto para manejar el montaje/desmontaje con animación
  useEffect(() => {
    if (open) setRender(true);
  }, [open]);

  function handleAnimationEnd() {
    if (!open) setRender(false);
  }

  return (
    <>
      {/* Contenedor del ChatWindow con animación pura de CSS */}
      <div 
        className={`
          fixed bottom-0 right-0 z-[9999] pointer-events-none w-full h-full flex justify-end items-end
        `}
      >
        <div
          className={`
            transition-all duration-300 transform origin-bottom-right pointer-events-auto
            ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"}
          `}
          onTransitionEnd={handleAnimationEnd}
        >
          {render && <ChatWindow onClose={() => setOpen(false)} />}
        </div>
      </div>

      <div className="z-[10000] relative">
        <ChatBubble onClick={() => setOpen(!open)} isOpen={open} />
      </div>
    </>
  );
}