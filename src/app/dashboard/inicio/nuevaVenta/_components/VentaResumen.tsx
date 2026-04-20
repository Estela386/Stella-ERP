"use client";

import jsPDF from "jspdf";
import { Producto } from "../page";
import { useState } from "react";
import { toast } from "sonner";

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
  esVentaMayorista?: boolean;
  onConfirmed?: () => void;
  emailTicket?: string;
};

export default function VentaResumen({
  productos,
  cliente,
  vendedor = "Usuario actual",
  idUsuario = "",
  fecha = new Date().toISOString().split("T")[0],
  esVentaMayorista = false,
  onConfirmed,
  emailTicket = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [montoPagado, setMontoPagado] = useState<string>("");

  const subtotalBase = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );
  const descuentoGlobal = esVentaMayorista ? subtotalBase * 0.25 : 0;
  const subtotalNeto = subtotalBase - descuentoGlobal;
  const iva = subtotalNeto * 0.16;
  const total = subtotalNeto + iva;

  const esVentaRapida = !cliente || cliente.id === -1 || cliente.id === -2;

  const generarTicketYConfirmar = async () => {
    if (productos.length === 0) return;

    // Validar monto a pagar
    const montoAlPagar = esVentaRapida
      ? total
      : montoPagado
        ? parseFloat(montoPagado)
        : 0;
    if (!esVentaRapida) {
      if (montoAlPagar < 0) {
        setError("El monto a pagar no puede ser negativo");
        return;
      }
      if (montoAlPagar > total) {
        setError(
          `El monto a pagar no puede ser mayor al total ($${total.toFixed(2)})`
        );
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Confirmar venta en BD
      const ventaData = {
        idUsuario,
        clienteId: cliente?.id ?? -2,
        telefonoExpress: cliente?.id === -1 ? cliente.telefono : undefined,
        productos: productos.map(p => ({
          id_producto: p.id,
          cantidad: p.cantidad,
          descuento_aplicado: null,
          personalizacion: p.opciones ? { opciones: p.opciones } : null,
          id_consignacion_detalle: p.id_consignacion_detalle ?? null,
        })),
        fecha,
        totalConIva: total,
        descuentoAplicado: descuentoGlobal,
        montoPagado: montoAlPagar,
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
        throw new Error(
          result.error || result.details || "Error al confirmar la venta"
        );
      }

      const ventaId = result.ventaId;
      const folio = ventaId || Math.floor(Math.random() * 900000 + 100000);

      // 🔥 2. ENVÍO DE CORREO POR RESEND (NUEVO BLOQUE)
      if (emailTicket && emailTicket.includes("@")) {
        try {
          const resendResponse = await fetch("/api/emails/enviar-ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailTicket,
              folio: folio,
              cliente: cliente?.nombre || "Mostrador",
              total: total,
              productos: productos.map(p => ({
                nombre: p.nombre,
                cantidad: p.cantidad,
                precio: p.precio,
              })),
            }),
          });

          if (!resendResponse.ok) {
            console.error("Error al enviar el correo con Resend");
            toast.error(
              "Venta guardada, pero hubo un error enviando el correo."
            );
          } else {
            toast.success(`Ticket enviado exitosamente a ${emailTicket}`);
          }
        } catch (emailErr) {
          console.error("Excepción enviando correo:", emailErr);
        }
      }

      // 3. Generar PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 260],
      });

      let y = 8;

      const continuar = () => {
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
        doc.text(`$${subtotalBase.toFixed(2)}`, 72, y, {
          align: "right",
        });
        y += 4;

        if (esVentaMayorista && descuentoGlobal > 0) {
          doc.setFont("helvetica", "normal");
          doc.text("Desc. May (25%):", 8, y);
          doc.text(`-$${descuentoGlobal.toFixed(2)}`, 72, y, {
            align: "right",
          });
          y += 4;
        }

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

        // SECCIÓN DE PAGOS
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.line(8, y, 72, y);
        y += 4;

        doc.setFont("helvetica", "bold");
        doc.text("PAGO REALIZADO", 40, y, { align: "center" });
        y += 5;

        doc.setFont("helvetica", "normal");
        // Asegurarse de usar montoAlPagar real
        const deudaPendiente = total - montoAlPagar;

        doc.text("Monto Pagado:", 8, y);
        doc.text(`$${montoAlPagar.toFixed(2)}`, 72, y, { align: "right" });
        y += 4;

        doc.text("Deuda Pendiente:", 8, y);
        doc.text(`$${deudaPendiente.toFixed(2)}`, 72, y, { align: "right" });
        y += 6;

        doc.line(8, y, 72, y);
        y += 6;

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
        doc.addImage(img, "PNG", 22, y, 36, 50);
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
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 flex flex-col gap-6">
      {/* Info de total con desglose */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-[#8C9796]">Subtotal</p>
          <p className="text-lg font-semibold text-[#708090]">
            ${subtotalBase.toFixed(2)}
          </p>
        </div>

        {esVentaMayorista && (
          <div>
            <p className="text-sm text-[#8C9796]">Desc. Mayorista</p>
            <p className="text-lg font-semibold text-[#10B981]">
              -${descuentoGlobal.toFixed(2)}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-[#8C9796]">IVA (16%)</p>
          <p className="text-lg font-semibold text-[#708090]">
            ${iva.toFixed(2)}
          </p>
        </div>
        <div className="border-t-2 sm:border-t-0 border-[#8C9796]/20 pt-3 sm:pt-0">
          <p className="text-sm text-[#708090]">Total</p>
          <p className="text-3xl font-semibold text-[#B76E79]">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Input de monto a pagar */}
      <div className="border-t-2 border-[#8C9796]/20 pt-4">
        <label className="block text-sm font-medium text-[#708090] mb-2">
          Monto a Pagar {esVentaRapida ? "(Exhibición única)" : "(Opcional)"}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-[#708090] font-semibold">
            $
          </span>
          <input
            type="number"
            value={esVentaRapida ? total.toFixed(2) : montoPagado}
            disabled={esVentaRapida}
            onChange={e => {
              if (esVentaRapida) return;
              const value = e.target.value;
              const numValue = value ? parseFloat(value) : 0;
              if (numValue <= total || value === "") {
                setMontoPagado(value);
              }
            }}
            placeholder={total.toFixed(2)}
            max={total}
            min="0"
            step="0.01"
            className={`w-full pl-8 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              esVentaRapida
                ? "border-[#EAE7E1] bg-[#F6F4EF] text-[#8C9796] cursor-not-allowed font-semibold"
                : "border-[#8C9796]/30 bg-white text-[#708090] focusing:border-[#B76E79] cursor-pointer"
            }`}
          />
        </div>
        {montoPagado && parseFloat(montoPagado) > 0 && (
          <p className="text-sm text-[#8C9796] mt-2">
            Saldo pendiente: ${(total - parseFloat(montoPagado)).toFixed(2)}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="w-full">
          <p className="text-sm text-red-600 font-medium text-center">
            {error}
          </p>
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
          cursor-pointer
          transition
          w-full sm:w-auto
        "
      >
        {loading ? "Confirmando..." : "Confirmar Venta"}
      </button>
    </div>
  );
}
