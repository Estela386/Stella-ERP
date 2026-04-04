// Archivo de tipos alineado con la base de datos real

export type PedidoEstado =
  | "PENDIENTE"
  | "EN_PRODUCCION"
  | "EN_TALLER"
  | "ENTREGADO";

export type Pedido = {
  id: number;
  fecha_pedido: string;
  fecha_entrega?: string | null;
  origen?: string | null;
  estado: PedidoEstado;
  total_estimado: number;
  observaciones?: string | null;
  id_usuario: number;
  usuario?: {
    id: number;
    nombre: string;
    id_rol?: number;
  };
  detalles?: DetallePedido[];
};

export type DetallePedido = {
  id: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  personalizacion?: Record<string, string | number | boolean>;
  producto?: {
    id: number;
    nombre: string;
    url_imagen?: string;
  };
};