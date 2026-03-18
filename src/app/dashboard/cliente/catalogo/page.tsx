"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import { ProductoCard } from "../types";
import { obtenerProductosCatalogo } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Grid, List, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { createClient } from "@utils/supabase/client";
import ChatbotPage from "@/app/chatbot/page";
import { useAuth } from "@/lib/hooks/useAuth";

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
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: ROSE, fontWeight: 500 }}>
          ${value.min.toLocaleString()}
        </span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: ROSE, fontWeight: 500 }}>
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
              fontFamily: "'DM Sans',sans-serif",
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
          fontFamily: "'DM Sans',sans-serif",
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
function ProductListCard({ product, onClick, esMayorista }: { product: ProductoCard; onClick: () => void; esMayorista?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const discountPrice = esMayorista ? (product.price || 0) * 0.7 : product.price;

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
        borderRadius: 16,
        border: hovered ? `1px solid rgba(183,110,121,0.3)` : "1px solid rgba(112,128,144,0.15)",
        boxShadow: hovered ? "0 12px 32px rgba(140,151,104,0.18)" : "0 2px 12px rgba(140,151,104,0.08)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Imagen */}
      <div style={{
        width: "clamp(120px,18vw,180px)",
        flexShrink: 0,
        background: BG,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Sheen */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", zIndex: 1 }} />
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }}
        />
        {(product as any).es_personalizable && (
          <div style={{
            position: "absolute", top: 10, left: 10, zIndex: 2,
            padding: "3px 8px", borderRadius: 20,
            background: "rgba(183,110,121,0.9)",
            color: "white", fontSize: "0.6rem", fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <Sparkles size={9} /> Personalizable
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "clamp(16px,2.5vw,24px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {(product as any).category && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE, margin: "0 0 6px" }}>
              {(product as any).category}
            </p>
          )}
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 600, color: DEEP, margin: "0 0 8px", lineHeight: 1.2 }}>
            {product.name}
          </h3>
          {(product as any).descripcion && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: SLATE, lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {(product as any).descripcion}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 500, color: esMayorista ? ROSE : DEEP, fontStyle: "italic" }}>
              ${discountPrice?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
            {esMayorista && (
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", fontWeight: 700, color: ROSE, background: "rgba(183,110,121,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                Socio Stella -30%
              </span>
            )}
          </div>

          {(product as any).stock_actual !== undefined && (
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 500,
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
function ProductGridCard({ product, onClick, esMayorista }: { product: ProductoCard; onClick: () => void; esMayorista?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const discountPrice = esMayorista ? (product.price || 0) * 0.7 : product.price;

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
      {/* Imagen */}
      <div style={{
        position: "relative",
        aspectRatio: "1/1",
        borderRadius: 14,
        overflow: "hidden",
        background: BG,
        border: hovered ? "1px solid rgba(183,110,121,0.25)" : "1px solid rgba(112,128,144,0.12)",
        boxShadow: hovered ? "0 18px 40px rgba(140,151,104,0.22)" : "0 2px 12px rgba(140,151,104,0.08)",
        marginBottom: 14,
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}>
        {/* Sheen */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", zIndex: 2 }} />

        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(183,110,121,0.08),transparent)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s", zIndex: 1 }} />

        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.5s ease" }}
        />

        {/* Badge personalizable */}
        {(product as any).es_personalizable && (
          <div style={{
            position: "absolute", top: 10, left: 10, zIndex: 3,
            padding: "3px 8px", borderRadius: 20,
            background: "rgba(183,110,121,0.88)",
            backdropFilter: "blur(4px)",
            color: "white", fontSize: "0.58rem", fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <Sparkles size={8} /> Personalizable
          </div>
        )}

        {/* Stock badge */}
        {(product as any).stock_actual === 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            background: "rgba(246,244,239,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 600, color: SLATE, background: "white", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(112,128,144,0.2)" }}>
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "0 2px" }}>
        {(product as any).category && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE, margin: "0 0 4px" }}>
            {(product as any).category}
          </p>
        )}
        <h3 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "1.05rem", fontWeight: 600,
          color: hovered ? DEEP : SLATE,
          margin: "0 0 6px", lineHeight: 1.2,
          transition: "color 0.18s",
        }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: ROSE, fontSize: "0.62rem" }}>★</span>
          ))}
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 500, color: esMayorista ? ROSE : DEEP, fontStyle: "italic", margin: "6px 0 0" }}>
          ${discountPrice?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          {esMayorista && <span style={{ fontSize: '0.6rem', fontStyle: 'normal', opacity: 0.8, marginLeft: 4 }}>(-30%)</span>}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Página principal ──────────────────────────────────────
export default function CatalogPage() {
  const router = useRouter();
  const { usuario } = useAuth();
  const esMayorista = usuario?.id_rol === 3 || usuario?.id_rol === 1;

  const [productos, setProductos]       = useState<ProductoCard[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [openDropdown, setOpenDropdown] = useState<FilterCategory | null>(null);
  const [sortBy, setSortBy]             = useState("Novedades");
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Opciones dinámicas desde BD
  const [materiales, setMateriales]   = useState<string[]>([]);
  const [categorias, setCategorias]   = useState<string[]>([]);

  // Rango de precio dinámico
  const [priceRange, setPriceRange]   = useState<PriceRange>({ min: 0, max: 5000 });
  const [priceFilter, setPriceFilter] = useState<PriceRange | null>(null);

  // ── Cargar productos ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { productos: data, error: err } = await obtenerProductosCatalogo();
        if (err) { setError(err); return; }
        const prods = data || [];
        setProductos(prods);

        // Calcular rango real de precios
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

  // ── Cargar categorías y materiales desde Supabase ──
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const supabase = createClient();

        // Categorías
        const { data: cats } = await supabase
          .from("categoria")
          .select("nombre")
          .order("nombre");
        if (cats) setCategorias(cats.map(c => c.nombre).filter(Boolean) as string[]);

        // Materiales: tipos de insumos usados en productos
        const { data: ins } = await supabase
          .from("insumos")
          .select("tipo")
          .not("tipo", "is", null);
        if (ins) {
          const tipos = [...new Set(ins.map(i => i.tipo).filter(Boolean))] as string[];
          setMateriales(tipos);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadFilters();
  }, []);

  // ── Filtrado y ordenamiento ──
  const filtered = useMemo(() => {
    let r = [...productos];

    // Búsqueda — busca en nombre, categoría, descripción
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      r = r.filter(p =>
        p.name?.toLowerCase().includes(t) ||
        (p as any).category?.toLowerCase().includes(t) ||
        (p as any).descripcion?.toLowerCase().includes(t)
      );
    }

    // Filtros de categoría y material
    activeFilters.forEach(f => {
      const v = f.value.toLowerCase();
      if (f.category === "Categoría") {
        r = r.filter(p => (p as any).category?.toLowerCase() === v);
      } else if (f.category === "Material") {
        r = r.filter(p =>
          p.name?.toLowerCase().includes(v) ||
          (p as any).descripcion?.toLowerCase().includes(v)
        );
      } else if (f.category === "Color") {
        r = r.filter(p =>
          p.name?.toLowerCase().includes(v) ||
          (p as any).descripcion?.toLowerCase().includes(v)
        );
      }
    });

    // Rango de precio dinámico
    if (priceFilter) {
      r = r.filter(p => (p.price || 0) >= priceFilter.min && (p.price || 0) <= priceFilter.max);
    }

    // Ordenamiento
    if (sortBy === "Precio: Menor a Mayor") r.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "Precio: Mayor a Menor") r.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "Personalizables") r = r.filter(p => (p as any).es_personalizable);

    return r;
  }, [productos, searchTerm, activeFilters, priceFilter, sortBy]);

  // ── Handlers ──
  const toggleFilter = (category: FilterCategory, value: string) => {
    const exists = activeFilters.find(f => f.category === category && f.value === value);
    setActiveFilters(exists
      ? activeFilters.filter(f => !(f.category === category && f.value === value))
      : [...activeFilters, { label: value, value, category }]
    );
  };

  const countFor = (cat: FilterCategory) => activeFilters.filter(f => f.category === cat).length;
  const clearAll = () => { setActiveFilters([]); setPriceFilter(priceRange); };

  const totalActiveFilters = activeFilters.length + (
    priceFilter && (priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) ? 1 : 0
  );

  // Cierra dropdown al click fuera
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".filter-dropdown-root")) {
        setOpenDropdown(null);
      }
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .cat-fade { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        select { -webkit-appearance:none; appearance:none; }
        input[type=range] { -webkit-appearance:none; appearance:none; height:4px; background:transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:white; border:2px solid ${ROSE}; cursor:pointer; }
        .filter-chip:hover { background: rgba(183,110,121,0.12) !important; }
        .product-link { text-decoration: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',sans-serif" }}>
        <HeaderClient />
        <ChatbotPage />
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px)" }}>

          {/* ── Header de sección ── */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.63rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: SAGE, margin: "0 0 8px" }}>
              Stella Designs
            </p>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: DEEP, margin: 0, lineHeight: 1.1 }}>
                Nuestro <em style={{ color: ROSE, fontStyle: "italic" }}>Catálogo</em>
              </h1>
              {!loading && (
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: SLATE, padding: "3px 12px", borderRadius: 20, background: "rgba(112,128,144,0.08)", border: "1px solid rgba(112,128,144,0.15)" }}>
                  {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                </span>
              )}
            </div>
          </div>

          {/* ── Barra de herramientas ── */}
          <div style={{
            background: "white",
            borderRadius: 14,
            border: "1px solid rgba(112,128,144,0.15)",
            boxShadow: "0 2px 12px rgba(140,151,104,0.08)",
            padding: "clamp(12px,2vw,18px) clamp(16px,2.5vw,24px)",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

              {/* Búsqueda */}
              <div style={{ position: "relative", flex: "1 1 200px", minWidth: 160, maxWidth: 320 }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: SLATE, pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, categoría, descripción..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                    borderRadius: 20,
                    border: "1.5px solid rgba(112,128,144,0.2)",
                    background: BG,
                    fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: DEEP,
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(183,110,121,0.4)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(112,128,144,0.2)")}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: SLATE, padding: 2 }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Separador */}
              <div style={{ width: 1, height: 28, background: "rgba(112,128,144,0.15)", flexShrink: 0 }} className="hidden sm:block" />

              {/* Filtros dropdown — desktop */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} className="filter-dropdown-root">
                {filterConfigs.map(({ cat, opts }) => (
                  <FilterDropdown
                    key={cat}
                    label={cat}
                    isOpen={openDropdown === cat}
                    onToggle={() => setOpenDropdown(openDropdown === cat ? null : cat)}
                    activeCount={countFor(cat)}
                  >
                    <div style={{ maxHeight: 240, overflowY: "auto" }}>
                      {opts.map(opt => {
                        const sel = !!activeFilters.find(f => f.category === cat && f.value === opt);
                        return (
                          <label
                            key={opt}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "8px 12px", borderRadius: 8,
                              cursor: "pointer",
                              background: sel ? "rgba(183,110,121,0.06)" : "transparent",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = "rgba(112,128,144,0.05)"; }}
                            onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <div style={{
                              width: 16, height: 16, borderRadius: 4,
                              border: `1.5px solid ${sel ? ROSE : "rgba(112,128,144,0.3)"}`,
                              background: sel ? ROSE : "transparent",
                              flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s",
                            }}>
                              {sel && <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                            </div>
                            <input type="checkbox" checked={sel} onChange={() => toggleFilter(cat, opt)} style={{ display: "none" }} />
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: sel ? DEEP : SLATE, fontWeight: sel ? 500 : 400 }}>
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                      {opts.length === 0 && (
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "rgba(112,128,144,0.5)", textAlign: "center", padding: "12px 0", margin: 0 }}>
                          Sin opciones
                        </p>
                      )}
                    </div>
                  </FilterDropdown>
                ))}

                {/* Precio dinámico */}
                <FilterDropdown
                  label="Precio"
                  isOpen={openDropdown === "Precio"}
                  onToggle={() => setOpenDropdown(openDropdown === "Precio" ? null : "Precio")}
                  activeCount={priceFilter && (priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) ? 1 : 0}
                >
                  <div style={{ width: 260 }}>
                    <PriceRangeSlider
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceFilter || priceRange}
                      onChange={setPriceFilter}
                    />
                  </div>
                </FilterDropdown>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Botón filtros mobile */}
              <button
                onClick={() => setShowMobileFilters(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 20,
                  border: "1.5px solid rgba(112,128,144,0.22)",
                  background: "transparent", color: SLATE,
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem",
                  cursor: "pointer",
                }}
                className="flex md:hidden"
              >
                <SlidersHorizontal size={14} /> Filtros
                {totalActiveFilters > 0 && (
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: ROSE, color: "white", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {totalActiveFilters}
                  </span>
                )}
              </button>

              {/* Ordenar */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(112,128,144,0.6)" }}>
                  Ordenar
                </span>
                <div style={{ position: "relative" }}>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{
                      padding: "7px 28px 7px 12px",
                      borderRadius: 20,
                      border: "1.5px solid rgba(112,128,144,0.2)",
                      background: BG,
                      fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem",
                      color: DEEP, cursor: "pointer", outline: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23708090' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                    }}
                  >
                    <option>Novedades</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                    <option>Personalizables</option>
                  </select>
                </div>
              </div>

              {/* Vista grid/lista */}
              <div style={{ display: "flex", alignItems: "center", gap: 2, background: BG, borderRadius: 10, padding: 3, flexShrink: 0 }}>
                {(["grid", "list"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    style={{
                      padding: "6px 10px", borderRadius: 8,
                      border: "none",
                      background: viewMode === m ? "white" : "transparent",
                      color: viewMode === m ? ROSE : SLATE,
                      cursor: "pointer",
                      boxShadow: viewMode === m ? "0 1px 4px rgba(140,151,104,0.1)" : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    {m === "grid" ? <Grid size={16} /> : <List size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Chips de filtros activos ── */}
          <AnimatePresence>
            {totalActiveFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 20, overflow: "hidden" }}
              >
                {activeFilters.map(f => (
                  <button
                    key={`${f.category}-${f.value}`}
                    className="filter-chip"
                    onClick={() => toggleFilter(f.category as FilterCategory, f.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `1px solid rgba(183,110,121,0.3)`,
                      background: "rgba(183,110,121,0.06)",
                      color: ROSE,
                      fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "0.62rem", color: "rgba(183,110,121,0.6)" }}>{f.category}</span>
                    {f.value}
                    <X size={11} />
                  </button>
                ))}
                {priceFilter && (priceFilter.min > priceRange.min || priceFilter.max < priceRange.max) && (
                  <button
                    className="filter-chip"
                    onClick={() => setPriceFilter(priceRange)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, border: `1px solid rgba(183,110,121,0.3)`, background: "rgba(183,110,121,0.06)", color: ROSE, fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                  >
                    <span style={{ fontSize: "0.62rem", color: "rgba(183,110,121,0.6)" }}>Precio</span>
                    ${priceFilter.min.toLocaleString()} – ${priceFilter.max.toLocaleString()}
                    <X size={11} />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.76rem", color: SLATE, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Limpiar todo
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Contenido ── */}
          <section>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid rgba(183,110,121,0.15)`, borderTopColor: ROSE }}
                />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", color: SLATE }}>
                  Preparando tu colección…
                </p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: 12, background: "rgba(183,110,121,0.08)", border: "1px solid rgba(183,110,121,0.2)", color: ROSE, fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem" }}>
                  {error}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(112,128,144,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Search size={24} style={{ color: "rgba(112,128,144,0.4)" }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: DEEP, margin: "0 0 8px" }}>
                  Sin <em style={{ color: ROSE }}>resultados</em>
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", color: SLATE, marginBottom: 20 }}>
                  No encontramos productos con esos filtros
                </p>
                <button
                  onClick={clearAll}
                  style={{ padding: "10px 24px", borderRadius: 6, border: "none", background: ROSE, color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                style={{ gap: "clamp(12px,2vw,24px)" }}
              >
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
                      <ProductListCard product={p} esMayorista={esMayorista} onClick={() => router.push(`/productos/${p.id}`)} />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        </main>

        <Footer />
      </div>

      {/* ── Panel filtros mobile ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(74,85,104,0.4)", backdropFilter: "blur(4px)", zIndex: 200 }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
                background: "white",
                borderRadius: "24px 24px 0 0",
                boxShadow: "0 -20px 56px rgba(140,151,104,0.2)",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: "clamp(16px,3vw,28px)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <div style={{ width: 44, height: 4, borderRadius: 4, background: "rgba(112,128,144,0.2)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 500, color: DEEP, margin: 0 }}>
                  Filtros
                </h3>
                <button onClick={() => setShowMobileFilters(false)} style={{ background: "none", border: "none", cursor: "pointer", color: SLATE }}>
                  <X size={20} />
                </button>
              </div>

              {filterConfigs.map(({ cat, opts }) => (
                <div key={cat} style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE, margin: "0 0 12px" }}>
                    {cat}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {opts.map(opt => {
                      const sel = !!activeFilters.find(f => f.category === cat && f.value === opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleFilter(cat as FilterCategory, opt)}
                          style={{
                            padding: "6px 14px", borderRadius: 20,
                            border: sel ? `1.5px solid ${ROSE}` : "1.5px solid rgba(112,128,144,0.22)",
                            background: sel ? "rgba(183,110,121,0.08)" : "white",
                            color: sel ? ROSE : SLATE,
                            fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE, margin: "0 0 12px" }}>
                  Precio
                </p>
                <PriceRangeSlider
                  min={priceRange.min} max={priceRange.max}
                  value={priceFilter || priceRange}
                  onChange={setPriceFilter}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={clearAll} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1.5px solid rgba(112,128,144,0.25)", background: "transparent", color: SLATE, fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", cursor: "pointer" }}>
                  Limpiar
                </button>
                <button onClick={() => setShowMobileFilters(false)} style={{ flex: 2, padding: "12px", borderRadius: 8, border: "none", background: ROSE, color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", cursor: "pointer", boxShadow: "0 3px 12px rgba(183,110,121,0.22)" }}>
                  Ver {filtered.length} productos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}