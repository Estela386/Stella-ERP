"use client";

import jsPDF from "jspdf";
import { Producto } from "../page";

type Props = {
  productos: Producto[];
};

export default function VentaResumen({ productos }: Props) {
  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const generarTicket = () => {
  if (productos.length === 0) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 220],
  });

  let y = 8;

  const continuarGeneracion = () => {
    // ===== NOMBRE TIENDA =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("STELLA JOYERÍA", 40, y, { align: "center" });
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(new Date().toLocaleString(), 40, y, {
      align: "center",
    });
    y += 6;

    doc.line(8, y, 72, y);
    y += 6;

    // ===== PRODUCTOS =====
    doc.setFontSize(9);

    productos.forEach((p) => {
      const subtotal = p.precio * p.cantidad;

      doc.setFont("helvetica", "bold");
      doc.text(p.nombre.substring(0, 24), 8, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.text(
        `${p.cantidad} x $${p.precio.toLocaleString()}`,
        8,
        y
      );

      doc.text(
        `$${subtotal.toLocaleString()}`,
        72,
        y,
        { align: "right" }
      );

      y += 6;
    });

    doc.line(8, y, 72, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text("TOTAL", 8, y);
    doc.text(
      `$${total.toLocaleString()}`,
      72,
      y,
      { align: "right" }
    );

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Gracias por su compra", 40, y, {
      align: "center",
    });

    doc.save("ticket-venta.pdf");
  };

  // ===== Intentar cargar imagen =====
  const img = new Image();
  img.src = "/logo.png";

  img.onload = () => {
    doc.addImage(img, "PNG", 22, y, 36, 18);
    y += 22;
    continuarGeneracion();
  };

  img.onerror = () => {
    console.warn("No se pudo cargar el logo, generando ticket sin imagen.");
    continuarGeneracion();
  };
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
