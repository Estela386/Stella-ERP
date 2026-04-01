/**
 * Modelo de DetalleVenta
 * Representa cada uno de los productos en una venta
 */
export interface IDetalleVenta {
  id: number;
  cantidad: number;
  id_producto: number; // productos.id
  descuento_aplicado?: number | null; // descuentos.id (opcional)
  id_venta?: number; // venta.id (para referencia)
  precio_unitario?: number; // Precio del producto en el momento de la venta
  subtotal?: number; // cantidad * precio_unitario
  id_consignacion_detalle?: number; // Link to a consignment detail if applicable
}

/**
 * DTO para crear un nuevo detalle de venta
 */
export type CreateDetalleVentaDTO = Omit<IDetalleVenta, "id" | "subtotal">;

/**
 * DTO para actualizar un detalle de venta
 */
export type UpdateDetalleVentaDTO = Partial<Omit<IDetalleVenta, "id">>;

/**
 * Clase DetalleVenta
 * Encapsula la lógica de negocio de un detalle de venta
 */
export class DetalleVenta implements IDetalleVenta {
  id: number;
  cantidad: number;
  id_producto: number;
  descuento_aplicado?: number | null;
  id_venta?: number;
  precio_unitario?: number;
  subtotal?: number;
  id_consignacion_detalle?: number;

  constructor(data: IDetalleVenta) {
    this.id = data.id;
    this.cantidad = data.cantidad;
    this.id_producto = data.id_producto;
    this.descuento_aplicado = data.descuento_aplicado;
    this.id_venta = data.id_venta;
    this.precio_unitario = data.precio_unitario;
    this.subtotal = data.subtotal;
    this.id_consignacion_detalle = data.id_consignacion_detalle;
  }

  /**
   * Calcula el subtotal del detalle
   */
  calcularSubtotal(): number {
    if (!this.precio_unitario) return 0;
    return this.cantidad * this.precio_unitario;
  }

  /**
   * Valida que los datos del detalle sean válidos
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.cantidad <= 0) {
      errors.push("La cantidad debe ser mayor a 0");
    }

    if (!this.id_producto) {
      errors.push("El producto es requerido");
    }

    if (this.precio_unitario && this.precio_unitario < 0) {
      errors.push("El precio unitario no puede ser negativo");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
