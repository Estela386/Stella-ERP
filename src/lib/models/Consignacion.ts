/**
 * Modelos de Consignación
 * Alineados con las tablas: consignacion, solicitud_mayorista, movimientos_producto
 */

/* ─── Consignacion ──────────────────────────────────────────── */

export type EstadoConsignacion = "activa" | "finalizada" | "cancelada";

export interface IConsignacionDetalle {
  id: number;
  id_consignacion: number;
  id_producto: number;
  cantidad: number;
  cantidad_vendida?: number;
  cantidad_devuelta?: number;
  precio_mayorista: number;
  precio_venta: number;
  // joins opcionales
  producto?: { id: number; nombre: string; precio: number; stock_actual: number; url_imagen?: string } | null;
}

export interface IConsignacion {
  id: number;
  id_mayorista: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoConsignacion;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
  creado_por?: number | null;
  // joins opcionales
  mayorista?: { id: number; nombre: string; correo: string } | null;
  detalles?: IConsignacionDetalle[];
}

export interface ConsignacionProductoDTO {
  id_producto: number;
  cantidad: number;
}

export type CreateConsignacionDTO = Omit<
  IConsignacion,
  "id" | "created_at" | "updated_at" | "mayorista" | "detalles" | "estado"
> & {
  productos: ConsignacionProductoDTO[];
};

export type UpdateConsignacionDTO = Partial<
  Omit<IConsignacion, "id" | "created_at" | "mayorista" | "detalles">
>;

/* ─── SolicitudMayorista ────────────────────────────────────── */

export type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";

export interface ISolicitudMayorista {
  id: number;
  id_usuario: number;
  mensaje?: string | null;
  estado: EstadoSolicitud;
  fecha_solicitud?: string;
  fecha_respuesta?: string | null;
  revisado_por?: number | null;
  // joins
  usuario?: { id: number; nombre: string; correo: string; id_rol: number } | null;
  revisor?: { id: number; nombre: string } | null;
}

export type CreateSolicitudDTO = {
  id_usuario: number;
  mensaje?: string;
};

export type UpdateSolicitudDTO = {
  estado: EstadoSolicitud;
  revisado_por?: number;
  fecha_respuesta?: string;
};

/* ─── MovimientoProducto ────────────────────────────────────── */

export type TipoMovimiento = "entrada" | "salida";

export interface IMovimientoProducto {
  id: number;
  id_producto: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo?: string | null;
  referencia_id?: number | null;
  fecha?: string;
  creado_por?: number | null;
}

export type CreateMovimientoDTO = Omit<IMovimientoProducto, "id" | "fecha">;

/* ─── UsuarioMayorista (vista simplificada) ─────────────────── */

export interface IUsuarioMayorista {
  id: number;
  nombre: string;
  correo: string;
  id_rol: number;
  activo: boolean;
  es_mayorista?: boolean;
  consignaciones_activas?: number;
}
