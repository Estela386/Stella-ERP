"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoCard } from "../types";
import { obtenerProductosCatalogo } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Grid, List, Search } from "lucide-react";

// --- Tipos y Configuración ---
type FilterCategory = "Metal" | "Color" | "Colección" | "Estilo" | "Tamaño" | "Precio";

interface FilterOption {
  label: string;
  value: string;
  category: FilterCategory;
}

const FILTER_CONFIG: Record<FilterCategory, string[]> = {
  Metal: ["Oro", "Plata", "Oro Rosa", "Bronce", "Acero"],
  Color: ["Blanco", "Rosa", "Azul", "Verde", "Natural", "Negro"],
  Colección: ["Clásica", "Moderma", "Orgánica", "Vintage", "Minimalista"],
  Estilo: ["Naturaleza", "Geométrico", "Amor", "Celestial", "Abstracto"],
  Tamaño: ["Pequeño", "Mediano", "Grande"],
  Precio: ["Menos de $100", "$100 - $300", "$300 - $600", "Más de $600"],
};

export default function CatalogPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [openDropdown, setOpenDropdown] = useState<FilterCategory | null>(null);
  const [sortBy, setSortBy] = useState("Novedades");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Colores solicitados
  const SLATE_GRAY = "#708090"; // Contraste base
  const ROSE_GOLD = "#B76E79";   // Seleccionado / Acento

  // Cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const { productos: productosData, error: errorProductos } = await obtenerProductosCatalogo();
        if (errorProductos) {
          setError(errorProductos);
          return;
        }
        setProductos(productosData || []);
      } catch (err) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // --- Lógica de Filtrado Inteligente ---
  const filteredAndSortedProductos = useMemo(() => {
    let result = [...productos];

    // Búsqueda por término
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category?.toLowerCase().includes(term)
      );
    }

    // Filtros activos (Extracción del nombre/categoría)
    activeFilters.forEach(filter => {
      const val = filter.value.toLowerCase();
      
      if (filter.category === "Precio") {
        if (val.includes("menos de")) result = result.filter(p => p.price < 100);
        else if (val.includes("100 - 300")) result = result.filter(p => p.price >= 100 && p.price <= 300);
        else if (val.includes("300 - 600")) result = result.filter(p => p.price > 300 && p.price <= 600);
        else if (val.includes("más de")) result = result.filter(p => p.price > 600);
      } else {
        result = result.filter(p => 
          p.name.toLowerCase().includes(val) || 
          p.category?.toLowerCase().includes(val)
        );
      }
    });

    // Ordenamiento
    if (sortBy === "Precio: Menor a Mayor") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "Precio: Mayor a Menor") result.sort((a, b) => b.price - a.price);

    return result;
  }, [productos, searchTerm, activeFilters, sortBy]);

  // --- Manejadores ---
  const toggleFilter = (category: FilterCategory, value: string) => {
    const exists = activeFilters.find(f => f.category === category && f.value === value);
    if (exists) {
      setActiveFilters(activeFilters.filter(f => !(f.category === category && f.value === value)));
    } else {
      setActiveFilters([...activeFilters, { label: value, value, category }]);
    }
  };

  const removeFilter = (filter: FilterOption) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => setActiveFilters([]);

  const handleProductClick = (id: number) => {
    router.push(`/productos/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <HeaderClient />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- Toolbar / Filtros --- */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[#708090]/20 pb-6">
            {/* Dropdowns de Filtro */}
            <div className="flex flex-wrap items-center gap-4">
              {(Object.keys(FILTER_CONFIG) as FilterCategory[]).map(category => (
                <div key={category} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === category ? null : category)}
                    className="flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: SLATE_GRAY }}
                  >
                    {category}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === category ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown === category && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-10 left-0 z-50 w-52 bg-white rounded-xl shadow-2xl border border-[#708090]/10 py-3 overflow-hidden"
                      >
                        {FILTER_CONFIG[category].map(opt => {
                          const isSelected = !!activeFilters.find(f => f.category === category && f.value === opt);
                          return (
                            <label
                              key={opt}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fcf5ef] cursor-pointer transition-colors"
                              style={{ color: isSelected ? ROSE_GOLD : SLATE_GRAY }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleFilter(category, opt)}
                                className="w-4 h-4 rounded border-[#708090]/30 focus:ring-[#B76E79] transition-all"
                                style={{ accentColor: ROSE_GOLD }}
                              />
                              <span className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}>{opt}</span>
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Barra de Búsqueda */}
              <div className="relative ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: SLATE_GRAY }} />
                <input
                  type="text"
                  placeholder="Buscar joyas..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-[#708090]/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]/40 transition-all w-48 md:w-64"
                  style={{ color: SLATE_GRAY }}
                />
              </div>
            </div>

            {/* Opciones de Orden y Vista */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <span className="uppercase tracking-widest text-[10px] font-bold" style={{ color: SLATE_GRAY }}>Ordenar</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none cursor-pointer"
                  style={{ color: SLATE_GRAY }}
                >
                  <option>Novedades</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-[#708090]/10 pl-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  style={{ color: viewMode === "grid" ? ROSE_GOLD : SLATE_GRAY }}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  style={{ color: viewMode === "list" ? ROSE_GOLD : SLATE_GRAY }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Etiquetas de Filtro Activo */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 overflow-hidden"
              >
                {activeFilters.map(filter => (
                  <button
                    key={`${filter.category}-${filter.value}`}
                    onClick={() => removeFilter(filter)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg text-sm transition-colors group shadow-sm"
                    style={{ borderColor: ROSE_GOLD, color: ROSE_GOLD }}
                  >
                    {filter.value}
                    <X size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-bold underline underline-offset-4 ml-2 transition-opacity hover:opacity-70"
                  style={{ color: SLATE_GRAY }}
                >
                  Limpiar todo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Grilla de Productos --- */}
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border border-t-transparent rounded-full"
                style={{ borderColor: `${ROSE_GOLD}33`, borderTopColor: ROSE_GOLD }}
              />
              <p className="text-sm font-medium" style={{ color: SLATE_GRAY }}>Curando tu colección...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl inline-block border border-red-100 font-medium">{error}</p>
            </div>
          ) : filteredAndSortedProductos.length > 0 ? (
            <>
              <motion.div
                layout
                className={`grid gap-x-8 gap-y-12 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProductos.map(product => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Imagen del Producto */}
                      <div className="relative aspect-square mb-6 overflow-hidden rounded-3xl bg-[#f5e9de] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#B76E79]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative w-[75%] h-[75%] transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-2xl"
                          />
                        </div>

                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                            style={{ color: SLATE_GRAY }}
                          >
                            <Search size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Información */}
                      <div className="text-center px-2">
                        <h3 className="text-[15px] font-bold mb-1 transition-colors group-hover:scale-105" style={{ color: SLATE_GRAY }}>
                          {product.name}
                        </h3>
                        <p className="text-sm font-bold" style={{ color: ROSE_GOLD }}>
                          ${product.price ? product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 }) : "0.00"}
                        </p>
                        
                        <div className="mt-4 flex justify-center">
                          <div className="w-1 h-1 rounded-full bg-gray-200 group-hover:w-4 transition-all duration-300" style={{ backgroundColor: ROSE_GOLD }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Botón Ver Más */}
              <div className="mt-24 pt-12 border-t border-gray-100 flex justify-center">
                <button 
                  className="px-10 py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ backgroundColor: `${ROSE_GOLD}11`, color: ROSE_GOLD }}
                >
                  Cargar más
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-300" />
              </div>
              <p className="font-medium" style={{ color: SLATE_GRAY }}>No se encontraron resultados para tu selección.</p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 text-sm font-bold hover:underline"
                style={{ color: ROSE_GOLD }}
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
      
      <style jsx global>{`
        body {
          background-color: #faf8f6;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23708090' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 2px center;
          padding-right: 20px;
        }
      `}</style>
    </div>
  );
}
