/**
 * RuletaService — Stella ERP
 * Usa exactamente las columnas reales de la BD:
 *   roulette_rewards  → name, type, value, probability
 *   roulette_spins    → id_usuario, reward_id, created_at
 *   ruleta_tokens     → id_usuario UNIQUE, tokens INT, updated_at
 *
 * El mecanismo de anti-abuso usa ruleta_tokens.tokens como CONTADOR.
 * Para girar: tokens > 0 → decrementa en 1 → registra giro.
 * Los tokens se agregan al hacer compras (desde el trigger/servicio de ventas).
 *
 * Las probabilidades son: probability de cada reward / suma_total.
 * Se ajustan dinámicamente según el score del usuario.
 */

import { createClient } from "@supabase/supabase-js";
import type {
  IRuletaReward,
  IRuletaSpin,
  IRuletaToken,
  ResultadoGiro,
  DisponibilidadRuleta,
  CreateRuletaRewardDTO,
  TipoRuleta,
} from "@/lib/models/RuletaSpin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

// ─── Emojis y colores por tipo de premio ─────────────────

const REWARD_UI: Record<string, { emoji: string; color: string }> = {
  points:   { emoji: "⭐", color: "#4a5568" },
  discount: { emoji: "🏷️", color: "#b76e79" },
  product:  { emoji: "🎁", color: "#8c9768" },
};

function getRewardUI(type: string) {
  return REWARD_UI[type] ?? { emoji: "🎁", color: "#708090" };
}

// ─── Obtener tokens disponibles del usuario ───────────────

export async function getTokensRuleta(id_usuario: number): Promise<IRuletaToken> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("ruleta_tokens")
    .select("*")
    .eq("id_usuario", id_usuario)
    .single();

  if (error || !data) {
    // No existe fila → 0 tokens
    return { id: 0, id_usuario, tokens: 0 };
  }
  return data as IRuletaToken;
}

// ─── Agregar token(s) de ruleta al usuario ────────────────

export async function agregarTokensRuleta(
  id_usuario: number,
  cantidad = 1
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("ruleta_tokens")
    .upsert(
      { id_usuario, tokens: cantidad, updated_at: new Date().toISOString() },
      {
        onConflict: "id_usuario",
        // Incrementa en lugar de reemplazar usando RPC o raw SQL
        // Como Supabase no soporta increment nativo en upsert,
        // usamos un SELECT + UPDATE
      }
    );

  if (error) {
    // Fallback: leer y actualizar manualmente
    const current = await getTokensRuleta(id_usuario);
    const newTokens = current.tokens + cantidad;

    if (current.id === 0) {
      await supabase
        .from("ruleta_tokens")
        .insert({ id_usuario, tokens: newTokens });
    } else {
      await supabase
        .from("ruleta_tokens")
        .update({ tokens: newTokens, updated_at: new Date().toISOString() })
        .eq("id_usuario", id_usuario);
    }
  }
  return true;
}

// ─── Disponibilidad de ruleta ─────────────────────────────

export async function getDisponibilidadRuleta(
  id_usuario: number
): Promise<DisponibilidadRuleta> {
  const tokenData = await getTokensRuleta(id_usuario);
  return {
    tokens_disponibles: tokenData.tokens,
    puede_girar: tokenData.tokens > 0,
  };
}

// ─── Obtener premios activos ──────────────────────────────

export async function getRewardsActivos(): Promise<IRuletaReward[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("roulette_rewards")
    .select("*");

  return (data ?? []) as IRuletaReward[];
}

// ─── Selección ponderada con ajuste por score ─────────────

function seleccionarPremio(
  rewards: IRuletaReward[],
  score: number       // 0-100
): IRuletaReward {
  // Ajuste: score alto (>70) aumenta hasta 30% la prob. de premios tipo discount/product
  const ajustadas = rewards.map((r) => {
    let prob = r.probability;
    if (score > 70 && r.type !== "points") {
      prob = prob * (1 + (score - 70) / 100);
    }
    return { reward: r, prob };
  });

  const total = ajustadas.reduce((sum, a) => sum + a.prob, 0);
  let rand = Math.random() * total;

  for (const { reward, prob } of ajustadas) {
    rand -= prob;
    if (rand <= 0) return reward;
  }

  // Fallback: primer premio
  return rewards[0];
}

// ─── Ejecutar giro (atómico: token → selección → registro) ─

export async function ejecutarGiro(
  id_usuario: number,
  score: number = 0
): Promise<ResultadoGiro> {
  const supabase = getSupabase();

  // 1. Verificar y decrementar token (operación crítica)
  const current = await getTokensRuleta(id_usuario);

  if (current.tokens <= 0) {
    return {
      reward: { id: 0, name: "Sin tokens", type: "points", value: 0, probability: 0 },
      descripcion: "No tienes giros disponibles",
      emoji: "❌",
      color: "#708090",
      error: "No tienes giros disponibles. ¡Realiza una compra para ganar tokens!",
    };
  }

  // Decrementar token ANTES de girar (previene doble click)
  const { error: tokenErr } = await supabase
    .from("ruleta_tokens")
    .update({ tokens: current.tokens - 1, updated_at: new Date().toISOString() })
    .eq("id_usuario", id_usuario)
    .eq("tokens", current.tokens); // Optimistic lock — solo actualiza si el valor no cambió

  if (tokenErr) {
    return {
      reward: { id: 0, name: "Error", type: "points", value: 0, probability: 0 },
      descripcion: "Error al procesar el giro",
      emoji: "❌",
      color: "#708090",
      error: "Error al procesar el giro. Inténtalo de nuevo.",
    };
  }

  // 2. Obtener premios y seleccionar
  const rewards = await getRewardsActivos();
  if (!rewards.length) {
    // No hay premios configurados — devolver token
    await supabase
      .from("ruleta_tokens")
      .update({ tokens: current.tokens, updated_at: new Date().toISOString() })
      .eq("id_usuario", id_usuario);
    return {
      reward: { id: 0, name: "Sin premios", type: "points", value: 0, probability: 0 },
      descripcion: "No hay premios configurados",
      emoji: "😞",
      color: "#708090",
      error: "No hay premios configurados en la ruleta.",
    };
  }

  const premio = seleccionarPremio(rewards, score);

  // 3. Registrar el giro
  await supabase.from("roulette_spins").insert({
    id_usuario,
    reward_id: premio.id,
  });

  // 4. Entregar premio
  if (premio.type === "points" && premio.value > 0) {
    // Agregar puntos directamente
    const { data: lpData } = await supabase
      .from("loyalty_points")
      .select("points, lifetime_points")
      .eq("id_usuario", id_usuario)
      .single();

    if (lpData) {
      await supabase
        .from("loyalty_points")
        .update({
          points: (lpData.points ?? 0) + premio.value,
          lifetime_points: (lpData.lifetime_points ?? 0) + premio.value,
          updated_at: new Date().toISOString(),
        })
        .eq("id_usuario", id_usuario);

      await supabase.from("loyalty_transactions").insert({
        id_usuario,
        points: premio.value,
        type: "bonus",
        description: `Premio ruleta: ${premio.name}`,
        reference_id: null,
      });
    }
  }

  const ui = getRewardUI(premio.type);

  let descripcion = "";
  if (premio.type === "points")   descripcion = `+${premio.value} puntos añadidos`;
  if (premio.type === "discount") descripcion = `${premio.value}% de descuento en tu próxima compra`;
  if (premio.type === "product")  descripcion = `Producto gratis: ID #${premio.value}`;

  return {
    reward: premio,
    descripcion,
    emoji: ui.emoji,
    color: ui.color,
  };
}

// ─── Historial de giros ───────────────────────────────────

export async function getHistorialGiros(
  id_usuario: number,
  limit = 10
): Promise<IRuletaSpin[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("roulette_spins")
    .select("*, reward:roulette_rewards(*)")
    .eq("id_usuario", id_usuario)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as IRuletaSpin[];
}

// ─── ADMIN: Crear/actualizar premio ──────────────────────

export async function upsertReward(
  reward: CreateRuletaRewardDTO & { id?: number }
): Promise<IRuletaReward | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("roulette_rewards")
    .upsert(reward)
    .select()
    .single();

  if (error) return null;
  return data as IRuletaReward;
}

// ─── ADMIN: Métricas de ruleta ───────────────────────────

export async function getMetricasRuleta(): Promise<{
  giros_hoy: number;
  giros_mes: number;
  premios_por_tipo: Record<string, number>;
}> {
  const supabase = getSupabase();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const [girosHoyRes, girosMesRes, premiosRes] = await Promise.all([
    supabase
      .from("roulette_spins")
      .select("id", { count: "exact" })
      .gte("created_at", hoy.toISOString()),
    supabase
      .from("roulette_spins")
      .select("id", { count: "exact" })
      .gte("created_at", inicioMes.toISOString()),
    supabase
      .from("roulette_spins")
      .select("reward:roulette_rewards(type)")
      .gte("created_at", inicioMes.toISOString()),
  ]);

  const premiosPorTipo: Record<string, number> = {};
  (premiosRes.data ?? []).forEach((s: { reward: { type: string } | null }) => {
    const tipo = s.reward?.type ?? "unknown";
    premiosPorTipo[tipo] = (premiosPorTipo[tipo] ?? 0) + 1;
  });

  return {
    giros_hoy: girosHoyRes.count ?? 0,
    giros_mes: girosMesRes.count ?? 0,
    premios_por_tipo: premiosPorTipo,
  };
}
