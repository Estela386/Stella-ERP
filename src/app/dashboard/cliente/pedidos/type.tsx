import { ReactNode } from "react";

export type OrderStatus = "pendiente" | "enviado" | "pagado" | "cancelado";

export interface OrderItem {
  id: number;
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  imagen_url?: string;
}

export interface Order {
  id: number;
  fecha: string;
  total: number;
  estado: OrderStatus;
  items: OrderItem[];
  direccion_envio?: string;
  metodo_pago?: string;
  numero_guia?: string;
}

export interface OrdersStats {
  totalPedidos: number;
  pedidosEnviados: number;
  puntosAcumulados: number;
}
