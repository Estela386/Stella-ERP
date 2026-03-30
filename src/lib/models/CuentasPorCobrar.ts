/**
 * Modelo de CuentasPorCobrar
 * Representa los registros de pagos pendientes de clientes
 */
export interface ICuentasPorCobrar {
  id: number;
  id_cliente: number;
  fecha_registro: string;
  concepto: string;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: "pagado" | "parcial" | "pendiente" | "vencido";
  id_venta?: number | null;
  cliente?: {
    id: number;
    nombre: string;
    telefono: string;
  };
}

/**
 * DTO para crear una nueva cuenta por cobrar
 */
export type CreateCuentasPorCobrarDTO = Omit<
  ICuentasPorCobrar,
  "id" | "created_at"
>;

/**
 * DTO para actualizar una cuenta por cobrar
 */
export type UpdateCuentasPorCobrarDTO = Partial<
  Omit<ICuentasPorCobrar, "id" | "created_at">
>;

/**
 * Clase CuentasPorCobrar
 * Encapsula la lógica de negocio de una cuenta por cobrar
 */
export class CuentasPorCobrar {
  constructor(public data: ICuentasPorCobrar) {}

  get porcentajePagado() {
    if (this.data.monto_inicial === 0) return 0;
    return Math.round((this.data.monto_pagado / this.data.monto_inicial) * 100);
  }
  /**
   * Calcula el porcentaje pagado
   */
  calcularPorcentajePagado(): number {
    if (this.data.monto_inicial === 0) return 0;
    return (this.data.monto_pagado / this.data.monto_inicial) * 100;
  }

  /**
   * Verifica si está completamente pagada
   */
  estaPagada(): boolean {
    return this.data.monto_pendiente === 0;
  }

  /**
   * Verifica si está parcialmente pagada
   */
  estaParcialmentePagada(): boolean {
    return this.data.monto_pagado > 0 && this.data.monto_pendiente > 0;
  }

  /**
   * Valida que los datos sean válidos
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.data.id_cliente || this.data.id_cliente <= 0) {
      errors.push("ID de cliente requerido");
    }

    if (this.data.monto_inicial < 0) {
      errors.push("Monto inicial no puede ser negativo");
    }

    if (this.data.monto_pagado < 0) {
      errors.push("Monto pagado no puede ser negativo");
    }

    if (this.data.monto_pagado > this.data.monto_inicial) {
      errors.push("Monto pagado no puede ser mayor al monto inicial");
    }

    if (this.data.monto_pendiente < 0) {
      errors.push("Monto pendiente no puede ser negativo");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convierte a JSON
   */
  toJSON(): ICuentasPorCobrar {
    return {
      id: this.data.id,
      id_cliente: this.data.id_cliente,
      fecha_registro: this.data.fecha_registro,
      concepto: this.data.concepto,
      monto_inicial: this.data.monto_inicial,
      monto_pagado: this.data.monto_pagado,
      monto_pendiente: this.data.monto_pendiente,
      estado: this.data.estado,
      id_venta: this.data.id_venta,
    };
  }
}

export interface IPago {
  id: number;
  id_cuenta: number;
  fecha_pago: string;
  monto_pago: number;
  metodo_pago: string;
  observaciones?: string;
}

export interface CreateCuentaDTO {
  id_cliente: number;
  concepto: string;
  monto_inicial: number;
  fecha_registro: string;
  estado: "pendiente";
  monto_pagado: 0;
  monto_pendiente: number;
  id_venta?: number | null;
}

export interface CreateClienteDTO {
  nombre: string;
  telefono: string;
}

export interface CreatePagoDTO {
  id_cuenta: number;
  monto_pago: number;
  metodo_pago: string;
  observaciones?: string;
  fecha_pago: string;
}
