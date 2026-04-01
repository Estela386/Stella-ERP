"use client";

import React, { useState, useEffect } from "react";
import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface SimilarProductsProps {
  id_categoria: number;
  currentProductId: string;
}

export default function SimilarProducts({ id_categoria, currentProductId }: SimilarProductsProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const service = new ProductoService(supabase);
        const { productos: data, error } = await service.obtenerPorCategoria(id_categoria);

        if (!error && data) {
          // Filtrar el producto actual y mostrar todos los demás en la categoría
          const filtered = data
            .filter((p: any) => p.id.toString() !== currentProductId);
          setProductos(filtered);
        }
      } catch (err) {
        console.error("Error fetching similar products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id_categoria) {
      fetchSimilar();
    }
  }, [id_categoria, currentProductId]);

  if (loading) return null;
  if (productos.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Header Minimalista */}
      <div className="text-center mb-12 md:mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase font-bold text-[#b76e79] tracking-[0.3em] mb-4 block"
        >
          Colección Relacionada
        </motion.span>
        <h2 className="font-serif italic text-3xl md:text-5xl text-[#4a5568] leading-tight">
          Sutileza en cada <span className="text-[#b76e79]">detalle</span>
        </h2>
      </div>

      {/* Grid Minimalista Equilibrado - Adaptable a múltiples productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {productos.map((producto, idx) => (
          <motion.div
            key={producto.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8, 
                delay: idx * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }
            }}
            viewport={{ once: true }}
            // Animación orgánica de flotación suave y continua (manejada por animate)
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (idx * 0.5) + 0.8 // Empezar después de que termine la entrada
            }}
          >
            <Link href={`/productos/${producto.id}`} className="group block">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F9F9F8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] group-hover:shadow-[0_30px_60px_rgba(183,110,121,0.15)] transition-all duration-700 border border-black/5">
                {/* Imagen */}
                {producto.url_imagen ? (
                  <Image 
                    src={producto.url_imagen} 
                    alt={producto.nombre} 
                    fill 
                    className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-50 italic text-[#b76e79]/10 font-serif text-3xl">
                    Stella
                  </div>
                )}
                
                {/* Overlay muy sutil */}
                <div className="absolute inset-0 bg-[#b76e79]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Icono de esquina minimalista */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#b76e79] shadow-lg">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>

              {/* Información Centrada y Limpia */}
              <div className="mt-6 md:mt-8 text-center px-4">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[#b76e79]/60 font-bold mb-1 md:mb-2 block">
                  {producto.categoria?.nombre || "Exclusivo"}
                </span>
                <h3 className="font-serif text-lg md:text-xl text-[#4a5568] group-hover:text-[#b76e79] transition-colors duration-500 truncate">
                  {producto.nombre}
                </h3>
                <p className="mt-1 md:mt-2 text-[13px] md:text-sm font-sans font-medium text-[#708090]">
                  ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </p>
                <div className="w-0 group-hover:w-10 md:group-hover:w-12 h-px bg-[#b76e79]/40 mx-auto mt-3 md:mt-4 transition-all duration-500"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pie de Galería */}
      <div className="mt-24 text-center">
        <Link 
          href="/dashboard/cliente/catalogo"
          className="text-xs uppercase tracking-[0.2em] font-bold text-[#708090] hover:text-[#b76e79] transition-colors inline-flex items-center gap-2 group"
        >
          Explorar Catálogo Completo
          <div className="w-8 h-px bg-[#708090]/30 group-hover:bg-[#b76e79]/50 transition-colors"></div>
        </Link>
      </div>
    </section>
  );
}
