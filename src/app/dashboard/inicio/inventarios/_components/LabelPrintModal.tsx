"use client";

import { useState, useMemo } from "react";
import { Producto } from "../type";
import { X, Search, FileText, Plus, Minus } from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { createClient } from "@utils/supabase/client";
import Image from "next/image";

interface LabelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
}

interface SelectedProducto {
  producto: Producto;
  cantidad: number;
  tipo: "standard" | "jewelry";
}

export default function LabelPrintModal({
  isOpen,
  onClose,
  productos,
}: LabelPrintModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<number, SelectedProducto>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [labelType, setLabelType] = useState<"standard" | "jewelry">("standard");

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
        [producto.id]: { producto, cantidad: newQuantity, tipo: prev[producto.id]?.tipo || labelType },
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
      [producto.id]: { producto, cantidad: qty, tipo: prev[producto.id]?.tipo || labelType },
    }));
  };

  const updateItemType = (productId: number, type: "standard" | "jewelry") => {
    setSelectedItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: { ...prev[productId], tipo: type },
      };
    });
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
      const materialesMap: Record<number, string> = {};
      
      if (selectedIds.length > 0) {
        const { data: rels, error: relsError } = await supabase
          .from("producto_material")
          .select("id_producto, id_material, materiales(nombre)")
          .in("id_producto", selectedIds);
          
        if (relsError) {
          console.error("Error fetching materiales:", relsError);
        }
          
        if (rels) {
          rels.forEach((rel: { id_producto: number; materiales: { nombre: string } | { nombre: string }[] | null }) => {
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

      const qrCache: Record<number, string> = {};
      
      // Grouping: Standard first, Jewelry later
      const standardList = Object.values(selectedItems).filter(item => item.tipo === "standard");
      const jewelryList = Object.values(selectedItems).filter(item => item.tipo === "jewelry");

      // Shared cursor for the PDF
      let currentY = 12; // Initial top margin
      const pageHeight = 297;

      // -- PROCESS STANDARDS (50x30mm) --
      const standardWidth = 50;
      const standardHeight = 30;
      const standardCols = 4;
      const standardSpacingX = 2;
      const standardSpacingY = 2;

      let stdCount = 0;
      for (const item of standardList) {
        for (let q = 0; q < item.cantidad; q++) {
          const indexOnPage = stdCount % (standardCols * 9);
          if (stdCount > 0 && indexOnPage === 0) {
            doc.addPage();
          }

          const colOnStandardLine = indexOnPage % standardCols;
          const rowOnStandardLine = Math.floor(indexOnPage / standardCols);
          
          const x = 2 + colOnStandardLine * (standardWidth + standardSpacingX);
          const y = 12 + rowOnStandardLine * (standardHeight + standardSpacingY);

          // Update shared cursors for jewelry transition
          currentY = y + standardHeight + standardSpacingY;

          // -- DRAW STANDARD LABEL --
          // (Copying current logic)
          doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1); doc.rect(x, y, standardWidth, standardHeight);
          doc.setFillColor(183, 110, 121); doc.rect(x + 1, y + 1, standardWidth - 2, 4, "F");
          doc.setTextColor(255, 255, 255); doc.setFontSize(6); doc.setFont("helvetica", "bold");
          doc.text("S T E L L A", x + (standardWidth / 2), y + 3.8, { align: "center" });
          doc.setTextColor(112, 128, 144); doc.setFontSize(8);
          doc.text((item.producto.nombre || "PRODUCTO").substring(0, 28).toUpperCase(), x + 2.5, y + 9, { maxWidth: 24 });
          doc.setTextColor(0, 0, 0); doc.setFontSize(14);
          const priceStr = item.producto.precio != null ? `$${item.producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "$0.00";
          doc.text(priceStr, x + 2.5, y + 16.5);
          doc.setDrawColor(240, 240, 240); doc.setLineWidth(0.3); doc.line(x + 2.5, y + 19, x + 24, y + 19);
          doc.setTextColor(130, 130, 130); doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
          const mat = materialesMap[item.producto.id] || "VARIOS";
          doc.text(`MATERIAL: ${mat.toUpperCase()}`, x + 2.5, y + 23, { maxWidth: 22 });
          const cat = item.producto.categoria?.nombre || "GENERAL";
          doc.text(`CAT: ${cat.toUpperCase()}`, x + 2.5, y + 26.5, { maxWidth: 22 });
          if (!qrCache[item.producto.id]) {
            qrCache[item.producto.id] = await QRCode.toDataURL(`https://www.stellajoyeria.online/productos/${item.producto.id}`, { width: 80, margin: 0 });
          }
          doc.addImage(qrCache[item.producto.id], "PNG", x + 28, y + 8, 19, 19);
          
          stdCount++;
        }
      }

      // -- PROCESS JEWELRY (60x12mm) --
      const jewelryWidth = 60;
      const jewelryHeight = 12;
      const jewelryCols = 3;
      const jewelrySpacingY = 4;
      const jewelryStartX = 15;

      // Reset cursor and add spacing if we already printed standards
      if (stdCount > 0) {
        // Did we finish a full page?
        if (currentY + jewelryHeight + 10 > pageHeight) {
          doc.addPage();
          currentY = 15;
        } else {
          // Add a small buffer after standard labels
          currentY += 4;
        }
      } else {
        currentY = 15;
      }

      let jwlCountTotal = 0;
      for (const item of jewelryList) {
        for (let q = 0; q < item.cantidad; q++) {
          // Check if we need a new page BEFORE calculating positions
          // If currentY is too low, saltar página
          if (currentY + jewelryHeight + 5 > pageHeight) {
            doc.addPage();
            currentY = 15;
            jwlCountTotal = 0; 
          }
          
          const colOnJwlLine = jwlCountTotal % jewelryCols;
          const rowOnJwlLine = Math.floor(jwlCountTotal / jewelryCols);
          
          const x = jewelryStartX + colOnJwlLine * jewelryWidth;
          const y = currentY + rowOnJwlLine * (jewelryHeight + jewelrySpacingY);

          // Prepare next page check if this row ends
          if (colOnJwlLine === jewelryCols - 1) {
            const nextRowY = y + jewelryHeight + jewelrySpacingY;
            if (nextRowY + jewelryHeight + 5 > pageHeight) {
              // This was the last row that fits on this page for jewelry
              // But we don't add page here, we do it at the start of next iteration
            }
          }

          // -- Render Jewelry Shape (Pesa / Cola de Rata) --
          // Proportions: 20mm (Face 1) - 20mm (Tail) - 20mm (Face 2)
          doc.setDrawColor(200, 200, 200); 
          doc.setLineWidth(0.1);
          
          // Face 1 (Left): 20x12 rounded
          if (typeof doc.roundedRect === 'function') {
            doc.roundedRect(x, y, 20, jewelryHeight, 1.5, 1.5, "S");
          } else {
            doc.rect(x, y, 20, jewelryHeight);
          }

          // Center tail (20x3) - notably longer (20mm)
          doc.rect(x + 20, y + 4.5, 20, 3);

          // Face 2 (Right): 20x12 rounded
          if (typeof doc.roundedRect === 'function') {
            doc.roundedRect(x + 40, y, 20, jewelryHeight, 1.5, 1.5, "S");
          } else {
            doc.rect(x + 40, y, 20, jewelryHeight);
          }

          // -- Cara Frontal (LEFT SIDE - 20mm) --
          doc.setTextColor(112, 128, 144); doc.setFont("helvetica", "bold"); doc.setFontSize(6);
          doc.text("S T E L L A", x + 10, y + 3.2, { align: "center" });

          // Price horizontal, centered in the face
          doc.setTextColor(0, 0, 0); doc.setFontSize(10);
          const price = item.producto.precio != null ? `$${item.producto.precio.toLocaleString('es-MX')}` : "$0";
          doc.text(price, x + 10, y + 8, { align: "center" });

          // -- Cara Posterior (RIGHT SIDE - 20mm starting at x+40) --
          // QR Code scaled
          if (!qrCache[item.producto.id]) {
            qrCache[item.producto.id] = await QRCode.toDataURL(`https://www.stellajoyeria.online/productos/${item.producto.id}`, { width: 50, margin: 0 });
          }
          
          // QR - small (8.5x8.5mm)
          doc.addImage(qrCache[item.producto.id], "PNG", x + 41, y + 1.8, 8.5, 8.5);

          // Attributes next to QR in the face
          doc.setTextColor(112, 128, 144); doc.setFont("helvetica", "normal"); doc.setFontSize(3.8);
          const cat = (item.producto.categoria?.nombre || "GRAL").substring(0, 15);
          doc.text(cat.toUpperCase(), x + 50.5, y + 4.5, { maxWidth: 9 });
          const mat = (materialesMap[item.producto.id] || "VAR").split(',')[0].substring(0, 12);
          doc.text(mat.toUpperCase(), x + 50.5, y + 8.5, { maxWidth: 9 });


          jwlCountTotal++;
        }
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
                        <Image 
                          src={p.url_imagen} 
                          alt={p.nombre || "Producto"} 
                          width={40}
                          height={40}
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
              <h3 className="font-medium text-gray-800">Tipo de Etiqueta</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLabelType("standard")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    labelType === "standard"
                      ? "bg-[#b76e79]/5 border-[#b76e79] text-[#b76e79]"
                      : "bg-white border-black/5 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-current opacity-20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-current" />
                  </div>
                  <span className="text-xs font-medium">Estándar</span>
                </button>
                <button
                  onClick={() => setLabelType("jewelry")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    labelType === "jewelry"
                      ? "bg-[#b76e79]/5 border-[#b76e79] text-[#b76e79]"
                      : "bg-white border-black/5 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-current opacity-20 flex items-center justify-center p-1">
                    <div className="w-full h-full rounded-full bg-current opacity-40" />
                  </div>
                  <span className="text-xs font-medium">Joyería</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-black/5 bg-gray-50/30">
              <h3 className="font-medium text-gray-800">Resumen</h3>
              <p className="text-sm text-gray-500 font-medium">{totalLabels} etiquetas seleccionadas</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Object.values(selectedItems).length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Ningún producto seleccionado.
                </div>
              ) : (
                Object.values(selectedItems).map(({ producto, cantidad, tipo }) => (
                  <div key={producto.id} className="border-b border-gray-100 pb-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate pr-2 text-gray-700 font-medium">{producto.nombre}</span>
                      <span className="font-semibold text-[#b76e79] shrink-0">x {cantidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemType(producto.id, "standard")}
                        className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                          tipo === "standard" 
                            ? "bg-[#b76e79] text-white border-[#b76e79]" 
                            : "bg-white text-gray-400 border-gray-200 hover:border-[#b76e79]/30"
                        }`}
                      >
                        Estándar
                      </button>
                      <button
                        onClick={() => updateItemType(producto.id, "jewelry")}
                        className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                          tipo === "jewelry" 
                            ? "bg-[#b76e79] text-white border-[#b76e79]" 
                            : "bg-white text-gray-400 border-gray-200 hover:border-[#b76e79]/30"
                        }`}
                      >
                        Joyería
                      </button>
                    </div>
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
