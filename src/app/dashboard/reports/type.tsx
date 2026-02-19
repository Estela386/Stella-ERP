export interface Venta {
  id: number
  total: number
  fecha: string
  id_usuario: number
}

export interface ProductoVendido {
  nombre: string
  unidades: number
  total: number
}

export interface Vendedor {
  nombre: string
  ventas: number
  total: number
}

export interface Producto {
  id: number;
  nombre: string;
  total: string;
  precio: string;
  costo: string;
  stock_actual: number;
  stock_min: number;
  categoria: string;
  url_imagen?: string;
}