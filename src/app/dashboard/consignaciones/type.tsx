export interface Cliente {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export interface HistorialProducto {
  id: number;
  fecha: string;
  tipo: "CONSIGNACION" | "DEVOLUCION" | "VENTA";
}

export interface Consignacion {
  id: number;
  cliente: Cliente;
  producto: Producto;
  cantidad: number;
  precio_consignado: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: "ACTIVA" | "VENCIDA";
}

export type Rol = "admin" | "mayorista";

export interface Usuario {
  id: number;
  nombre: string;
  rol: Rol;
}
