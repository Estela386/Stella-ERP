/**
 * Archivo de índice para componentes del carrito
 * Facilita las importaciones desde otros archivos
 */

export { default as CartItem } from "./CartItem";
export { default as CartSummary } from "./CartSummary";
export { default as EmptyCart } from "./EmptyCart";
export { default as CartView } from "./CartView";

// Tipos para componentes
export type CartItemProps = {
  producto: any; // Producto type
  cantidad: number;
  onCantidadChange: (newCantidad: number) => void;
  onRemove: () => void;
};

export type CartSummaryProps = {
  subtotal: number;
  descuento?: number;
  iva: number;
  total: number;
  onCheckout: () => void;
};
