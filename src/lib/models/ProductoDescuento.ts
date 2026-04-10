/**
 * Modelos de Inventario Inteligente — Stella ERP
 * Alineados con el esquema real aplicado en BD
 */

// ─── Reglas de inventario ─────────────────────────────────
// BD: inventory_rules (id, days_without_sale, discount_percent, active)

export interface IInventoryRule {
  id: number;
  days_without_sale: number;
  discount_percent: number;
  active: boolean;
}

export type CreateInventoryRuleDTO = Omit<IInventoryRule, "id">;

// ─── Descuento de producto ────────────────────────────────
// BD: product_discounts (id, id_producto, discount_percent, reason, active, created_at)

export interface IProductoDescuento {
  id: number;
  id_producto: number;
  discount_percent: number;
  reason?: string;
  active: boolean;
  created_at?: string;
  // join
  producto?: {
    id: number;
    nombre: string | null;
    precio: number;
    stock_actual: number | null;
    url_imagen: string | null;
    id_categoria: number | null;
    costo: number | null;
  };
}

// ─── Historial de ventas por producto ────────────────────
// BD: product_sales_history (id, id_producto, cantidad_vendida, monto_venta, id_venta, created_at)

export interface IProductoSalesHistory {
  id: number;
  id_producto: number;
  cantidad_vendida: number;
  monto_venta?: number;
  id_venta?: number;
  created_at?: string;
}

// ─── Análisis de rotación (calculado en runtime) ─────────

export interface ProductoRotacionAnalisis {
  id_producto: number;
  nombre: string | null;
  precio: number;
  precio_con_descuento: number;
  porcentaje_descuento: number;
  stock_actual: number | null;
  dias_sin_venta: number;
  ultima_venta?: string;
  url_imagen?: string | null;
  id_categoria?: number | null;
  razon_oferta: string;
}

export interface ResultadoDescuentosAuto {
  procesados: number;
  aplicados: number;
  sin_cambios: number;
}
