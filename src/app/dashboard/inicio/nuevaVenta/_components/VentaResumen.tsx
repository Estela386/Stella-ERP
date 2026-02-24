"use client";

import jsPDF from "jspdf";
import { Producto } from "../page";

type Props = {
  productos: Producto[];
  cliente?: string;
  vendedor?: string;
};

export default function VentaResumen({
  productos,
  cliente = "Cliente mostrador",
  vendedor = "Usuario actual",
}: Props) {

  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const generarTicket = () => {
    if (productos.length === 0) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 260],
    });

    let y = 8;
    const folio = Math.floor(Math.random() * 900000 + 100000);

    const continuar = () => {

      // ===== ENCABEZADO =====
      // doc.setFont("helvetica", "bold");
      // doc.setFontSize(13);
      // doc.text("STELLA JOYERÍA", 40, y, { align: "center" });
      y += 5;

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

      // ===== INFO VENTA =====
      doc.setFontSize(8);
      doc.text(`Folio: ${folio}`, 8, y);
      doc.text(new Date().toLocaleString(), 72, y, { align: "right" });
      y += 4;

      doc.text(`Cliente: ${cliente}`, 8, y);
      y += 4;

      doc.text(`Vendedor: ${vendedor}`, 8, y);
      y += 6;

      doc.line(8, y, 72, y);
      y += 5;

      // ===== TABLA =====
      doc.setFont("helvetica", "bold");
      doc.text("Producto", 8, y);
      doc.text("Total", 72, y, { align: "right" });
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.line(8, y, 72, y);
      y += 5;

      // ===== PRODUCTOS =====
      productos.forEach((p) => {
        const subtotal = p.precio * p.cantidad;

        doc.text(
          `${p.cantidad} x ${p.nombre.substring(0, 18)}`,
          8,
          y
        );

        doc.text(
          `$${subtotal.toLocaleString()}`,
          72,
          y,
          { align: "right" }
        );

        y += 5;
      });

      doc.line(8, y, 72, y);
      y += 6;

      // ===== TOTALES =====
      const subtotalCalc = total / 1.16;
      const iva = total - subtotalCalc;

      doc.text("Subtotal:", 8, y);
      doc.text(`$${subtotalCalc.toFixed(2)}`, 72, y, {
        align: "right",
      });
      y += 4;

      doc.text("IVA (16%):", 8, y);
      doc.text(`$${iva.toFixed(2)}`, 72, y, {
        align: "right",
      });
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TOTAL:", 8, y);
      doc.text(`$${total.toLocaleString()}`, 72, y, {
        align: "right",
      });

      y += 8;

      // ===== METODO DE PAGO =====
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Método de pago: Efectivo", 8, y);
      y += 6;

      doc.line(8, y, 72, y);
      y += 6;

      // ===== MENSAJE FINAL =====
      doc.text("Gracias por su compra", 40, y, {
        align: "center",
      });
      y += 4;

      doc.text("Conserve este ticket", 40, y, {
        align: "center",
      });

      doc.save(`ticket-${folio}.pdf`);
    };

    // ===== LOGO =====
    const img = new Image();
    img.src = "/logo.png";

    img.onload = () => {
      doc.addImage(img, "PNG", 28, y, 36, 50);
      y += 50;
      continuar();
    };

    img.onerror = continuar;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 flex flex-col sm:flex-row justify-between items-center gap-6">

      <div>
        <p className="text-sm text-[#708090]">Total</p>
        <p className="text-3xl font-semibold text-[#B76E79]">
          ${total.toLocaleString()}
        </p>
      </div>

      <button
        onClick={generarTicket}
        disabled={productos.length === 0}
        className="
          bg-[#B76E79]
          text-white
          px-8 py-4
          rounded-full
          font-medium
          disabled:opacity-50
        "
      >
        Confirmar Venta
      </button>

    </div>
  );
}