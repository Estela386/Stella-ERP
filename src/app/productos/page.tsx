import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import MothersDayBanner from "@/app/_components/MothersDayBanner";

export default async function ProductosPage() {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos, error } = await productoService.obtenerTodos();

    if (error || !productos) {
      return (
        <div className="min-h-screen bg-white px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#7c5c4a] mb-4">
              Catálogo de Productos
            </h1>
            <p className="text-red-600">Error al cargar productos</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#f8eedc] to-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-[#7c5c4a]">
              Catálogo de Productos
            </h1>
            <p className="text-[#7c5c4a] mt-2">
              Explora todos nuestros productos disponibles
            </p>
          </div>
        </header>

        {/* Products Grid */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          {/* 🌸 Campaña especial — se auto-oculta si no hay campaña activa */}
          <MothersDayBanner />

          {productos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {productos.map(product => (
                <Link key={product.id} href={`/productos/${product.id}`}>
                  <div className="group cursor-pointer">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square bg-[#e5d3c2] rounded-lg overflow-hidden mb-4">
                      {product.url_imagen ? (
                        <Image
                          src={product.url_imagen}
                          alt={product.nombre || "Imagen del producto"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#7c5c4a] text-sm">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 className="text-sm font-medium text-[#7c5c4a] mb-2 group-hover:text-[#5c4a37] transition-colors line-clamp-2">
                        {product.nombre}
                      </h3>
                      <p className="text-lg font-semibold text-[#7c5c4a]">
                        ${product.precio.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#7c5c4a]">No hay productos disponibles</p>
            </div>
          )}
        </main>
      </div>
    );
  } catch (err) {
    return (
      <div className="min-h-screen bg-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#7c5c4a] mb-4">Error</h1>
          <p className="text-red-600">
            Error al cargar el catálogo de productos
          </p>
        </div>
      </div>
    );
  }
}
