"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  Trash2, 
  Settings2, 
  DollarSign, 
  Percent, 
  Plus,
  Loader2,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  sageSm: "rgba(140, 151, 104, 0.08)",
  sageMd: "rgba(140, 151, 104, 0.15)",
  shadow: "0 12px 40px rgba(140, 151, 104, 0.15)",
  border: "rgba(112, 128, 144, 0.18)",
  fontSerif: "times", // Para Cormorant
  fontSans: "helvetica" // Para DM Sans
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
      const { productos: data, error: err } = await obtenerProductosMayoreo();
      if (err) throw new Error(err);
      setProductos(data || []);
    } catch (err: any) {
      setError(err.message);
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

  // Helper para convertir imagen a Base64 para jsPDF
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
    } catch (e) {
      console.error("Error converting image to base64:", e);
      return null;
    }
  };

  // Helper para calcular dimensiones de imagen sin distorsión
  const calculateImageMetrics = (imgWidth: number, imgHeight: number, maxWidth: number, maxHeight: number) => {
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    return {
      width: newWidth,
      height: newHeight,
      x: (maxWidth - newWidth) / 2,
      y: (maxHeight - newHeight) / 2
    };
  };

  const generatePDF = async () => {
    if (productos.length === 0) {
      alert("No hay productos cargados en el catálogo.");
      return;
    }

    try {
      setGenerating(true);
      const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. PORTADA EDITORIAL (Minimalismo Alto con Logo oficial)
      doc.setFillColor(246, 244, 239); 
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Cargar y dibujar LogoM
      try {
        const logoBase64 = await getBase64ImageFromUrl("/LogoM.svg");
        if (logoBase64) {
          doc.addImage(logoBase64, "PNG", pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 25);
        }
      } catch (e) {
        doc.setTextColor(74, 85, 104); 
        doc.setFont(STYLES.fontSerif, "normal");
        doc.setFontSize(72);
        doc.text("STELLA", pageWidth / 2, pageHeight / 2 - 20, { align: "center", charSpace: 10 });
      }
      
      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(9);
      doc.setTextColor(112, 128, 144);
      doc.text("ALTA JOYERÍA ARTESANAL", pageWidth / 2, pageHeight / 2 - 5, { align: "center", charSpace: 4 });

      doc.setFont(STYLES.fontSerif, "italic");
      doc.setFontSize(22);
      doc.setTextColor(183, 110, 121); 
      doc.text("Catálogo de Socios", pageWidth / 2, pageHeight / 2 + 15, { align: "center" });
      
      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(8);
      doc.setTextColor(112, 128, 144, 0.4);
      doc.text("EDICIÓN LIMITADA 2026", pageWidth / 2, pageHeight - 30, { align: "center", charSpace: 2 });

      // 2. CUERPO EDITORIAL (2 Productos por Página para Máximo Impacto)
      const productsPerPage = 2;
      for (let i = 0; i < productos.length; i += productsPerPage) {
        doc.addPage();
        doc.setFillColor(246, 244, 239);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        const pageProducts = productos.slice(i, i + productsPerPage);
        const margin = 20;
        const availableHeight = pageHeight - (margin * 2) - 20;
        const productBoxH = availableHeight / productsPerPage;
        const productBoxW = pageWidth - (margin * 2);

        // Header de página con logo pequeño
        try {
          const logoSmall = await getBase64ImageFromUrl("/LogoM.svg");
          if (logoSmall) {
            doc.addImage(logoSmall, "PNG", margin, 10, 30, 9);
          }
        } catch (e) {
          doc.setFontSize(7);
          doc.setTextColor(112, 128, 144, 120);
          doc.text("STELLA JOYERÍA", margin, 12);
        }
        
        doc.setFontSize(7);
        doc.setTextColor(112, 128, 144, 120);
        doc.text("CATÁLOGO DE SOCIOS", pageWidth - margin, 12, { align: "right" });
        doc.text(`— ${Math.floor(i / productsPerPage) + 1} —`, pageWidth / 2, pageHeight - 10, { align: "center" });

        for (let j = 0; j < pageProducts.length; j++) {
          const p = pageProducts[j];
          const yOffset = margin + (j * productBoxH) + (j * 15);

          // Diseño de caja con "aire"
          if (j > 0) {
            doc.setDrawColor(112, 128, 144, 20);
            doc.setLineWidth(0.1);
            doc.line(margin + 20, yOffset - 7.5, pageWidth - margin - 20, yOffset - 7.5);
          }

          // Renderizar Producto (Layout Editorial: Imagen MUCHO más grande)
          const imgSize = Math.min(productBoxH - 10, 85);
          const imgX = margin;
          const imgY = yOffset;

          // Imagen Premium
          if (p.image) {
            try {
              const base64 = await getBase64ImageFromUrl(p.image);
              if (base64) {
                const img = new Image();
                img.src = base64;
                await new Promise((resolve) => { img.onload = resolve; });
                const metrics = calculateImageMetrics(img.width, img.height, imgSize, imgSize);
                
                doc.setFillColor(255, 255, 255);
                doc.rect(imgX + metrics.x, imgY + metrics.y, metrics.width, metrics.height, "F");
                doc.addImage(base64, "JPEG", imgX + metrics.x, imgY + metrics.y, metrics.width, metrics.height);
              }
            } catch (e) {
              doc.setFillColor(237, 233, 227);
              doc.rect(imgX, imgY, imgSize, imgSize, "F");
            }
          }

          // Texto Sophisticated
          const textX = imgX + imgSize + 15;
          const textY = imgY + 8;
          const textW = productBoxW - imgSize - 15;

          // Categoría
          doc.setFont(STYLES.fontSans, "bold");
          doc.setFontSize(6.5);
          doc.setTextColor(140, 151, 104);
          doc.text(p.category?.toUpperCase() || "DISEÑO STELLA", textX, textY, { charSpace: 3 });

          // Nombre impactante
          doc.setFont(STYLES.fontSerif, "normal");
          doc.setFontSize(22);
          doc.setTextColor(74, 85, 104);
          doc.text(p.name, textX, textY + 11);

          // Descripción con límite de líneas
          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(9);
          doc.setTextColor(112, 128, 144);
          const descStr = p.descripcion || "Diseño artesanal grabado en materiales de la más alta calidad.";
          const splitDesc = doc.splitTextToSize(descStr, textW - 10);
          doc.text(splitDesc.slice(0, 4), textX, textY + 20);

          // Badges (Personalización / Stock)
          const badgeY = textY + 38;
          let badgeX = textX;
          
          doc.setFontSize(5.5);
          if (p.es_personalizable) {
            doc.setTextColor(183, 110, 121);
            doc.text("• PERSONALIZABLE", badgeX, badgeY);
            badgeX += 30;
          }

          const stockNum = p.stock_actual || 0;
          const isLowStock = stockNum <= (p.stock_min || 2);
          doc.setTextColor(isLowStock ? 183 : 140, isLowStock ? 110 : 151, isLowStock ? 121 : 104);
          doc.text(stockNum > 0 ? "• DISPONIBLE" : "• BAJO PEDIDO", badgeX, badgeY);

          // Precios Relevantes
          const finalPrice = getFinalPrice(p.costo_mayorista || (p.price * 0.7));
          const wholesale = p.costo_mayorista || (p.price * 0.7);

          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(8);
          doc.setTextColor(112, 128, 144);
          doc.text("Precio Socio:", textX, textY + 50);
          doc.setFont(STYLES.fontSans, "bold");
          doc.text(`$${wholesale.toLocaleString()}`, textX + 20, textY + 50);

          doc.setFont(STYLES.fontSerif, "italic");
          doc.setFontSize(24);
          doc.setTextColor(183, 110, 121); 
          doc.text(`$${finalPrice.toLocaleString()}`, textW + textX, textY + 50, { align: "right" });
          doc.setFont(STYLES.fontSans, "normal");
          doc.setFontSize(6.5);
          doc.text("P.V. SUGERIDO", textW + textX, textY + 54, { align: "right" });
        }
      }

      // 3. PÁGINA FINAL (Editorial Close)
      doc.addPage();
      doc.setFillColor(74, 85, 104);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // contraportada con logo
      try {
        const logoFinal = await getBase64ImageFromUrl("/LogoM.svg");
        if (logoFinal) {
          doc.addImage(logoFinal, "PNG", pageWidth / 2 - 30, pageHeight / 2 - 50, 60, 18);
        }
      } catch (e) {
        doc.setFont(STYLES.fontSerif, "italic");
        doc.setFontSize(36);
        doc.text("Stella Jewelry", pageWidth/2, pageHeight/2 - 10, { align: "center" });
      }
      
      doc.setTextColor(246, 244, 239);
      doc.setFont(STYLES.fontSans, "normal");
      doc.setFontSize(9);
      doc.setTextColor(246, 244, 239, 0.4);
      doc.text("EL ARTE DE CREAR MOMENTOS ETERNOS", pageWidth/2, pageHeight/2 + 5, { align: "center", charSpace: 3 });
      
      doc.setFontSize(8);
      doc.text("CONTACTAR POR WHATSAPP: wa.me/stella-jewelry", pageWidth/2, pageHeight - 30, { align: "center" });
      doc.link(pageWidth/2 - 40, pageHeight - 34, 80, 8, { url: "https://wa.me/521234567890" });

      doc.save(`Catalogo_Socio_Stella_2026.pdf`);
    } catch (err: any) {
      console.error("Error generating PDF:", err);
      alert("Error al generar el PDF: " + err.message);
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
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: "24px 32px", 
          borderBottom: STYLES.border, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: "white"
        }}>
          <div>
            <h2 style={{ 
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", 
              fontSize: "2rem", 
              color: STYLES.slateDeep,
              margin: 0
            }}>Configurar <em style={{ color: STYLES.rose }}>Catálogo</em></h2>
            <p style={{ 
              fontSize: "0.85rem", 
              color: STYLES.slate, 
              marginTop: 4 
            }}>Ajusta tus márgenes y genera tu listado personalizado.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} color={STYLES.slate} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          
          {/* Controls */}
          <div style={{ 
            background: "white", 
            borderRadius: 16, 
            padding: 24, 
            marginBottom: 32,
            border: STYLES.border,
            display: "flex",
            gap: 24,
            alignItems: "flex-end",
            flexWrap: "wrap"
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ 
                display: "block", 
                fontSize: "0.75rem", 
                fontWeight: 600, 
                color: STYLES.slate,
                paddingBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>Margen de Ganancia</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ 
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: STYLES.bg,
                  borderRadius: 10,
                  padding: "0 12px",
                  border: STYLES.border
                }}>
                  {marginType === "amount" ? <DollarSign size={16} color={STYLES.slate} /> : <Percent size={16} color={STYLES.slate} />}
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
                      fontFamily: "var(--font-sans, Inter, sans-serif)"
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
                      boxShadow: marginType === "percent" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                    }}
                  ><Percent size={14} /></button>
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
                      boxShadow: marginType === "amount" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                    }}
                  ><DollarSign size={14} /></button>
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
                justifyContent: "center"
              }}
            >
              {generating ? (
                <><Loader2 size={18} className="animate-spin" /> Generando...</>
              ) : (
                <><Download size={18} /> Descargar Catálogo PDF</>
              )}
            </button>
          </div>

          {/* Product List */}
          <div style={{ 
            background: "white", 
            borderRadius: 16, 
            border: STYLES.border,
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: STYLES.border }}>
                  <th style={thStyle}>Producto</th>
                  <th style={thStyle}>Costo Soc. (-25%)</th>
                  <th style={thStyle}>Tu Ganancia</th>
                  <th style={thStyle}>Precio Final</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 40, textAlign: "center", color: STYLES.slate }}>
                      <Loader2 className="animate-spin mx-auto mb-2" /> Cargando listado...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 40, textAlign: "center", color: STYLES.rose }}>
                      <AlertCircle className="mx-auto mb-2" /> 
                      <p>Error: {error}</p>
                      <button onClick={loadProducts} style={{ fontSize: '0.7rem', textDecoration: 'underline', marginTop: 8 }}>Reintentar</button>
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 40, textAlign: "center", color: STYLES.slate }}>
                      <AlertCircle className="mx-auto mb-2" /> No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((p) => {
                    const wholesale = p.costo_mayorista || (p.price * 0.7);
                    const final = getFinalPrice(wholesale);
                    const profit = final - wholesale;

                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ 
                              width: 40, height: 40, borderRadius: 8, background: STYLES.bg,
                              overflow: "hidden", flexShrink: 0
                            }}>
                              {p.image ? (
                                <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText size={20} /></div>
                              )}
                            </div>
                            <div style={{ textAlign: "left" }}>
                              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: STYLES.slateDeep, margin: 0 }}>{p.name}</p>
                              <p style={{ fontSize: "0.7rem", color: STYLES.slate, margin: 0 }}>ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>${wholesale.toLocaleString()}</td>
                        <td style={{ ...tdStyle, color: STYLES.slate, fontWeight: 600 }}>+ ${profit.toLocaleString()}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: STYLES.slateDeep }}>${final.toLocaleString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ 
          padding: "16px 32px", 
          background: "#fafafa", 
          borderTop: STYLES.border,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          fontSize: "0.75rem",
          color: STYLES.slate
        }}>
          <span>Total: <strong>{productos.length} productos</strong></span>
          <span>•</span>
          <span>Margen: <strong>{marginType === "percent" ? `${marginValue}%` : `$${marginValue}`}</strong></span>
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
  color: STYLES.slate,
  fontWeight: 600
};

const tdStyle: React.CSSProperties = {
  padding: "16px 20px",
  fontSize: "0.85rem",
  color: STYLES.slateDeep,
  fontFamily: "var(--font-sans, Inter, sans-serif)"
};
