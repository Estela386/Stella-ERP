"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sparkles, ShoppingBag, Heart } from "lucide-react";
import SorteoWidget from "./SorteoWidget";
import ThemesSection from "./ThemesSection";

interface Product {
  id: string;
  nombre: string;
  precio: number;
  url_imagen: string;
  categoria?: { nombre: string };
}

interface Category {
  id: number;
  nombre: string;
}

export default function ProductFunnelClient({ 
  initialProducts, 
  categories,
  participantesCount
}: { 
  initialProducts: Product[],
  categories: Category[],
  participantesCount: number
}) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  // Filtro robusto: Comparamos con el nombre de la categoría o el nombre del producto
  const filteredProducts = activeTheme
    ? initialProducts.filter(p => {
        const catName = p.categoria?.nombre.toLowerCase() || "";
        const prodName = p.nombre.toLowerCase();
        const theme = activeTheme.toLowerCase();
        return catName === theme || prodName.includes(theme);
      })
    : initialProducts;

  const handleSelectTheme = (theme: string) => {
    // Si ya está activo, lo desactivamos para "Ver Todo"
    if (activeTheme === theme) {
      setActiveTheme(null);
    } else {
      setActiveTheme(theme);
      // Scroll suave hacia los resultados
      setTimeout(() => {
        document.getElementById("galeria-productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleRegistroExitoso = (preferencia: string) => {
    setActiveTheme(preferencia.toLowerCase());
    document.getElementById("catalogo-estrategico")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-12">
      <div id="sorteo-seccion" className="scroll-mt-24">
        <SorteoWidget 
          onRegistroExitoso={handleRegistroExitoso} 
          allProducts={initialProducts} 
        />
      </div>

      <div id="catalogo-estrategico" className="scroll-mt-24">
        <ThemesSection 
          activeTheme={activeTheme} 
          onSelectTheme={handleSelectTheme} 
          categories={categories}
          allProducts={initialProducts}
        />

        {/* 💎 Featured Gallery (Pinterest Style) */}
        <div id="galeria-productos" className="space-y-8 mt-12 scroll-mt-24">
          <div className="flex items-end justify-between border-b border-gray-100 pb-6">
            <div className="space-y-1">
              <h2 className="text-3xl text-[#2d3748] leading-tight" style={{ fontFamily: "var(--font-marcellus), serif" }}>
                {activeTheme ? `También podría interesarte: ${activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1)}` : "También podría interesarte"}
              </h2>
              <p className="text-[10px] text-[#708090] uppercase tracking-widest font-bold" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Explora las piezas que hemos seleccionado para ti</p>
            </div>
            <button 
              onClick={() => setActiveTheme(null)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTheme ? 'text-[#b76e79] hover:text-black' : 'text-transparent pointer-events-none'}`}
            >
              Ver Todo
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center font-serif text-gray-400 italic">
              No encontramos piezas para este estilo por el momento.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredProducts.map((product, idx) => (
                <Link key={product.id} href={`/productos/${product.id}`} className="block break-inside-avoid group mb-4">
                  <div className="relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
                    
                    {/* Imagen del producto */}
                    <div className={`relative w-full overflow-hidden ${idx % 3 === 0 ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                      {product.url_imagen ? (
                        <Image
                          src={product.url_imagen}
                          alt={product.nombre}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f6f4ef] to-[#e8e4dc] flex items-center justify-center">
                          <ShoppingBag size={32} className="text-[#b76e79]/30" />
                        </div>
                      )}

                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Tag dinámico */}
                      {idx % 7 === 0 && (
                        <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-amber-600 border border-amber-100 shadow-sm">
                          <Sparkles size={9} className="inline mr-1" />Limitada
                        </div>
                      )}

                      {/* Corazón */}
                      <button className="absolute top-3 right-3 z-20 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart size={13} className="text-[#b76e79]" />
                      </button>
                    </div>

                    {/* Textual Info */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm text-[#2d3748] leading-tight flex-1 pr-2" style={{ fontFamily: "var(--font-marcellus), serif" }}>
                            {product.nombre}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-[#b76e79]" style={{ fontFamily: "var(--font-marcellus), serif" }}>
                          ${product.precio.toLocaleString('es-MX')}
                        </span>
                        <span className="text-[9px] font-black text-[#708090] uppercase tracking-widest group-hover:text-[#b76e79] transition-colors">
                            Ver →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
