import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { ConsignacionService } from "@lib/services/ConsignacionService";
import { UpdateConsignacionDTO } from "@lib/models";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body: UpdateConsignacionDTO = await req.json();

    const service = new ConsignacionService(supabase);
    const { consignacion, error } = await service.actualizar(parseInt(id), body);

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: consignacion });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await req.json().catch(() => ({}));

    const service = new ConsignacionService(supabase);
    const { success, error } = await service.cancelar(
      parseInt(id),
      supabase,
      body?.admin_id
    );

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await req.json().catch(() => ({}));

    // El único uso del PATCH en consignaciones es para reactivar
    if (body.action === "reactivar") {
      const service = new ConsignacionService(supabase);
      const { success, error } = await service.reactivar(
        parseInt(id),
        supabase,
        body?.admin_id
      );

      if (error) return NextResponse.json({ error }, { status: 400 });
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
