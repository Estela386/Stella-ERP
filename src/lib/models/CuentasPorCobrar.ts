/**
 * Modelo de CuentasPorCobrar
 * Representa los registros de pagos pendientes de clientes
 */
export interface ICuentasPorCobrar {
  id: number;
  id_cliente: number;
  fecha_registro: string; // timestamp
  concepto: string | null;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: string; // ej: "pendiente", "pagada", "parcial"
  id_venta: number | null;
  created_at?: string;
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
export class CuentasPorCobrar implements ICuentasPorCobrar {
  id: number;
  id_cliente: number;
  fecha_registro: string;
  concepto: string | null;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: string;
  id_venta: number | null;
  created_at?: string;

  constructor(data: ICuentasPorCobrar) {
    this.id = data.id;
    this.id_cliente = data.id_cliente;
    this.fecha_registro = data.fecha_registro;
    this.concepto = data.concepto;
    this.monto_inicial = data.monto_inicial;
    this.monto_pagado = data.monto_pagado;
    this.monto_pendiente = data.monto_pendiente;
    this.estado = data.estado;
    this.id_venta = data.id_venta;
    this.created_at = data.created_at;
  }

  /**
   * Calcula el porcentaje pagado
   */
  calcularPorcentajePagado(): number {
    if (this.monto_inicial === 0) return 0;
    return (this.monto_pagado / this.monto_inicial) * 100;
  }

  /**
   * Verifica si está completamente pagada
   */
  estaPagada(): boolean {
    return this.monto_pendiente === 0;
  }

  /**
   * Verifica si está parcialmente pagada
   */
  estaParcialmentePagada(): boolean {
    return this.monto_pagado > 0 && this.monto_pendiente > 0;
  }

  /**
   * Valida que los datos sean válidos
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.id_cliente || this.id_cliente <= 0) {
      errors.push("ID de cliente requerido");
    }

    if (this.monto_inicial < 0) {
      errors.push("Monto inicial no puede ser negativo");
    }

    if (this.monto_pagado < 0) {
      errors.push("Monto pagado no puede ser negativo");
    }

    if (this.monto_pagado > this.monto_inicial) {
      errors.push("Monto pagado no puede ser mayor al monto inicial");
    }

    if (this.monto_pendiente < 0) {
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
      id: this.id,
      id_cliente: this.id_cliente,
      fecha_registro: this.fecha_registro,
      concepto: this.concepto,
      monto_inicial: this.monto_inicial,
      monto_pagado: this.monto_pagado,
      monto_pendiente: this.monto_pendiente,
      estado: this.estado,
      id_venta: this.id_venta,
      created_at: this.created_at,
    };
  }
}
