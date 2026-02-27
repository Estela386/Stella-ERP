"use client";

import { Producto } from "../page";
import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Plus, Minus } from "lucide-react";

interface ProductoDisponible {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
}

type Props = {
  productos: Producto[];
  onAgregar: (producto: ProductoDisponible) => void;
  onEliminar: (id: number) => void;
  onAumentar: (id: number) => void;
  onDisminuir: (id: number) => void;
};

export default function ProductosVenta({
  productos,
  onAgregar,
  onEliminar,
  onAumentar,
  onDisminuir,
}: Props) {
  const [productosDisponibles, setProductosDisponibles] = useState<
    ProductoDisponible[]
  >([]);
  const [productosFiltrados, setProductosFiltrados] = useState<
    ProductoDisponible[]
  >([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar productos disponibles
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("/api/ventas/productos");
        const data = await response.json();

        if (response.ok && data.productos) {
          setProductosDisponibles(data.productos);
          setProductosFiltrados(data.productos);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Filtrar productos por búsqueda
  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados(productosDisponibles);
    } else {
      const termino = busqueda.toLowerCase();
      setProductosFiltrados(
        productosDisponibles.filter(p =>
          p.nombre.toLowerCase().includes(termino)
        )
      );
    }
  }, [busqueda, productosDisponibles]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-[#8C9796]/20 overflow-visible border border-[#8C9796]/20">
      {/* HEADER */}
      <div className="bg-[#F6F4EF] px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-[#708090] tracking-wide">
          Productos en la Venta
        </h2>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="p-6 space-y-3 max-h-[340px] overflow-y-auto">
        {productos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#8C9796] text-sm">
              Aún no hay productos agregados
            </p>
          </div>
        ) : (
          productos.map(p => (
            <div
              key={p.id}
              className="
                flex items-center justify-between
                bg-[#F6F4EF]
                border border-[#8C9796]/20
                rounded-xl
                px-4 py-3
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              {/* INFO PRODUCTO */}
              <div className="flex flex-col flex-1">
                <p className="font-semibold text-[#708090]">{p.nombre}</p>
                <p className="text-xs text-[#8C9796]">
                  ${p.precio.toLocaleString()}
                  {p.stock !== undefined && (
                    <span className="ml-2">Stock: {p.stock}</span>
                  )}
                </p>
              </div>

              {/* DERECHA */}
              <div className="flex items-center gap-3">
                {/* CANTIDAD CON +/- */}
                <div className="flex items-center gap-2 bg-white border border-[#8C9796]/30 rounded-lg px-2 py-1">
                  <button
                    onClick={() => onDisminuir(p.id)}
                    disabled={p.cantidad <= 1}
                    className="p-1 hover:bg-[#B76E79]/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Disminuir cantidad"
                  >
                    <Minus size={14} className="text-[#B76E79]" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#708090]">
                    {p.cantidad}
                  </span>
                  <button
                    onClick={() => onAumentar(p.id)}
                    disabled={p.stock !== undefined && p.cantidad >= p.stock}
                    className="p-1 hover:bg-[#B76E79]/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title={
                      p.stock !== undefined && p.cantidad >= p.stock
                        ? "Stock máximo alcanzado"
                        : "Aumentar cantidad"
                    }
                  >
                    <Plus size={14} className="text-[#B76E79]" />
                  </button>
                </div>

                {/* SUBTOTAL */}
                <p className="font-semibold text-[#B76E79] text-lg min-w-fit">
                  ${(p.precio * p.cantidad).toLocaleString()}
                </p>

                {/* ELIMINAR */}
                <button
                  onClick={() => onEliminar(p.id)}
                  className="
                    w-8 h-8
                    rounded-full
                    bg-[#B76E79]/15
                    text-[#B76E79]
                    flex items-center justify-center
                    hover:bg-[#B76E79]
                    hover:text-white
                    transition
                  "
                  title="Eliminar producto"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SELECTOR DE PRODUCTOS */}
      <div className="flex gap-4 p-6 border-t bg-[#F6F4EF] relative z-20">
        {/* Dropdown para buscar productos */}
        <div ref={dropdownRef} className="flex-1 relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (!showDropdown) setBusqueda("");
            }}
            className={`w-full text-left bg-white border-2 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none transition flex items-center justify-between ${
              showDropdown
                ? "border-[#B76E79] ring-2 ring-[#B76E79]/20"
                : "border-[#8C9796]/40 hover:border-[#8C9796]/60"
            }`}
          >
            <span className="text-[#8C9796]">
              {loading ? "Cargando productos..." : "+ Agregar producto"}
            </span>
            <ChevronDown
              size={18}
              className={`text-[#B76E79] transition ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#B76E79]/50 rounded-xl shadow-2xl z-50 w-full">
              {/* Búsqueda */}
              <div className="p-3 border-b border-[#8C9796]/20">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9796]/50"
                  />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    autoFocus
                    className="w-full bg-[#F6F4EF] border border-[#8C9796]/30 rounded-lg pl-10 pr-3 py-2 text-sm text-[#708090] focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
                  />
                </div>
              </div>

              {/* Lista de productos */}
              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-[#8C9796] text-sm">
                    Cargando productos...
                  </div>
                ) : productosFiltrados.length === 0 ? (
                  <div className="p-4 text-center text-[#8C9796] text-sm">
                    {busqueda
                      ? "No se encontraron productos"
                      : "Sin productos disponibles"}
                  </div>
                ) : (
                  productosFiltrados.map(producto => {
                    const sinStock = !producto.stock || producto.stock === 0;
                    return (
                      <button
                        key={producto.id}
                        disabled={sinStock}
                        onClick={() => {
                          onAgregar(producto);
                          setShowDropdown(false);
                          setBusqueda("");
                        }}
                        className={`w-full text-left px-4 py-3 transition border-b border-[#8C9796]/10 last:border-b-0 ${
                          sinStock
                            ? "opacity-50 cursor-not-allowed bg-[#8C9796]/5"
                            : "hover:bg-[#B76E79]/10 cursor-pointer"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                sinStock ? "text-[#8C9796]" : "text-[#708090]"
                              }`}
                            >
                              {producto.nombre}
                            </div>
                            <div className="text-xs text-[#8C9796] flex items-center gap-1 mt-1">
                              Stock: {producto.stock || 0}
                              {sinStock && (
                                <span className="text-[#B76E79] font-semibold">
                                  (Sin stock)
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              sinStock ? "text-[#8C9796]" : "text-[#B76E79]"
                            }`}
                          >
                            ${producto.precio.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
