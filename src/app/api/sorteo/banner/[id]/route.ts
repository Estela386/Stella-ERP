import { NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { SorteoService } from "@lib/services/SorteoService";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Verificar si es admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { data: usuario } = await supabase
      .from("usuario")
      .select("id_rol")
      .eq("correo", user.email)
      .single();
      
    if (usuario?.id_rol !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = new SorteoService(supabase);
    const { data: sorteo, error } = await service.obtenerPorBanner(Number(id));

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ sorteo });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
