"use client";

import React, { createContext, useState, useCallback } from "react";
import { Producto } from "@lib/models";
export interface CartItemData {
  producto: Producto;
  cantidad: number;
  personalizacion?: Record<number, any>;
}

interface CartContextType {
  items: CartItemData[];
  agregarAlCarrito: (
    producto: Producto,
    cantidad: number,
    personalizacion?: Record<number, any>
  ) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  eliminarDelCarrito: (productoId: number) => void;
  limpiarCarrito: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);

  const agregarAlCarrito = useCallback(
    (
      producto: Producto,
      cantidad: number,
      personalizacion?: Record<number, any>
    ) => {
      setItems(prevItems => {
        // Dos productos iguales con distinta personalización son items distintos
        const existingItem = prevItems.find(
          item =>
            item.producto.id === producto.id &&
            JSON.stringify(item.personalizacion) ===
              JSON.stringify(personalizacion)
        );

        if (existingItem) {
          return prevItems.map(item =>
            item.producto.id === producto.id &&
            JSON.stringify(item.personalizacion) ===
              JSON.stringify(personalizacion)
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        }

        return [...prevItems, { producto, cantidad, personalizacion }];
      });
    },
    []
  );
  const actualizarCantidad = useCallback(
    (productoId: number, cantidad: number) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item.producto.id === productoId ? { ...item, cantidad } : item
        )
      );
    },
    []
  );

  const eliminarDelCarrito = useCallback((productoId: number) => {
    setItems(prevItems =>
      prevItems.filter(item => item.producto.id !== productoId)
    );
  }, []);

  const limpiarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        limpiarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
