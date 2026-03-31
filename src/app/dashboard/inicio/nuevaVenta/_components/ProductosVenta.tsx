"use client";

import { Producto } from "../page";
import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Plus, Minus, QrCode } from "lucide-react";
import QrScannerModal from "./QrScannerModal";

interface ProductoDisponible {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  categoria_nombre?: string;
  opciones?: any[];
}

type Props = {
  productos: Producto[];
  onAgregar: (producto: ProductoDisponible) => void;
  onEliminar: (id: number) => void;
  onAumentar: (id: number) => void;
  onDisminuir: (id: number) => void;
  onActualizar: (id: number, cambios: Partial<Producto>) => void;
};

export default function ProductosVenta({
  productos,
  onAgregar,
  onEliminar,
  onAumentar,
  onDisminuir,
  onActualizar,
}: Props) {
  const [productosDisponibles, setProductosDisponibles] = useState<
    ProductoDisponible[]
  >([]);
  const [productosFiltrados, setProductosFiltrados] = useState<
    ProductoDisponible[]
  >([]);
  const [busqueda, setBusqueda] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
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

  // Manejar el escaneo de QR ya sea por texto manual o por la cámara
  const processQrString = (val: string) => {
    if (!val) return;
    
    let idStr = "";
    
    // Intentar extraer de una URL como xxx/productos/9
    const match = val.match(/\/productos\/(\d+)/);
    if (match && match[1]) {
      idStr = match[1];
    } else if (/^\d+$/.test(val)) {
      // Fallback: si solo se escanea un número
      idStr = val;
    }
    
    if (idStr) {
      const prodId = parseInt(idStr, 10);
      const productoFound = productosDisponibles.find(p => p.id === prodId);
      
      if (productoFound) {
        if (!productoFound.stock || productoFound.stock === 0) {
          alert("El producto escaneado no tiene stock disponible.");
        } else {
          onAgregar(productoFound);
        }
      } else {
        alert("Producto no encontrado en inventario.");
      }
    } else {
      alert("Código QR inválido. No se pudo obtener el ID del producto.");
    }
  };

  const handleQrScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processQrString(qrInput.trim());
      setQrInput("");
    }
  };

  const handleCameraScan = (decodedText: string) => {
    setIsScannerOpen(false);
    processQrString(decodedText.trim());
  };

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
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#708090]">{p.nombre}</p>
                  {p.categoria_nombre && (
                    <span className="text-[10px] bg-[#B76E79]/10 text-[#B76E79] px-2 py-0.5 rounded-full font-medium">
                      {p.categoria_nombre}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8C9796]">
                  ${p.precio.toLocaleString()}
                  {p.stock !== undefined && (
                    <span className="ml-2">Stock: {p.stock}</span>
                  )}
                </p>

                {/* OPCIONES DE JUEGO (Si aplica) */}
                {p.categoria_nombre?.toLowerCase().includes("juego") && (
                  <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Checkboxes de partes */}
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const opJuego = p.opciones?.find((o: any) => o.nombre === "Componentes del Juego");
                        const componentes = opJuego && opJuego.valores 
                          ? opJuego.valores.map((v: any) => v.valor) 
                          : ["Anillo", "Collar", "Aretes"];
                        
                        return componentes.map((parte: string) => {
                          const seleccionadas = p.partes_seleccionadas || [];
                          const isSelected = seleccionadas.includes(parte);
                          return (
                            <button
                              key={parte}
                              onClick={() => {
                                const nuevas = isSelected
                                  ? seleccionadas.filter(s => s !== parte)
                                  : [...seleccionadas, parte];
                                onActualizar(p.id, { partes_seleccionadas: nuevas });
                              }}
                              className={`
                                text-[10px] px-3 py-1 rounded-lg border transition-all flex items-center gap-1
                                ${isSelected 
                                  ? "bg-[#B76E79] text-white border-[#B76E79] shadow-sm" 
                                  : "bg-white text-[#708090] border-[#8C9796]/30 hover:border-[#B76E79]/50"}
                              `}
                            >
                              {parte}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Precios rápidos */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#8C9796] uppercase">Precio x:</span>
                      {[1, 2, 3].map(num => (
                        <button
                          key={num}
                          onClick={() => {
                            const nuevoPrecio = prompt(`Ingrese precio para ${num} artículo(s):`, p.precio.toString());
                            if (nuevoPrecio !== null) {
                              const val = parseFloat(nuevoPrecio);
                              if (!isNaN(val)) {
                                onActualizar(p.id, { precio: val });
                              }
                            }
                          }}
                          className="bg-white border border-[#8C9796]/30 text-[#708090] hover:border-[#B76E79] hover:text-[#B76E79] text-[10px] font-bold w-12 py-1 rounded-md transition-all shadow-sm"
                        >
                          {num} Art
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DERECHA */}
              <div className="flex items-center gap-3">
                {/* CANTIDAD CON +/- */}
                <div className="flex items-center gap-2 bg-white border border-[#8C9796]/30 rounded-lg px-2 py-1">
                  <button
                    onClick={() => onDisminuir(p.id)}
                    disabled={p.cantidad <= 1}
                    className="p-1 hover:bg-[#B76E79]/10 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
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
                    className="p-1 hover:bg-[#B76E79]/10 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
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
                <div className="flex flex-col items-end min-w-[80px]">
                  <p className="font-semibold text-[#B76E79] text-lg leading-tight">
                    ${(p.precio * p.cantidad).toLocaleString()}
                  </p>
                  {p.cantidad > 1 && (
                    <p className="text-[9px] text-[#8C9796] mt-0.5">
                      ${p.precio.toLocaleString()} c/u
                    </p>
                  )}
                </div>

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
                    cursor-pointer
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

      {/* SELECTOR DE PRODUCTOS Y ESCÁNER */}
      <div className="flex flex-col sm:flex-row gap-4 p-6 border-t bg-[#F6F4EF] relative z-20">
        
        {/* Acciones de Escáner QR */}
        <div className="w-full sm:w-[50%] md:w-1/3 flex gap-2">
          {/* Cámara / Subir Imagen */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center justify-center bg-[#b76e79] text-white px-4 py-3 rounded-xl shadow-sm hover:bg-[#a45f69] transition"
            title="Abrir cámara o imagen"
          >
            <QrCode className="w-5 h-5 mx-auto" />
          </button>
          
          {/* Input para pistola láser física o pegado manual */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pistola láser / Pega URL aquí y presiona Enter..."
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              onKeyDown={handleQrScan}
              className="w-full px-3 py-3 bg-white border-2 border-[#8C9796]/40 rounded-xl text-xs text-[#708090] shadow-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]/20 transition"
            />
          </div>
        </div>

        {/* Dropdown para buscar productos */}
        <div ref={dropdownRef} className="flex-1 relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (!showDropdown) setBusqueda("");
            }}
            className={`w-full text-left bg-white border-2 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none transition flex items-center justify-between cursor-pointer ${
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
                        className={`w-full text-left px-4 py-3 transition border-b border-[#8C9796]/10 last:border-b-0 cursor-pointer ${
                          sinStock
                            ? "opacity-50 cursor-not-allowed bg-[#8C9796]/5"
                            : "hover:bg-[#B76E79]/10"
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

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleCameraScan}
      />
    </div>
  );
}
