"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ProductoRepository } from "@/lib/repositories/ProductoRepository";

interface NuevoPedidoProps {
  usuarioId: number;
  onSuccess: () => void;
}

export default function NuevoPedido({ usuarioId, onSuccess }: NuevoPedidoProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos del inventario general
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const repo = new ProductoRepository(supabase);
        const { data, error } = await repo.getAll();
        if (data) setProductos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id.toString().includes(busqueda)
  );

  const agregarAlCarrito = (producto: any) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const enviarPedido = async () => {
    if (carrito.length === 0) return;
    setEnviando(true);
    setError(null);

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const detalles = carrito.map(item => ({
      id_producto: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      subtotal: item.precio * item.cantidad
    }));

    try {
      const resp = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuarioId,
          total_estimado: total,
          detalles
        })
      });

      if (resp.ok) {
        setCarrito([]);
        onSuccess();
      } else {
        const data = await resp.json();
        setError(data.error || "Error al enviar el pedido");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Buscador de Productos */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9796]" size={20} />
          <input
            type="text"
            placeholder="Buscar productos por nombre o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#f8f9fa] border-2 border-[#8C9796]/20 rounded-2xl pl-12 pr-4 py-4 focus:border-[#B76E79]/50 transition outline-none"
          />
        </div>

        {loading ? (
           <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#B76E79]" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productosFiltrados.slice(0, 8).map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#8C9796]/10 shadow-sm flex items-center justify-between hover:border-[#B76E79]/30 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F6F4EF] rounded-xl flex items-center justify-center text-[#B76E79]">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#708090]">{p.nombre}</p>
                    <p className="text-xs text-[#8C9796]">${p.precio} MXN</p>
                  </div>
                </div>
                <button 
                  onClick={() => agregarAlCarrito(p)}
                  className="p-2 bg-[#F6F4EF] text-[#B76E79] rounded-xl hover:bg-[#B76E79] hover:text-white transition cursor-pointer"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de Pedido */}
      <div className="bg-[#F6F4EF]/50 rounded-3xl p-6 border border-[#B76E79]/20 flex flex-col h-fit sticky top-6">
        <h3 className="text-lg font-bold text-[#708090] mb-6 flex items-center gap-2">
          <ShoppingBag size={22} className="text-[#B76E79]" />
          Tu Pedido
        </h3>

        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
          {carrito.length === 0 ? (
            <p className="text-center text-[#8C9796] py-8 text-sm italic">Tu carrito está vacío</p>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm animate-in slide-in-from-right-4 duration-200">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#708090] line-clamp-1">{item.nombre}</p>
                  <p className="text-xs text-[#8C9796]">{item.cantidad} x ${item.precio}</p>
                </div>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="p-2 text-red-300 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#B76E79]/20 pt-6 mt-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#8C9796] font-medium">Total Estimado</span>
            <span className="text-2xl font-bold text-[#B76E79]">
              ${carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}
            </span>
          </div>

          {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

          <button
            onClick={enviarPedido}
            disabled={carrito.length === 0 || enviando}
            className="w-full bg-[#B76E79] text-white py-4 rounded-2xl font-bold hover:bg-[#A0626B] disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {enviando ? <Loader2 className="animate-spin" size={20} /> : "Levantar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
