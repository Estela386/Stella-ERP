import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getDisponibilidadRuleta,
  ejecutarGiro,
  getHistorialGiros,
  getRewardsActivos,
  getMetricasRuleta,
  upsertReward,
  agregarTokensRuleta,
} from "@/lib/services/RuletaService";
import { calcularScoreRuntime, getLoyaltyPoints } from "@/lib/services/FidelizacionService";
import type { CreateRuletaRewardDTO } from "@/lib/models/RuletaSpin";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUsuarioInfo(req: NextRequest): Promise<{ id: number; rol: number } | null> {
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

// GET: disponibilidad, historial, premios, métricas admin
export async function GET(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const vista = searchParams.get("vista") ?? "disponibilidad";

  if (vista === "disponibilidad") {
    const disponibilidad = await getDisponibilidadRuleta(usuario.id);
    return NextResponse.json({ disponibilidad });
  }

  if (vista === "historial") {
    const historial = await getHistorialGiros(usuario.id);
    return NextResponse.json({ historial });
  }

  if (vista === "rewards") {
    const rewards = await getRewardsActivos();
    return NextResponse.json({ rewards });
  }

  if (vista === "metricas" && usuario.rol === 1) {
    const metricas = await getMetricasRuleta();
    return NextResponse.json({ metricas });
  }

  return NextResponse.json({ error: "Vista no válida" }, { status: 400 });
}

// POST: girar ruleta o acciones admin
export async function POST(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { accion } = body as { accion: string };

  // ── Girar ruleta (usa tokens del contador) ───────────────
  if (accion === "girar") {
    // Obtener score actual del usuario para ajustar probabilidades
    const lp = await getLoyaltyPoints(usuario.id);
    const score = calcularScoreRuntime(lp?.lifetime_points ?? 0);

    const resultado = await ejecutarGiro(usuario.id, score);

    if (resultado.error) {
      return NextResponse.json({ error: resultado.error }, { status: 400 });
    }
    return NextResponse.json({ resultado });
  }

  // ── ADMIN: Agregar tokens manualmente ────────────────────
  if (accion === "agregar_tokens" && usuario.rol === 1) {
    const { id_usuario_target, cantidad } = body as { id_usuario_target: number; cantidad: number };
    const ok = await agregarTokensRuleta(id_usuario_target, cantidad ?? 1);
    return NextResponse.json({ exito: ok });
  }

  // ── ADMIN: Crear/actualizar premio ───────────────────────
  if (accion === "upsert_reward" && usuario.rol === 1) {
    const { reward } = body as { reward: CreateRuletaRewardDTO & { id?: number } };
    const nuevo = await upsertReward(reward);
    if (!nuevo) return NextResponse.json({ error: "Error al guardar premio" }, { status: 500 });
    return NextResponse.json({ reward: nuevo });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
