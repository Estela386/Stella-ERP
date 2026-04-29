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
      <div className="flex flex-col lg:flex-row min-h-[500px] md:min-h-[650px]">
        
        <div className="relative flex-1 bg-gradient-to-br from-[#fafafa] to-gray-50 flex flex-col p-6 md:p-12 overflow-hidden border-r border-gray-100">
          {/* Animated sparkles background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#b76e79] rounded-full animate-ping" />
            <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-[#708090] rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white blur-xl animate-pulse" />
          </div>

          <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white text-[#b76e79] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/5 ring-1 ring-black/5">
                <Trophy size={12} className="md:w-3.5 md:h-3.5" /> Sorteo 
             </div>
             <div className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {currentPrize + 1} de {getPremios().length}
                </p>
             </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPrize}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="w-full max-w-sm"
                >
                   <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] mb-10 border-[8px] border-white group">
                      {/* Glow effect behind */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#b76e79]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <Image 
                        src={getPremios()[currentPrize].img} 
                        alt={getPremios()[currentPrize].nombre}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      
                      {/* Glass detail label */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/40 backdrop-blur-xl border border-white/40 p-4 rounded-3xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">Detalle Premium</span>
                           <Sparkles size={14} className="text-white animate-pulse" />
                        </div>
                      </div>
                      {getPremios()[currentPrize].id && (
                        <Link 
                          href={`/productos/${getPremios()[currentPrize].id}`}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#708090]">
                            Ver Detalle
                          </span>
                        </Link>
                      )}
                   </div>
                   <div className="text-center space-y-2">
                      <h3 className="text-2xl md:text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>{getPremios()[currentPrize].nombre}</h3>
                      <p className="text-xs md:text-sm font-medium text-[#708090] italic" style={{ fontFamily: "var(--font-lora), serif" }}>{getPremios()[currentPrize].materiales}</p>
                      <p className="text-[9px] md:text-[10px] font-black text-[#b76e79] uppercase tracking-widest pt-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Valor: {getPremios()[currentPrize].valor}</p>
                   </div>
                </motion.div>
             </AnimatePresence>

             {/* Carousel Controls */}
             <button onClick={prevPrize} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-600 shadow-md hover:scale-110 transition-transform">
                <ChevronLeft size={20} />
             </button>
             <button onClick={nextPrize} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-600 shadow-md hover:scale-110 transition-transform">
                <ChevronRight size={20} />
             </button>
          </div>
        </div>

        {/* ── Lado Derecho ── */}
        <div className="relative flex-[1.2] p-8 md:p-16 flex flex-col justify-center bg-white">
          {/* Subtle noise texture or pattern */}
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
                /* PASO 1: Instagram */
                <motion.div 
                  key="step-insta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 max-w-md mx-auto w-full text-center"
                >
                   <div className="space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                         <Instagram size={40} />
                      </div>
                      <h3 className="text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>Síguenos en Instagram</h3>
                      <p className="text-sm text-[#708090]">Es obligatorio seguir nuestra cuenta para validar tu participación.</p>
                   </div>

                    {/* Progress Steps & Counter */}
                    <div className="space-y-4 py-6 border-y border-gray-100">
                       <div className="relative flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400 z-10">
                          {/* Progress Line Background */}
                          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                          {/* Active Progress Line */}
                          <motion.div className="absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-[#b76e79] -z-10" initial={{ width: "0%" }} animate={{ width: "0%" }} />
                          
                          <div className="flex flex-col items-center gap-2 text-[#b76e79] bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-[#b76e79] text-white flex items-center justify-center shadow-md">1</div>
                             <span>Síguenos</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">2</div>
                             <span>Regístrate</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">3</div>
                             <span>¡Listo!</span>
                          </div>
                       </div>
                      
                    </div>

                   <div className="space-y-4">
                      <a 
                        href="https://www.instagram.com/_u/stellajoyeriar" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setHasClickedInstagram(true)}
                        className="flex items-center justify-center gap-3 w-full py-5 bg-white border-2 border-[#708090] text-[#708090] rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-[#708090]/5 transition-all"
                      >
                         <Instagram size={18} /> Ir a Instagram
                      </a>

                      <button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!hasClickedInstagram}
                        className="w-full py-5 bg-[#708090] text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#708090]/20 hover:bg-[#5a6a7a] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         Siguiente paso <ChevronRight size={18} />
                      </button>
                      {!hasClickedInstagram && <p className="text-[10px] text-red-400 font-bold">Haz clic en el botón de Instagram para continuar</p>}
                   </div>
                </motion.div>
             ) : currentStep === 2 ? (
                /* PASO 2: Formulario */
                <motion.form 
                  key="step-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleParticipar}
                  className="space-y-8 max-w-md mx-auto w-full"
                >
                   <div className="space-y-4 text-center">
                      <h3 className="text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>Último paso</h3>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#708090] bg-[#708090]/10 py-2 px-4 rounded-full w-max mx-auto">
                         <ShieldCheck size={14} /> Registro 100% seguro
                      </div>
                   </div>

                    {/* Progress Steps & Counter */}
                    <div className="space-y-4 py-6 border-y border-gray-100">
                       <div className="relative flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400 z-10">
                          {/* Progress Line Background */}
                          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                          {/* Active Progress Line */}
                          <motion.div className="absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-[#b76e79] -z-10" initial={{ width: "0%" }} animate={{ width: "50%" }} transition={{ duration: 0.5 }} />
                          
                          <div className="flex flex-col items-center gap-2 text-green-500 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md"><CheckCircle2 size={12} /></div>
                             <span>Síguenos</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 text-[#b76e79] bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-[#b76e79] text-white flex items-center justify-center shadow-md">2</div>
                             <span>Regístrate</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">3</div>
                             <span>¡Listo!</span>
                          </div>
                       </div>
                    </div>

                   {formError && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-500 text-sm font-medium text-center rounded-2xl">
                       {formError}
                     </motion.div>
                   )}

                   <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input required className="w-full pl-12 pr-6 py-4 bg-white border-transparent focus:border-[#708090] focus:bg-white rounded-2xl outline-none transition-all text-sm" placeholder="Nombre completo" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                      </div>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input required type="email" className="w-full pl-12 pr-6 py-4 bg-white border-transparent focus:border-[#708090] focus:bg-white rounded-2xl outline-none transition-all text-sm" placeholder="Correo electrónico" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
                      </div>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input required className="w-full pl-12 pr-6 py-4 bg-white border-transparent focus:border-[#708090] focus:bg-white rounded-2xl outline-none transition-all text-sm" placeholder="Teléfono a 10 dígitos" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                      </div>
                      
                      <div className="pt-4">
                         <label className="text-xs font-bold text-gray-600 mb-3 block text-center">Elige tu estilo favorito</label>
                         <div className="grid grid-cols-3 gap-2">
                           {["anillos", "collares", "aretes"].map((pref) => (
                             <div 
                               key={pref}
                               onClick={() => setFormData({...formData, preferencia: pref})}
                               className={`cursor-pointer py-3 text-center rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.preferencia === pref ? 'bg-[#708090] text-white border-[#708090] shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-[#708090] hover:text-[#708090]'}`}
                             >
                               {pref}
                             </div>
                           ))}
                         </div>
                      </div>

                      <div className="flex items-start gap-3 pt-4 px-2">
                         <input 
                          type="checkbox" 
                          id="marketing"
                          required
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-[#708090] focus:ring-[#708090]"
                          checked={formData.aceptaMarketing}
                          onChange={e => setFormData({...formData, aceptaMarketing: e.target.checked})}
                         />
                         <label htmlFor="marketing" className="text-[10px] text-gray-500 leading-relaxed cursor-pointer">
                           Acepto que mi información sea utilizada para recibir notificaciones sobre promociones, lanzamientos y publicidad de Stella Joyería.
                         </label>
                      </div>
                   </div>

                   <div className="pt-2 text-center space-y-4">
                      <button 
                        disabled={loading}
                        type="submit"
                        className="w-full py-5 bg-[#708090] text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#708090]/20 hover:bg-[#5a6a7a] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                      >
                         {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles size={18} /> Finalizar registro</>}
                      </button>
                   </div>
                </motion.form>
             ) : (
                /* PASO 3: Éxito */
                <motion.div 
                  key="step-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 max-w-md mx-auto"
                >
                   <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-sm mb-4">
                      <CheckCircle2 size={48} />
                   </div>

                    {/* Progress Steps & Counter */}
                    <div className="space-y-4 py-6 border-y border-gray-100 mb-8">
                       <div className="relative flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400 z-10">
                          {/* Progress Line Background */}
                          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                          {/* Active Progress Line */}
                          <motion.div className="absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-green-500 -z-10" initial={{ width: "50%" }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} />
                          
                          <div className="flex flex-col items-center gap-2 text-green-500 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md"><CheckCircle2 size={12} /></div>
                             <span>Síguenos</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 text-green-500 bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md"><CheckCircle2 size={12} /></div>
                             <span>Regístrate</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 text-[#b76e79] bg-white px-2">
                             <div className="w-6 h-6 rounded-full bg-[#b76e79] text-white flex items-center justify-center shadow-md"><CheckCircle2 size={12} /></div>
                             <span>¡Listo!</span>
                          </div>
                       </div>
                    
                    </div>
                   
                   <h3 className="text-5xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>¡Ya estás <span className="italic text-[#708090]" style={{ fontFamily: "var(--font-lora), serif" }}>participando</span>!</h3>
                   
                    <div className="mt-12 p-10 bg-gradient-to-br from-[#708090] to-[#5a6a7a] rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                       {/* Animated background glow */}
                       <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 blur-[80px] rounded-full animate-pulse" />
                       <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#b76e79]/40 blur-[80px] rounded-full animate-pulse" />
                       
                       <div className="absolute top-0 right-0 p-6 opacity-10 text-white">
                          <Trophy size={120} />
                       </div>
                       <div className="relative z-10 space-y-6 text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-[#708090] text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                             Anuncio del Ganador
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-3xl md:text-4xl font-serif leading-tight">
                               {(() => {
                                 if (!sorteo?.fecha_fin) return "¡Hoy mismo a las 2:00 PM!";
                                 const fecha = new Date(sorteo.fecha_fin);
                                 const hoy = new Date();
                                 const esHoy = fecha.getDate() === hoy.getDate() && 
                                              fecha.getMonth() === hoy.getMonth() && 
                                              fecha.getFullYear() === hoy.getFullYear();
                                 
                                 const opciones: Intl.DateTimeFormatOptions = { 
                                   hour: '2-digit', 
                                   minute: '2-digit',
                                   hour12: true 
                                 };
                                 const horaStr = fecha.toLocaleTimeString('es-MX', opciones);
                                 
                                 if (esHoy) return <>¡Hoy mismo <br/>a las {horaStr}!</>;
                                 
                                 const fechaStr = fecha.toLocaleDateString('es-MX', { 
                                   day: 'numeric', 
                                   month: 'long' 
                                 });
                                 return <>El {fechaStr} <br/>a las {horaStr}</>;
                               })()}
                            </h4>
                            <div className="h-1 w-12 bg-white/30 mx-auto rounded-full" />
                          </div>
                          
                          <p className="text-sm text-white/80 font-medium italic">¡Mucha suerte, ya estás en nuestra lista VIP!</p>
                       </div>
                    </div>

                   <button 
                    onClick={() => window.scrollTo({ top: document.getElementById('catalogo-estrategico')?.offsetTop || 0, behavior: 'smooth' })}
                    className="text-xs font-bold text-[#708090] uppercase tracking-widest border-b border-[#708090]/30 pb-1 hover:border-[#708090] transition-all"
                   >
                     Ver catálogo mientras esperas
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
