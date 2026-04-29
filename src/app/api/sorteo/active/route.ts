import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SorteoService } from "@lib/services/SorteoService";

export const dynamic = 'force-dynamic';

// Usar cliente público para que cualquier visitante vea el sorteo
function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getPublicClient();
    const service = new SorteoService(supabase);
    
    // Obtenemos el sorteo activo
    const { data: sorteo, error } = await service.obtenerSorteoActivo();

    if (error) {
      console.error("Error en sorteo activo:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ sorteo });
  } catch (error) {
    console.error("Internal Server Error en sorteo:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
