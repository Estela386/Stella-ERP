/**
 * Modelo de Pedido
 * Representa la estructura de datos de un pedido en la base de datos
 */

export type EstadoPedido = "PENDIENTE" | "EN_PRODUCCION" | "EN_TALLER" | "ENTREGADO";

export interface IDetallePedido {
  id?: number;
  id_pedido?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
  producto?: {
    id: number;
    nombre: string;
    url_imagen?: string;
  };
}

export interface IPedido {
  id: number;
  fecha_pedido: string;
  fecha_entrega?: string | null;
  origen?: string | null;
  estado: EstadoPedido;
  total_estimado: number;
  observaciones?: string | null;
  id_usuario: number; // El mayorista o admin que crea el pedido
  created_at?: string;
  detalles?: IDetallePedido[];
  usuario?: {
    id: number;
    nombre: string;
    correo: string;
    id_rol?: number;
  };
}

/**
 * DTO para crear un nuevo pedido
 */
export interface CreatePedidoDTO {
  id_usuario: number;
  total_estimado: number;
  observaciones?: string;
  estado?: EstadoPedido;
  detalles: Array<{
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
}

/**
 * Clase Pedido
 */
export class Pedido implements IPedido {
  id: number;
  fecha_pedido: string;
  fecha_entrega?: string | null;
  origen?: string | null;
  estado: EstadoPedido;
  total_estimado: number;
  observaciones?: string | null;
  id_usuario: number;
  created_at?: string;
  detalles?: IDetallePedido[];

  constructor(data: IPedido) {
    this.id = data.id;
    this.fecha_pedido = data.fecha_pedido;
    this.fecha_entrega = data.fecha_entrega;
    this.origen = data.origen;
    this.estado = data.estado;
    this.total_estimado = data.total_estimado;
    this.observaciones = data.observaciones;
    this.id_usuario = data.id_usuario;
    this.created_at = data.created_at;
    this.detalles = data.detalles;
  }
}
