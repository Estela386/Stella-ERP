/**
 * PromocionService — Stella ERP
 * Usa exactamente las columnas reales de la BD:
 *   promotions      → name, type, value, min_purchase, start_date, end_date, active
 *   promo_codes     → code, id_promotion, usage_limit, used_count, expires_at
 *   user_promo_codes → id_usuario, id_promo_code, used_at
 *
 * Reglas de stacking: máximo 40% de descuento combinado
 */

import { createClient } from "@supabase/supabase-js";
import type {
  IPromocion,
  IPromoCode,
  IUserPromoCode,
  CreatePromocionDTO,
  CreatePromoCodeDTO,
  ValidacionCodigo,
} from "@/lib/models/Promocion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

// ─── Validar código promocional ───────────────────────────

export async function validarCodigo(
  code: string,
  id_usuario: number,
  monto_compra: number = 0,
  descuento_ya_aplicado: number = 0  // % ya aplicado (regla stacking)
): Promise<ValidacionCodigo> {
  const supabase = getSupabase();

  // 1. Buscar código
  const { data: codeData, error: codeErr } = await supabase
    .from("promo_codes")
    .select("*, promotion:promotions(*)")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (codeErr || !codeData) {
    return { valido: false, error: "Código no encontrado" };
  }

  const c = codeData as IPromoCode & { promotion: IPromocion };

  // 2. Verificar expiración
  if (c.expires_at && new Date(c.expires_at) < new Date()) {
    return { valido: false, error: "Código expirado" };
  }

  // 3. Verificar límite de usos globales
  if (c.usage_limit != null && c.used_count >= c.usage_limit) {
    return { valido: false, error: "Código agotado" };
  }

  // 4. Verificar que el usuario no lo haya usado antes
  const { data: usoExistente } = await supabase
    .from("user_promo_codes")
    .select("id")
    .eq("id_usuario", id_usuario)
    .eq("id_promo_code", c.id)
    .single();

  if (usoExistente) {
    return { valido: false, error: "Ya usaste este código" };
  }

  // 5. Verificar promoción activa
  const promo = c.promotion;
  if (!promo || !promo.active) {
    return { valido: false, error: "Promoción inactiva" };
  }

  // 6. Verificar fechas de la promoción
  if (promo.start_date && new Date(promo.start_date) > new Date()) {
    return { valido: false, error: "Promoción aún no disponible" };
  }
  if (promo.end_date && new Date(promo.end_date) < new Date()) {
    return { valido: false, error: "Promoción expirada" };
  }

  // 7. Verificar compra mínima
  if (monto_compra < (promo.min_purchase ?? 0)) {
    return {
      valido: false,
      error: `Compra mínima requerida: $${promo.min_purchase?.toLocaleString()}`,
    };
  }

  // 8. Regla de stacking (máx 40% combinado)
  let valorFinal = promo.value;
  if (promo.type === "percentage") {
    const totalCombinado = descuento_ya_aplicado + promo.value;
    if (totalCombinado > 40) {
      valorFinal = Math.max(40 - descuento_ya_aplicado, 0);
      if (valorFinal <= 0) {
        return {
          valido: false,
          error: "Ya tienes el descuento máximo aplicado (40%)",
        };
      }
    }
  }

  return {
    valido: true,
    tipo: promo.type,
    valor: valorFinal,
    nombre: promo.name,
    promo_code_id: c.id,
  };
}

// ─── Registrar uso de código ──────────────────────────────

export async function registrarUsoCodigo(
  id_promo_code: number,
  id_usuario: number
): Promise<boolean> {
  const supabase = getSupabase();

  const [insertRes, updateRes] = await Promise.all([
    // Registrar en user_promo_codes
    supabase.from("user_promo_codes").insert({
      id_usuario,
      id_promo_code,
      used_at: new Date().toISOString(),
    }),
    (async () => {
      const { error } = await supabase.rpc("increment_promo_code_usage", { p_code_id: id_promo_code });
      if (error) {
        const { data } = await supabase
          .from("promo_codes")
          .select("used_count")
          .eq("id", id_promo_code)
          .single();
        await supabase
          .from("promo_codes")
          .update({ used_count: (data?.used_count ?? 0) + 1 })
          .eq("id", id_promo_code);
      }
    })()
  ]);

  return !insertRes.error;
}

// ─── Códigos disponibles del usuario (no usados) ─────────

export async function getCodigosUsuario(id_usuario: number): Promise<IUserPromoCode[]> {
  const supabase = getSupabase();

  // Obtener IDs de códigos ya usados por el usuario
  const { data: usados } = await supabase
    .from("user_promo_codes")
    .select("id_promo_code")
    .eq("id_usuario", id_usuario);

  const idsUsados = (usados ?? []).map((u: { id_promo_code: number }) => u.id_promo_code);

  // Obtener códigos asignados al usuario que aún no usó
  // Por ahora retornamos los códigos de ruleta ganados (origen futuro)
  // En esta versión simplificada, se retorna desde user_promo_codes
  const { data } = await supabase
    .from("user_promo_codes")
    .select("*, promo_code:promo_codes(*, promotion:promotions(*))")
    .eq("id_usuario", id_usuario)
    .order("used_at", { ascending: false })
    .limit(20);

  return (data ?? []) as IUserPromoCode[];
}

// ─── ADMIN: Todas las promociones ────────────────────────

export async function getPromociones(): Promise<IPromocion[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("promotions")
    .select("*")
    .order("id", { ascending: false });

  return (data ?? []) as IPromocion[];
}

// ─── ADMIN: Crear promoción ───────────────────────────────

export async function createPromocion(dto: CreatePromocionDTO): Promise<IPromocion | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("promotions")
    .insert(dto)
    .select()
    .single();

  if (error) return null;
  return data as IPromocion;
}

// ─── ADMIN: Crear código promo ────────────────────────────

export async function createPromoCode(dto: CreatePromoCodeDTO): Promise<IPromoCode | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("promo_codes")
    .insert({ ...dto, code: dto.code.toUpperCase().trim(), used_count: 0 })
    .select()
    .single();

  if (error) return null;
  return data as IPromoCode;
}

// ─── ADMIN: Métricas ──────────────────────────────────────

export async function getMetricasCodigos(): Promise<{
  codigos_activos: number;
  usos_mes: number;
  top_codigos: { code: string; used_count: number }[];
}> {
  const supabase = getSupabase();
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [codigosRes, usosMesRes, topRes] = await Promise.all([
    supabase.from("promo_codes").select("id", { count: "exact" }),
    supabase
      .from("user_promo_codes")
      .select("id", { count: "exact" })
      .gte("used_at", inicioMes.toISOString()),
    supabase
      .from("promo_codes")
      .select("code, used_count")
      .order("used_count", { ascending: false })
      .limit(5),
  ]);

  return {
    codigos_activos: codigosRes.count ?? 0,
    usos_mes: usosMesRes.count ?? 0,
    top_codigos: (topRes.data ?? []).map((c: { code: string; used_count: number }) => ({
      code: c.code,
      used_count: c.used_count,
    })),
  };
}
