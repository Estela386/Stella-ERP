"use client";

import { useState, useEffect } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { Order } from "../../type";
import jsPDF from "jspdf";
import logo from "@assets/logo.png";
import { createClient } from "@utils/supabase/client";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  order,
}: ReceiptModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dbOrder, setDbOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchReceiptData = async () => {
      if (!isOpen) return;
      setLoading(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("ventas")
          .select(
            `
            *,
            detalles:detallesventas (
              cantidad,
              producto:producto (nombre, precio)
            )
          `
          )
          .eq("id", order.id)
          .single();

        if (error) throw error;
        if (mounted && data) setDbOrder(data);
      } catch (error) {
        console.error("Error al cargar recibo:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReceiptData();
    return () => {
      mounted = false;
    };
  }, [isOpen, order.id]);

  const currentTotal = dbOrder ? Number(dbOrder.total) : order.total;
  const currentFecha = dbOrder
    ? new Date(dbOrder.fecha).toLocaleDateString("es-MX")
    : order.fecha;
  const currentItems = dbOrder
    ? dbOrder.detalles.map((d: any) => ({
        nombre_producto: d.producto?.nombre || "Producto",
        cantidad: d.cantidad,
        precio_unitario: d.producto?.precio || 0,
      }))
    : order.items;

  const subtotal = currentTotal / 1.16;
  const iva = currentTotal - subtotal;

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 260],
      });
      let y = 8;
      const folio = order.id;

      const finishPDF = () => {
        y += 8;
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Joyería Artesanal", 40, y, { align: "center" });
        y += 4;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Av. Principal 123, Zapopan", 40, y, { align: "center" });
        y += 6;
        doc.line(8, y, 72, y);
        y += 5;

        doc.text(`Folio: ${folio}`, 8, y);
        doc.text(currentFecha, 72, y, { align: "right" });
        y += 4;
        doc.text(`Cliente: Stella Cliente`, 8, y);
        y += 6;
        doc.line(8, y, 72, y);
        y += 5;

        doc.setFont("helvetica", "bold");
        doc.text("Producto", 8, y);
        doc.text("Total", 72, y, { align: "right" });
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.line(8, y, 72, y);
        y += 5;

        currentItems.forEach((p: any) => {
          const itemTotal = p.precio_unitario * p.cantidad;
          doc.text(
            `${p.cantidad} x ${p.nombre_producto.substring(0, 18)}`,
            8,
            y
          );
          doc.text(`$${itemTotal.toLocaleString()}`, 72, y, { align: "right" });
          y += 5;
        });

        doc.line(8, y, 72, y);
        y += 6;
        doc.text("Subtotal:", 8, y);
        doc.text(`$${subtotal.toFixed(2)}`, 72, y, { align: "right" });
        y += 4;
        doc.text("IVA (16%):", 8, y);
        doc.text(`$${iva.toFixed(2)}`, 72, y, { align: "right" });
        y += 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("TOTAL:", 8, y);
        doc.text(`$${currentTotal.toFixed(2)}`, 72, y, { align: "right" });
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Método de pago: ${order.metodo_pago}`, 8, y);
        y += 10;
        doc.text("Gracias por su compra", 40, y, { align: "center" });

        doc.save(`recibo-${folio}.pdf`);
      };

      const img = new Image();
      img.src = logo.src;
      img.onload = () => {
        doc.addImage(img, "PNG", 22, y, 36, 50);
        y += 50;
        finishPDF();
      };
      img.onerror = finishPDF;
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Recibo de Compra #${order.id}`}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Loader2 size={32} className="animate-spin text-[#b76e79]" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* El contenido visual del ticket se mantiene intacto, usando currentItems y currentTotal */}
          <div
            style={{
              background: "#ffffff",
              border: "1px dashed rgba(112, 128, 144, 0.3)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              borderRadius: "8px",
              fontFamily: "'Courier New', Courier, monospace",
              color: "#4a5568",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  color: "#4a5568",
                  fontWeight: "bold",
                }}
              >
                Stella Joyería
              </h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#708090" }}>
                Av. Principal 123, Zapopan
              </p>
            </div>

            <div
              style={{
                borderBottom: "1px dashed #708090",
                paddingBottom: "12px",
              }}
            >
              <p
                style={{
                  margin: "4px 0",
                  fontSize: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Fecha:</span>{" "}
                <span>{currentFecha}</span>
              </p>
              <p
                style={{
                  margin: "4px 0",
                  fontSize: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Folio:</span>{" "}
                <span>{order.id}</span>
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "8px 0",
              }}
            >
              {currentItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "0.85rem",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {item.cantidad} x {item.nombre_producto}
                  </span>
                  <span style={{ fontWeight: "bold" }}>
                    ${(item.precio_unitario * item.cantidad).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px dashed #708090",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#708090",
                }}
              >
                <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#708090",
                }}
              >
                <span>IVA (16%):</span> <span>${iva.toFixed(2)}</span>
              </div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  color: "#b76e79",
                }}
              >
                <span>TOTAL:</span> <span>${currentTotal.toFixed(2)}</span>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "16px",
                borderTop: "1px dashed #708090",
                paddingTop: "16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#708090",
                  fontStyle: "italic",
                }}
              >
                ¡Gracias por su compra!
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={downloadPDF}
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: "12px",
                background: "#b76e79",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: isGenerating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isGenerating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              {isGenerating ? "Generando..." : "Descargar PDF"}
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: "12px",
                background: "transparent",
                color: "#708090",
                border: "1px solid rgba(112, 128, 144, 0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
