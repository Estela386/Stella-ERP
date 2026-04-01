import { createClient } from "@/utils/supabase/server";
import { VentaService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

interface ConfirmarVentaRequest {
  idUsuario: string;
  clienteId: number;
  productos: Array<{
    id_producto: number;
    cantidad: number;
    descuento_aplicado?: number | null;
    personalizacion?: Record<number, any> | null;
    id_consignacion_detalle?: number;
  }>;
  fecha: string;
  totalConIva?: number;
  montoPagado?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ConfirmarVentaRequest;
    const { idUsuario, clienteId, productos, fecha, totalConIva, montoPagado } =
      body;

    // Validaciones
    if (!idUsuario || !clienteId || !productos || !fecha) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (productos.length === 0) {
      return NextResponse.json(
        { error: "La venta debe tener al menos un producto" },
        { status: 400 }
      );
    }

    // Crear venta
    const supabase = await createClient();
    const ventaService = new VentaService(supabase);

    const { venta, ventaId, error } = await ventaService.crear(
      clienteId,
      idUsuario,
      productos,
      fecha,
      totalConIva,
      montoPagado || 0
    );

    if (error || !venta) {
      return NextResponse.json(
        { error: error || "Error al crear la venta" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      venta: {
        id: venta.id,
        total: venta.total,
        fecha: venta.fecha,
        estado: venta.estado,
      },
      ventaId,
      success: true,
    });
  } catch (err) {
    console.error("Error creating venta:", err);
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
