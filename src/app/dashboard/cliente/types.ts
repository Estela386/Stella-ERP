/**
 * Tipos compartidos para el dashboard de cliente
 */

export interface ProductoCard {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}
