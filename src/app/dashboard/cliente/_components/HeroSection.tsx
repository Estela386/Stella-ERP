"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeroConfig {
  imageUrl: string;
  headline: string;
  subheadline: string;
  accentWord: string;
  featuredProductIds: number[];
}

interface ProductoBasic {
  id: number;
  nombre: string;
  precio: number;
  url_imagen?: string | null;
}

interface HeroSectionProps {
  /** id_rol del usuario según tabla usuario: 1 = admin, 2 = cliente, 3 = mayorista */
  idRol?: number | null;
}

// ── Imagen por defecto: archivo local en public/ ──
const DEFAULT_CONFIG: HeroConfig = {
  imageUrl: "/HomePagePicture.webp",
  headline: "Una pieza perfecta",
  accentWord: "para cada ocasión",
  subheadline:
    "Descubre accesorios únicos, diseñadas con los mejores materiales.",
  featuredProductIds: [],
};

function ProductPill({ product }: { product: ProductoBasic }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 12,
        background: "rgba(246,244,239,0.92)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(183,110,121,0.22)",
        boxShadow: "0 2px 12px rgba(140,151,104,0.15)",
      }}
    >
      {product.url_imagen && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={product.url_imagen}
            alt={product.nombre}
            width={32}
            height={32}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      )}
      <div>
        <p
          style={{
            fontFamily: "var(--font-subtitle)",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#4a5568",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {product.nombre}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: "#b76e79",
            margin: 0,
          }}
        >
          ${product.precio?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function HeroSection({ idRol }: HeroSectionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // id_rol === 1 → admin
  const isAdmin = idRol === 1;

  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [allProducts, setAllProducts] = useState<ProductoBasic[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Carga productos de la tabla "producto" al abrir el panel admin
  useEffect(() => {
    if (!isAdmin || !editing) return;
    const load = async () => {
      setLoadingProducts(true);
      try {
        const { createClient } = await import("@utils/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase
          .from("producto")
          .select("id, nombre, precio, url_imagen")
          .order("nombre");
        if (!error && data) setAllProducts(data as ProductoBasic[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, [isAdmin, editing]);

  const featuredProducts = allProducts.filter(p =>
    config.featuredProductIds.includes(p.id)
  );

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setDraft(d => ({ ...d, imageUrl: url }));
  };

  const toggleProduct = (id: number) => {
    setDraft(d => ({
      ...d,
      featuredProductIds: d.featuredProductIds.includes(id)
        ? d.featuredProductIds.filter(x => x !== id)
        : [...d.featuredProductIds, id],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setConfig(draft);
    setEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setDraft(config);
    setImagePreview(null);
    setEditing(false);
  };

  return (
    <>
      <style>{`
        @keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes blobFloat { 0%,100%{transform:scale(1) translate(0,0)} 33%{transform:scale(1.04) translate(12px,-8px)} 66%{transform:scale(0.97) translate(-8px,6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .hero-fade-0{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.1s both}
        .hero-fade-1{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.22s both}
        .hero-fade-2{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.34s both}
        .hero-fade-3{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.46s both}
        .pill-float{animation:heroFloat 4.5s ease-in-out infinite}
        .pill-float-2{animation:heroFloat 5.2s ease-in-out 0.8s infinite}
        .hero-blob{animation:blobFloat 9s ease-in-out infinite}
        .hero-blob-2{animation:blobFloat 12s ease-in-out 2s infinite}
        .edit-btn:hover{background:rgba(183,110,121,0.15)!important}
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#f6f4ef",
          minHeight: "clamp(420px, 55vw, 580px)",
        }}
      >
        {/* Blobs decorativos */}
        <div
          className="hero-blob pointer-events-none absolute"
          style={{
            top: -80,
            right: -60,
            width: 380,
            height: 380,
            borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
            background: "rgba(183,110,121,0.07)",
            filter: "blur(2px)",
          }}
        />
        <div
          className="hero-blob-2 pointer-events-none absolute"
          style={{
            bottom: -60,
            left: -40,
            width: 320,
            height: 320,
            borderRadius: "45% 55% 40% 60% / 60% 40% 55% 45%",
            background: "rgba(140,151,104,0.07)",
            filter: "blur(2px)",
          }}
        />

        {/* Botón editar — SOLO cuando id_rol === 1 */}
        {isAdmin && !editing && (
          <button
            className="edit-btn"
            onClick={() => {
              setDraft(config);
              setEditing(true);
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(183,110,121,0.3)",
              color: "#b76e79",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(183,110,121,0.15)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar sección
          </button>
        )}

        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src={imagePreview || config.imageUrl}
            alt="Hero Stella"
            fill
            sizes=""
            className="object-cover object-top"
            priority
            onError={() => {}}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(246,244,239,0.88) 0%, rgba(246,244,239,0.60) 45%, rgba(246,244,239,0.18) 100%)",
            }}
          />
        </div>

        {/* Contenido hero */}
        <div
          className="relative z-10 flex flex-col justify-center h-full"
          style={{
            minHeight: "clamp(420px, 55vw, 580px)",
            padding: "clamp(32px,5vw,72px) clamp(20px,5vw,72px)",
          }}
        >
          <p
            className="hero-fade-0"
            style={{
              fontFamily: "var(--font-subtitle)",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8c9768",
              marginBottom: 12,
            }}
          >
            Stella Joyería
          </p>

          <h1
            className="hero-fade-1"
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.4rem,5vw,4.8rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "#4a5568",
              maxWidth: 540,
              margin: 0,
            }}
          >
            {config.headline}
            <br />
            <em style={{ color: "#b76e79", fontStyle: "italic" }}>
              {config.accentWord}
            </em>
          </h1>

          <p
            className="hero-fade-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.88rem,1.4vw,1rem)",
              color: "#708090",
              maxWidth: 400,
              lineHeight: 1.65,
              marginTop: 16,
            }}
          >
            {config.subheadline}
          </p>

          <div
            className="hero-fade-3"
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => router.push("/dashboard/cliente/catalogo")}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                fontWeight: 500,
                background: "#b76e79",
                color: "#f6f4ef",
                border: "none",
                borderRadius: 6,
                padding: "12px 28px",
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(183,110,121,0.22)",
                transition: "all 0.22s ease",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.transform = "translateY(-2px)";
                b.style.boxShadow = "0 10px 26px rgba(183,110,121,0.32)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.transform = "translateY(0)";
                b.style.boxShadow = "0 3px 12px rgba(183,110,121,0.22)";
              }}
            >
              Ver Novedades
            </button>
            <button
              onClick={() => router.push("/dashboard/cliente/catalogo")}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                fontWeight: 400,
                background: "transparent",
                color: "#708090",
                border: "1.5px solid rgba(112,128,144,0.35)",
                borderRadius: 6,
                padding: "12px 24px",
                cursor: "pointer",
                transition: "all 0.22s ease",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.borderColor = "#708090";
                b.style.color = "#4a5568";
                b.style.background = "rgba(112,128,144,0.06)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.borderColor = "rgba(112,128,144,0.35)";
                b.style.color = "#708090";
                b.style.background = "transparent";
              }}
            >
              Conocer Más
            </button>
          </div>

          {/* Pills de productos destacados */}
          {featuredProducts.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              {featuredProducts.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  className={i % 2 === 0 ? "pill-float" : "pill-float-2"}
                >
                  <ProductPill product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Línea decorativa inferior */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(183,110,121,0.35), rgba(140,151,104,0.25), transparent)",
          }}
        />
      </section>

      {/* ════════════════════════════════════
          PANEL DE EDICIÓN — solo admin
      ════════════════════════════════════ */}
      {isAdmin && editing && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{
            background: "rgba(74,85,104,0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={e => e.target === e.currentTarget && handleCancel()}
        >
          <div
            className="w-full overflow-y-auto"
            style={{
              background: "#f6f4ef",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -20px 56px rgba(140,151,104,0.22)",
              maxHeight: "88vh",
              padding: "clamp(20px,3vw,36px)",
            }}
          >
            {/* Handle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 4,
                  borderRadius: 4,
                  background: "rgba(112,128,144,0.22)",
                }}
              />
            </div>

            {/* Título */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "1.8rem",
                  fontWeight: 500,
                  color: "#4a5568",
                  margin: 0,
                }}
              >
                Editar <em style={{ color: "#b76e79" }}>Hero</em>
              </h2>
              <button
                onClick={handleCancel}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(112,128,144,0.25)",
                  background: "white",
                  color: "#708090",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: 32 }}>
              {/* ── Columna izquierda: imagen + textos ── */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-subtitle)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#708090",
                    marginBottom: 10,
                  }}
                >
                  Imagen principal
                </label>

                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "2px dashed rgba(183,110,121,0.35)",
                    background: "white",
                    boxShadow: "0 4px 14px rgba(140,151,104,0.08)",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="group"
                >
                  {imagePreview || draft.imageUrl ? (
                    <>
                      <Image
                        src={imagePreview || draft.imageUrl}
                        alt="preview"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={() => {}}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                        style={{ background: "rgba(246,244,239,0.85)" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#b76e79"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.82rem",
                            color: "#b76e79",
                          }}
                        >
                          Cambiar imagen
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: "rgba(183,110,121,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#b76e79"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.82rem",
                          color: "#708090",
                        }}
                      >
                        Haz clic para subir imagen
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.72rem",
                          color: "rgba(112,128,144,0.5)",
                        }}
                      >
                        PNG, JPG, WEBP
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    color: "rgba(112,128,144,0.55)",
                    marginTop: 8,
                  }}
                >
                  La imagen se aplica solo en esta sesión. Para que persista,
                  coloca el archivo en{" "}
                  <code
                    style={{
                      background: "rgba(112,128,144,0.08)",
                      padding: "1px 5px",
                      borderRadius: 4,
                    }}
                  >
                    public/
                  </code>{" "}
                  y actualiza{" "}
                  <code
                    style={{
                      background: "rgba(112,128,144,0.08)",
                      padding: "1px 5px",
                      borderRadius: 4,
                    }}
                  >
                    imageUrl
                  </code>{" "}
                  en el código.
                </p>

                {/* Campos de texto */}
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {(
                    [
                      { label: "Titular principal", key: "headline" },
                      {
                        label: "Palabra de acento (color rose)",
                        key: "accentWord",
                      },
                      { label: "Subtítulo", key: "subheadline" },
                    ] as { label: string; key: keyof HeroConfig }[]
                  ).map(field => (
                    <div key={field.key}>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-subtitle)",
                          fontSize: "0.63rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.16em",
                          color: "#708090",
                          marginBottom: 6,
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={draft[field.key] as string}
                        onChange={e =>
                          setDraft(d => ({ ...d, [field.key]: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.88rem",
                          color: "#4a5568",
                          background: "white",
                          border: "1px solid rgba(112,128,144,0.22)",
                          borderRadius: 8,
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e =>
                          (e.currentTarget.style.borderColor =
                            "rgba(183,110,121,0.5)")
                        }
                        onBlur={e =>
                          (e.currentTarget.style.borderColor =
                            "rgba(112,128,144,0.22)")
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Columna derecha: selector de productos ── */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <label
                    style={{
                      fontFamily: "var(--font-subtitle)",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#708090",
                    }}
                  >
                    Artículos destacados
                  </label>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: "rgba(183,110,121,0.08)",
                      border: "1px solid rgba(183,110,121,0.22)",
                      color: "#b76e79",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                    }}
                  >
                    máx. 3
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    color: "rgba(112,128,144,0.65)",
                    marginBottom: 14,
                  }}
                >
                  Selecciona los productos del catálogo que aparecen en la
                  imagen
                </p>

                {loadingProducts ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "48px 0",
                    }}
                  >
                    <div
                      className="animate-spin"
                      style={{
                        width: 28,
                        height: 28,
                        border: "2px solid rgba(183,110,121,0.15)",
                        borderTopColor: "#b76e79",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      maxHeight: 380,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {allProducts.map(product => {
                      const selected = draft.featuredProductIds.includes(
                        product.id
                      );
                      const maxReached =
                        draft.featuredProductIds.length >= 3 && !selected;
                      return (
                        <button
                          key={product.id}
                          disabled={maxReached}
                          onClick={() => toggleProduct(product.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: selected
                              ? "1.5px solid #b76e79"
                              : "1px solid rgba(112,128,144,0.18)",
                            background: selected
                              ? "rgba(183,110,121,0.07)"
                              : "white",
                            cursor: maxReached ? "not-allowed" : "pointer",
                            opacity: maxReached ? 0.4 : 1,
                            boxShadow: selected
                              ? "0 2px 10px rgba(183,110,121,0.12)"
                              : "0 1px 4px rgba(140,151,104,0.06)",
                            transition: "all 0.18s ease",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: "rgba(112,128,144,0.08)",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {product.url_imagen && (
                              <Image
                                src={product.url_imagen}
                                alt={product.nombre}
                                width={36}
                                height={36}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                color: selected ? "#4a5568" : "#708090",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                margin: 0,
                              }}
                            >
                              {product.nombre}
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.72rem",
                                color: "#b76e79",
                                margin: 0,
                              }}
                            >
                              ${product.precio?.toLocaleString()}
                            </p>
                          </div>
                          {selected && (
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "#b76e79",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {allProducts.length === 0 && (
                      <div
                        className="col-span-2"
                        style={{
                          textAlign: "center",
                          padding: "32px 0",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.84rem",
                          color: "rgba(112,128,144,0.5)",
                        }}
                      >
                        No hay productos en el catálogo
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 32,
                paddingTop: 24,
                borderTop: "1px solid rgba(112,128,144,0.12)",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  padding: "10px 24px",
                  borderRadius: 6,
                  border: "1.5px solid rgba(112,128,144,0.25)",
                  background: "transparent",
                  color: "#708090",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                  padding: "10px 28px",
                  borderRadius: 6,
                  border: "none",
                  background: saving ? "rgba(183,110,121,0.5)" : "#b76e79",
                  color: "#f6f4ef",
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: "0 3px 12px rgba(183,110,121,0.22)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.22s",
                }}
              >
                {saving ? (
                  <>
                    <div
                      className="animate-spin"
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(246,244,239,0.3)",
                        borderTopColor: "#f6f4ef",
                        borderRadius: "50%",
                      }}
                    />
                    Guardando…
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
