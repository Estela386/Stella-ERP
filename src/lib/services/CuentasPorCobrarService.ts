import { CuentasPorCobrarRepository } from "@/lib/repositories/CuentasPorCobrarRepository";
import {
  CuentasPorCobrar,
  CreateCuentasPorCobrarDTO,
  UpdateCuentasPorCobrarDTO,
  IPago,
  CreateCuentaDTO,
  CreatePagoDTO,
  CreateClienteDTO,
  ICuentasPorCobrar,
} from "@/lib/models/CuentasPorCobrar";
import { ICliente } from "@/lib/models/Cliente";
import { SupabaseClient } from "@supabase/supabase-js";
import error from "next/error";

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
  async crear(
    id_cliente: number,
    concepto: string,
    monto_inicial: number,
    id_venta?: number | null
  ): Promise<{ cuenta: ICuentasPorCobrar | null; error: string | null }> {
    const dto: CreateCuentaDTO = {
      id_cliente,
      concepto,
      monto_inicial,
      monto_pagado: 0,
      monto_pendiente: monto_inicial,
      estado: "pendiente",
      fecha_registro: new Date().toISOString(),
      id_venta: id_venta ?? null,
    };

    const { data } = await this.repository.crear(dto);
    return { cuenta: data as unknown as ICuentasPorCobrar, error: null };
  }
  /**
   * Crea una cuenta por cobrar para una venta
   * Este método es llamado cuando se confirma una venta
   */
  async crearParaVenta(
    clienteId: number,
    ventaId: number,
    totalFinal: number,
    montoPagado: number,
    concepto: string,
    metodoPago: string = "Efectivo"
  ) {
    const { data } = await this.repository.crear({
      id_cliente: clienteId,
      concepto,
      monto_inicial: totalFinal,
      monto_pagado: montoPagado,
      monto_pendiente: totalFinal - montoPagado,
      estado: montoPagado >= totalFinal ? "pagado" : "pendiente",
      fecha_registro: new Date().toISOString(),
      id_venta: ventaId,
    });

    if (montoPagado > 0 && data) {
      await this.repository.createPago({
        id_cuenta: data.id,
        monto_pago: montoPagado,
        metodo_pago: metodoPago,
        observaciones: "Pago inicial al registrar venta",
        fecha_pago: new Date().toISOString(),
      });
    }

    return data;
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
   */ async registrarPago(
    id_cuenta: number,
    monto_pago: number,
    metodo_pago: string,
    observaciones?: string
  ): Promise<{
    cuenta: ICuentasPorCobrar | null;
    pago: IPago | null;
    error: string | null;
  }> {
    // Obtener cuenta actual
    const cuentaActual = await this.repository.obtenerPorId(id_cuenta);

    if (!cuentaActual) {
      return { cuenta: null, pago: null, error: "Cuenta no encontrada" };
    }

    if (monto_pago <= 0) {
      return { cuenta: null, pago: null, error: "El monto debe ser mayor a 0" };
    }
    console.log({ cuentaActual, monto_pago });
    if (monto_pago > cuentaActual.data.monto_pendiente) {
      return {
        cuenta: null,
        pago: null,
        error: "El monto excede el saldo pendiente",
      };
    }

    // Crear registro de pago
    const pagoDTO: CreatePagoDTO = {
      id_cuenta,
      monto_pago,
      metodo_pago,
      observaciones,
      fecha_pago: new Date().toISOString(),
    };
    console.log(cuentaActual, pagoDTO);

    const { data: pagoData, error: errorPago } =
      await this.repository.createPago(pagoDTO);

    if (errorPago)
      return { cuenta: null, pago: null, error: errorPago.message };

    // Actualizar montos en la cuenta
    const nuevoMontoPagado = cuentaActual.data.monto_pagado + monto_pago;
    const nuevoMontoPendiente = cuentaActual.data.monto_pendiente - monto_pago;
    const nuevoEstado =
      nuevoMontoPendiente === 0
        ? "pagado"
        : nuevoMontoPagado > 0
          ? "parcial"
          : "pendiente";
    console.log({ nuevoMontoPagado, nuevoMontoPendiente, nuevoEstado });
    const { data: cuentaActualizada } = await this.repository.actualizar(
      id_cuenta,
      {
        monto_pagado: nuevoMontoPagado,
        monto_pendiente: nuevoMontoPendiente,
        estado: nuevoEstado,
      }
    );

    return {
      cuenta: cuentaActualizada as unknown as ICuentasPorCobrar,
      pago: pagoData as unknown as IPago,
      error: null,
    };
  }
  async obtenerPagos(id_cuenta: number): Promise<{
    pagos: IPago[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getPagosByCuenta(id_cuenta);
    if (error) return { pagos: null, error: error.message };
    return { pagos: data as IPago[], error: null };
  }
  async obtenerTodas() {
    const { data, error } = await this.repository.getAll();
    if (error) return { cuentas: null, error };
    return { cuentas: data as ICuentasPorCobrar[], error: null };
  }
  async obtenerClientes(): Promise<{
    clientes: ICliente[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAllClientes();
    if (error) return { clientes: null, error: error.message };
    return { clientes: data as ICliente[], error: null };
  }
  async crearCliente(dto: CreateClienteDTO): Promise<{
    cliente: ICliente | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.createCliente(dto);
    if (error) return { cliente: null, error: error.message };
    return { cliente: data as ICliente, error: null };
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
      (total, c) => total + c.data.monto_pendiente,
      0
    );
    const totalPagado = cuentas.reduce(
      (total, c) => total + c.data.monto_pagado,
      0
    );
    const totalCuentas = cuentas.reduce(
      (total, c) => total + c.data.monto_inicial,
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
