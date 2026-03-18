"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShieldCheck, Gem, Sparkles, Facebook, Twitter, Instagram } from "lucide-react"
import HeaderClient from "@/app/(auth)/_components/HeaderClient"
import { useAuth } from "@/lib/hooks/useAuth"
import ReviewCard, { Review } from "./_components/ReviewCard"
import WholesaleSection from "./_components/WholesaleSection"
import ChatbotPage from "@/app/chatbot/page"
import Footer from "@/app/(auth)/_components/Footer"

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Olimpia Chat",
    role: "COMPRADOR FRECUENTE",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Las joyas son hermosas y la atención fue increíble. Compré un collar de plata para un regalo y llegó al día siguiente con una presentación impecable. Definitivamente volveré a comprar.",
    platformIcon: Facebook
  },
  {
    id: 2,
    name: "Linda Anand",
    role: "CLIENTE VERIFICADO",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "Compré mi anillo de compromiso aquí. El nivel de detalle y la calidad superaron mis expectativas. A mi prometida le fascinó.",
    platformIcon: Instagram
  },
  {
    id: 3,
    name: "David Gueta",
    role: "ARTISTA",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    text: "Muy buena calidad y diseños exclusivos. Tuve una duda con mi pedido y el soporte por chat me lo resolvió al instante.",
    platformIcon: Twitter
  }
]

export default function NosotrosPage() {
  const router = useRouter()
  const { usuario } = useAuth()

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex flex-col">
      <HeaderClient user={usuario} />
      <ChatbotPage />
      {/* ABOUT US CONTENT */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20 mt-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#708090] mb-6">
            Nuestra <span className="text-[#b76e79]">Historia</span>
          </h2>
          <p className="text-[#708090] max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Stella Joyería nació con la convicción de que cada pieza de joyería debe ser tan única como la persona que la porta. 
            No somos solo una tienda, somos un equipo de artesanos y diseñadores apasionados por llevar la belleza, la elegancia y la exclusividad a tu vida cotidiana.
          </p>
        </div>

        {/* Values / Cards (Using the requested styling 708090, b76e79, 8c9768 shadows) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="
            bg-white rounded-2xl p-8 
            shadow-[0_15px_40px_rgba(140,151,104,0.12)]
            border border-[#708090]/10
            flex flex-col items-center text-center
            transition-transform duration-300 hover:-translate-y-2
          ">
            <div className="w-16 h-16 rounded-full bg-[#b76e79]/10 flex items-center justify-center mb-6">
              <Gem className="w-8 h-8 text-[#b76e79]" />
            </div>
            <h3 className="text-xl font-bold text-[#708090] mb-3">Calidad Premium</h3>
            <p className="text-[#708090]/80 text-sm">
              Seleccionamos meticulosamente cada material. Nuestras gemas y metales pasan por estrictos controles para garantizar su brillo y durabilidad de por vida.
            </p>
          </div>

          <div className="
            bg-white rounded-2xl p-8 
            shadow-[0_15px_40px_rgba(140,151,104,0.12)]
            border border-[#708090]/10
            flex flex-col items-center text-center
            transition-transform duration-300 hover:-translate-y-2
          ">
            <div className="w-16 h-16 rounded-full bg-[#b76e79]/10 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-[#b76e79]" />
            </div>
            <h3 className="text-xl font-bold text-[#708090] mb-3">Diseño Exclusivo</h3>
            <p className="text-[#708090]/80 text-sm">
              Cada colección es limitada. Diseñamos pensando en la estética contemporánea sin perder el toque clásico que convierte a una joya en una reliquia.
            </p>
          </div>

          <div className="
            bg-white rounded-2xl p-8 
            shadow-[0_15px_40px_rgba(140,151,104,0.12)]
            border border-[#708090]/10
            flex flex-col items-center text-center
            transition-transform duration-300 hover:-translate-y-2
          ">
            <div className="w-16 h-16 rounded-full bg-[#b76e79]/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-[#b76e79]" />
            </div>
            <h3 className="text-xl font-bold text-[#708090] mb-3">Confianza Absoluta</h3>
            <p className="text-[#708090]/80 text-sm">
              Tu tranquilidad es nuestra prioridad. Ofrecemos pagos encriptados, envíos asegurados y una política de devolución transparente.
            </p>
          </div>
        </div>

        {/* Reseñas Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#708090] mb-4">
              Lo que dicen <span className="text-[#b76e79]">Nuestros Clientes</span>
            </h2>
            <p className="text-[#708090]/80 max-w-2xl mx-auto text-sm md:text-base">
              Nos enorgullece recibir el cariño de las personas que confían en nosotros para sus momentos inolvidables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {REVIEWS.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Wholesale Section */}
        <WholesaleSection />

        {/* Banner Section */}
        <div className="
          bg-[#708090]
          rounded-2xl p-8 md:p-12
          flex flex-col md:flex-row items-center justify-between
          shadow-[0_15px_40px_rgba(140,151,104,0.3)]
          border border-[#708090]/20
        ">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#f6f4ef] mb-3">
              Descubre tu brillo interior
            </h3>
            <p className="text-[#f6f4ef]/80 max-w-lg">
              Explora nuestro catálogo y encuentra esa pieza que hablará por ti sin decir una sola palabra.
            </p>
          </div>
          <button 
            onClick={() => router.push("/dashboard/cliente/catalogo")}
            className="
            mt-6 md:mt-0
            px-8 py-3 rounded-full
            bg-[#b76e79] border border-[#b76e79]
            text-[#f6f4ef] font-bold tracking-wide
            hover:bg-[#a05e68] hover:border-[#a05e68]
            shadow-[0_4px_14px_rgba(183,110,121,0.4)]
            hover:shadow-[0_6px_20px_rgba(183,110,121,0.5)]
            hover:-translate-y-1
            transition-all duration-300
          ">
            VER CATÁLOGO
          </button>
        </div>

      </div>
      <Footer />
    </div>
  )
}
