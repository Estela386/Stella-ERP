/**
 * Modelo de Venta
 * Representa la estructura de datos de una venta en la base de datos
 */
export interface IVenta {
  id: number;
  total: number;
  fecha: string; // timestamp
  id_usuario: string; // usuario.id
  estado: "aprobada" | "denegada" | "pendiente" | "cancelada";
  id_pedido?: number | null; // pedidos.id (opcional)
  created_at?: string;
}

/**
 * DTO para crear una nueva venta
 */
export type CreateVentaDTO = Omit<IVenta, "id" | "created_at">;

/**
 * DTO para actualizar una venta
 */
export type UpdateVentaDTO = Partial<Omit<IVenta, "id" | "created_at">>;

/**
 * Clase Venta
 * Encapsula la lógica de negocio de una venta
 */
export class Venta implements IVenta {
  id: number;
  total: number;
  fecha: string;
  id_usuario: string;
  estado: "aprobada" | "denegada" | "pendiente" | "cancelada";
  id_pedido?: number | null;
  created_at?: string;

  constructor(data: IVenta) {
    this.id = data.id;
    this.total = data.total;
    this.fecha = data.fecha;
    this.id_usuario = data.id_usuario;
    this.estado = data.estado;
    this.id_pedido = data.id_pedido;
    this.created_at = data.created_at;
  }

  /**
   * Valida que los datos de la venta sean válidos
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.total < 0) {
      errors.push("El total no puede ser negativo");
    }

    if (!this.fecha) {
      errors.push("La fecha es requerida");
    }

    if (!this.id_usuario) {
      errors.push("El usuario es requerido");
    }

    if (!this.estado) {
      errors.push("El estado es requerido");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
