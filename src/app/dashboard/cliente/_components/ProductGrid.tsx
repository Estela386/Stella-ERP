"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { ProductoCard } from "../types";

export default function ProductGrid() {
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const productoService = new ProductoService(supabase);

        const { productos: productosData, error: errorProductos } =
          await productoService.obtenerTodos();

        if (errorProductos || !productosData) {
          setError(errorProductos || "No se pudieron cargar los productos");
          return;
        }

        // Transformar datos para ProductCard
        const productosFormatted: ProductoCard[] = productosData.map(p => ({
          id: p.id,
          name: p.nombre || "Producto",
          price: p.precio || 0,
          image: p.url_imagen || p.nombre || "Producto",
          category: p.nombre?.split(" ")[0] || undefined,
          rating: 5,
        }));

        setProductos(productosFormatted);
        setError(null);
      } catch (err) {
        setError("Error al cargar productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c5c4a]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="text-center text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-light text-[#7c5c4a] mb-2">
          Colección Destacada
        </h2>
        <p className="text-[#7c5c4a]">
          Nuestros productos más populares y recomendados
        </p>
      </div>

      {/* Products Grid */}
      {productos.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {productos.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-[#7c5c4a] text-[#7c5c4a] rounded-lg hover:bg-[#e5d3c2] transition-colors font-medium">
              Ver Todo el Catálogo
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-[#7c5c4a] py-12">
          No hay productos disponibles
        </div>
      )}
    </section>
  );
}
