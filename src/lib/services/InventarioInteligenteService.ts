/**
 * InventarioInteligenteService — Stella ERP
 * Usa exactamente las columnas reales de la BD:
 *   inventory_rules     → days_without_sale, discount_percent, active
 *   product_discounts   → id_producto, discount_percent, reason, active, created_at
 *   product_sales_history → id_producto, cantidad_vendida, monto_venta, id_venta, created_at
 *
 * Reglas: 30 días → 10%, 60 días → 20%, 120 días → 35%
 * No bajar del margen mínimo (calculado en runtime con 'costo').
 */

import { createClient } from "@supabase/supabase-js";
import type {
  IInventoryRule,
  IProductoDescuento,
  ProductoRotacionAnalisis,
  ResultadoDescuentosAuto,
  CreateInventoryRuleDTO,
} from "@/lib/models/ProductoDescuento";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

const MARGEN_MINIMO_DEFAULT = 15; // % — no bajar de este margen sobre el costo

// ─── Obtener reglas configuradas ─────────────────────────

export async function getInventoryRules(): Promise<IInventoryRule[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("inventory_rules")
    .select("*")
    .order("days_without_sale");

  return (data ?? []) as IInventoryRule[];
}

// ─── Ejecutar análisis y aplicar descuentos automáticos ──

export async function ejecutarDescuentosAuto(): Promise<ResultadoDescuentosAuto> {
  const supabase = getSupabase();

  // 1. Obtener reglas activas (ordenadas de más días a menos)
  const rules = (await getInventoryRules()).filter((r) => r.active);
  if (!rules.length) return { procesados: 0, aplicados: 0, sin_cambios: 0 };

  // 2. Obtener productos con stock disponible
  const { data: productos } = await supabase
    .from("producto")
    .select("id, nombre, precio, costo, stock_actual, id_categoria, created_at")
    .gt("stock_actual", 0);

  if (!productos?.length) return { procesados: 0, aplicados: 0, sin_cambios: 0 };

  let aplicados = 0;
  let sin_cambios = 0;
  const hoy = new Date();

  for (const prod of productos) {
    // Ignorar productos nuevos (< 30 días)
    const creado = new Date(prod.created_at ?? hoy);
    const diasDesdeCreacion = Math.floor((hoy.getTime() - creado.getTime()) / (1000 * 60 * 60 * 24));
    if (diasDesdeCreacion < 30) { sin_cambios++; continue; }

    // Obtener última venta
    const { data: lastSale } = await supabase
      .from("product_sales_history")
      .select("created_at")
      .eq("id_producto", prod.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const ultimaVenta = lastSale?.created_at ? new Date(lastSale.created_at) : creado;
    const diasSinVenta = Math.floor((hoy.getTime() - ultimaVenta.getTime()) / (1000 * 60 * 60 * 24));

    // Buscar regla aplicable (mayor días sin venta que cumple)
    const reglaAplicable = [...rules]
      .sort((a, b) => b.days_without_sale - a.days_without_sale)
      .find((r) => diasSinVenta >= r.days_without_sale);

    if (!reglaAplicable) {
      // Sin regla → eliminar descuento si existía
      await supabase
        .from("product_discounts")
        .update({ active: false })
        .eq("id_producto", prod.id)
        .eq("active", true);
      sin_cambios++;
      continue;
    }

    // Validar margen mínimo
    const costo = prod.costo ?? 0;
    const precioMinimo = costo > 0 ? costo * (1 + MARGEN_MINIMO_DEFAULT / 100) : 0;
    const precioConDescuento = prod.precio * (1 - reglaAplicable.discount_percent / 100);

    if (precioConDescuento < precioMinimo && precioMinimo > 0) {
      // El descuento rompería el margen — no aplicar
      sin_cambios++;
      continue;
    }

    // Upsert en product_discounts
    const reason = `Baja rotación: ${diasSinVenta} días sin venta (regla ${reglaAplicable.days_without_sale}d)`;

    const { data: existente } = await supabase
      .from("product_discounts")
      .select("id")
      .eq("id_producto", prod.id)
      .single();

    if (existente) {
      await supabase
        .from("product_discounts")
        .update({ discount_percent: reglaAplicable.discount_percent, reason, active: true })
        .eq("id_producto", prod.id);
    } else {
      await supabase
        .from("product_discounts")
        .insert({ id_producto: prod.id, discount_percent: reglaAplicable.discount_percent, reason, active: true });
    }

    aplicados++;
  }

  return { procesados: productos.length, aplicados, sin_cambios };
}

// ─── Obtener productos con descuento activo ───────────────

export async function getProductosEnOferta(): Promise<ProductoRotacionAnalisis[]> {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("product_discounts")
    .select(`
      id_producto,
      discount_percent,
      reason,
      created_at,
      producto:producto(id, nombre, precio, costo, stock_actual, url_imagen, id_categoria)
    `)
    .eq("active", true)
    .limit(50);

  if (!data) return [];

  return (data as any[]).map((d: any) => {
    const prod = Array.isArray(d.producto) ? d.producto[0] : d.producto;
    if (!prod) return null;

    const precio_con_descuento = prod.precio * (1 - d.discount_percent / 100);
    const diasMatch = d.reason?.match(/(\d+) días sin venta/);
    const dias_sin_venta = diasMatch ? parseInt(diasMatch[1]) : 0;

    return {
      id_producto: d.id_producto,
      nombre: prod.nombre,
      precio: prod.precio,
      precio_con_descuento: Math.round(precio_con_descuento * 100) / 100,
      porcentaje_descuento: d.discount_percent,
      stock_actual: prod.stock_actual,
      dias_sin_venta,
      ultima_venta: d.created_at,
      url_imagen: prod.url_imagen,
      id_categoria: prod.id_categoria,
      razon_oferta: `🔥 ${dias_sin_venta || "30"}+ días sin venta`,
    } as ProductoRotacionAnalisis;
  }).filter(Boolean) as ProductoRotacionAnalisis[];
}

// ─── Obtener descuento activo de un producto ──────────────

export async function getDescuentoProducto(
  id_producto: number
): Promise<IProductoDescuento | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("product_discounts")
    .select("*, producto:producto(id, nombre, precio, costo, stock_actual, url_imagen, id_categoria)")
    .eq("id_producto", id_producto)
    .eq("active", true)
    .single();

  return (data as IProductoDescuento) ?? null;
}

// ─── ADMIN: Crear/actualizar regla ────────────────────────

export async function upsertInventoryRule(
  rule: CreateInventoryRuleDTO & { id?: number }
): Promise<IInventoryRule | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inventory_rules")
    .upsert(rule)
    .select()
    .single();

  if (error) return null;
  return data as IInventoryRule;
}

// ─── ADMIN: Alternar regla activa ─────────────────────────

export async function toggleInventoryRule(id: number, active: boolean): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("inventory_rules")
    .update({ active })
    .eq("id", id);
  return !error;
}

// ─── Reporte general ─────────────────────────────────────

export async function getReporteRotacion(): Promise<{
  total_en_oferta: number;
  valor_stock_en_oferta: number;
  distribucion: { rango: string; cantidad: number }[];
}> {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("product_discounts")
    .select("discount_percent, producto:producto(precio, stock_actual)")
    .eq("active", true);

  if (!data || !data.length) {
    return { total_en_oferta: 0, valor_stock_en_oferta: 0, distribucion: [] };
  }

  const valorStock = (data as any[]).reduce((acc: number, d: any) => {
    const prod = Array.isArray(d.producto) ? d.producto[0] : d.producto;
    return acc + (prod?.precio ?? 0) * (prod?.stock_actual ?? 0);
  }, 0);

  const dist = [
    { rango: "10% OFF (30 días)",  cantidad: (data as any[]).filter((d: any) => d.discount_percent <= 10).length },
    { rango: "20% OFF (60 días)",  cantidad: (data as any[]).filter((d: any) => d.discount_percent > 10 && d.discount_percent <= 20).length },
    { rango: "35% OFF (120 días)", cantidad: (data as any[]).filter((d: any) => d.discount_percent > 20).length },
  ];

  return {
    total_en_oferta: data.length,
    valor_stock_en_oferta: Math.round(valorStock),
    distribucion: dist,
  };
}
