"use client";

import { useState, useEffect } from "react";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import { useCart } from "@lib/hooks/useCart";
import Image from "next/image";

interface ProductoClientProps {
  id: string;
}

export default function ProductoClient({ id }: ProductoClientProps) {
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCart();
  console.log("usuario:", usuario);
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agregandoCarrito, setAgregandoCarrito] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);

        const supabase = createClient();
        const productoService = new ProductoService(supabase);

        const { producto: productoData, error: errorProducto } =
          await productoService.obtenerPorId(parseInt(id));

        if (errorProducto || !productoData) {
          setError("Producto no encontrado");
          return;
        }

        setProducto(productoData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    console.log("id:", id);
    if (!isNaN(Number(id))) {
      cargarProducto();
    } else {
      setError("ID inválido");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderClient user={usuario} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c5c4a]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderClient user={usuario} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600">{error || "Producto no encontrado"}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderClient user={usuario} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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

          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7c5c4a]">
              {producto.nombre}
            </h1>

            <div>
              <p className="text-sm text-gray-600 mb-2">Precio</p>
              <p className="text-4xl font-bold text-[#7c5c4a]">
                ${producto.precio.toLocaleString()}
              </p>
            </div>

            {producto.categoria && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Categoría</p>
                <p className="text-lg text-[#7c5c4a]">
                  {producto.categoria.nombre}
                </p>
              </div>
            )}

            {producto.descripcion && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Descripción</p>
                <p className="text-base text-[#7c5c4a] leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-2">Stock Disponible</p>
              <p
                className={`text-lg font-semibold ${
                  producto.stock_actual > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {producto.stock_actual > 0
                  ? `${producto.stock_actual} unidades`
                  : "Agotado"}
              </p>
            </div>

            <button
              disabled={producto.stock_actual === 0 || agregandoCarrito}
              className="cursor-pointer w-full bg-[#7c5c4a] text-white py-3 rounded-lg hover:bg-[#5c4a37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={() => {
                setAgregandoCarrito(true);
                agregarAlCarrito(producto, 1);
                setTimeout(() => {
                  setAgregandoCarrito(false);
                  alert("¡Producto agregado al carrito!");
                }, 500);
              }}
            >
              {agregandoCarrito
                ? "Agregando..."
                : producto.stock_actual > 0
                  ? "Agregar al Carrito"
                  : "Sin stock"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
