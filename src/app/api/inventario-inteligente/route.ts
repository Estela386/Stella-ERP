import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getProductosEnOferta,
  ejecutarDescuentosAuto,
  getInventoryRules,
  upsertInventoryRule,
  getReporteRotacion,
} from "@/lib/services/InventarioInteligenteService";
import type { CreateInventoryRuleDTO } from "@/lib/models/ProductoDescuento";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getUsuarioInfo(req: NextRequest): Promise<{ id: number; rol: number } | null> {
  const supabase = getSupabase();
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const { data } = await supabase
    .from("usuario")
    .select("id, id_rol")
    .eq("id_auth", user.id)
    .single();
  return data ? { id: data.id, rol: data.id_rol } : null;
}

export async function GET(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const vista = searchParams.get("vista") ?? "ofertas";

  if (vista === "ofertas") {
    const productos = await getProductosEnOferta();
    return NextResponse.json({ productos });
  }

  if (vista === "reglas" && usuario.rol === 1) {
    const reglas = await getInventoryRules();
    return NextResponse.json({ reglas });
  }

  if (vista === "reporte" && usuario.rol === 1) {
    const reporte = await getReporteRotacion();
    return NextResponse.json({ reporte });
  }

  return NextResponse.json({ error: "Vista no válida" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario || usuario.rol !== 1) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const body = await req.json();
  const { accion } = body as { accion: string };

  // Ejecutar análisis y aplicar descuentos automáticos
  if (accion === "ejecutar_descuentos") {
    const resultado = await ejecutarDescuentosAuto();
    return NextResponse.json({ resultado });
  }

  // Crear/actualizar regla de inventario
  if (accion === "upsert_regla") {
    const { regla } = body as { regla: CreateInventoryRuleDTO & { id?: number } };
    const nueva = await upsertInventoryRule(regla);
    if (!nueva) return NextResponse.json({ error: "Error al guardar regla" }, { status: 500 });
    return NextResponse.json({ regla: nueva });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
