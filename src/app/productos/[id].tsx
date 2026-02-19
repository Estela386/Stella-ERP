import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ProductoPageProps {
  params: { id: string };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id } = params;
  const supabase = await createClient();
  const productoService = new ProductoService(supabase);

  const { producto, error } = await productoService.obtenerPorId(parseInt(id));

  if (error || !producto) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#f8eedc] to-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#7c5c4a]">
            {producto.nombre}
          </h1>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative bg-[#e5d3c2] rounded-lg overflow-hidden h-96">
            {producto.url_imagen ? (
              <Image
                src={producto.url_imagen}
                alt={producto.nombre || "Imagen del producto"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7c5c4a]">
                Imagen no disponible
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Precio</p>
              <p className="text-4xl font-bold text-[#7c5c4a]">
                ${producto.precio.toLocaleString()}
              </p>
            </div>

            {/* Category */}
            {producto.id_categoria && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Categoría</p>
                <p className="text-lg text-[#7c5c4a]">
                  {producto.id_categoria || "Sin categoría"}
                </p>
              </div>
            )}

            {/* Stock */}
            {/* <div>
                <p className="text-sm text-gray-600 mb-2">Stock Disponible</p>
                <p
                  className={`text-lg font-semibold ${
                    producto.stock_actual > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {producto.stock_actual > 0
                    ? `${producto.stock_actual} unidades`
                    : "Agotado"}
                </p>
              </div> */}

            {/* Add to Cart Button */}
            <button className="w-full bg-[#7c5c4a] text-white py-3 rounded-lg hover:bg-[#5c4a37] transition-colors font-medium">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
