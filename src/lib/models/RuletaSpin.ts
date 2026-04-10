/**
 * Modelos de Ruleta — Stella ERP
 * Alineados con el esquema real aplicado en BD
 */

import type { RewardType } from "./Promocion";

export type TipoRuleta = "diaria" | "compra" | "nivel";

// ─── Premio de ruleta ──────────────────────────────────────
// BD: roulette_rewards (id, name, type, value, probability)

export interface IRuletaReward {
  id: number;
  name: string;
  type: RewardType;         // 'discount' | 'product' | 'points'
  value: number;            // Puntos, %descuento, o id_producto
  probability: number;      // 0-100 (porcentaje base)
}

export type CreateRuletaRewardDTO = Omit<IRuletaReward, "id">;

// ─── Giro de ruleta ───────────────────────────────────────
// BD: roulette_spins (id, id_usuario, reward_id, created_at)

export interface IRuletaSpin {
  id: number;
  id_usuario: number;
  reward_id: number;
  created_at?: string;
  // join
  reward?: IRuletaReward;
}

// ─── Tokens de ruleta ────────────────────────────────────
// BD: ruleta_tokens (id, id_usuario UNIQUE, tokens INT, updated_at)
// Un fila por usuario — "tokens" es un contador de giros disponibles

export interface IRuletaToken {
  id: number;
  id_usuario: number;
  tokens: number;         // Cantidad de giros disponibles
  updated_at?: string;
}

// ─── Resultado de un giro ─────────────────────────────────

export interface ResultadoGiro {
  reward: IRuletaReward;
  descripcion: string;     // Texto amigable del premio
  emoji: string;
  color: string;
  error?: string;
}

// ─── Disponibilidad de ruleta ─────────────────────────────

export interface DisponibilidadRuleta {
  tokens_disponibles: number;
  puede_girar: boolean;
}
