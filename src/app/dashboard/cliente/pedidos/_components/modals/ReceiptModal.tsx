"use client";

import { Download, Printer, FileText, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { Order } from "../../type";
import jsPDF from "jspdf";
import { useState } from "react";
import logo from "@assets/logo.png";

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

  const subtotal = order.total / 1.16;
  const iva = order.total - subtotal;

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
        y += 4;
        doc.text("Tel: 33 1234 5678", 40, y, { align: "center" });
        y += 6;
        doc.line(8, y, 72, y);
        y += 5;

        doc.setFontSize(8);
        doc.text(`Folio: ${folio}`, 8, y);
        doc.text(new Date().toLocaleString(), 72, y, { align: "right" });
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

        order.items.forEach(p => {
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
        doc.text(`$${order.total.toFixed(2)}`, 72, y, { align: "right" });
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Método de pago: ${order.metodo_pago}`, 8, y);
        y += 10;
        doc.text("Gracias por su compra", 40, y, { align: "center" });
        y += 4;
        doc.text("Stella Joyería Artesanal", 40, y, { align: "center" });

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
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Receipt Mockup */}
        <div
          style={{
            background: "#ffffff",
            border: "1px dashed rgba(112, 128, 144, 0.3)",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            borderRadius: "8px",
            fontFamily: "'Courier New', Courier, monospace", // Receipt style font
            position: "relative",
            color: "#4a5568", // Color base oscuro para todo el ticket
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)",
          }}
        >
          {/* Logo Placeholder */}
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
                color: "#4a5568",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Fecha:</span>{" "}
              <span>{order.fecha}</span>
            </p>
            <p
              style={{
                margin: "4px 0",
                fontSize: "0.85rem",
                display: "flex",
                justifyContent: "space-between",
                color: "#4a5568",
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
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#4a5568",
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
                color: "#b76e79", // Color de acento para el total
              }}
            >
              <span>TOTAL:</span> <span>${order.total.toFixed(2)}</span>
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
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "0.7rem",
                color: "#b76e79",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Stella Joyería Artesanal
            </p>
          </div>
        </div>

        {/* Actions */}
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
              boxShadow: "0 10px 26px rgba(183, 110, 121, 0.32)",
              transition: "all 0.2s ease",
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
    </Modal>
  );
}
