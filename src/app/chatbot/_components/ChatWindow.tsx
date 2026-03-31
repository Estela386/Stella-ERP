"use client";

import { useState } from "react";
import { Message } from "../type";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatQuickActions from "./ChatQuickActions";

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy Luna🌙, tu asistente de joyería. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      type: "text",
    },
  ]);

  const [typing, setTyping] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    if (typing) {
      console.warn(
        "Aún se está procesando la respuesta anterior. Espera un momento."
      );
      return;
    }

    if (Date.now() - lastSentAt < 1200) {
      console.warn(
        "Demasiadas peticiones rápidas. Espera un momento antes de enviar otro mensaje."
      );
      return;
    }

    setLastSentAt(Date.now());

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: "user",
      type: "text",
    };
    const messagesToSend = [...messages, userMsg].map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesToSend,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const botText = data.choices[0].message.content;
        const botMsg: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: botText,
          type: "text",
        };
        setMessages(prev => [...prev, botMsg]);
        setTyping(false);
      })
      .catch(err => {
        console.error("Error fetching bot response:", err);
        setTyping(false);
        // Optionally add an error message
        const errorMsg: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.",
          type: "text",
        };
        setMessages(prev => [...prev, errorMsg]);
      });
  }

  return (
    <div
      className="
    fixed bottom-4 right-2 sm:bottom-28 sm:right-8
    w-[calc(100vw-1rem)] sm:w-[390px]
    h-[calc(100dvh-5rem)] sm:h-[600px]
    max-w-[430px] max-h-[700px]
    rounded-[24px] sm:rounded-[28px]
    overflow-hidden
    flex flex-col
    bg-[#f6f4ef]
    border border-[#708090]/20
    shadow-[0_20px_60px_rgba(140,151,104,0.2),0_4px_20px_rgba(140,151,104,0.1)]
    "
    >
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} typing={typing} onSend={sendMessage} />
      <ChatQuickActions onSend={sendMessage} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
