"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";
import Image from "next/image";

interface ThemesSectionProps {
  onSelectTheme: (theme: string) => void;
  activeTheme: string | null;
  categories: Array<{ id: number; nombre: string }>;
  allProducts: any[];
}

function CategoryCard({ 
  theme, 
  isActive, 
  onSelect, 
  products 
}: { 
  theme: any, 
  isActive: boolean, 
  onSelect: () => void, 
  products: any[] 
}) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const images = products.length > 0 
    ? products.map(p => p.url_imagen).filter(img => img) 
    : [theme.img];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <button
      onClick={onSelect}
      className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group border-4 transition-all duration-500 text-left cursor-pointer w-full ${
        isActive ? "border-[#b76e79] shadow-xl scale-[1.02]" : "border-transparent hover:border-gray-200 hover:shadow-xl"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImgIdx}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentImgIdx]}
            alt={theme.name}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-6 w-full">
        {isActive && (
          <span className="inline-block px-3 py-1 bg-[#b76e79] text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-3 shadow-sm">
            Seleccionado
          </span>
        )}
        <h3 className="text-white text-xl md:text-2xl mb-1 drop-shadow-md" style={{ fontFamily: "var(--font-marcellus), serif" }}>
          {theme.name}
        </h3>
        <p className="text-gray-200 text-[10px] uppercase tracking-widest font-bold opacity-80" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          {theme.desc}
        </p>
      </div>
    </button>
  );
}

const DEFAULT_THEME_IMAGES: Record<string, string> = {
  "anillos": "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=600&auto=format&fit=crop",
  "collares": "https://images.unsplash.com/photo-1599643478524-fb66f70d00f0?q=80&w=600&auto=format&fit=crop",
  "aretes": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
  "pulseras": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
};

export default function ThemesSection({ onSelectTheme, activeTheme, categories, allProducts }: ThemesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const themes = categories.length > 0 ? categories.map(c => ({
    id: c.nombre.toLowerCase(),
    name: c.nombre,
    desc: `Colección ${c.nombre}`,
    img: DEFAULT_THEME_IMAGES[c.nombre.toLowerCase()] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
  })) : [
    {
      id: "minimalista",
      name: "Minimalista",
      desc: "Simplicidad pura",
      img: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=600&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth;
        const offsetWidth = containerRef.current.offsetWidth;
        setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [themes.length]);

  return (
    <section className="py-6 overflow-hidden">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-3 text-[#b76e79]">
          <div className="h-[1px] w-8 bg-[#b76e79]/30" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curaduría Premium</span>
          <div className="h-[1px] w-8 bg-[#b76e79]/30" />
        </div>
        <h2 className="text-4xl md:text-6xl text-[#2d3748] leading-tight" style={{ fontFamily: "var(--font-marcellus), serif" }}>
          Encuentra tu <span className="italic text-[#b76e79]" style={{ fontFamily: "var(--font-lora), serif" }}>Estilo</span>
        </h2>
      </div>

      <div className="px-4 md:px-8 overflow-hidden" ref={containerRef}>
        <motion.div 
          className="flex gap-6 cursor-grab active:cursor-grabbing pb-8"
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          style={{ width: "max-content" }}
        >
          {themes.map((theme) => {
            const categoryProducts = allProducts.filter(p => 
              p.categoria?.nombre.toLowerCase() === theme.name.toLowerCase() ||
              p.nombre.toLowerCase().includes(theme.name.toLowerCase())
            );

            return (
              <div key={theme.id} className="w-[260px] md:w-[320px] shrink-0">
                <CategoryCard
                  theme={theme}
                  isActive={activeTheme === theme.id}
                  onSelect={() => onSelectTheme(theme.id)}
                  products={categoryProducts}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Indicador visual de scroll */}
      <div className="flex justify-center gap-2 -mt-4">
        <div className="h-1 w-24 bg-[#b76e79]/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#b76e79]"
            animate={{ 
              x: ["-100%", "100%"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </section>
  );
}
