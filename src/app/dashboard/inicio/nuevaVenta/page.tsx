"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaVentaHeader from "./_components/NuevaVentaHeader";
import VentaInfoForm from "./_components/VentaInfoForm";
import ProductosVenta from "./_components/ProductosVenta";
import VentaResumen from "./_components/VentaResumen";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

function PedidoHydrator({
  onLoaded,
  onLoading,
}: {
  onLoaded: (productos: Producto[]) => void;
  onLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("pedidoId");

  useEffect(() => {
    if (id) {
      onLoading();
      const load = async () => {
        try {
          const supabase = createClient();
          const SELECT_FULL = `*, usuario:usuario(id, nombre, correo, id_rol), detalles:pedido_detalle(id, id_producto, cantidad, precio_unitario, subtotal, producto:producto(id, nombre, url_imagen))`;
          const { data, error } = await supabase
            .from('pedidos')
            .select(SELECT_FULL)
            .eq('id', id)
            .single();

          if (data && data.detalles) {
            const mapped = data.detalles.map((det: any) => ({
              id: det.id_producto,
              nombre: det.producto?.nombre || "Producto de Pedido",
              precio: det.precio_unitario,
              cantidad: det.cantidad,
            }));
            onLoaded(mapped);
          } else if (error) {
            console.error("Error cargando pedido base:", error);
          }
        } catch (err) {
          console.error("Excepción cargando pedido:", err);
        }
      };
      load();
    }
  }, [id]);

  return null;
}

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock?: number;
  categoria_nombre?: string;
  partes_seleccionadas?: string[];
  opciones?: { nombre: string; valores: { valor: string }[] }[];
  es_consignado?: boolean;
  id_consignacion_detalle?: number;
};

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  id_usuario?: number;
}

interface ProductoDisponible {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  categoria_nombre?: string;
  opciones?: any[];
  es_consignado?: boolean;
  id_consignacion_detalle?: number;
}

export default function NuevaVentaPage() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cargandoPedido, setCargandoPedido] = useState(false);

  // La hidratación ocurre ahora de forma reactiva gracias a PedidoHydrator

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
        const esJuego = productoDisponible.categoria_nombre?.toLowerCase().includes("juego");
        
        // Buscar componentes en las opciones
        let componentes: string[] = [];
        if (esJuego) {
          const opJuego = productoDisponible.opciones?.find((o: any) => o.nombre === "Componentes del Juego");
          if (opJuego && opJuego.valores) {
            componentes = opJuego.valores.map((v: any) => v.valor);
          } else {
            // Fallback si no hay componentes definidos
            componentes = ["Anillo", "Collar", "Aretes"];
          }
        }

        return [
          ...prev,
          {
            id: productoDisponible.id,
            nombre: productoDisponible.nombre,
            precio: productoDisponible.precio,
            cantidad: 1,
            stock: productoDisponible.stock,
            categoria_nombre: productoDisponible.categoria_nombre,
            partes_seleccionadas: esJuego ? componentes : undefined,
            opciones: productoDisponible.opciones,
            es_consignado: productoDisponible.es_consignado,
            id_consignacion_detalle: productoDisponible.id_consignacion_detalle,
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
  
  const actualizarProducto = (id: number, cambios: Partial<Producto>) => {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
  };

  const handleVentaConfirmada = () => {
    // Limpiar formulario
    setProductos([]);
    setClienteSeleccionado(null);
    setFecha(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <div className="mx-auto max-w-[1440px] space-y-8">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 sm:w-12" style={{ background: "var(--rose-gold)" }} />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-marcellus)" }}>
                Gestión
              </span>
            </div>
            {cargandoPedido && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "var(--rose-gold)" }} />
                <p className="text-xs" style={{ color: "var(--slate-light)" }}>
                  Sincronizando productos del pedido...
                </p>
              </div>
            )}
            <Suspense fallback={null}>
              <PedidoHydrator 
                onLoading={() => setCargandoPedido(true)} 
                onLoaded={(prods) => { setProductos(prods); setCargandoPedido(false); }} 
              />
            </Suspense>
          </header>

          <NuevaVentaHeader />

          <VentaInfoForm
            usuario={usuario}
            onClienteChange={setClienteSeleccionado}
            onFechaChange={setFecha}
          />

          <ProductosVenta
            productos={productos}
            clienteSeleccionado={clienteSeleccionado}
            usuario={usuario}
            onAgregar={agregarProducto}
            onEliminar={eliminarProducto}
            onAumentar={aumentarCantidad}
            onDisminuir={disminuirCantidad}
            onActualizar={actualizarProducto}
          />

          <VentaResumen
            productos={productos}
            cliente={clienteSeleccionado}
            vendedor={usuario?.nombre || "Usuario actual"}
            idUsuario={usuario?.id || ""}
            fecha={fecha}
            esVentaMayorista={usuario?.id_rol === 1 && !!clienteSeleccionado?.id_usuario}
            onConfirmed={handleVentaConfirmada}
          />
        </div>
      </main>
    </div>
  );
}
