import { NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { SorteoService } from "@lib/services/SorteoService";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_sorteo, nombre, correo, telefono, preferencia } = body;

    if (!id_sorteo || !nombre || !correo) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const supabase = await createClient();
    const service = new SorteoService(supabase);

    // Intentar obtener la IP del cliente
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const { data, error, alreadyExists } = await service.participar({
      id_sorteo,
      nombre,
      correo,
      telefono,
      preferencia,
      ip
    });

    if (error) {
      if (alreadyExists) {
        return NextResponse.json({ error, alreadyExists: true }, { status: 409 });
      }
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
