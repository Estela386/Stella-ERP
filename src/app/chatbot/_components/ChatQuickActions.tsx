"use client"

import { Package, CreditCard, ShoppingBag, LifeBuoy, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props{
  onSend: (message: string) => void
}

const ACTIONS = [
  { icon: Package,     label: "Pedidos",   message: "¿Cuáles son mis pedidos recientes?" },
  { icon: ShoppingBag, label: "Productos", message: "¿Qué productos tienen disponibles en su catálogo?" },
  { icon: CreditCard,  label: "Pagos",     message: "¿Cuáles son los métodos de pago disponibles?" },
  { icon: LifeBuoy,    label: "Soporte",   message: "Necesito ayuda con mi compra." },
  { icon: Star,        label: "Nosotros",  link: "/nosotros" },
]

export default function ChatQuickActions({ onSend }: Props){
  const router = useRouter()

  return(
    <div className="px-4 pb-4 pt-3 grid grid-cols-2 gap-2.5 border-t border-[#708090]/15">
      {ACTIONS.map(({ icon: Icon, label, message, link }) => (
        <button
          key={label}
          onClick={() => {
            if (link) {
              router.push(link)
            } else if (message) {
              onSend(message)
            }
          }}
          className={`
          flex items-center justify-center gap-1.5
          w-full
          text-[12px] sm:text-[13px] font-medium px-2 py-2.5
          rounded-[14px]
          bg-white
          border border-[#708090]/25
          text-[#708090]
          shadow-[0_1px_4px_rgba(140,151,104,0.08)]
          hover:bg-[#b76e79]
          hover:border-[#b76e79]
          hover:text-[#f6f4ef]
          hover:shadow-[0_4px_12px_rgba(140,151,104,0.25)]
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all duration-300
          group
          ${label === "Nosotros" ? "col-span-2" : ""}
          `}
        >
          <Icon size={14} className={`transition-colors duration-300 ${label === "Nosotros" ? "text-[#b76e79] group-hover:text-[#f6f4ef]" : "text-[#708090] group-hover:text-[#f6f4ef]"}`}/>
          {label}
        </button>
      ))}
    </div>
  )
}