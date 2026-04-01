"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoCard } from "../types";
import { obtenerProductosCatalogo } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Grid, List, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { createClient } from "@utils/supabase/client";
import ChatbotPage from "@/app/chatbot/page";
import { useAuth } from "@/lib/hooks/useAuth";
import { Suspense } from "react";

// ─── Design tokens ────────────────────────────────────────
const ROSE   = "#b76e79";
const SLATE  = "#708090";
const DEEP   = "#4a5568";
const BG     = "#f6f4ef";
const BGALT  = "#ede9e3";
const SAGE   = "#8c9768";

// ─── Tipos ────────────────────────────────────────────────
type FilterCategory = "Material" | "Categoría" | "Color" | "Precio";

interface FilterOption {
  label: string;
  value: string;
  category: FilterCategory;
}

interface PriceRange {
  min: number;
  max: number;
}

// Colores fijos disponibles
const COLORES = ["Blanco", "Rosa", "Dorado", "Plateado", "Negro", "Natural", "Multicolor"];

// ─── Componente precio slider ──────────────────────────────
function PriceRangeSlider({
  min, max, value, onChange,
}: {
  min: number; max: number;
  value: PriceRange;
  onChange: (r: PriceRange) => void;
}) {
  const rangeRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div style={{ padding: "8px 4px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.78rem", color: ROSE, fontWeight: 500 }}>
          ${value.min.toLocaleString()}
        </span>
        <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.78rem", color: ROSE, fontWeight: 500 }}>
          ${value.max.toLocaleString()}
        </span>
      </div>

      <div ref={rangeRef} style={{ position: "relative", height: 4, borderRadius: 4, background: "rgba(112,128,144,0.18)", margin: "0 6px" }}>
        {/* Track activo */}
        <div style={{
          position: "absolute",
          left: `${pct(value.min)}%`,
          right: `${100 - pct(value.max)}%`,
          height: "100%",
          background: ROSE,
          borderRadius: 4,
        }} />

        {/* Thumb min */}
        <input
          type="range" min={min} max={max} step={50}
          value={value.min}
          onChange={e => {
            const v = Math.min(Number(e.target.value), value.max - 50);
            onChange({ ...value, min: v });
          }}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", zIndex: 2 }}
        />

        {/* Thumb max */}
        <input
          type="range" min={min} max={max} step={50}
          value={value.max}
          onChange={e => {
            const v = Math.max(Number(e.target.value), value.min + 50);
            onChange({ ...value, max: v });
          }}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", zIndex: 3 }}
        />

        {/* Handles visuales */}
        {[value.min, value.max].map((v, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${pct(v)}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 16, height: 16,
            borderRadius: "50%",
            background: "white",
            border: `2px solid ${ROSE}`,
            boxShadow: "0 1px 4px rgba(183,110,121,0.3)",
            pointerEvents: "none",
            zIndex: 1,
          }} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, gap: 8 }}>
        {[
          { label: "Menos de $200", range: { min, max: 200 } },
          { label: "$200–$500",     range: { min: 200, max: 500 } },
          { label: "Más de $500",   range: { min: 500, max } },
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.range)}
            style={{
              flex: 1,
              padding: "4px 6px",
              borderRadius: 6,
              border: `1px solid rgba(183,110,121,0.25)`,
              background: value.min === preset.range.min && value.max === preset.range.max
                ? "rgba(183,110,121,0.1)" : "transparent",
              color: ROSE,
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.66rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sección de Filtro (Sidebar) ───────────────────────────
function FilterSection({ title, children, isOpenDefault = true }: { title: string; children: React.ReactNode; isOpenDefault?: boolean }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div style={{ borderBottom: "1px solid rgba(112,128,144,0.08)", padding: "16px 0" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
      >
        <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "0.85rem", fontWeight: 700, color: DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        <ChevronDown size={14} style={{ color: SLATE, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ paddingTop: 12 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar Filters Component ─────────────────────────────
function SidebarFilters({ 
  filterConfigs, activeFilters, toggleFilter, priceRange, priceFilter, setPriceFilter, clearAll, hideTitle = false
}: { 
  filterConfigs: any[]; 
  activeFilters: FilterOption[]; 
  toggleFilter: (cat: FilterCategory, val: string) => void;
  priceRange: PriceRange;
  priceFilter: PriceRange;
  setPriceFilter: (r: PriceRange) => void;
  clearAll: () => void;
  hideTitle?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!hideTitle && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.2rem", color: DEEP, margin: 0 }}>Filtros</h2>
          {activeFilters.length > 0 && (
            <button onClick={clearAll} style={{ background: "none", border: "none", color: ROSE, fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Limpiar</button>
          )}
        </div>
      )}

      {filterConfigs.map(({ cat, opts }) => (
        <FilterSection key={cat} title={cat}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {opts.map((opt: string) => {
              const sel = !!activeFilters.find(f => f.category === cat && f.value === opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFilter(cat as FilterCategory, opt)}
                  style={{ 
                    padding: "6px 12px", borderRadius: 14, 
                    background: sel ? "rgba(183,110,121,0.08)" : "transparent",
                    border: sel ? `1.2px solid ${ROSE}` : "1.2px solid rgba(112,128,144,0.15)",
                    color: sel ? ROSE : SLATE,
                    fontFamily: "var(--font-sans)", fontSize: "0.78rem", 
                    fontWeight: sel ? 600 : 400,
                    cursor: "pointer", transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </FilterSection>
      ))}

      <FilterSection title="Precio">
        <PriceRangeSlider min={priceRange.min} max={priceRange.max} value={priceFilter} onChange={setPriceFilter} />
      </FilterSection>
    </div>
  );
}

// ─── Dropdown de filtro ────────────────────────────────────
function FilterDropdown({
  label, isOpen, onToggle, children, activeCount,
}: {
  label: string; isOpen: boolean; onToggle: () => void;
  children: React.ReactNode; activeCount?: number;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px",
          borderRadius: 20,
          border: activeCount ? `1.5px solid ${ROSE}` : "1.5px solid rgba(112,128,144,0.22)",
          background: activeCount ? "rgba(183,110,121,0.06)" : "white",
          color: activeCount ? ROSE : SLATE,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          fontSize: "0.8rem", fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.18s ease",
          whiteSpace: "nowrap",
        }}
      >
        {label}
        {activeCount ? (
          <span style={{
            width: 18, height: 18, borderRadius: "50%",
            background: ROSE, color: "white",
            fontSize: "0.6rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {activeCount}
          </span>
        ) : (
          <ChevronDown size={13} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              zIndex: 100, minWidth: 220,
              background: "white",
              borderRadius: 14,
              border: "1px solid rgba(112,128,144,0.15)",
              boxShadow: "0 8px 32px rgba(140,151,104,0.15)",
              padding: "12px",
              overflow: "hidden",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tarjeta en vista lista ────────────────────────────────
function ProductListCard({ product, onClick }: { product: ProductoCard; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const price = product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "stretch",
        background: "white",
        borderRadius: 8,
        border: "none",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.06)" : "0 4px 14px rgba(0,0,0,0.03)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Imagen */}
      <div style={{
        width: "clamp(120px,22vw,220px)",
        flexShrink: 0,
        background: "#FAF9F6",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", zIndex: 1 }} />
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)" }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "clamp(20px,3vw,32px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {(product as any).category && (
            <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#8c9768", margin: "0 0 8px" }}>
              {(product as any).category}
            </p>
          )}
          <h3 style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "clamp(1.4rem,2.5vw,1.8rem)", fontWeight: 400, color: hovered ? "#b76e79" : "#2D3748", margin: "0 0 10px", lineHeight: 1.2, transition: "color 0.3s ease", letterSpacing: "0.01em" }}>
            {product.name}
          </h3>
          {(product as any).descripcion && (
            <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.85rem", color: "#708090", lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {(product as any).descripcion}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 24, gap: 16 }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6, opacity: 0.8 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#b76e79", fontSize: "0.7rem", lineHeight: 1 }}>★</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "1.05rem", fontWeight: 500, color: "#4a5568", letterSpacing: "0.03em" }}>
                ${price?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {(product as any).stock_actual !== undefined && (
            <span style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.72rem", fontWeight: 500,
              padding: "4px 10px", borderRadius: 20,
              background: (product as any).stock_actual > 0 ? "rgba(140,151,104,0.1)" : "rgba(183,110,121,0.08)",
              color: (product as any).stock_actual > 0 ? SAGE : ROSE,
              border: `1px solid ${(product as any).stock_actual > 0 ? "rgba(140,151,104,0.25)" : "rgba(183,110,121,0.2)"}`,
            }}>
              {(product as any).stock_actual > 0 ? `${(product as any).stock_actual} disponibles` : "Sin stock"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tarjeta en vista grid ─────────────────────────────────
function ProductGridCard({ product, onClick }: { product: ProductoCard; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const price = product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div style={{
        position: "relative",
        aspectRatio: "3/4",
        borderRadius: 8,
        overflow: "hidden",
        background: "#FAF9F6",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.06)" : "none",
        marginBottom: 16,
        transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(183,110,121,0.08),transparent)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s", zIndex: 1 }} />

        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />

        {(product as any).stock_actual === 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            background: "rgba(246,244,239,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.72rem", fontWeight: 600, color: SLATE, background: "white", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(112,128,144,0.2)" }}>
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 4px 6px", textAlign: "left" }}>
        {(product as any).category && (
          <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#8c9768", margin: "0 0 8px" }}>
            {(product as any).category}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h3 style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: "1.3rem", fontWeight: 400,
            color: hovered ? "#b76e79" : "#2D3748",
            margin: "0", lineHeight: 1.15,
            transition: "color 0.3s ease",
            letterSpacing: "0.01em",
            flex: 1,
            wordBreak: "break-word"
          }}>
            {product.name}
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2, opacity: 0.8 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#b76e79", fontSize: "0.62rem", lineHeight: 1 }}>★</span>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.95rem", fontWeight: 500, color: "#4a5568", margin: "0", letterSpacing: "0.03em", textAlign: "right" }}>
              ${price?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Componente Principal ────────────────────────────────────
function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario } = useAuth();

  const [productos, setProductos]       = useState<ProductoCard[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [openDropdown, setOpenDropdown] = useState<FilterCategory | null>(null);
  const [sortBy, setSortBy]             = useState("Novedades");
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [materiales, setMateriales]   = useState<string[]>([]);
  const [categorias, setCategorias]   = useState<string[]>([]);
  const [priceRange, setPriceRange]   = useState<PriceRange>({ min: 0, max: 5000 });
  const [priceFilter, setPriceFilter] = useState<PriceRange | null>(null);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat === "personalizada") setSortBy("Personalizables");
    else if (cat === "nuevos") setSortBy("Novedades");
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { productos: data, error: err } = await obtenerProductosCatalogo();
        if (err) { setError(err); return; }
        const prods = data || [];
        setProductos(prods);

        if (prods.length > 0) {
          const prices = prods.map(p => p.price || 0);
          const minP = Math.floor(Math.min(...prices) / 50) * 50;
          const maxP = Math.ceil(Math.max(...prices) / 50) * 50;
          setPriceRange({ min: minP, max: maxP });
          setPriceFilter({ min: minP, max: maxP });
        }
      } catch {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const supabase = createClient();
        const { data: cats } = await supabase.from("categoria").select("nombre").order("nombre");
        if (cats) setCategorias(cats.map(c => c.nombre).filter(Boolean) as string[]);
        const { data: mats } = await supabase.from("materiales").select("nombre").order("nombre");
        if (mats) setMateriales(mats.map(m => m.nombre).filter(Boolean) as string[]);
      } catch (e) {
        console.error(e);
      }
    };
    loadFilters();
  }, []);

  const filtered = useMemo(() => {
    let r = [...productos];
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      r = r.filter(p =>
        p.name?.toLowerCase().includes(t) ||
        (p as any).category?.toLowerCase().includes(t) ||
        (p as any).descripcion?.toLowerCase().includes(t)
      );
    }
    // Filtrado por categorías: OR dentro de la misma categoría, AND entre distintas
    const groupedFilters = activeFilters.reduce((acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f.value.toLowerCase());
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(groupedFilters).forEach(([category, values]) => {
      r = r.filter(p => {
        if (category === "Categoría") return values.includes((p as any).category?.toLowerCase());
        if (category === "Material") return p.materiales?.some(m => values.includes(m.toLowerCase()));
        if (category === "Color") return values.some(v => p.name?.toLowerCase().includes(v) || (p as any).descripcion?.toLowerCase().includes(v));
        return true;
      });
    });
    if (priceFilter) r = r.filter(p => (p.price || 0) >= priceFilter.min && (p.price || 0) <= priceFilter.max);
    if (sortBy === "Precio: Menor a Mayor") r.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "Precio: Mayor a Menor") r.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "Personalizables") r = r.filter(p => p.es_personalizable);
    else if (sortBy === "Novedades") r.sort((a, b) => b.id - a.id);
    return r;
  }, [productos, searchTerm, activeFilters, priceFilter, sortBy]);

  const toggleFilter = (category: FilterCategory, value: string) => {
    const exists = activeFilters.find(f => f.category === category && f.value === value);
    setActiveFilters(exists
      ? activeFilters.filter(f => !(f.category === category && f.value === value))
      : [...activeFilters, { label: value, value, category }]
    );
  };

  const clearAll = () => { setActiveFilters([]); setPriceFilter(priceRange); };

  const totalActiveFilters = activeFilters.length + (
    priceFilter && (priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) ? 1 : 0
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".filter-dropdown-root")) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filterConfigs: { cat: FilterCategory; opts: string[] }[] = [
    { cat: "Material",  opts: materiales.length ? materiales : ["Chapa 18k", "Acero Inoxidable", "Hilo"] },
    { cat: "Categoría", opts: categorias },
    { cat: "Color",     opts: COLORES },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .cat-fade { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        select { -webkit-appearance:none; appearance:none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: BG, fontFamily: "var(--font-sans, Inter, sans-serif)" }}>
        <HeaderClient />
        <ChatbotPage />
        <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(16px,4vw,60px) 48px" }}>
          <div className="flex flex-col md:flex-row gap-8 pt-6 md:pt-10">
            
            {/* 1. SIDEBAR (Desktop) */}
            <aside className="hidden md:block w-[260px] flex-shrink-0">
              <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-4">
                <SidebarFilters 
                  filterConfigs={filterConfigs} 
                  activeFilters={activeFilters} 
                  toggleFilter={toggleFilter} 
                  priceRange={priceRange} 
                  priceFilter={priceFilter || priceRange} 
                  setPriceFilter={setPriceFilter} 
                  clearAll={clearAll} 
                />
              </div>
            </aside>

            {/* 2. AREA DE PRODUCTOS */}
            <div className="flex-1 min-w-0">
              
              {/* BARRA SUPERIOR SIMPLIFICADA */}
              <div 
                className="sticky top-[64px] md:top-[80px] z-[40] transition-all duration-300 mb-6"
                style={{ 
                  background: "rgba(246, 244, 239, 0.95)", 
                  backdropFilter: "blur(16px)",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(112,128,144,0.08)"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              {/* FILA 1: Búsqueda + Acciones (Desktop: Side-by-side) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* 1. BÚSQUEDA */}
                <div style={{
                  display: "flex", alignItems: "center",
                  background: "white", borderRadius: 30, padding: "4px 16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(112,128,144,0.1)",
                  width: "100%", maxWidth: "500px"
                }}>
                  <Search size={16} style={{ color: SAGE, flexShrink: 0 }} />
                  <input
                    type="text" placeholder="Buscar joyas..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: "10px 12px", background: "transparent", border: "none", fontSize: "0.85rem", color: DEEP, outline: "none", fontFamily: "var(--font-poppins)" }}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* 2. ACCIONES (Filtros, Ordenar, Vista) - Desktop: Derecha */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "white", borderRadius: 20, padding: "6px 12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid rgba(112,128,144,0.08)",
                  width: "fit-content"
                }}>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 12,
                      background: totalActiveFilters > 0 ? "rgba(183,110,121,0.08)" : "transparent",
                      color: totalActiveFilters > 0 ? ROSE : SLATE,
                      fontSize: "0.7rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-marcellus)"
                    }}
                  >
                    <SlidersHorizontal size={14} /> Filtros
                    {totalActiveFilters > 0 && <span style={{ padding: "1px 6px", borderRadius: 10, background: ROSE, color: "white", fontSize: "0.6rem" }}>{totalActiveFilters}</span>}
                  </button>

                  <div style={{ width: 1, height: 16, background: "rgba(112,128,144,0.1)" }} />

                  <select
                    value={sortBy} onChange={e => setSortBy(e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-marcellus)", fontSize: "0.7rem", fontWeight: 700, color: SLATE, cursor: "pointer", maxWidth: "160px" }}
                  >
                    <option>Novedades</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                    <option>Personalizables</option>
                  </select>

                  <div style={{ width: 1, height: 16, background: "rgba(112,128,144,0.1)" }} />

                  <div style={{ display: "flex", gap: 4 }}>
                     {(["grid", "list"] as const).map(m => (
                       <button
                         key={m} onClick={() => setViewMode(m)}
                         style={{ padding: 2, borderRadius: 8, background: viewMode === m ? "#F6F4EF" : "transparent", color: viewMode === m ? ROSE : "rgba(112,128,144,0.3)", cursor: "pointer", border: "none", transition: "all 0.2s" }}
                       >
                         {m === "grid" ? <Grid size={18} /> : <List size={18} />}
                       </button>
                     ))}
                  </div>
                </div>
              </div>

              {/* ETIQUETAS DE FILTROS ACTIVOS */}
              <AnimatePresence>
                {totalActiveFilters > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, overflow: "hidden" }}
                  >
                    {[...activeFilters, ...(priceFilter && (priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) ? [{ label: `$${priceFilter.min} - $${priceFilter.max}`, category: 'Precio', value: 'price' } as FilterOption] : [])].map(f => (
                      <button
                        key={`${f.category}-${f.value}`}
                        onClick={() => f.category === 'Precio' ? setPriceFilter(priceRange) : toggleFilter(f.category, f.value)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 16, border: "1.2px solid rgba(183,110,121,0.2)", background: "white", color: ROSE, fontSize: "0.68rem", fontWeight: 700, fontFamily: "var(--font-marcellus)", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        <span className="opacity-60">{f.category}:</span> {f.label} <X size={10} />
                      </button>
                    ))}
                    <button
                      onClick={clearAll}
                      style={{ fontSize: "0.68rem", color: SLATE, background: "none", border: "none", textDecoration: "underline", cursor: "pointer", fontFamily: "var(--font-marcellus)", marginLeft: 6, fontWeight: 700 }}
                    >
                      Limpiar todo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {!loading && (
              <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400" style={{ fontFamily: "var(--font-marcellus)" }}>
                Exhibiendo {filtered.length} piezas
              </p>
            )}
          </div>

          <section>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid rgba(183,110,121,0.15)`, borderTopColor: ROSE }} />
                <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.84rem", color: SLATE }}>Preparando tu colección…</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: 12, background: "rgba(183,110,121,0.08)", border: "1px solid rgba(183,110,121,0.2)", color: ROSE, fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.88rem" }}>{error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(112,128,144,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Search size={24} style={{ color: "rgba(112,128,144,0.4)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.5rem", color: DEEP, margin: "0 0 8px" }}>Sin <em style={{ color: ROSE }}>resultados</em></h3>
                <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.84rem", color: SLATE, marginBottom: 20 }}>No encontramos productos con esos filtros</p>
                <button onClick={clearAll} style={{ padding: "10px 24px", borderRadius: 6, border: "none", background: ROSE, color: "white", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.82rem", cursor: "pointer" }}>Limpiar filtros</button>
              </div>
            ) : viewMode === "grid" ? (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: "clamp(12px,2vw,24px)" }}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <div key={p.id} className="cat-fade" style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}>
                      <ProductGridCard product={p} onClick={() => router.push(`/productos/${p.id}`)} />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div layout style={{ display: "flex", flexDirection: "column", gap: "clamp(10px,1.5vw,16px)" }}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <div key={p.id} className="cat-fade" style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}>
                      <ProductListCard product={p} onClick={() => router.push(`/productos/${p.id}`)} />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
            </div> {/* Cierre flex-1 área de productos */}
          </div> {/* Cierre flex flex-col md:flex-row gap-8 */}
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(74,85,104,0.4)", backdropFilter: "blur(4px)", zIndex: 200 }} onClick={() => setShowMobileFilters(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201, background: "white", borderRadius: "32px 32px 0 0", boxShadow: "0 -20px 56px rgba(140,151,104,0.2)", maxHeight: "70vh", overflowY: "auto", padding: "20px 24px 32px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 44, height: 4, borderRadius: 4, background: "rgba(112,128,144,0.2)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.5rem", fontWeight: 500, color: DEEP, margin: 0 }}>Filtros</h3>
                <button onClick={() => setShowMobileFilters(false)} style={{ background: "none", border: "none", cursor: "pointer", color: SLATE }}><X size={20} /></button>
              </div>
              <div style={{ marginBottom: 24 }}>
                <SidebarFilters 
                  filterConfigs={filterConfigs} 
                  activeFilters={activeFilters} 
                  toggleFilter={toggleFilter} 
                  priceRange={priceRange} 
                  priceFilter={priceFilter || priceRange} 
                  setPriceFilter={setPriceFilter} 
                  clearAll={clearAll} 
                  hideTitle={true}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={clearAll} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1.5px solid rgba(112,128,144,0.25)", background: "transparent", color: SLATE, fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.84rem", cursor: "pointer" }}>Limpiar</button>
                <button onClick={() => setShowMobileFilters(false)} style={{ flex: 2, padding: "12px", borderRadius: 8, border: "none", background: ROSE, color: "white", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.84rem", cursor: "pointer", boxShadow: "0 3px 12px rgba(183,110,121,0.22)" }}>Ver {filtered.length} productos</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}