import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getLoyaltySummary,
  getOrCreateLoyaltyPoints,
  getLoyaltyTransactions,
  getNivelProgreso,
  getPromocionesDinamicas,
} from "@/lib/services/FidelizacionService";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getUsuarioId(req: NextRequest): Promise<number | null> {
  const supabase = getSupabase();
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const { data } = await supabase
    .from("usuario")
    .select("id")
    .eq("id_auth", user.id)
    .single();
  return data?.id ?? null;
}

export async function GET(req: NextRequest) {
  const id_usuario = await getUsuarioId(req);
  if (!id_usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const vista = searchParams.get("vista") ?? "summary";

  try {
    if (vista === "summary") {
      await getOrCreateLoyaltyPoints(id_usuario);
      const [summary, progreso, promociones] = await Promise.all([
        getLoyaltySummary(id_usuario),
        getNivelProgreso(id_usuario),
        getPromocionesDinamicas(id_usuario),
      ]);
      return NextResponse.json({ summary, progreso, promociones });
    }

    if (vista === "transacciones") {
      const limit = parseInt(searchParams.get("limit") ?? "20");
      const transacciones = await getLoyaltyTransactions(id_usuario, limit);
      return NextResponse.json({ transacciones });
    }

    if (vista === "progreso") {
      const progreso = await getNivelProgreso(id_usuario);
      return NextResponse.json({ progreso });
    }

    return NextResponse.json({ error: "Vista no válida" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
