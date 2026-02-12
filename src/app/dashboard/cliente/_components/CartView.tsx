"use client";

import { useState, useMemo, useEffect } from "react";
import { Producto } from "@lib/models";
import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

interface CartItemData {
  producto: Producto;
  cantidad: number;
}

export default function CartView() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
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

        // Agregar los primeros 2 productos al carrito como demo
        const itemsDemo = productosData.slice(0, 2).map(producto => ({
          producto,
          cantidad: 1,
        }));

        setCartItems(itemsDemo);
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

  // Calcular totales
  const calculos = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.producto.precio || 0) * item.cantidad,
      0
    );

    const descuento = 0; // Por ahora sin descuento
    const subtotalConDescuento = subtotal - descuento;
    const iva = Math.round(subtotalConDescuento * 0.19 * 100) / 100; // 19% de IVA
    const total = subtotalConDescuento + iva;

    return {
      subtotal,
      descuento,
      iva,
      total,
    };
  }, [cartItems]);

  const handleCantidadChange = (index: number, newCantidad: number) => {
    setCartItems(items =>
      items.map((item, i) =>
        i === index ? { ...item, cantidad: newCantidad } : item
      )
    );
  };

  const handleRemove = (index: number) => {
    setCartItems(items => items.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    alert(`Procesando compra por: $${calculos.total.toLocaleString()}`);
    // Aquí irá la lógica de checkout
  };

  const isEmpty = cartItems.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8eedc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c5c4a]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8eedc] flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8eedc]">
      {/* Header */}
      <header className="bg-white border-b border-[#d6c1b1] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <h1 className="text-2xl font-semibold text-[#7c5c4a]">
            Carrito de Compras
          </h1>
          <p className="text-sm text-[#a89080] mt-1">
            {isEmpty ? "0" : cartItems.length} artículo
            {cartItems.length !== 1 ? "s" : ""} en tu carrito
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={index}
                    producto={item.producto}
                    cantidad={item.cantidad}
                    onCantidadChange={newCantidad =>
                      handleCantidadChange(index, newCantidad)
                    }
                    onRemove={() => handleRemove(index)}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={calculos.subtotal}
                descuento={calculos.descuento}
                iva={calculos.iva}
                total={calculos.total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
