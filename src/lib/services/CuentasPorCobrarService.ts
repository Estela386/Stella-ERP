import { CuentasPorCobrarRepository } from "@/lib/repositories/CuentasPorCobrarRepository";
import {
  CuentasPorCobrar,
  CreateCuentasPorCobrarDTO,
  UpdateCuentasPorCobrarDTO,
} from "@/lib/models/CuentasPorCobrar";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Servicio para CuentasPorCobrar
 * Contiene la lógica de negocio
 */
export class CuentasPorCobrarService {
  private repository: CuentasPorCobrarRepository;

  constructor(client: SupabaseClient) {
    this.repository = new CuentasPorCobrarRepository(client);
  }

  /**
   * Crea una nueva cuenta por cobrar
   */
  async crear(data: CreateCuentasPorCobrarDTO): Promise<CuentasPorCobrar> {
    return this.repository.crear(data);
  }

  /**
   * Crea una cuenta por cobrar para una venta
   * Este método es llamado cuando se confirma una venta
   */
  async crearParaVenta(
    idCliente: number,
    idVenta: number,
    montoTotal: number,
    montoPagado: number = 0,
    concepto: string = "Venta"
  ): Promise<CuentasPorCobrar> {
    console.log("Creando cuenta por cobrar:", {
      idCliente,
      idVenta,
      montoTotal,
      montoPagado,
      concepto,
    });

    const montoPendiente = montoTotal - montoPagado;
    const estado =
      montoPendiente === 0
        ? "pagada"
        : montoPagado > 0
          ? "parcial"
          : "pendiente";

    const data: CreateCuentasPorCobrarDTO = {
      id_cliente: idCliente,
      id_venta: idVenta,
      fecha_registro: new Date().toISOString(),
      concepto: concepto,
      monto_inicial: montoTotal,
      monto_pagado: montoPagado,
      monto_pendiente: montoPendiente,
      estado: estado,
    };

    return this.repository.crear(data);
  }

  /**
   * Obtiene todas las cuentas de un cliente
   */
  async obtenerPorCliente(idCliente: number): Promise<CuentasPorCobrar[]> {
    return this.repository.obtenerPorCliente(idCliente);
  }

  /**
   * Obtiene todas las cuentas de una venta
   */
  async obtenerPorVenta(idVenta: number): Promise<CuentasPorCobrar[]> {
    return this.repository.obtenerPorVenta(idVenta);
  }

  /**
   * Obtiene cuentas pendientes de un cliente
   */
  async obtenerPendientesPorCliente(
    idCliente: number
  ): Promise<CuentasPorCobrar[]> {
    return this.repository.obtenerPendientesPorCliente(idCliente);
  }

  /**
   * Obtiene cuentas por estado
   */
  async obtenerPorEstado(estado: string): Promise<CuentasPorCobrar[]> {
    return this.repository.obtenerPorEstado(estado);
  }

  /**
   * Actualiza una cuenta
   */
  async actualizar(
    id: number,
    data: UpdateCuentasPorCobrarDTO
  ): Promise<CuentasPorCobrar> {
    return this.repository.actualizar(id, data);
  }

  /**
   * Registra un pago en una cuenta
   */
  async registrarPago(
    idCuenta: number,
    montoPagado: number
  ): Promise<CuentasPorCobrar> {
    const cuenta = await this.repository.obtenerPorId(idCuenta);

    if (!cuenta) {
      throw new Error(`Cuenta ${idCuenta} no encontrada`);
    }

    const nuevoMontoPagado = cuenta.monto_pagado + montoPagado;

    if (nuevoMontoPagado > cuenta.monto_inicial) {
      throw new Error(
        `Monto de pago ${montoPagado} excede el monto pendiente de ${cuenta.monto_pendiente}`
      );
    }

    const nuevoMontoPendiente = cuenta.monto_inicial - nuevoMontoPagado;
    const nuevoEstado = nuevoMontoPendiente === 0 ? "pagada" : "parcial";

    return this.repository.actualizar(idCuenta, {
      monto_pagado: nuevoMontoPagado,
      monto_pendiente: nuevoMontoPendiente,
      estado: nuevoEstado,
    });
  }

  /**
   * Obtiene una cuenta por ID
   */
  async obtenerPorId(id: number): Promise<CuentasPorCobrar | null> {
    return this.repository.obtenerPorId(id);
  }

  /**
   * Obtiene el total pendiente de un cliente
   */
  async obtenerTotalPendiente(idCliente: number): Promise<number> {
    return this.repository.obtenerTotalPendiente(idCliente);
  }

  /**
   * Obtiene resumen de cuentas de un cliente
   */
  async obtenerResumenCliente(idCliente: number): Promise<{
    totalCuentas: number;
    totalPendiente: number;
    totalPagado: number;
    porcentajePagado: number;
  }> {
    const cuentas = await this.obtenerPorCliente(idCliente);

    const totalPendiente = cuentas.reduce(
      (total, c) => total + c.monto_pendiente,
      0
    );
    const totalPagado = cuentas.reduce((total, c) => total + c.monto_pagado, 0);
    const totalCuentas = cuentas.reduce(
      (total, c) => total + c.monto_inicial,
      0
    );
    const porcentajePagado =
      totalCuentas > 0 ? (totalPagado / totalCuentas) * 100 : 0;

    return {
      totalCuentas: cuentas.length,
      totalPendiente,
      totalPagado,
      porcentajePagado,
    };
  }
}
