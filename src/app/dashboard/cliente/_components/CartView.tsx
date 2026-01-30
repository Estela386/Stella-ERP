"use client";

import { useState, useMemo } from "react";
import { Producto } from "@/lib/models";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

// Productos estáticos para demostración
const PRODUCTOS_DEMO: Producto[] = [
  new Producto({
    id: 1,
    nombre: "Anillo Ceramista Premium",
    costo: 45.0,
    precio: 85.0,
    tiempo: 45,
    stock_actual: 10,
    stock_min: 2,
    url_imagen: "Anillo Premium",
    id_categoria: 1,
  }),
  new Producto({
    id: 2,
    nombre: "Olla Sanitaria Cerámica 5Lt",
    costo: 120.0,
    precio: 330.0,
    tiempo: 120,
    stock_actual: 5,
    stock_min: 1,
    url_imagen: "Olla 5Lt",
    id_categoria: 1,
  }),
];

interface CartItemData {
  producto: Producto;
  cantidad: number;
}

export default function CartView() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    { producto: PRODUCTOS_DEMO[0] as Producto, cantidad: 1 },
    { producto: PRODUCTOS_DEMO[1] as Producto, cantidad: 1 },
  ]);

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
