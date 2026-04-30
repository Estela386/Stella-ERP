"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, Sparkles, User, Mail, Phone, ChevronRight, ChevronLeft, ShieldCheck, Tag, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Sorteo {
  id: number;
  nombre: string;
  descripcion: string;
  premio: string;
  fecha_fin: string;
  ganadores?: Array<{
    participante: {
      nombre: string;
      correo: string;
    }
  }>;
}

interface SorteoWidgetProps {
  onRegistroExitoso?: (preferencia: string) => void;
  allProducts?: any[];
  participantesCount?: number;
}

const PREMIOS_DEMO = [
  {
    id: null,
    nombre: "Collar Aurora",
    materiales: "Perla de río · Acero inoxidable",
    valor: "$350 MXN",
    img: "https://images.unsplash.com/photo-1599643478524-fb66f70d00f0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: null,
    nombre: "Anillo Eternidad",
    materiales: "Zirconias · Baño de Oro 18k",
    valor: "$450 MXN",
    img: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: null,
    nombre: "Aretes Stella",
    materiales: "Plata 925 · Cristales",
    valor: "$280 MXN",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
  }
];

export default function SorteoWidget({ onRegistroExitoso, allProducts = [], participantesCount = 120 }: SorteoWidgetProps) {
  const [sorteo, setSorteo] = useState<Sorteo | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Instagram, 2: Form, 3: Success
  const [currentPrize, setCurrentPrize] = useState(0);
  const [hasClickedInstagram, setHasClickedInstagram] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "exists">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    preferencia: "anillos",
    aceptaMarketing: false
  });

  useEffect(() => {
    fetch("/api/sorteo/active")
      .then(r => r.json())
      .then(data => {
        if (data.sorteo) setSorteo(data.sorteo);
      })
      .catch(console.error);
      
    // Auto-advance carousel
    const interval = setInterval(() => {
      const premios = getPremios();
      setCurrentPrize((prev) => (prev + 1) % premios.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sorteo?.premio]);

  const getPremios = () => {
    if (sorteo?.premio) {
      const nombresPremios = sorteo.premio.split(",").map(p => p.trim());
      return nombresPremios.map(nombre => {
        // Intentar encontrar el producto real por nombre
        const productoReal = allProducts.find(p => 
          p.nombre.toLowerCase() === nombre.toLowerCase() || 
          p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        if (productoReal) {
          return {
            id: productoReal.id,
            nombre: productoReal.nombre,
            materiales: productoReal.categoria?.nombre || "Pieza Stella",
            valor: `$${productoReal.precio}`,
            img: productoReal.url_imagen || PREMIOS_DEMO[0].img
          };
        }

        // Fallback si no se encuentra
        return {
          id: null,
          nombre: nombre,
          materiales: "Producto Stella",
          valor: "Sorpresa",
          img: PREMIOS_DEMO[Math.floor(Math.random() * PREMIOS_DEMO.length)].img
        };
      });
    }
    return PREMIOS_DEMO;
  };

  const handleParticipar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const phoneDigits = formData.telefono.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setFormError("El número de teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/sorteo/participar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_sorteo: sorteo?.id,
          ...formData
        })
      });

      if (res.ok) {
        setStatus("success");
        setCurrentStep(3);
        if (onRegistroExitoso) {
          onRegistroExitoso(formData.preferencia);
        }
      } else if (res.status === 409) {
        setFormError("Este correo electrónico ya se encuentra participando en el sorteo.");
      } else {
        setFormError("Ocurrió un error al procesar tu registro. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Hubo un problema de conexión. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const nextPrize = () => setCurrentPrize((prev) => (prev + 1) % getPremios().length);
  const prevPrize = () => setCurrentPrize((prev) => (prev - 1 + getPremios().length) % getPremios().length);

  // If no active sorteo, we still render the widget as a generic lead capture for the funnel
  const ganador = sorteo?.ganadores?.[0]?.participante;

  return (
    <section className="relative w-full mb-12 md:mb-20 overflow-hidden rounded-[2rem] md:rounded-[4.5rem] bg-white border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#708090]/5 skew-x-12 translate-x-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#b76e79]/5 -skew-x-12 -translate-x-20 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row min-h-[400px] md:min-h-[650px]">
        
        <div className="relative flex-1 bg-gradient-to-br from-[#fafafa] to-gray-50 flex flex-col p-4 sm:p-6 md:p-12 overflow-hidden border-r border-gray-100">
          {/* Animated sparkles background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#b76e79] rounded-full animate-ping" />
            <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-[#708090] rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white blur-xl animate-pulse" />
          </div>

          <div className="flex justify-between items-center mb-4 sm:mb-8 relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white text-[#b76e79] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/5 ring-1 ring-black/5">
                <Trophy size={12} className="md:w-3.5 md:h-3.5" /> Sorteo 
             </div>
             <div className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {currentPrize + 1} de {getPremios().length}
                </p>
             </div>
          </div>

          <div className="flex-1 relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPrize}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="w-full max-w-lg flex flex-row sm:flex-col items-center gap-4 sm:gap-6"
                >
                   {/* Imagen pequeña horizontal en móvil */}
                   <div className="relative w-24 h-32 sm:w-full sm:h-auto sm:aspect-[4/5] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-lg border-[3px] sm:border-[8px] border-white shrink-0 group">
                      <Image 
                        src={getPremios()[currentPrize].img} 
                        alt={getPremios()[currentPrize].nombre}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      {getPremios()[currentPrize].id && (
                        <Link 
                          href={`/productos/${getPremios()[currentPrize].id}`}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                        >
                           <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-[#708090]">
                             Ver
                           </span>
                        </Link>
                      )}
                   </div>

                   <div className="text-left sm:text-center space-y-1 sm:space-y-2 flex-1">
                      <h3 className="text-lg sm:text-2xl md:text-3xl text-[#2d3748] leading-tight" style={{ fontFamily: "var(--font-marcellus), serif" }}>{getPremios()[currentPrize].nombre}</h3>
                      <p className="text-[10px] sm:text-sm text-[#708090] italic line-clamp-1" style={{ fontFamily: "var(--font-lora), serif" }}>{getPremios()[currentPrize].materiales}</p>
                      <p className="text-[9px] sm:text-[10px] font-black text-[#b76e79] uppercase tracking-widest pt-1" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{getPremios()[currentPrize].valor}</p>
                   </div>
                </motion.div>
             </AnimatePresence>

             {/* Carousel Controls */}
             <button onClick={prevPrize} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-600 shadow-md hover:scale-110 transition-transform">
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
             </button>
             <button onClick={nextPrize} className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-600 shadow-md hover:scale-110 transition-transform">
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
             </button>
          </div>
        </div>

        {/* ── Lado Derecho ── */}
        <div className="relative flex-[1.2] p-6 sm:p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          <div className="w-full">
            <AnimatePresence mode="wait">
             {ganador ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                   <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-inner animate-bounce">
                      <Trophy size={48} />
                   </div>
                   <h3 className="text-3xl font-serif text-black">¡Tenemos ganadora!</h3>
                   <p className="text-5xl font-serif text-[#b76e79] font-bold italic">{ganador.nombre}</p>
                </motion.div>
             ) : currentStep === 1 ? (
                <motion.div 
                  key="step-insta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8 max-w-md mx-auto w-full text-center"
                >
                   <div className="space-y-3 sm:space-y-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                         <Instagram size={32} className="sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>Síguenos en Instagram</h3>
                      <p className="text-xs sm:text-sm text-[#708090]">Es obligatorio seguir nuestra cuenta para participar.</p>
                   </div>

                    <div className="space-y-3 py-4 sm:py-6 border-y border-gray-100">
                       <div className="relative flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 z-10">
                          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                          <div className="flex flex-col items-center gap-2 text-[#b76e79] bg-white px-2">
                             <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#b76e79] text-white flex items-center justify-center shadow-md">1</div>
                             <span>Síguenos</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 bg-white px-2">
                             <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">2</div>
                             <span>Registro</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 bg-white px-2">
                             <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">3</div>
                             <span>¡Listo!</span>
                          </div>
                       </div>
                    </div>

                   <div className="space-y-3">
                      <a 
                        href="https://www.instagram.com/_u/stellajoyeriar" 
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => setHasClickedInstagram(true)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-[#708090] text-[#708090] rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#708090]/5 transition-all"
                      >
                         <Instagram size={16} /> Ir a Instagram
                      </a>

                      <button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!hasClickedInstagram}
                        className="w-full py-4 bg-[#708090] text-white rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-[#708090]/20 hover:bg-[#5a6a7a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                         Siguiente paso <ChevronRight size={16} />
                      </button>
                      {!hasClickedInstagram && <p className="text-[9px] text-red-400 font-bold italic">Haz clic en Instagram para continuar</p>}
                   </div>
                </motion.div>
             ) : currentStep === 2 ? (
                <motion.form 
                  key="step-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleParticipar}
                  className="space-y-6 max-w-md mx-auto w-full"
                >
                   <div className="space-y-3 text-center">
                      <h3 className="text-2xl sm:text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>Último paso</h3>
                      <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-[#708090] bg-[#708090]/10 py-1.5 px-4 rounded-full w-max mx-auto">
                         <ShieldCheck size={12} /> Seguro
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                         <input required className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 focus:border-[#708090] rounded-xl outline-none text-xs" placeholder="Nombre completo" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                      </div>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                         <input required type="email" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 focus:border-[#708090] rounded-xl outline-none text-xs" placeholder="Correo electrónico" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
                      </div>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                         <input required className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 focus:border-[#708090] rounded-xl outline-none text-xs" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                      </div>
                      
                      <div className="pt-2">
                         <div className="grid grid-cols-3 gap-2">
                           {["anillos", "collares", "aretes"].map((pref) => (
                             <div key={pref} onClick={() => setFormData({...formData, preferencia: pref})} className={`cursor-pointer py-2 text-center rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${formData.preferencia === pref ? 'bg-[#708090] text-white' : 'bg-white text-gray-400'}`}>
                               {pref}
                             </div>
                           ))}
                         </div>
                      </div>
                   </div>

                   <button disabled={loading} type="submit" className="w-full py-4 bg-[#708090] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#5a6a7a] transition-all">
                      {loading ? "Registrando..." : "Finalizar registro"}
                   </button>
                </motion.form>
             ) : (
                <motion.div key="step-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-sm">
                      <CheckCircle2 size={40} className="sm:w-12 sm:h-12" />
                   </div>
                   <h3 className="text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>¡Listo!</h3>
                   <p className="text-xs sm:text-sm text-[#708090] font-medium">Ya estás participando en el sorteo.</p>
                   <button onClick={() => window.scrollTo({ top: document.getElementById('catalogo-estrategico')?.offsetTop || 0, behavior: 'smooth' })} className="text-[10px] font-black text-[#708090] uppercase tracking-widest border-b border-[#708090]/20 pb-1">
                      Ver catálogo
                   </button>
                </motion.div>
             )}
           </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
