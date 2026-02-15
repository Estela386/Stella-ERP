"use client";

import { useEffect, useState } from "react";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoCard } from "../types";
import { obtenerProductosCatalogo, buscarProductosCatalogo } from "../actions";

export default function CatalogPage() {
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar productos iniciales
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const { productos: productosData, error: errorProductos } =
          await obtenerProductosCatalogo();

        if (errorProductos) {
          setError(errorProductos);
          return;
        }

        setProductos(productosData || []);
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

  // Manejar búsqueda
  const handleSearch = async (termino: string) => {
    setSearchTerm(termino);

    if (!termino.trim()) {
      // Si el búsqueda está vacía, recargar todos
      const { productos: productosData } = await obtenerProductosCatalogo();
      setProductos(productosData || []);
      return;
    }

    try {
      setLoading(true);
      const { productos: productosData, error: errorProductos } =
        await buscarProductosCatalogo(termino);

      if (errorProductos) {
        setError(errorProductos);
        return;
      }

      setProductos(productosData || []);
      setError(null);
    } catch (err) {
      setError("Error al buscar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <HeaderClient user={null} />

      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#f8eedc] to-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-[#7c5c4a]">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 mb-6">
            Explora nuestro catálogo completo de productos disponibles para ti.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c5c4a] text-gray-700"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c5c4a]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">
            <p>{error}</p>
          </div>
        ) : productos.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {productos.map(product => (
                <div key={product.id} className="group cursor-pointer">
                  {/* Product Card */}
                  <div className="relative w-full aspect-square bg-[#e5d3c2] rounded-lg overflow-hidden mb-3">
                    <div className="w-full h-full bg-gradient-to-br from-[#e5d3c2] to-[#d6c1b1] flex items-center justify-center">
                      <span className="text-[#7c5c4a] text-xs md:text-sm text-center px-2">
                        {product.image}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div>
                    {product.category && (
                      <p className="text-xs text-[#7c5c4a] uppercase tracking-wider mb-1">
                        {product.category}
                      </p>
                    )}
                    <h3 className="text-sm font-medium text-[#7c5c4a] mb-2 group-hover:text-[#5c4a37] transition-colors truncate">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < (product.rating || 0)
                                ? "text-[#d4a574]"
                                : "text-[#d6c1b1]"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-end gap-2">
                      <span className="text-sm md:text-base font-semibold text-[#7c5c4a]">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination or Load More */}
            <div className="text-center">
              <p className="text-gray-600">
                Mostrando {productos.length} productos
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
