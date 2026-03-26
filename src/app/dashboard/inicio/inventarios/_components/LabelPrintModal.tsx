"use client";

import { useState, useMemo } from "react";
import { Producto } from "../type";
import { X, Search, FileText, Plus, Minus } from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { createClient } from "@utils/supabase/client";

interface LabelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
}

interface SelectedProducto {
  producto: Producto;
  cantidad: number;
}

export default function LabelPrintModal({
  isOpen,
  onClose,
  productos,
}: LabelPrintModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<number, SelectedProducto>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter products by search term
  const filteredProducts = useMemo(() => {
    return productos.filter((p) =>
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  // Handle quantity changes
  const updateQuantity = (producto: Producto, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[producto.id];
      const newQuantity = (current?.cantidad || 0) + delta;

      if (newQuantity <= 0) {
        const newState = { ...prev };
        delete newState[producto.id];
        return newState;
      }

      return {
        ...prev,
        [producto.id]: { producto, cantidad: newQuantity },
      };
    });
  };

  const handleManualQuantityChange = (producto: Producto, value: string) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty <= 0) {
      setSelectedItems((prev) => {
        const newState = { ...prev };
        delete newState[producto.id];
        return newState;
      });
      return;
    }

    setSelectedItems((prev) => ({
      ...prev,
      [producto.id]: { producto, cantidad: qty },
    }));
  };

  const totalLabels = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, item) => sum + item.cantidad, 0);
  }, [selectedItems]);

  const generatePDF = async () => {
    if (totalLabels === 0) return;

    try {
      setIsGenerating(true);
      const supabase = createClient();
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Fetch materials for selected products
      const selectedIds = Object.keys(selectedItems).map(Number);
      let materialesMap: Record<number, string> = {};
      
      if (selectedIds.length > 0) {
        const { data: rels, error: relsError } = await supabase
          .from("producto_material")
          .select("id_producto, id_material, materiales(nombre)")
          .in("id_producto", selectedIds);
          
        if (relsError) {
          console.error("Error fetching materiales:", relsError);
        }
          
        if (rels) {
          rels.forEach((rel: any) => {
            const mat = Array.isArray(rel.materiales) ? rel.materiales[0] : rel.materiales;
            if (mat?.nombre) {
              if (materialesMap[rel.id_producto]) {
                materialesMap[rel.id_producto] += `, ${mat.nombre}`;
              } else {
                materialesMap[rel.id_producto] = mat.nombre;
              }
            }
          });
        }
      }

      // Format for A4 layout: 4 columns x 9 rows per page
      const labelW = 50;
      const labelH = 30;
      const startX = 2; // minor left margin
      const startY = 12; // top margin
      const spaceX = 2;
      const spaceY = 2;
      const cols = 4;
      const rows = 9;

      let currentLabel = 0;
      const qrCache: Record<number, string> = {};

      // Expand all requested labels into a single flat array
      const labelsToPrint = Object.values(selectedItems).flatMap((item) =>
        Array.from({ length: item.cantidad }).map(() => item.producto)
      );

      for (let i = 0; i < labelsToPrint.length; i++) {
        const prod = labelsToPrint[i];

        if (i > 0 && i % (cols * rows) === 0) {
          doc.addPage();
        }

        const indexOnPage = i % (cols * rows);
        const col = indexOnPage % cols;
        const row = Math.floor(indexOnPage / cols);

        const x = startX + col * (labelW + spaceX);
        const y = startY + row * (labelH + spaceY);

        // -- 1. Cut marks / Label Boundary --
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.setLineDashPattern([1, 1], 0);
        doc.rect(x, y, labelW, labelH);
        doc.setLineDashPattern([], 0); // reset dash

        // -- 2. Accent Bar & Brand Name --
        doc.setFillColor(183, 110, 121); // #b76e79 (Stella Rose)
        doc.rect(x + 1, y + 1, labelW - 2, 4, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        // Center text on the label
        doc.text("S T E L L A", x + (labelW / 2), y + 3.8, { align: "center", renderingMode: "fill" });

        // -- 3. Product Info Section --
        // Left side for text (x + 2 to x + 26)
        // Name
        doc.setTextColor(112, 128, 144); // #708090
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        const shortName = (prod.nombre || "Producto").substring(0, 28);
        // Truncate cleanly if too long, using max-width wrapper
        doc.text(shortName.toUpperCase(), x + 2.5, y + 9, { maxWidth: 24 });

        // Price
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        const price = prod.precio != null ? `$${prod.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "$0.00";
        doc.text(price, x + 2.5, y + 16.5);

        // Divider
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.3);
        doc.line(x + 2.5, y + 19, x + 24, y + 19);

        // Attributes (Material & Category)
        doc.setTextColor(130, 130, 130);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.5);
        
        const materialText = materialesMap[prod.id] || "VARIOS";
        doc.text(`MATERIAL: ${materialText.toUpperCase()}`, x + 2.5, y + 23, { maxWidth: 22 });
        
        const catText = prod.categoria?.nombre || "GENERAL";
        doc.text(`CAT: ${catText.toUpperCase()}`, x + 2.5, y + 26.5, { maxWidth: 22 });

        // -- 4. QR Code Section --
        // Right side (x + 28 to x + 48)
        if (!qrCache[prod.id]) {
          const productUrl = `${window.location.origin}/productos/${prod.id}`;
          qrCache[prod.id] = await QRCode.toDataURL(productUrl, {
            width: 80,
            margin: 0, // removed margin so it fills space nicely
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
        }
        
        // Add QR Image to PDF (X=28, Y=8, 19x19 mm)
        doc.addImage(qrCache[prod.id], "PNG", x + 28, y + 8, 19, 19);
      }

      doc.save("etiquetas_inventario.pdf");
      onClose();
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un error al generar las etiquetas.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#b76e79]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-medium text-[#708090]">
              Imprimir Etiquetas
            </h2>
            <p className="text-sm text-gray-500">
              Selecciona los productos y la cantidad de etiquetas que deseas imprimir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row min-h-0">
          {/* Left panel: Product Selection */}
          <div className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r border-black/5 bg-[#F6F3EF]/30">
            <div className="p-4 border-b border-black/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-black/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No se encontraron productos.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-black/5 hover:border-[#b76e79]/30 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      {p.url_imagen ? (
                        <img 
                          src={p.url_imagen} 
                          alt={p.nombre || "Producto"} 
                          className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-sm text-gray-800 truncate" title={p.nombre || "Producto"}>
                          {p.nombre || "Sin nombre"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Stock: {p.stock_actual} • {p.categoria?.nombre || "Sin categoría"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center shrink-0">
                      <button
                        onClick={() => updateQuantity(p, -1)}
                        className="p-1 text-gray-400 hover:text-[#b76e79] hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={selectedItems[p.id]?.cantidad || ""}
                        onChange={(e) => handleManualQuantityChange(p, e.target.value)}
                        placeholder="0"
                        className="w-12 text-center text-sm font-medium mx-1 py-1 border border-black/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b76e79] hide-arrows"
                      />
                      <button
                        onClick={() => updateQuantity(p, 1)}
                        className="p-1 text-gray-400 hover:text-[#b76e79] hover:bg-green-50 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel: Summary */}
          <div className="w-full sm:w-80 flex flex-col bg-white">
            <div className="p-4 border-b border-black/5">
              <h3 className="font-medium text-gray-800">Resumen de Etiquetas</h3>
              <p className="text-sm text-gray-500">{totalLabels} en total</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Object.values(selectedItems).length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Ningún producto seleccionado.
                </div>
              ) : (
                Object.values(selectedItems).map(({ producto, cantidad }) => (
                  <div key={producto.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                    <span className="truncate pr-2 text-gray-700">{producto.nombre}</span>
                    <span className="font-medium text-[#b76e79] shrink-0">x {cantidad}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-black/5 bg-gray-50/50">
              <button
                onClick={generatePDF}
                disabled={totalLabels === 0 || isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-[#b76e79] text-white py-3 px-4 rounded-xl font-medium focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#a45f69] transition-colors relative overflow-hidden"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generando PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Descargar PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Include CSS for hiding arrows in number input directly inside the component scope or globally (using globally in index.css is better but this inline style handles it) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows {
          -moz-appearance: textfield;
        }
      `}} />
    </div>
  );
}
