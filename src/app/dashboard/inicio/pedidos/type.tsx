export type PedidoEstado =
  | "PENDIENTE"
  | "EN_PRODUCCION"
  | "EN_TALLER"
  | "ENTREGADO";

export type Prioridad = "Alta" | "Media" | "Baja";

export type Pedido = {
  id: string;
  cliente: string;
  tipo: string;
  descripcion: string;
  entrega: string;
  estado: PedidoEstado;
  prioridad: Prioridad;

  productos: ProductoPedido[];
};

export type ProductoPedido = {
  codigo: string;
  nombre: string;
  cantidad: number;
};