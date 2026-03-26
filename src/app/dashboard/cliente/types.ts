/**
 * Tipos compartidos para el dashboard de cliente
 */

export interface ProductoCard {
  id: number;
  name: string;
  price: number;
  costo?: number;
  costo_mayorista?: number;
  descripcion?: string;
  image?: string;
  category?: string;
  rating?: number;
  es_personalizable?: boolean;
  materiales?: string[];
  stock_actual?: number;
  stock_min?: number;
}
