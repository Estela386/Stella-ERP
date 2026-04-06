"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Trash2, ShoppingBag, Loader2, Sparkles, X, Settings2, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ProductoRepository } from "@/lib/repositories/ProductoRepository";
import { useCart } from "@/lib/hooks/useCart";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { IProducto, OpcionDTO } from "../../../../../lib/models/Producto";
import Image from "next/image";

interface NuevoPedidoProps {
  usuarioId: number | string;
  onSuccess: () => void;
}

// Interfaz para el item local del carrito en este componente
interface ItemCarritoLocal {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  es_personalizable: boolean;
  personalizacion: Record<string, string> | null;
  url_imagen?: string;
}

export default function NuevoPedido({ usuarioId, onSuccess }: NuevoPedidoProps) {
  const { items: itemsCarrito, limpiarCarrito } = useCart();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemCarritoLocal[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para personalización
  const [personalizandoIdx, setPersonalizandoIdx] = useState<number | null>(null);
  const [opcionesCargando, setOpcionesCargando] = useState(false);
  const [opcionesProducto, setOpcionesProducto] = useState<OpcionDTO[]>([]);
  const [configuracionActual, setConfiguracionActual] = useState<Record<string, string>>({});
  const [intentoSuscripcion, setIntentoSuscripcion] = useState(false);

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const repo = new ProductoRepository(supabase);
      const { data } = await repo.getAll();
      if (data) setProductos(data as IProducto[]);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const abrirPersonalizacion = useCallback(async (index: number, currentCarrito: ItemCarritoLocal[]) => {
    const item = currentCarrito[index];
    if (!item) return;
    
    setPersonalizandoIdx(index);
    setOpcionesCargando(true);
    setConfiguracionActual(item.personalizacion || {});
    
    try {
      const resp = await fetch(`/api/productos/${item.id}/opciones`);
      const data = await resp.json();
      if (data.opciones) setOpcionesProducto(data.opciones as OpcionDTO[]);
    } catch (err) {
      console.error("Error al cargar opciones:", err);
      toast.error("Error al cargar opciones");
    } finally {
      setOpcionesCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    
    if (searchParams.get("fromCart") === "true" && itemsCarrito.length > 0) {
      const itemsMapeados: ItemCarritoLocal[] = itemsCarrito.map(item => ({
        id: item.producto.id,
        nombre: item.producto.nombre || "Sin nombre",
        precio: item.producto.precio,
        cantidad: item.cantidad,
        es_personalizable: !!item.producto.es_personalizable,
        personalizacion: (item.personalizacion as Record<string, string>) || null,
        url_imagen: item.producto.url_imagen || undefined
      }));
      setCarrito(itemsMapeados);
    }
  }, [cargarProductos, itemsCarrito, searchParams]);

  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id.toString().includes(busqueda)
  );

  const agregarAlCarrito = (producto: IProducto) => {
    const nuevoItem: ItemCarritoLocal = { 
      id: producto.id,
      nombre: producto.nombre || "Sin nombre",
      precio: producto.precio,
      cantidad: 1,
      es_personalizable: !!producto.es_personalizable,
      personalizacion: null,
      url_imagen: producto.url_imagen || undefined
    };
    
    const nuevoCarrito = [...carrito, nuevoItem];
    setCarrito(nuevoCarrito);
    toast.success(`${producto.nombre} añadido`);

    // AUTO-OPEN si es personalizable
    if (producto.es_personalizable) {
      setTimeout(() => abrirPersonalizacion(nuevoCarrito.length - 1, nuevoCarrito), 300);
    }
  };

  const guardarPersonalizacion = () => {
    if (personalizandoIdx === null) return;
    
    const faltantes = opcionesProducto.filter(op => 
      op.obligatorio && !configuracionActual[op.nombre]
    );

    if (faltantes.length > 0) {
      toast.error(`Campo obligatorio: ${faltantes[0].nombre}`, {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    const nuevoCarrito = [...carrito];
    nuevoCarrito[personalizandoIdx].personalizacion = configuracionActual;
    setCarrito(nuevoCarrito);
    setPersonalizandoIdx(null);
    toast.success("Configuración guardada", {
      icon: <CheckCircle2 className="text-emerald-500" />
    });
  };

  const eliminarDelCarrito = (idx: number) => {
    setCarrito(carrito.filter((_, i) => i !== idx));
  };

  const enviarPedido = async () => {
    setIntentoSuscripcion(true);
    if (carrito.length === 0) return;

    // VALIDACIÓN INTEGRAL
    const incompletos = carrito.filter(item => item.es_personalizable && !item.personalizacion);
    if (incompletos.length > 0) {
      toast.error(`Faltan datos en ${incompletos.length} producto(s)`, {
        description: "Por favor, personaliza los artículos resaltados en rojo.",
        duration: 5000
      });
      return;
    }

    setEnviando(true);
    setError(null);

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const detalles = carrito.map(item => ({
      id_producto: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      subtotal: item.precio * item.cantidad,
      personalizacion: item.personalizacion
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
        if (searchParams.get("fromCart") === "true") limpiarCarrito();
        onSuccess();
        toast.success("Pedido procesado con éxito");
      } else {
        const data = await resp.json();
        setError(data.error || "Error al enviar el pedido");
      }
    } catch (err) {
      console.error("Error al enviar pedido:", err);
      setError("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 items-start">
      
      {/* SECCIÓN IZQUIERDA: BUSCADOR Y RESULTADOS */}
      <div className="flex-1 space-y-8 w-full">
        <div className="flex flex-col gap-2">
            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-[#B76E79]">Inventario</h4>
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8C9796] group-focus-within:text-[#B76E79] transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Busca tesoros por nombre o ID..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-white border border-black/5 rounded-[2rem] pl-14 pr-6 py-5 shadow-sm focus:shadow-xl focus:border-[#B76E79]/30 transition-all outline-none text-[#708090]"
                />
            </div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-[#B76E79]" size={32} />
                <p className="text-xs text-[#8C9796] tracking-widest uppercase font-medium">Buscando artículos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {productosFiltrados.slice(0, 8).map((p, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    key={p.id} 
                    className="group bg-white p-5 rounded-[2rem] border border-black/5 shadow-sm flex items-center justify-between hover:shadow-xl hover:border-[#B76E79]/20 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#F6F4EF] rounded-2xl flex items-center justify-center text-[#B76E79] group-hover:scale-110 transition-transform duration-500 overflow-hidden relative shrink-0">
                        {p.url_imagen ? (
                            <Image src={p.url_imagen} alt={p.nombre || "Producto"} fill sizes="(max-width: 768px) 100vw, 56px" className="object-cover" />
                        ) : (
                            <ShoppingBag size={24} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-[#708090] text-sm leading-tight">{p.nombre}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <p className="text-xs font-bold text-[#B76E79]">${p.precio} MXN</p>
                            {p.es_personalizable && (
                                <span className="flex shrink-0 items-center gap-1 text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
                                    <Sparkles size={8} /> Personalizable
                                </span>
                            )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => agregarAlCarrito(p)}
                      className="p-3 bg-[#F6F4EF] text-[#B76E79] rounded-2xl hover:bg-[#B76E79] hover:text-white transition-all shadow-sm hover:rotate-90 duration-300"
                    >
                      <Plus size={22} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN Y ACCIÓN */}
      <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 sticky top-10">
        <div className="bg-white rounded-[2rem] p-6 lg:p-7 border border-black/5 shadow-xl flex flex-col min-h-[300px] lg:min-h-[500px] overflow-hidden relative">
          
          {/* Header del Carrito */}
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-bold text-[#708090] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79]">
                <ShoppingBag size={20} />
              </div>
              Bolsa de Pedido
            </h4>
            <span className="bg-[#F6F4EF] text-[#8C9796] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {carrito.length} Items
            </span>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
            <AnimatePresence initial={false}>
                {carrito.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex flex-col items-center justify-center py-20 text-center gap-4"
                    >
                        <div className="w-16 h-16 bg-[#F6F4EF] rounded-full flex items-center justify-center text-[#D6C1B1]">
                            <ShoppingBag size={32} />
                        </div>
                        <p className="text-sm text-[#8C9796] italic">Tu bolsa de pedido está vacía.<br/>¡Añade algo especial!</p>
                    </motion.div>
                ) : (
                    carrito.map((item, idx) => {
                        const needsConfig = item.es_personalizable && !item.personalizacion;
                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key={`${item.id}-${idx}`} 
                                className={`group flex flex-col p-4 rounded-3xl border transition-all duration-300 ${
                                    needsConfig && intentoSuscripcion 
                                    ? "bg-red-50 border-red-200 animate-pulse" 
                                    : "bg-[#F6F4EF]/30 border-transparent hover:bg-white hover:shadow-lg hover:border-black/5"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-bold text-[#708090] line-clamp-1">{item.nombre}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-[#B76E79]">${item.precio}</span>
                                            <span className="text-[10px] text-[#8C9796]">Cant: {item.cantidad}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {item.es_personalizable && (
                                            <button 
                                                onClick={() => abrirPersonalizacion(idx, carrito)}
                                                className={`p-2.5 rounded-xl transition-all ${
                                                    item.personalizacion 
                                                    ? 'bg-emerald-50 text-emerald-600' 
                                                    : 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                                                }`}
                                                title="Personalizar"
                                            >
                                                <Settings2 size={18} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => eliminarDelCarrito(idx)}
                                            className="p-2.5 rounded-xl text-[#D6C1B1] hover:bg-red-50 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {item.personalizacion ? (
                                    <div className="mt-3 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                                        {Object.entries(item.personalizacion).map(([key, val]) => {
                                            const valStr = String(val);
                                            const hasPipe = valStr.includes('|');
                                            const [name, colorHex] = hasPipe ? valStr.split('|') : [valStr, ''];
                                            const isColor = hasPipe && colorHex.startsWith('#');
                                            
                                            return (
                                                <span key={key} className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-black/5 text-[10px] font-bold text-[#8C9796] flex items-center gap-1.5 shadow-sm">
                                                    <span className="text-slate-400 font-medium">{key}:</span>
                                                    {isColor && (
                                                        <span className="w-2.5 h-2.5 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: colorHex }} />
                                                    )}
                                                    {name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ) : needsConfig && (
                                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-100/50 p-2 rounded-xl border border-amber-200">
                                        <AlertCircle size={12} />
                                        Configuración pendiente
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
          </div>

          {/* Footer del Resumen */}
          <div className="mt-8 pt-8 border-t border-[#F6F4EF] space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-widest font-bold text-[#8C9796]">Inversión Estimada</p>
                <div className="text-3xl font-black text-[#B76E79] font-mono">
                    ${carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}
                </div>
              </div>
              <ChevronRight className="text-[#D6C1B1]" size={32} />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-3 text-red-500 text-xs animate-bounce">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button
              onClick={enviarPedido}
              disabled={carrito.length === 0 || enviando || !usuarioId}
              className="w-full bg-[#B76E79] text-white py-5 rounded-[2rem] font-bold text-lg shadow-[0_20px_40px_rgba(183,110,121,0.3)] hover:shadow-[0_25px_50px_rgba(183,110,121,0.4)] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
            >
              {enviando ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                    Levantar Pedido 
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE PERSONALIZACIÓN INTEGRADO */}
      <AnimatePresence>
        {personalizandoIdx !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-white/20"
            >
              {/* Header Modal */}
              <div className="bg-gradient-to-br from-[#B76E79] to-[#8C525A] p-8 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Settings2 size={120} className="rotate-12" />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold font-serif" style={{ fontFamily: 'var(--font-marcellus)' }}>Personaliza tu pieza</h4>
                    <p className="text-sm opacity-80 font-medium flex items-center gap-2">
                        <ShoppingBag size={14} /> {carrito[personalizandoIdx]?.nombre}
                    </p>
                  </div>
                  <button 
                    onClick={() => setPersonalizandoIdx(null)} 
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Cuerpo Modal */}
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                {opcionesCargando ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-[#B76E79]" size={32} />
                    <p className="text-xs text-[#8C9796] tracking-widest uppercase font-bold">Cargando opciones...</p>
                  </div>
                ) : opcionesProducto.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Settings2 size={48} className="mx-auto text-[#D6C1B1] opacity-30" />
                    <p className="text-sm text-[#8C9796] italic">No hay opciones configurables para este producto.</p>
                  </div>
                ) : (
                  opcionesProducto.map((op, opIdx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: opIdx * 0.1 }}
                        key={opIdx} 
                        className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4"
                    >
                      <label className="text-sm font-bold text-[#708090] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            {op.nombre}
                            {op.obligatorio && <span className="text-red-400 font-black">*</span>}
                        </span>
                        <span className="text-[10px] text-[#8C9796] font-normal uppercase tracking-widest">{op.tipo}</span>
                      </label>
                      
                      {op.tipo === "select" && (
                        <div className="relative">
                            <select 
                                value={configuracionActual[op.nombre] || ""}
                                onChange={(e) => setConfiguracionActual({...configuracionActual, [op.nombre]: e.target.value})}
                                className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:border-[#B76E79]/20 outline-none transition appearance-none text-[#708090]"
                            >
                                <option value="">Selecciona una opción...</option>
                                {op.valores?.map((v, vIdx) => (
                                <option key={vIdx} value={v.valor}>{v.valor}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8C9796]">
                                <ChevronRight size={18} className="rotate-90" />
                            </div>
                        </div>
                      )}

                      {op.tipo === "text" && (
                        <input 
                          type="text"
                          value={configuracionActual[op.nombre] || ""}
                          onChange={(e) => setConfiguracionActual({...configuracionActual, [op.nombre]: e.target.value})}
                          className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:border-[#B76E79]/20 outline-none transition text-[#708090]"
                          placeholder="Escribe aquí el detalle..."
                        />
                      )}

                      {(op.tipo === "multi" || op.tipo === "color") && (
                        <div className="flex flex-wrap gap-3">
                          {op.valores?.map((v, vIdx) => {
                             const hasPipe = v.valor?.includes('|');
                             const [name, hexCode] = hasPipe ? v.valor.split('|') : [v.valor, ''];
                             
                             const isColorField = op.tipo === "color" || 
                                                  op.nombre.toLowerCase().includes('color') || 
                                                  op.nombre.toLowerCase().includes('tono') || 
                                                  op.nombre.toLowerCase().includes('metal');
                             
                             const isColor = isColorField || (hasPipe && hexCode.startsWith('#'));
                             
                             // Fallback to recognized colors if no hex is provided
                             const getFallbackColor = (n: string) => {
                                 const lowered = n.toLowerCase();
                                 if (lowered.includes('oro rosa') || lowered.includes('rose')) return '#C07C88';
                                 if (lowered.includes('oro') || lowered.includes('dorad')) return '#D4AF37';
                                 if (lowered.includes('plata') || lowered.includes('platead')) return '#E2E8F0';
                                 if (lowered.includes('blanc')) return '#F8FAFC';
                                 if (lowered.includes('negr')) return '#1E293B';
                                 if (lowered.includes('roj')) return '#EF4444';
                                 if (lowered.includes('azul')) return '#3B82F6';
                                 if (lowered.includes('verd')) return '#10B981';
                                 if (lowered.includes('amarill')) return '#F59E0B';
                                 if (lowered.includes('rosa')) return '#F472B6';
                                 if (lowered.includes('morad') || lowered.includes('lila')) return '#8B5CF6';
                                 return '#E2E8F0'; // Default gray/silver
                             };
                             
                             const hex = (hasPipe && hexCode.startsWith('#')) ? hexCode : getFallbackColor(name);
                             const active = configuracionActual[op.nombre] === v.valor;
                             
                             if (isColor) {
                               return (
                                 <button
                                   key={vIdx}
                                   onClick={() => setConfiguracionActual({...configuracionActual, [op.nombre]: v.valor})}
                                   className={`group flex flex-col items-center gap-1 transition-all p-2 rounded-2xl ${active ? 'bg-[#F6F4EF] shadow-sm' : 'hover:bg-slate-50'}`}
                                 >
                                   <div 
                                    className={`w-10 h-10 rounded-full border-[3px] transition-all duration-300 ${active ? 'border-[#B76E79] shadow-md scale-110' : 'border-gray-200 hover:scale-105 hover:border-gray-300'}`}
                                    style={{ backgroundColor: hex }}
                                   />
                                   <span className={`text-[10px] font-bold mt-1 text-center max-w-[60px] leading-tight transition-colors ${active ? 'text-[#B76E79]' : 'text-slate-400'}`}>{name}</span>
                                 </button>
                               )
                             } else {
                               return (
                                 <button
                                   key={vIdx}
                                   onClick={() => setConfiguracionActual({...configuracionActual, [op.nombre]: v.valor})}
                                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                      active 
                                        ? 'bg-[#B76E79] text-white shadow-md' 
                                        : 'bg-white border-2 border-slate-100 text-[#708090] hover:border-slate-200'
                                    } whitespace-normal text-left`}
                                 >
                                   {name}
                                 </button>
                               )
                             }
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Modal */}
              <div className="p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                <button 
                  onClick={() => setPersonalizandoIdx(null)}
                  className="w-full sm:w-1/3 text-[#8C9796] text-sm font-bold hover:text-[#708090] transition-colors py-4"
                >
                  Omitir cambios
                </button>
                <button 
                  onClick={guardarPersonalizacion}
                  className="w-full sm:w-2/3 bg-gradient-to-r from-[#B76E79] to-[#8C525A] text-white py-4 rounded-[1.5rem] font-bold hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-lg shadow-[#B76E79]/20 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  Aplicar Configuración
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D6C1B1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B76E79;
        }
      `}</style>
    </div>
  );
}
