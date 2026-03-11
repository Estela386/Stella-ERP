"use client"

import { useState } from "react"
import { Message } from "../type"
import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import ChatQuickActions from "./ChatQuickActions"

interface Props{
  onClose:()=>void
}

export function getBotReply(input: string): Omit<Message, "id" | "sender"> {
  const lower = input.toLowerCase()

  if (lower.includes("pedido") || lower.includes("orden") || lower.includes("compra")) {
    return {
      text: "Claro, puedo ayudarte con eso. Selecciona lo que necesitas revisar sobre tus pedidos:",
      options: [
        { label: "Rastrear pedido", message: "Quiero rastrear mi pedido" },
        { label: "Cancelar orden", message: "Necesito cancelar mi orden" },
        { label: "Tiempos de envío", message: "¿Cuáles son los tiempos de envío?" },
        { label: "Reportar error", message: "Tengo un problema con mi pedido" }
      ]
    }
  }
  if (lower.includes("producto") || lower.includes("catálogo") || lower.includes("joya")) {
    return {
      text: "Nuestra colección de joyería artesanal es hermosa. 💎 ¿Qué categoría te gustaría explorar?",
      options: [
        { label: "Anillos", message: "Ver anillos de plata y oro" },
        { label: "Collares", message: "Ver la colección de collares" },
        { label: "Pulseras", message: "Ver pulseras y brazaletes" },
        { label: "Pendientes", message: "Ver pendientes y aretes" }
      ]
    }
  }
  if (lower.includes("pago") || lower.includes("cobro")) {
    return {
      text: "Ofrecemos múltiples opciones de pago, todas 100% seguras. ¿De qué necesitas información?",
      options: [
        { label: "Tarjetas aceptadas", message: "¿Qué tarjetas de crédito aceptan?" },
        { label: "Meses sin intereses", message: "Quiero ver opciones de meses sin intereses" },
        { label: "Pagar con PayPal", message: "¿Cómo pago con PayPal?" },
        { label: "Facturación", message: "Necesito apoyo con la facturación" }
      ]
    }
  }
  if (lower.includes("soporte") || lower.includes("ayuda") || lower.includes("problema")) {
    return {
      text: "El equipo de soporte está listo para asistirte. ¿Cómo te podemos ayudar hoy?",
      options: [
        { label: "Hablar con asesor", message: "Quiero hablar con un asesor humano" },
        { label: "Devoluciones", message: "¿Cómo funciona la política de devolución?" },
        { label: "Garantías", message: "Información sobre la garantía de mis joyas" },
        { label: "Cuidado de joyas", message: "¿Cómo debo cuidar mis productos?" }
      ]
    }
  }

  // Respuestas dinámicas si ya seleccionaron una subopción (mockups simples)
  if (lower.includes("rastrear") || lower.includes("estado")) {
    return {
      type: "card",
      data: { title: "Pedido #1452", description: "Estado: Enviado · Llega en 2-3 días hábiles" }
    }
  }
  if (lower.includes("anillos")) {
    return { text: "💍 ¡Perfecto! Los anillos son nuestra especialidad. Haz clic en 'Catálogo' en la web para ver existencias de tu talla." }
  }

  return {
    text: "Gracias por tu mensaje ☀️ Dinos, ¿en qué te puedo ayudar hoy? Escribe 'pedidos', 'productos', 'pagos' o 'soporte'."
  }
}

export default function ChatWindow({onClose}:Props){

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy Luna🌙, tu asistente de joyería. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      type: "text"
    }
  ])

  const [typing, setTyping] = useState(false)

  function sendMessage(text: string) {
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now(), text, sender: "user", type: "text" }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    setTimeout(() => {
      const reply = getBotReply(text)
      const botMsg: Message = { id: Date.now() + 1, sender: "bot", ...reply }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
    }, 1100)
  }

  return(
    <div className="
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
    ">
      <ChatHeader onClose={onClose}/>
      <ChatMessages messages={messages} typing={typing} onSend={sendMessage} />
      <ChatQuickActions onSend={sendMessage}/>
      <ChatInput onSend={sendMessage}/>
    </div>
  )
}