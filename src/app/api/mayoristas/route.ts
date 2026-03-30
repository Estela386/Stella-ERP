import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { UsuarioService } from "@lib/services/UsuarioService";

export async function GET() {
  try {
    const supabase = await createClient();
    const service = new UsuarioService(supabase);
    const { mayoristas, error } = await service.listarMayoristas();

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: mayoristas });
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
    const { id_usuario } = await req.json();

    if (!id_usuario) {
      return NextResponse.json({ error: "id_usuario requerido" }, { status: 400 });
    }

    const service = new UsuarioService(supabase);
    const { usuario, error } = await service.promoverAMayorista(id_usuario);

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data: usuario }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
