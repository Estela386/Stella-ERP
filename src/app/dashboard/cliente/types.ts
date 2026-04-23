/**
 * Tipos compartidos para el dashboard de cliente
 */

import { IProductoImagen } from "../inicio/inventarios/type";

export interface OpcionPersonalizacion {
  id: number;
  nombre: string;
  tipo: string;
  valores: { valor: string }[];
}

export interface ProductoCard {
  id: number;
  name: string;
  price: number;
  costo?: number;
  costo_mayorista?: number;
  descripcion?: string;
  image?: string;
  category?: string; // nombre de categoría real
  rating?: number;
  es_personalizable?: boolean;
  materiales?: string[];
  opciones?: OpcionPersonalizacion[];
  stock_actual?: number;
  stock_min?: number;
  created_at?: string;
  images?: IProductoImagen[];
  url_filtro_tiktok?: string;
}
