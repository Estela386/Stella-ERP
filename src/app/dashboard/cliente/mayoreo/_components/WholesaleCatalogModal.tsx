"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { 
  X, 
  Download, 
  DollarSign, 
  Percent, 
  Loader2,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductoCard } from "@/app/dashboard/cliente/types";
import { obtenerProductosMayoreo } from "@/app/dashboard/cliente/actions";
import { jsPDF } from "jspdf";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STYLES = {
  bg: "#f6f4ef",
  bgAlt: "#ede9e3",
  white: "#ffffff",
  slate: "#708090",
  slateDeep: "#4a5568",
  rose: "#b76e79",
  roseLight: "rgba(183, 110, 121, 0.08)",
  sage: "#8c9768",
  shadow: "0 12px 40px rgba(140, 151, 104, 0.15)",
  border: "rgba(112, 128, 144, 0.18)",
  fontSerif: "times",
  fontSans: "helvetica",
};

export default function WholesaleCatalogModal({ isOpen, onClose }: Props) {
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marginType, setMarginType] = useState<"percent" | "amount">("percent");
  const [marginValue, setMarginValue] = useState<number>(30);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const { productos: data, error: err } = await obtenerProductosMayoreo();
      if (err) throw new Error(err);
      setProductos(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const getFinalPrice = (wholesale: number) => {
    if (marginType === "percent") {
      return wholesale * (1 + marginValue / 100);
    }
    return wholesale + marginValue;
  };

  // Convierte imagen URL a Base64 para jsPDF
  const getBase64ImageFromUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // Calcula dimensiones de imagen respetando aspect ratio
  const calculateImageMetrics = (
    imgW: number, imgH: number,
    maxW: number, maxH: number
  ) => {
    const ratio = Math.min(maxW / imgW, maxH / imgH);
    const w = imgW * ratio;
    const h = imgH * ratio;
    return { width: w, height: h, x: (maxW - w) / 2, y: (maxH - h) / 2 };
  };


  const generatePDF = async () => {
    if (productos.length === 0) {
      alert("No hay productos cargados en el catálogo.");
      return;
    }
    try {
      setGenerating(true);
      const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const PW = doc.internal.pageSize.getWidth();   // 210 mm
      const PH = doc.internal.pageSize.getHeight();  // 297 mm

      // ── PORTADA ────────────────────────────────────────────────
      doc.setFillColor(246, 244, 239);
      doc.rect(0, 0, PW, PH, "F");

      doc.setDrawColor(183, 110, 121);
      doc.setLineWidth(0.8);
      doc.line(30, 38, PW - 30, 38);

      try {
        const logo = await getBase64ImageFromUrl("/LogoM.svg");
        if (logo) {
          doc.addImage(logo, "PNG", PW / 2 - 35, PH / 2 - 45, 70, 22);
        }
      } catch {
        doc.setFont(STYLES.fontSerif, "italic");
        doc.setFontSize(52);
        doc.setTextColor(74, 85, 104);
        doc.text("Stella", PW / 2, PH / 2 - 20, { align: "center" });
      }

      doc.setFont(STYLES.fontSans, "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(112, 128, 144);
      doc.text("ALTA JOYERIA ARTESANAL", PW / 2, PH / 2 - 10, { align: "center", charSpace: 3 });

      doc.setFont(STYLES.fontSerif, "italic");
      doc.setFontSize(26);
      doc.setTextColor(183, 110, 121);
      doc.text("Catalogo de Productos", PW / 2, PH / 2 + 12, { align: "center" });

      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 151, 104);
      doc.text("COLECCION EXCLUSIVA 2026", PW / 2, PH / 2 + 22, { align: "center", charSpace: 2 });

      doc.setDrawColor(183, 110, 121);
      doc.setLineWidth(0.8);
      doc.line(30, PH - 40, PW - 30, PH - 40);

      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(7);
      doc.setTextColor(112, 128, 144);
      doc.text("Documento confidencial para distribuidores Stella", PW / 2, PH - 26, { align: "center" });

      // ── PÁGINAS DE PRODUCTOS (2 tarjetas por página, layout horizontal) ──
      const PPP      = 2;
      const M        = 12;          // margen mm
      const CARD_W   = PW - M * 2;  // 186 mm
      const GAP_Y    = 4;
      const HEADER_H = 20;
      const FOOTER_H = 12;
      const AVAIL_H  = PH - HEADER_H - FOOTER_H - M;
      const CARD_H   = (AVAIL_H - GAP_Y * (PPP - 1)) / PPP;

      // Proporción imagen / texto  (45% / 55%)
      const IMG_W = Math.round(CARD_W * 0.45); // ~83 mm
      const TXT_W = CARD_W - IMG_W;             // ~103 mm

      for (let i = 0; i < productos.length; i += PPP) {
        doc.addPage();

        // Fondo de página
        doc.setFillColor(246, 244, 239);
        doc.rect(0, 0, PW, PH, "F");

        // ── Header ──
        try {
          const logoH = await getBase64ImageFromUrl("/LogoM.svg");
          if (logoH) doc.addImage(logoH, "PNG", M, 6, 28, 9);
        } catch {
          doc.setFont(STYLES.fontSans, "bold");
          doc.setFontSize(8);
          doc.setTextColor(112, 128, 144);
          doc.text("STELLA", M, 13);
        }
        doc.setFont(STYLES.fontSans, "normal");
        doc.setFontSize(7);
        doc.setTextColor(140, 151, 104);
        doc.text("CATALOGO DE PRODUCTOS", PW - M, 13, { align: "right" });
        doc.setDrawColor(220, 215, 210);
        doc.setLineWidth(0.3);
        doc.line(M, HEADER_H, PW - M, HEADER_H);

        // ── Footer ──
        doc.line(M, PH - FOOTER_H, PW - M, PH - FOOTER_H);
        doc.setFont(STYLES.fontSans, "normal");
        doc.setFontSize(7);
        doc.setTextColor(112, 128, 144);
        doc.text(`Pagina ${Math.floor(i / PPP) + 1}`, PW / 2, PH - 6, { align: "center" });

        // ── Tarjetas ──
        const pageProducts = productos.slice(i, i + PPP);

        for (let j = 0; j < pageProducts.length; j++) {
          const p = pageProducts[j];
          const CX = M;
          const CY = HEADER_H + 4 + j * (CARD_H + GAP_Y);

          // Fondo blanco tarjeta (limpio, sin sombra para estilo editorial)
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(240, 235, 230);
          doc.setLineWidth(0.2);
          doc.roundedRect(CX, CY, CARD_W, CARD_H, 6, 6, "FD");

          // ─── COLUMNA IZQUIERDA: IMAGEN ────────────────────────
          const IMG_AREA_H = CARD_H - 12; // Dejamos espacio abajo para créditos
          
          if (p.image) {
            try {
              const b64 = await getBase64ImageFromUrl(p.image);
              if (b64) {
                const img = new Image();
                img.src = b64;
                await new Promise<void>((res) => {
                  img.onload  = () => res();
                  img.onerror = () => res();
                });
                
                const PAD = 5;
                const met = calculateImageMetrics(
                  img.width, img.height,
                  IMG_W - PAD * 2, IMG_AREA_H - PAD
                );
                
                // Fondo para la imagen (gris muy suave)
                doc.setFillColor(250, 248, 245);
                doc.roundedRect(CX + PAD, CY + PAD, IMG_W - PAD * 2, IMG_AREA_H - PAD, 5, 5, "F");
                
                doc.addImage(
                  b64, "JPEG",
                  CX + PAD + met.x,
                  CY + PAD + met.y,
                  met.width, met.height
                );
              }
            } catch { /* skip */ }
          }

          // ─── COLUMNA DERECHA: INFORMACIÓN ────────────────────
          const TX  = CX + IMG_W + 6;
          const TW  = TXT_W - 12;
          let   TY  = CY + 12;

          // NOMBRE DEL PRODUCTO (Estilo Perla Aurora Pastel)
          doc.setFont(STYLES.fontSerif, "italic");
          doc.setFontSize(20); // Reducido de 24 para dar más espacio
          doc.setTextColor(74, 85, 104);
          const nameLines = doc.splitTextToSize(p.name, TW);
          doc.text(nameLines.slice(0, 2), TX, TY);
          TY += nameLines.length > 1 ? 16 : 9;

          // PRECIO (Estilo Rose Gold Prominente)
          const wholesale = p.costo_mayorista ?? (p.price * 0.7);
          const finalPrice = getFinalPrice(wholesale);
          
          doc.setFont(STYLES.fontSans, "bold");
          doc.setFontSize(18); // Reducido de 22
          doc.setTextColor(183, 110, 121);
          const pStr = `$${finalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
          doc.text(pStr, TX, TY);
          
          const pWidth = doc.getTextWidth(pStr);
          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(6.5);
          doc.setTextColor(112, 128, 144);
          doc.text("MXN", TX + pWidth + 2, TY - 0.8);
          TY += 7; // Reducido de 8

          // ETIQUETAS DE MATERIAL (Pills)
          const matArr = p.materiales || ["Premium"];
          let pillX = TX;
          matArr.slice(0, 2).forEach(m => {
            doc.setFontSize(5);
            const mText = m.toUpperCase();
            const mSize = doc.getTextWidth(mText) + 6;
            doc.setDrawColor(183, 110, 121, 0.4);
            doc.setFillColor(252, 246, 247);
            doc.roundedRect(pillX, TY, mSize, 4.5, 2.2, 2.2, "FD");
            
            doc.setTextColor(183, 110, 121);
            doc.text(mText, pillX + 3, TY + 3.2); // Mejor centrado
            pillX += mSize + 2;
          });
          TY += 8; // Reducido de 10

          // SECCIÓN DESCRIPCIÓN
          doc.setDrawColor(240, 235, 230);
          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(8);
          doc.setTextColor(112, 128, 144);
          const descTxt = p.descripcion || "Diseño exclusivo de Stella Joyería pensado para ocasiones especiales y uso diario.";
          const descLines = doc.splitTextToSize(descTxt, TW);
          // Máximo 3 líneas para la descripción
          doc.text(descLines.slice(0, 3), TX, TY);
          TY += (Math.min(descLines.length, 3) * 4) + 6;
          
          // --- DETALLES TÉCNICOS (Agrupados) ---
          doc.setFont(STYLES.fontSans, "bold");
          doc.setFontSize(7);
          doc.setTextColor(74, 85, 104);
          doc.text("CARACTERÍSTICAS", TX, TY);
          TY += 4.5;

          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          
          const specs = [
            { label: "Material", value: matArr.slice(0,2).join(", ") },
            { label: "Categoría", value: p.category || "Joyería" }
          ];

          specs.forEach(s => {
            doc.text(`· ${s.label}: ${s.value}`, TX, TY);
            TY += 3.8;
          });
          TY += 1.5;

          // STOCK (Punto Verde - Integrado con detalles)
          const stock = p.stock_actual ?? 3;
          doc.setFillColor(140, 151, 104);
          doc.circle(TX + 1, TY - 1, 0.8, "F");
          doc.setFont(STYLES.fontSans, "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(140, 151, 104);
          doc.text(`${stock} Disponibles`, TX + 4, TY);
          TY += 9;

          // PERSONALIZACIÓN (Estilo botones)
          if (p.es_personalizable && p.opciones && p.opciones.length > 0) {
            doc.setFont(STYLES.fontSans, "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(74, 85, 104);
            doc.text("PERSONALIZA TU PIEZA", TX, TY);
            TY += 4.5;

            p.opciones.slice(0, 1).forEach(opt => {
              doc.setFontSize(7.5);
              doc.setTextColor(148, 163, 184);
              doc.text(`${opt.nombre} *`, TX, TY);
              TY += 3.5;

              let bx = TX;
              const isColor = opt.tipo === "color" || opt.nombre.toLowerCase().includes("color");

              opt.valores.slice(0, 4).forEach(v => {
                const val = v.valor || "";
                const parts = val.includes("|") ? val.split("|") : [val, val];
                const colorName = parts[0];
                let colorHex = parts[1];

                const colorMap: Record<string, string> = { 
                  rosa: "#fbcfe8", verde: "#86efac", blanco: "#ffffff", 
                  negro: "#333333", azul: "#93c5fd", rojo: "#fca5a5", 
                  dorado: "#fde047", plata: "#e5e7eb", lila: "#e9d5ff"
                };
                if (!colorHex.startsWith("#")) colorHex = colorMap[colorName.toLowerCase()] || "#cccccc";

                const r = parseInt(colorHex.slice(1, 3), 16);
                const g = parseInt(colorHex.slice(3, 5), 16);
                const b = parseInt(colorHex.slice(5, 7), 16);

                const bText = colorName;
                const bW = doc.getTextWidth(bText) + (isColor ? 12 : 8);
                
                doc.setDrawColor(226, 232, 240);
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(bx, TY, bW, 6.5, 1.5, 1.5, "FD");
                
                if (isColor) {
                  doc.setFillColor(r, g, b);
                  doc.setDrawColor(200, 200, 200);
                  doc.setLineWidth(0.1);
                  doc.circle(bx + 3.2, TY + 3.25, 1.6, "FD");
                  
                  doc.setFont(STYLES.fontSans, "normal");
                  doc.setFontSize(6.2);
                  doc.setTextColor(74, 85, 104);
                  doc.text(bText, bx + 6, TY + 4.5);
                } else {
                  doc.setFont(STYLES.fontSans, "normal");
                  doc.setFontSize(6.2);
                  doc.setTextColor(74, 85, 104);
                  doc.text(bText, bx + (bW/2), TY + 4.5, { align: "center" });
                }
                bx += bW + 3;
              });
            });
          }
        }
      }

      // ── CONTRAPORTADA ──────────────────────────────────────────
      doc.addPage();
      doc.setFillColor(74, 85, 104);
      doc.rect(0, 0, PW, PH, "F");

      doc.setDrawColor(183, 110, 121);
      doc.setLineWidth(0.5);
      doc.line(PW / 2 - 30, PH / 2 - 58, PW / 2 + 30, PH / 2 - 58);

      try {
        const logoF = await getBase64ImageFromUrl("/LogoM.svg");
        if (logoF) doc.addImage(logoF, "PNG", PW / 2 - 30, PH / 2 - 50, 60, 19);
      } catch {
        doc.setFont(STYLES.fontSerif, "italic");
        doc.setFontSize(32);
        doc.setTextColor(246, 244, 239);
        doc.text("Stella", PW / 2, PH / 2 - 30, { align: "center" });
      }

      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(246, 244, 239);
      doc.text("EL ARTE DE CREAR MOMENTOS ETERNOS", PW / 2, PH / 2 + 10, { align: "center", charSpace: 2 });

      doc.setDrawColor(183, 110, 121);
      doc.setLineWidth(0.5);
      doc.line(PW / 2 - 30, PH / 2 + 18, PW / 2 + 30, PH / 2 + 18);

      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(8);
      doc.setTextColor(183, 110, 121);
      doc.text("CONTACTO: wa.me/stella-jewelry", PW / 2, PH - 30, { align: "center" });
      doc.link(PW / 2 - 42, PH - 36, 84, 8, { url: "https://wa.me/521234567890" });

      doc.save("Catalogo_Stella_2026.pdf");
    } catch (err: unknown) {
      console.error("Error generando PDF:", err);
      alert("Error al generar el PDF: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{
          width: "100%",
          maxWidth: 900,
          background: STYLES.bg,
          borderRadius: 24,
          boxShadow: STYLES.shadow,
          overflow: "hidden",
          position: "relative",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div style={{
          padding: "24px 32px",
          borderBottom: `1px solid ${STYLES.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "2rem",
              color: STYLES.slateDeep,
              margin: 0,
            }}>
              Configurar <em style={{ color: STYLES.rose }}>Catálogo</em>
            </h2>
            <p style={{ fontSize: "0.85rem", color: STYLES.slate, marginTop: 4 }}>
              Ajusta tus márgenes y genera tu catálogo personalizado.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} color={STYLES.slate} />
          </button>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>

          {/* Controles de Margen + Botón */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            border: `1px solid ${STYLES.border}`,
            display: "flex",
            gap: 24,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: STYLES.slate,
                paddingBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                Margen de Ganancia
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: STYLES.bg,
                  borderRadius: 10,
                  padding: "0 12px",
                  border: `1px solid ${STYLES.border}`,
                }}>
                  {marginType === "amount"
                    ? <DollarSign size={16} color={STYLES.slate} />
                    : <Percent size={16} color={STYLES.slate} />
                  }
                  <input
                    type="number"
                    value={marginValue}
                    onChange={(e) => setMarginValue(Number(e.target.value))}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "10px 8px",
                      width: "100%",
                      outline: "none",
                      color: STYLES.slateDeep,
                      fontFamily: "var(--font-sans, Inter, sans-serif)",
                    }}
                  />
                </div>
                <div style={{ display: "flex", background: STYLES.bg, borderRadius: 10, padding: 4, gap: 4 }}>
                  <button
                    onClick={() => setMarginType("percent")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: marginType === "percent" ? "white" : "transparent",
                      color: marginType === "percent" ? STYLES.rose : STYLES.slate,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      boxShadow: marginType === "percent" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    <Percent size={14} />
                  </button>
                  <button
                    onClick={() => setMarginType("amount")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: marginType === "amount" ? "white" : "transparent",
                      color: marginType === "amount" ? STYLES.rose : STYLES.slate,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      boxShadow: marginType === "amount" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    <DollarSign size={14} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={generatePDF}
              disabled={generating || productos.length === 0}
              style={{
                background: STYLES.rose,
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 32px",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: (generating || productos.length === 0) ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px rgba(183, 110, 121, 0.25)",
                opacity: (generating || productos.length === 0) ? 0.7 : 1,
                minWidth: 200,
                justifyContent: "center",
              }}
            >
              {generating ? (
                <><Loader2 size={18} className="animate-spin" /> Generando...</>
              ) : (
                <><Download size={18} /> Descargar Catálogo PDF</>
              )}
            </button>
          </div>

          {/* Lista de productos en tabla */}
          <div style={{
            background: "white",
            borderRadius: 16,
            border: `1px solid ${STYLES.border}`,
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: `1px solid ${STYLES.border}` }}>
                  <th style={thStyle}>Producto</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Material</th>
                  <th style={thStyle}>Costo Socio</th>
                  <th style={thStyle}>P. Sugerido</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: STYLES.slate }}>
                      <Loader2 className="animate-spin mx-auto mb-2" /> Cargando listado...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: STYLES.rose }}>
                      <AlertCircle className="mx-auto mb-2" />
                      <p>Error: {error}</p>
                      <button
                        onClick={loadProducts}
                        style={{ fontSize: "0.7rem", textDecoration: "underline", marginTop: 8 }}
                      >
                        Reintentar
                      </button>
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: STYLES.slate }}>
                      <AlertCircle className="mx-auto mb-2" /> No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((p) => {
                    const wholesale = p.costo_mayorista ?? (p.price * 0.7);
                    const final = getFinalPrice(wholesale);
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 44, height: 44, borderRadius: 10, background: STYLES.bg,
                              overflow: "hidden", flexShrink: 0, position: "relative",
                            }}>
                              {p.image ? (
                                <NextImage src={p.image} alt={p.name} fill sizes="44px" style={{ objectFit: "cover" }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <FileText size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: STYLES.slateDeep, margin: 0 }}>
                                {p.name}
                              </p>
                              <p style={{ fontSize: "0.7rem", color: STYLES.slate, margin: 0 }}>
                                ID: {p.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            background: "rgba(140,151,104,0.1)",
                            color: STYLES.sage,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}>
                            {p.category ?? "—"}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, fontSize: "0.78rem", color: STYLES.slate }}>
                          {p.materiales && p.materiales.length > 0
                            ? p.materiales.join(", ")
                            : "—"}
                        </td>
                        <td style={tdStyle}>
                          ${wholesale.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: STYLES.rose }}>
                          ${final.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer del Modal */}
        <div style={{
          padding: "16px 32px",
          background: "#fafafa",
          borderTop: `1px solid ${STYLES.border}`,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          fontSize: "0.75rem",
          color: STYLES.slate,
        }}>
          <span>Total: <strong>{productos.length} productos</strong></span>
          <span>•</span>
          <span>
            Margen:{" "}
            <strong>
              {marginType === "percent" ? `${marginValue}%` : `$${marginValue}`}
            </strong>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#708090",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 20px",
  fontSize: "0.85rem",
  color: "#4a5568",
  fontFamily: "var(--font-sans, Inter, sans-serif)",
};
