"use client";

import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { RecomendacionService } from "@/lib/services/RecomendacionService"; // Asegúrate de exportar esto
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface AlsoBoughtProductsProps {
  currentProductId: string;
}

export default function AlsoBoughtProducts({
  currentProductId,
}: AlsoBoughtProductsProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      try {
        const supabase = createClient();
        const recomendacionService = new RecomendacionService(supabase);

        const recomendados = await recomendacionService.obtenerTambienCompraron(
          parseInt(currentProductId)
        );
        console.log("Recomendados:", recomendados);
        if (recomendados && recomendados.length > 0) {
          setProductos(recomendados);
        }
      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRecomendaciones();
    }
  }, [currentProductId]);

  if (loading || productos.length === 0) return null;

  return (
    <section className="w-full max-w-[1200px] mx-auto px-5 mt-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#708090]/20" />
        <h2 className="font-serif text-2xl md:text-3xl text-[#4a5568] italic flex items-center gap-2">
          <ShoppingBag size={24} className="text-[#b76e79]" />
          Clientes también compraron
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#708090]/20" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {productos.map(prod => (
          <Link
            key={prod.id}
            href={`/productos/${prod.id}`}
            className="group flex flex-col gap-3 bg-white p-3 rounded-2xl shadow-sm border border-[#708090]/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#f6f4ef]">
              <Image
                src={prod.url_imagen || "/LogoM.svg"}
                alt={prod.nombre}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col px-1">
              <h3 className="font-sans text-sm font-semibold text-[#4a5568] line-clamp-1 group-hover:text-[#b76e79] transition-colors">
                {prod.nombre}
              </h3>
              <p className="font-sans text-sm font-bold text-[#b76e79] mt-1">
                $
                {Number(prod.precio).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
