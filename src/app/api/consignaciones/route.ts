import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { ConsignacionService } from "@lib/services/ConsignacionService";
import { CreateConsignacionDTO } from "@lib/models";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const idMayorista = searchParams.get("id_mayorista");

    const service = new ConsignacionService(supabase);

    if (idMayorista) {
      const { consignaciones, error } = await service.listarPorMayorista(
        parseInt(idMayorista)
      );
      if (error) return NextResponse.json({ error }, { status: 400 });
      return NextResponse.json({ data: consignaciones });
    }

    const { consignaciones, error } = await service.listarTodas();
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: consignaciones });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateConsignacionDTO = await req.json();

    if (!body.id_mayorista || !body.productos || !body.productos.length || !body.fecha_inicio || !body.fecha_fin) {
      return NextResponse.json({ error: "Faltan campos requeridos. Asegúrese de enviar productos." }, { status: 400 });
    }

    const service = new ConsignacionService(supabase);
    const { consignacion, error } = await service.crear(body, supabase);

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: consignacion }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error del servidor" },
      { status: 500 }
    );
  }
}
