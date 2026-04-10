/**
 * FidelizacionService — Stella ERP
 * Usa exactamente las columnas reales de la BD:
 *   loyalty_points    → points, lifetime_points
 *   user_levels       → name, min_points, discount_percent, priority
 *   loyalty_transactions → points, type, description, reference_id
 *   score_history     → score, reason
 *
 * La función SQL acumular_puntos_compra(p_usuario, p_monto, p_venta) ya existe.
 * El nivel se calcula en runtime comparando lifetime_points con user_levels.min_points.
 */

import { createClient } from "@supabase/supabase-js";
import type {
  ILoyaltyPoints,
  ILoyaltySummary,
  ILoyaltyTransaction,
  IScoreHistory,
  IUserLevel,
  NivelProgreso,
  AcumularPuntosDTO,
  CanjearPuntosDTO,
} from "@/lib/models/Fidelizacion";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

// ─── Niveles de usuario ───────────────────────────────────

export async function getUserLevels(): Promise<IUserLevel[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("user_levels")
    .select("*")
    .order("priority", { ascending: true }); // menor priority = nivel más bajo

  return (data ?? []) as IUserLevel[];
}

/** Calcula el nivel actual basado en lifetime_points */
function calcularNivel(lifetimePoints: number, levels: IUserLevel[]): IUserLevel | null {
  if (!levels.length) return null;
  // Ordenar desc por min_points; el primero que cumpla = nivel actual
  const sorted = [...levels].sort((a, b) => b.min_points - a.min_points);
  return sorted.find((l) => lifetimePoints >= l.min_points) ?? levels[0];
}

/** Calcula el siguiente nivel */
function calcularProximoNivel(currentLevel: IUserLevel | null, levels: IUserLevel[]): IUserLevel | null {
  if (!currentLevel) return levels[0] ?? null;
  const sorted = [...levels].sort((a, b) => a.min_points - b.min_points);
  const idx = sorted.findIndex((l) => l.id === currentLevel.id);
  return idx !== -1 && idx + 1 < sorted.length ? sorted[idx + 1] : null;
}

// ─── Perfil básico de puntos ──────────────────────────────

export async function getLoyaltyPoints(id_usuario: number): Promise<ILoyaltyPoints | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("id_usuario", id_usuario)
    .single();

  return (data as ILoyaltyPoints) ?? null;
}

/** Crea el registro de puntos si no existe */
export async function getOrCreateLoyaltyPoints(id_usuario: number): Promise<ILoyaltyPoints> {
  const supabase = getSupabase();
  const existing = await getLoyaltyPoints(id_usuario);
  if (existing) return existing;

  const { data } = await supabase
    .from("loyalty_points")
    .insert({ id_usuario, points: 0, lifetime_points: 0 })
    .select()
    .single();

  return data as ILoyaltyPoints;
}

// ─── Resumen enriquecido ──────────────────────────────────

export async function getLoyaltySummary(id_usuario: number): Promise<ILoyaltySummary | null> {
  const supabase = getSupabase();

  const [lp, userRes, levels] = await Promise.all([
    getOrCreateLoyaltyPoints(id_usuario),
    supabase.from("usuario").select("nombre, correo").eq("id", id_usuario).single(),
    getUserLevels(),
  ]);

  const nivelActual  = calcularNivel(lp.lifetime_points, levels);
  const proximoNivel = calcularProximoNivel(nivelActual, levels);

  const progresoPct = proximoNivel && nivelActual
    ? Math.min(
        Math.round(
          ((lp.lifetime_points - nivelActual.min_points) /
           Math.max(proximoNivel.min_points - nivelActual.min_points, 1)) * 100
        ),
        100
      )
    : 100;

  const puntos_para_proximo = proximoNivel
    ? Math.max(proximoNivel.min_points - lp.lifetime_points, 0)
    : 0;

  // Score calculado en runtime (0-100) basado en lifetime_points
  const score = calcularScoreRuntime(lp.lifetime_points);

  return {
    id_usuario,
    nombre_usuario: userRes.data?.nombre ?? undefined,
    correo_usuario: userRes.data?.correo ?? undefined,
    points: lp.points,
    lifetime_points: lp.lifetime_points,
    nivel: nivelActual,
    proximo_nivel: proximoNivel,
    progreso_nivel_pct: progresoPct,
    puntos_para_proximo,
    score,
    updated_at: lp.updated_at,
  };
}

/** Calcula score 0-100 basado en lifetime_points (máx de referencia: 5000 puntos) */
export function calcularScoreRuntime(lifetimePoints: number): number {
  return Math.min(Math.round((lifetimePoints / 5000) * 100), 100);
}

// ─── Acumular puntos (usa la función SQL existente) ────────
// La función BD: acumular_puntos_compra(p_usuario, p_monto, p_venta)
// Calcula: FLOOR(p_monto / 10) puntos

export async function acumularPuntosCompra(dto: AcumularPuntosDTO): Promise<{
  puntos_ganados: number;
  error?: string;
}> {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("acumular_puntos_compra", {
    p_usuario: dto.id_usuario,
    p_monto:   dto.monto,
    p_venta:   dto.id_venta,
  });

  if (error) return { puntos_ganados: 0, error: error.message };

  // Calcular cuántos puntos se ganaron (misma lógica que la función SQL)
  const puntos_ganados = Math.floor(dto.monto / 10);
  return { puntos_ganados };
}

// ─── Canjear puntos ────────────────────────────────────────

export async function canjearPuntos(dto: CanjearPuntosDTO): Promise<{
  exito: boolean;
  error?: string;
}> {
  const supabase = getSupabase();

  // Leer puntos actuales con lock implícito
  const lp = await getLoyaltyPoints(dto.id_usuario);
  if (!lp || lp.points < dto.puntos) {
    return { exito: false, error: "Puntos insuficientes" };
  }

  // Descontar puntos
  const { error: updateErr } = await supabase
    .from("loyalty_points")
    .update({ points: lp.points - dto.puntos, updated_at: new Date().toISOString() })
    .eq("id_usuario", dto.id_usuario);

  if (updateErr) return { exito: false, error: updateErr.message };

  // Registrar transacción de canje
  await supabase.from("loyalty_transactions").insert({
    id_usuario:   dto.id_usuario,
    points:       -dto.puntos,
    type:         "redeem",
    description:  dto.descripcion ?? "Canje de puntos",
    reference_id: null,
  });

  return { exito: true };
}

// ─── Registrar score ──────────────────────────────────────

export async function registrarScore(
  id_usuario: number,
  score: number,
  reason?: string
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("score_history").insert({ id_usuario, score, reason });
}

// ─── Historial de transacciones ───────────────────────────

export async function getLoyaltyTransactions(
  id_usuario: number,
  limit = 20
): Promise<ILoyaltyTransaction[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("loyalty_transactions")
    .select("*")
    .eq("id_usuario", id_usuario)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as ILoyaltyTransaction[];
}

// ─── Historial de score ───────────────────────────────────

export async function getScoreHistory(id_usuario: number): Promise<IScoreHistory[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("score_history")
    .select("*")
    .eq("id_usuario", id_usuario)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []) as IScoreHistory[];
}

// ─── Progreso de nivel ────────────────────────────────────

export async function getNivelProgreso(id_usuario: number): Promise<NivelProgreso> {
  const [lp, levels] = await Promise.all([
    getOrCreateLoyaltyPoints(id_usuario),
    getUserLevels(),
  ]);

  const nivelActual  = calcularNivel(lp.lifetime_points, levels);
  const proximoNivel = calcularProximoNivel(nivelActual, levels);

  const progreso_pct = proximoNivel && nivelActual
    ? Math.min(
        Math.round(
          ((lp.lifetime_points - nivelActual.min_points) /
           Math.max(proximoNivel.min_points - nivelActual.min_points, 1)) * 100
        ),
        100
      )
    : 100;

  return {
    nivel_actual: nivelActual,
    proximo_nivel: proximoNivel,
    progreso_pct,
    puntos_actuales: lp.lifetime_points,
    puntos_necesarios: proximoNivel
      ? Math.max(proximoNivel.min_points - lp.lifetime_points, 0)
      : 0,
  };
}

// ─── Promociones dinámicas para el usuario ────────────────

export async function getPromocionesDinamicas(id_usuario: number): Promise<
  { tipo: string; titulo: string; descripcion: string; icono: string; color: string }[]
> {
  const summary = await getLoyaltySummary(id_usuario);
  if (!summary) return [];

  const promos: { tipo: string; titulo: string; descripcion: string; icono: string; color: string }[] = [];

  // "Te faltan X puntos para subir de nivel"
  if (summary.proximo_nivel && summary.puntos_para_proximo > 0 && summary.puntos_para_proximo < 200) {
    promos.push({
      tipo: "falta_nivel",
      titulo: `¡Casi llegas a ${summary.proximo_nivel.name}!`,
      descripcion: `Te faltan solo ${summary.puntos_para_proximo} puntos (≈ $${summary.puntos_para_proximo * 10} en compras)`,
      icono: "🚀",
      color: "#b76e79",
    });
  }

  // Ruleta disponible
  promos.push({
    tipo: "giro_ruleta",
    titulo: "🎰 ¡Tienes giros disponibles!",
    descripcion: "Gira la ruleta y gana puntos, descuentos o envío gratis",
    icono: "🎰",
    color: "#4a5568",
  });

  return promos;
}
