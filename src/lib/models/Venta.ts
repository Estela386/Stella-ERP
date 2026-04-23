/**
 * Modelo de Venta
 * Representa la estructura de datos de una venta en la base de datos
 */
export interface IVenta {
  id: number;
  total: number | null;
  fecha: Date | string | null;
  id_usuario: number | string | null; // usuario.id
  estado: "aprobada" | "denegada" | "pendiente" | "cancelada";
  id_pedido?: number | null; // pedidos.id (opcional)
  created_at?: string;
  detalles?: IDetalleVenta[]; // Relación con detallesventas
  usuario?: { nombre: string | null; [key: string]: any } | null; // Relación con usuario
  metodo_pago?: string | null;
}

import { IDetalleVenta } from "./DetalleVenta";

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
  id_usuario: string | number | null;
  estado: "aprobada" | "denegada" | "pendiente" | "cancelada";
  id_pedido?: number | null;
  created_at?: string;
  detalles?: IDetalleVenta[];
  usuario?: { nombre: string | null; [key: string]: any } | null;
  metodo_pago?: string | null;

  constructor(data: IVenta) {
    this.id = data.id;
    this.total = data.total ?? 0;
    this.fecha =
      data.fecha instanceof Date
        ? data.fecha.toISOString()
        : (data.fecha ?? "");
    this.id_usuario = data.id_usuario;
    this.estado = data.estado;
    this.id_pedido = data.id_pedido;
    this.created_at = data.created_at;
    this.usuario = data.usuario;
    this.metodo_pago = data.metodo_pago;
  }
  toJSON(): IVenta {
    return {
      id: this.id,
      total: this.total,
      fecha: this.fecha,
      id_usuario: this.id_usuario,
      estado: this.estado,
      detalles: this.detalles,
      usuario: this.usuario,
      metodo_pago: this.metodo_pago,
    };
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
