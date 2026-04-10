/**
 * Modelos de Promociones — Stella ERP
 * Alineados con el esquema real aplicado en BD
 */

// ─── Tipos reales de la BD ────────────────────────────────

export type PromotionType = "percentage" | "fixed" | "2x1";
export type RewardType    = "discount" | "product" | "points";

// ─── Promoción ────────────────────────────────────────────

export interface IPromocion {
  id: number;
  name: string;
  type: PromotionType;
  value: number;
  min_purchase: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

export type CreatePromocionDTO = Omit<IPromocion, "id">;

// ─── Código Promocional ───────────────────────────────────

export interface IPromoCode {
  id: number;
  code: string;
  id_promotion: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  // join
  promotion?: IPromocion;
}

export type CreatePromoCodeDTO = Omit<IPromoCode, "id" | "used_count" | "promotion">;

// ─── Código de usuario ────────────────────────────────────

export interface IUserPromoCode {
  id: number;
  id_usuario: number;
  id_promo_code: number;
  used_at?: string;
  // join
  promo_code?: IPromoCode;
}

// ─── Resultado de validación de código ───────────────────

export interface ValidacionCodigo {
  valido: boolean;
  error?: string;
  tipo?: PromotionType;
  valor?: number;
  nombre?: string;
  promo_code_id?: number;
}

// ─── Promocion dinámica (sugerencia UI) ──────────────────

export interface IPromocionDinamica {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  valor?: number;
}
