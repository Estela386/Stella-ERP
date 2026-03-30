import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { SolicitudMayoristaService } from "@lib/services/SolicitudMayoristaService";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { accion, admin_id } = await req.json(); // accion: 'aprobar' | 'rechazar'

    if (!accion || !["aprobar", "rechazar"].includes(accion)) {
      return NextResponse.json({ error: "accion debe ser 'aprobar' o 'rechazar'" }, { status: 400 });
    }

    const service = new SolicitudMayoristaService(supabase);

    let result: { success: boolean; error: string | null };

    if (accion === "aprobar") {
      result = await service.aprobar(parseInt(id), admin_id);
    } else {
      result = await service.rechazar(parseInt(id), admin_id);
    }

    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
