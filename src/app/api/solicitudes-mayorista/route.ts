import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { SolicitudMayoristaService } from "@lib/services/SolicitudMayoristaService";
import { CreateSolicitudDTO } from "@lib/models";

export async function GET() {
  try {
    const supabase = await createClient();
    const service = new SolicitudMayoristaService(supabase);
    const { solicitudes, error } = await service.listarTodas();

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: solicitudes });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateSolicitudDTO = await req.json();

    if (!body.id_usuario) {
      return NextResponse.json({ error: "id_usuario requerido" }, { status: 400 });
    }

    const service = new SolicitudMayoristaService(supabase);
    const { solicitud, error } = await service.crear(body);

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: solicitud }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
