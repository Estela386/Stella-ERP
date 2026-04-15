import { createClient } from "@/utils/supabase/server";
import { VentaService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

interface ConfirmarVentaRequest {
  idUsuario: string;
  clienteId: number;
  telefonoExpress?: string;
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
    let { idUsuario, clienteId, telefonoExpress, productos, fecha, totalConIva, montoPagado } = body;

    const supabase = await createClient();

    // --- LÓGICA DE CLIENTE INTELIGENTE ---
    if (clienteId === -2 || clienteId === -1) {
      if (clienteId === -2) {
        // Público General
        const { data: publicoData } = await supabase.from('cliente').select('id').ilike('nombre', 'Público General').limit(1).single();
        if (publicoData) {
          clienteId = publicoData.id;
        } else {
          const { data: newPublico, error: errPub } = await supabase.from('cliente').insert({ nombre: 'Público General', telefono: 'Sin Registro' }).select('id').single();
          if (errPub) throw new Error("Error creando Público General: " + errPub.message);
          clienteId = newPublico.id;
        }
      } else if (clienteId === -1 && telefonoExpress) {
        // Venta por Teléfono
        const { data: expressData } = await supabase.from('cliente').select('id').eq('telefono', telefonoExpress).limit(1).single();
        if (expressData && expressData.id) {
          clienteId = expressData.id;
        } else {
          const { data: newExpress, error: errExp } = await supabase.from('cliente').insert({ nombre: `Cliente ${telefonoExpress}`, telefono: telefonoExpress }).select('id').single();
          if (errExp) throw new Error("Error creando cliente por teléfono: " + errExp.message);
          clienteId = newExpress.id;
        }
      }
    }

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
        { error: error || "Error al crear la venta desde el servicio", details: error },
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
  } catch (err: any) {
    console.error("Error creating venta:", err);
    return NextResponse.json(
      { error: err.message || "Error al procesar la solicitud", details: err.stack },
      { status: 500 }
    );
  }
}
