/**
 * Modelos de Fidelización — Stella ERP
 * Alineados con el esquema real de la BD aplicado
 */

// ─── Niveles ──────────────────────────────────────────────

export interface IUserLevel {
  id: number;
  name: string;           // "Cliente", "Preferente", "Mayorista", "Consignación"
  min_points: number;     // Puntos vitalicios mínimos para este nivel
  discount_percent: number;
  priority: number;       // Orden (mayor = mejor nivel)
  created_at?: string;
}

// Nivel calculado en runtime (no está en BD)
export type NivelNombre = "Cliente" | "Cliente Preferente" | "Mayorista" | "Mayorista Consignación";

// ─── Puntos de Fidelización ───────────────────────────────

export interface ILoyaltyPoints {
  id: number;
  id_usuario: number;
  points: number;           // Puntos canjeables actuales
  lifetime_points: number;  // Puntos totales acumulados (para calcular nivel)
  updated_at?: string;
}

// Vista enriquecida (calculada en backend)
export interface ILoyaltySummary {
  id_usuario: number;
  nombre_usuario?: string;
  correo_usuario?: string;
  points: number;
  lifetime_points: number;
  nivel: IUserLevel | null;
  proximo_nivel: IUserLevel | null;
  progreso_nivel_pct: number;       // 0-100
  puntos_para_proximo: number;
  score: number;                    // 0-100 calculado en runtime
  updated_at?: string;
}

// ─── Transacciones de Puntos ──────────────────────────────

export type TransactionType = "earn" | "redeem" | "expire" | "bonus";

export interface ILoyaltyTransaction {
  id: number;
  id_usuario: number;
  points: number;
  type: TransactionType;
  description?: string;
  reference_id?: number;
  created_at?: string;
}

// ─── Historial de Score ───────────────────────────────────

export interface IScoreHistory {
  id: number;
  id_usuario: number;
  score: number;
  reason?: string;
  created_at?: string;
}

// ─── DTOs ─────────────────────────────────────────────────

export interface AcumularPuntosDTO {
  id_usuario: number;
  monto: number;
  id_venta: number;
}

export interface CanjearPuntosDTO {
  id_usuario: number;
  puntos: number;
  descripcion?: string;
}

export interface NivelProgreso {
  nivel_actual: IUserLevel | null;
  proximo_nivel: IUserLevel | null;
  progreso_pct: number;
  puntos_actuales: number;
  puntos_necesarios: number;
}
