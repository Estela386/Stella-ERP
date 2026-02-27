"use client";

import jsPDF from "jspdf";
import { Producto } from "../page";
import { useState } from "react";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

type Props = {
  productos: Producto[];
  cliente?: Cliente | null;
  vendedor?: string;
  idUsuario?: string;
  fecha?: string;
  onConfirmed?: () => void;
};

export default function VentaResumen({
  productos,
  cliente,
  vendedor = "Usuario actual",
  idUsuario = "",
  fecha = new Date().toISOString().split("T")[0],
  onConfirmed,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const generarTicketYConfirmar = async () => {
    if (productos.length === 0) return;
    if (!cliente) {
      setError("Selecciona un cliente");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Confirmar venta en BD
      const ventaData = {
        idUsuario,
        clienteId: cliente.id,
        productos: productos.map(p => ({
          id_producto: p.id,
          cantidad: p.cantidad,
          descuento_aplicado: null,
        })),
        fecha,
        totalConIva: total,
      };

      const response = await fetch("/api/ventas/confirmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al confirmar la venta");
      }

      const ventaId = result.ventaId;

      // 2. Generar PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 260],
      });

      let y = 8;
      const folio = ventaId || Math.floor(Math.random() * 900000 + 100000);

      const continuar = () => {
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

        // INFO VENTA
        doc.setFontSize(8);
        doc.text(`Folio: ${folio}`, 8, y);
        doc.text(new Date().toLocaleString(), 72, y, { align: "right" });
        y += 4;

        doc.text(`Cliente: ${cliente?.nombre || "Mostrador"}`, 8, y);
        y += 4;

        doc.text(`Vendedor: ${vendedor}`, 8, y);
        y += 6;

        doc.line(8, y, 72, y);
        y += 5;

        // TABLA HEADER
        doc.setFont("helvetica", "bold");
        doc.text("Producto", 8, y);
        doc.text("Total", 72, y, { align: "right" });
        y += 4;

        doc.setFont("helvetica", "normal");
        doc.line(8, y, 72, y);
        y += 5;

        // PRODUCTOS
        productos.forEach(p => {
          const subtotal = p.precio * p.cantidad;

          doc.text(`${p.cantidad} x ${p.nombre.substring(0, 18)}`, 8, y);

          doc.text(`$${subtotal.toLocaleString()}`, 72, y, { align: "right" });

          y += 5;
        });

        doc.line(8, y, 72, y);
        y += 6;

        // TOTALES
        doc.text("Subtotal:", 8, y);
        doc.text(`$${subtotal.toFixed(2)}`, 72, y, {
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
        doc.text(`$${total.toFixed(2)}`, 72, y, {
          align: "right",
        });

        y += 8;

        // METODO DE PAGO
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Método de pago: Efectivo", 8, y);
        y += 6;

        doc.line(8, y, 72, y);
        y += 6;

        // MENSAJE FINAL
        doc.text("Gracias por su compra", 40, y, {
          align: "center",
        });
        y += 4;

        doc.text("Conserve este ticket", 40, y, {
          align: "center",
        });

        doc.save(`ticket-${folio}.pdf`);

        // Venta confirmada
        if (onConfirmed) {
          onConfirmed();
        }
      };

      // LOGO
      const img = new Image();
      img.src = "/logo.png";

      img.onload = () => {
        doc.addImage(img, "PNG", 28, y, 36, 50);
        y += 50;
        continuar();
      };

      img.onerror = continuar;
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al confirmar la venta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 flex flex-col sm:flex-row justify-between items-center gap-6">
      {/* Info de total con desglose */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-[#8C9796]">Subtotal</p>
          <p className="text-lg font-semibold text-[#708090]">
            ${subtotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-[#8C9796]">IVA (16%)</p>
          <p className="text-lg font-semibold text-[#708090]">
            ${iva.toFixed(2)}
          </p>
        </div>
        <div className="border-t-2 border-[#8C9796]/20 pt-3">
          <p className="text-sm text-[#708090]">Total</p>
          <p className="text-3xl font-semibold text-[#B76E79]">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full text-center">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Botón confirmar */}
      <button
        onClick={generarTicketYConfirmar}
        disabled={productos.length === 0 || loading}
        className="
          bg-[#B76E79]
          text-white
          px-8 py-4
          rounded-full
          font-medium
          disabled:opacity-50
          disabled:cursor-not-allowed
          hover:bg-[#A0626B]
          transition
        "
      >
        {loading ? "Confirmando..." : "Confirmar Venta"}
      </button>
    </div>
  );
}
