import { ProductoService, SorteoService, CategoriaService, ReviewService } from "@lib/services";
import { createClient } from "@utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import SorteoWidget from "./_components/SorteoWidget";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import ProductFunnelClient from "./_components/ProductFunnelClient";
import Countdown from "./_components/Countdown";
import SocialProof from "./_components/SocialProof";
import { 
  ShoppingBag, ArrowRight, Heart, Sparkles, 
  Truck, ShieldCheck, Gift as GiftIcon, Instagram, 
  ChevronRight, Gem, Star, Circle, CheckCircle2,
  Crown, Layout
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);
    const sorteoService = new SorteoService(supabase);
    const categoriaService = new CategoriaService(supabase);
    
    // 1. Obtener productos
    const { productos, error } = await productoService.obtenerTodos();
    
    // 2. Obtener sorteo activo
    const { data: sorteo } = await sorteoService.obtenerSorteoActivo();
    
    // 3. Obtener categorías para la sección de temas
    const { categorias } = await categoriaService.obtenerTodas();

    // 4. Obtener beneficios dinámicos
    const { data: beneficios } = await supabase
      .from("landing_beneficios")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    // 5. Obtener reseñas reales y participantes
    const reviewService = new ReviewService(supabase);
    const { reviews: reviewsDB } = await reviewService.obtenerPorProducto("landing"); 
    
    let participantesCount = 120; // Default fallback
    if (sorteo?.id) {
      const { data: participantes } = await sorteoService.obtenerParticipantes(sorteo.id);
      if (participantes) {
        participantesCount = participantes.length;
      }
    }
    
    // Fecha fin para el countdown
    const fechaFin = sorteo?.fecha_fin || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    if (error || !productos) {
      return (
        <div className="min-h-screen bg-[#fcfcf8] px-4 py-12 flex items-center justify-center font-serif italic text-[#b76e79]">
           Error al conectar con la colección...
        </div>
      );
    }

    return (
      <div className="min-h-screen text-[#1a1a2e] selection:bg-[#b76e79]/20 selection:text-[#b76e79] relative" style={{ background: "#f6f4ef" }}>
        
        {/* ── ESTRELLAS DECORATIVAS FIJAS EN TODA LA PÁGINA ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Grande - arriba izquierda */}
          <div className="absolute top-[5%] left-[3%] w-24 h-24 opacity-[0.07]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 25s linear infinite" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Pequeña - arriba centro-derecha */}
          <div className="absolute top-[8%] left-[60%] w-10 h-10 opacity-[0.1]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 18s linear infinite reverse" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Mediana - arriba derecha */}
          <div className="absolute top-[2%] right-[5%] w-16 h-16 opacity-[0.08]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 30s linear infinite" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Grande - centro izquierda */}
          <div className="absolute top-[35%] left-[1%] w-20 h-20 opacity-[0.06]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 40s linear infinite reverse" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#708090"/>
            </svg>
          </div>
          {/* Pequeña - centro */}
          <div className="absolute top-[42%] left-[48%] w-8 h-8 opacity-[0.08]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 15s linear infinite" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Mediana - centro derecha */}
          <div className="absolute top-[50%] right-[3%] w-14 h-14 opacity-[0.09]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 22s linear infinite reverse" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Pequeña - 3/4 izquierda */}
          <div className="absolute top-[70%] left-[10%] w-10 h-10 opacity-[0.07]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 20s linear infinite" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#708090"/>
            </svg>
          </div>
          {/* Grande - abajo centro */}
          <div className="absolute top-[78%] left-[40%] w-28 h-28 opacity-[0.05]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 50s linear infinite reverse" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Mediana - abajo derecha */}
          <div className="absolute top-[85%] right-[8%] w-16 h-16 opacity-[0.08]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 28s linear infinite" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
          {/* Pequeña - abajo izquierda */}
          <div className="absolute top-[92%] left-[25%] w-8 h-8 opacity-[0.1]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: "spin 12s linear infinite reverse" }}>
              <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 15L51.5 48.5L85 50L51.5 51.5L50 85L48.5 51.5L15 50L48.5 48.5L50 15Z" fill="#b76e79"/>
            </svg>
          </div>
        </div>

        <HeaderClient />

        {/* ── 1. HERO (Impacto Inmediato) ── */}
        <header className="relative pt-10 pb-6 sm:pt-16 sm:pb-10 px-6 sm:px-8 overflow-hidden bg-[#f6f4ef]">

           {/* ── ESTRELLAS GIRATORIAS DEL HERO ── */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Filtramos algunas estrellas en móvil para que no se vea saturado */}
             {[
               { top:"4%",  left:"3%",  size:32, dur:"18s", rev:false, op:"0.45", hideMobile: false },
               { top:"2%",  left:"14%", size:16, dur:"10s", rev:true,  op:"0.35", hideMobile: true },
               { top:"6%",  left:"25%", size:24, dur:"22s", rev:false, op:"0.40", hideMobile: false },
               { top:"1%",  left:"38%", size:14, dur:"8s",  rev:true,  op:"0.45", hideMobile: true },
               { top:"5%",  left:"52%", size:20, dur:"20s", rev:false, op:"0.38", hideMobile: false },
               { top:"3%",  left:"65%", size:14, dur:"12s", rev:true,  op:"0.42", hideMobile: true },
               { top:"7%",  left:"76%", size:28, dur:"25s", rev:false, op:"0.36", hideMobile: false },
               { top:"2%",  left:"88%", size:18, dur:"14s", rev:true,  op:"0.48", hideMobile: true },
               { top:"8%",  left:"96%", size:32, dur:"19s", rev:false, op:"0.33", hideMobile: false },
               // Fila media-alta
               { top:"22%", left:"1%",  size:20, dur:"16s", rev:true,  op:"0.38", hideMobile: true },
               { top:"18%", left:"10%", size:36, dur:"30s", rev:false, op:"0.30", hideMobile: false },
               { top:"25%", left:"20%", size:12, dur:"9s",  rev:true,  op:"0.50", hideMobile: true },
               { top:"20%", left:"32%", size:24, dur:"21s", rev:false, op:"0.35", hideMobile: false },
               { top:"28%", left:"44%", size:16, dur:"13s", rev:true,  op:"0.42", hideMobile: true },
               { top:"19%", left:"56%", size:30, dur:"26s", rev:false, op:"0.33", hideMobile: false },
               { top:"26%", left:"70%", size:12, dur:"11s", rev:true,  op:"0.46", hideMobile: true },
               { top:"21%", left:"82%", size:34, dur:"28s", rev:false, op:"0.30", hideMobile: false },
               { top:"30%", left:"93%", size:18, dur:"15s", rev:true,  op:"0.40", hideMobile: true },
               // Fila media
               { top:"45%", left:"4%",  size:14, dur:"12s", rev:false, op:"0.44", hideMobile: false },
               { top:"48%", left:"16%", size:28, dur:"23s", rev:true,  op:"0.32", hideMobile: true },
               { top:"50%", left:"88%", size:24, dur:"20s", rev:false, op:"0.38", hideMobile: false },
               { top:"43%", left:"96%", size:12, dur:"9s",  rev:true,  op:"0.50", hideMobile: true },
               // Fila media-baja
               { top:"64%", left:"2%",  size:32, dur:"27s", rev:true,  op:"0.30", hideMobile: false },
               { top:"68%", left:"12%", size:16, dur:"13s", rev:false, op:"0.44", hideMobile: true },
               { top:"62%", left:"23%", size:22, dur:"18s", rev:true,  op:"0.37", hideMobile: false },
               { top:"70%", left:"35%", size:12, dur:"8s",  rev:false, op:"0.50", hideMobile: true },
               { top:"65%", left:"48%", size:28, dur:"24s", rev:true,  op:"0.33", hideMobile: false },
               { top:"72%", left:"60%", size:18, dur:"16s", rev:false, op:"0.42", hideMobile: true },
               { top:"63%", left:"73%", size:34, dur:"29s", rev:true,  op:"0.30", hideMobile: false },
               { top:"68%", left:"85%", size:14, dur:"11s", rev:false, op:"0.46", hideMobile: true },
               { top:"66%", left:"95%", size:20, dur:"17s", rev:true,  op:"0.38", hideMobile: false },
               // Fila inferior
               { top:"85%", left:"5%",  size:24, dur:"20s", rev:false, op:"0.38", hideMobile: false },
               { top:"88%", left:"17%", size:12, dur:"10s", rev:true,  op:"0.50", hideMobile: true },
               { top:"82%", left:"30%", size:36, dur:"32s", rev:false, op:"0.30", hideMobile: false },
               { top:"90%", left:"44%", size:16, dur:"13s", rev:true,  op:"0.44", hideMobile: true },
               { top:"84%", left:"58%", size:24, dur:"22s", rev:false, op:"0.36", hideMobile: false },
               { top:"89%", left:"70%", size:14, dur:"11s", rev:true,  op:"0.46", hideMobile: true },
               { top:"83%", left:"82%", size:30, dur:"26s", rev:false, op:"0.33", hideMobile: false },
               { top:"91%", left:"93%", size:20, dur:"15s", rev:true,  op:"0.42", hideMobile: true },
             ].map((s, i) => (
               <div key={i} className={`absolute ${s.hideMobile ? 'hidden sm:block' : 'block'}`} style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.op }}>
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ animation: `spin ${s.dur} linear infinite ${s.rev ? "reverse" : ""}` }}>
                   <path d="M50 0L52.5 47.5L100 50L52.5 52.5L50 100L47.5 52.5L0 50L47.5 47.5L50 0Z M50 18L51.2 48.8L82 50L51.2 51.2L50 82L48.8 51.2L18 50L48.8 48.8L50 18Z" fill="#b76e79"/>
                 </svg>
               </div>
             ))}
           </div>

           {/* Texto central */}
           <div className="max-w-2xl mx-auto relative z-10 text-center space-y-4 sm:space-y-6">
              <div className="flex justify-center items-center gap-3 sm:gap-4 animate-fade-in">
                 <div className="h-[1px] w-12 sm:w-16 bg-[#b76e79] opacity-50" />
                 <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#b76e79] flex items-center gap-2">
                    <Crown size={12} className="sm:w-3.5 sm:h-3.5" /> Edición Limitada
                 </span>
                 <div className="h-[1px] w-12 sm:w-16 bg-[#b76e79] opacity-50" />
              </div>
            
              
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="#b76e79" className="text-[#b76e79] sm:w-4 sm:h-4" />
                ))}
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl leading-[1.1] sm:leading-[1.05] text-[#2d3748] tracking-tight" style={{ fontFamily: "var(--font-marcellus), serif" }}>
                Gana piezas <br className="sm:block" />
                <span className="italic font-light text-[#b76e79]" style={{ fontFamily: "var(--font-lora), serif" }}>exclusivas</span>
              </h1>
              <p className="max-w-xs sm:max-w-md mx-auto text-[#708090] font-sans text-xs sm:text-base leading-relaxed" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                Participa gratis y descubre diseños únicos hechos para tu estilo. Únete a nuestra comunidad hoy mismo.
              </p>
              
              <div className="pt-2 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                 <a href="#sorteo-seccion" className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-[#b76e79] text-white rounded-[2rem] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#b76e79]/20 hover:bg-[#a45f69] hover:-translate-y-1 transition-all">
                    Participar ahora
                 </a>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-bold animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                ⭐ 3 premios disponibles
              </p>
           </div>

           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8 flex flex-col gap-6 sm:gap-10">
          
          {/* ── 7. URGENCIA (FOMO) ── */}
          <div className="max-w-md mx-auto -mt-8 relative z-20">
            <Countdown targetDate={fechaFin} />
          </div>

          {/* 3. BENEFICIOS (TrustStrip Style) */}
          <section className="py-8 border-y border-[#b76e79]/10 bg-white/40 backdrop-blur-sm relative overflow-hidden rounded-[2.5rem]">
             <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #708090 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
             <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {(beneficios || []).map((b: any, i: number) => {
                    const IconComponent = (LucideIcons as any)[b.icono] || LucideIcons.Star;
                    return (
                      <div key={i} className="flex items-center gap-4 group">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-[#b76e79]/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <IconComponent size={20} color={b.color || "#b76e79"} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-[#2d3748] m-0" style={{ fontFamily: "var(--font-marcellus), serif" }}>{b.title}</h4>
                            <p className="text-[10px] text-[#708090] uppercase tracking-widest m-0" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{b.subtitulo}</p>
                         </div>
                      </div>
                    );
                  })}
                  {(!beneficios || beneficios.length === 0) && (
                    <p className="col-span-full text-center text-xs text-gray-400 italic">Configure sus beneficios en la base de datos...</p>
                  )}
                </div>
             </div>
          </section>
          
          {/* ── 6. PRUEBA SOCIAL (Relocalizada arriba) ── */}
          <SocialProof 
            reviews={JSON.parse(JSON.stringify(reviewsDB || []))} 
            participantesCount={participantesCount}
          />

          <section className="text-center max-w-3xl mx-auto space-y-4 py-8 relative">
             {/* Decoración de fondo */}
             <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 opacity-10 pointer-events-none w-32 h-32">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-spin-slow">
                   <path d="M50 0L54.5 35.5L90 10L64.5 45.5L100 50L64.5 54.5L90 90L54.5 64.5L50 100L45.5 64.5L10 90L35.5 54.5L0 50L35.5 45.5L10 10L45.5 35.5L50 0Z" fill="#b76e79"/>
                </svg>
             </div>
             <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 opacity-10 pointer-events-none w-24 h-24">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-[spin_10s_linear_infinite_reverse]">
                   <path d="M50 0L54.5 35.5L90 10L64.5 45.5L100 50L64.5 54.5L90 90L54.5 64.5L50 100L45.5 64.5L10 90L35.5 54.5L0 50L35.5 45.5L10 10L45.5 35.5L50 0Z" fill="#b76e79"/>
                </svg>
             </div>

            <h2 className="text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>Stella Joyería artesanal</h2>
            <h3 className="text-xl italic text-[#b76e79]" style={{ fontFamily: "var(--font-lora), serif" }}>Diseños únicos para cada estilo</h3>
            <p className="text-[#708090] leading-relaxed max-w-xl mx-auto" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Creamos piezas accesibles, elegantes y personalizadas para cada persona.
            </p>
          </section>

          {/* ── FUNNEL: PREMIOS, PASOS, FORMULARIO, TEMAS, PRODUCTOS ── */}
          <ProductFunnelClient 
            initialProducts={JSON.parse(JSON.stringify(productos))} 
            categories={JSON.parse(JSON.stringify(categorias || []))}
            participantesCount={participantesCount}
          />



          {/* ✉️ Newsletter VIP */}
          <section className="relative p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-gradient-to-br from-[#3d4a5c] to-[#2c3544] text-white shadow-2xl">
             <div className="absolute top-0 right-0 p-6 md:p-10 opacity-10 pointer-events-none">
                <Sparkles size={100} className="md:w-[200px] md:h-[200px]" />
             </div>
             <div className="max-w-2xl space-y-6 md:space-y-8 relative z-10">
                <div className="space-y-3">
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#b76e79]">Membresía Stella</span>
                   <h3 className="text-3xl md:text-5xl font-serif leading-tight">Únete al <br /><span className="italic text-[#b76e79] drop-shadow-md">Club de Joyería Fina</span></h3>
                   <p className="text-gray-300 font-serif italic text-base md:text-lg opacity-80">Sé la primera en conocer nuestras colecciones limitadas y recibe beneficios exclusivos.</p>
                </div>
                <form className="flex flex-col sm:flex-row gap-3 md:gap-4">
                   <input className="flex-1 px-6 md:px-8 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-[2rem] outline-none placeholder:text-white/40 font-serif text-sm md:text-base" placeholder="Tu correo electrónico..." />
                   <button className="px-8 md:px-10 py-4 md:py-5 bg-[#b76e79] hover:bg-[#a45f69] text-white rounded-2xl md:rounded-[2rem] font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#b76e79]/20">
                      Ser VIP
                   </button>
                </form>
             </div>
          </section>

        </main>

        <Footer />

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        `}</style>
      </div>
    );
  } catch (err) {
    console.error("Error en ProductosPage:", err);
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">Momento de <span className="italic text-[#b76e79]">pausa</span></h1>
          <p className="text-gray-400 font-serif italic">Estamos preparando las piezas para ti. Vuelve en un momento.</p>
        </div>
      </div>
    );
  }
}
