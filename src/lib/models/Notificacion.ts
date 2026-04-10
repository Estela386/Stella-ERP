// =========================================
// 🔔 MODELO: NOTIFICACION
// =========================================

export type TipoNotificacion =
  | "stock_bajo_producto"
  | "stock_bajo_insumo"
  | "pedido_nuevo"
  | "pedido_estado"
  | "consignacion_nueva"
  | "insight_ia"
  | "venta_alerta";

export interface INotificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  referencia_id: number | null;
  leida: boolean;
  id_usuario: number | null;
  created_at: string;
}

export interface UpdateNotificacionDTO {
  leida?: boolean;
}
