"use client";

import { useState } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaVentaHeader from "./_components/NuevaVentaHeader";
import VentaInfoForm from "./_components/VentaInfoForm";
import ProductosVenta from "./_components/ProductosVenta";
import VentaResumen from "./_components/VentaResumen";
import { useAuth } from "@/lib/hooks/useAuth";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock?: number;
};

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

interface ProductoDisponible {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
}

export default function NuevaVentaPage() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const agregarProducto = (productoDisponible: ProductoDisponible) => {
    setProductos(prev => {
      // Verificar si el producto ya existe
      const existente = prev.find(p => p.id === productoDisponible.id);

      if (existente) {
        // Si existe, aumentar cantidad (con validación de stock)
        const nuevaCantidad = existente.cantidad + 1;
        const stockDisponible = productoDisponible.stock || 0;

        if (nuevaCantidad > stockDisponible) {
          return prev; // No agregar si excede stock
        }

        return prev.map(p =>
          p.id === productoDisponible.id ? { ...p, cantidad: nuevaCantidad } : p
        );
      } else {
        // Si no existe, agregarlo
        return [
          ...prev,
          {
            id: productoDisponible.id,
            nombre: productoDisponible.nombre,
            precio: productoDisponible.precio,
            cantidad: 1,
            stock: productoDisponible.stock,
          },
        ];
      }
    });
  };

  const aumentarCantidad = (id: number) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id) {
          const stock = p.stock || 0;
          if (p.cantidad < stock) {
            return { ...p, cantidad: p.cantidad + 1 };
          }
        }
        return p;
      })
    );
  };

  const disminuirCantidad = (id: number) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id && p.cantidad > 1) {
          return { ...p, cantidad: p.cantidad - 1 };
        }
        return p;
      })
    );
  };

  const eliminarProducto = (id: number) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const handleVentaConfirmada = () => {
    // Limpiar formulario
    setProductos([]);
    setClienteSeleccionado(null);
    setFecha(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 sm:w-12 bg-[#B76E79]" />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Gestión
              </span>
            </div>
          </header>

          <NuevaVentaHeader />

          <VentaInfoForm
            onClienteChange={setClienteSeleccionado}
            onFechaChange={setFecha}
          />

          <ProductosVenta
            productos={productos}
            onAgregar={agregarProducto}
            onEliminar={eliminarProducto}
            onAumentar={aumentarCantidad}
            onDisminuir={disminuirCantidad}
          />

          <VentaResumen
            productos={productos}
            cliente={clienteSeleccionado}
            vendedor={usuario?.nombre || "Usuario actual"}
            idUsuario={usuario?.id || ""}
            fecha={fecha}
            onConfirmed={handleVentaConfirmada}
          />
        </div>
      </main>
    </div>
  );
}
