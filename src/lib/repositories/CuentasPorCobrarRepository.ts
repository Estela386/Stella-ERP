import { BaseRepository } from "./BaseRepository";
import {
  CuentasPorCobrar,
  ICuentasPorCobrar,
  CreateCuentasPorCobrarDTO,
  UpdateCuentasPorCobrarDTO,
} from "@/lib/models/CuentasPorCobrar";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repositorio para CuentasPorCobrar
 * Maneja operaciones de inserción, actualización, consulta y eliminación
 */
export class CuentasPorCobrarRepository extends BaseRepository<CuentasPorCobrar> {
  constructor(client: SupabaseClient) {
    super(client, "cuentasporcobrar");
  }

  /**
   * Crea una nueva cuenta por cobrar
   */
  async crear(data: CreateCuentasPorCobrarDTO): Promise<CuentasPorCobrar> {
    const proyecto = new CuentasPorCobrar(data as ICuentasPorCobrar);
    const validation = proyecto.validar();

    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    const { data: resultado, error } = await this.client
      .from("cuentasporcobrar")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new CuentasPorCobrar(resultado);
  }

  /**
   * Obtiene todas las cuentas por cobrar de un cliente
   */
  async obtenerPorCliente(idCliente: number): Promise<CuentasPorCobrar[]> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("*")
      .eq("id_cliente", idCliente)
      .order("fecha_registro", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => new CuentasPorCobrar(item));
  }

  /**
   * Obtiene todas las cuentas por cobrar de una venta
   */
  async obtenerPorVenta(idVenta: number): Promise<CuentasPorCobrar[]> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("*")
      .eq("id_venta", idVenta)
      .order("fecha_registro", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => new CuentasPorCobrar(item));
  }

  /**
   * Obtiene cuentas por cobrar pendientes de un cliente
   */
  async obtenerPendientesPorCliente(
    idCliente: number
  ): Promise<CuentasPorCobrar[]> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("*")
      .eq("id_cliente", idCliente)
      .eq("estado", "pendiente")
      .order("fecha_registro", { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => new CuentasPorCobrar(item));
  }

  /**
   * Obtiene cuentas por cobrar con estado específico
   */
  async obtenerPorEstado(estado: string): Promise<CuentasPorCobrar[]> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("*")
      .eq("estado", estado)
      .order("fecha_registro", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => new CuentasPorCobrar(item));
  }

  /**
   * Actualiza una cuenta por cobrar
   */
  async actualizar(
    id: number,
    data: UpdateCuentasPorCobrarDTO
  ): Promise<CuentasPorCobrar> {
    const { data: resultado, error } = await this.client
      .from("cuentasporcobrar")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new CuentasPorCobrar(resultado);
  }

  /**
   * Obtiene una cuenta por cobrar por ID
   */
  async obtenerPorId(id: number): Promise<CuentasPorCobrar | null> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data ? new CuentasPorCobrar(data) : null;
  }

  /**
   * Obtiene el total pendiente de un cliente
   */
  async obtenerTotalPendiente(idCliente: number): Promise<number> {
    const { data, error } = await this.client
      .from("cuentasporcobrar")
      .select("monto_pendiente")
      .eq("id_cliente", idCliente)
      .eq("estado", "pendiente");

    if (error) {
      throw error;
    }

    return (data || []).reduce(
      (total: number, item: any) => total + (item.monto_pendiente || 0),
      0
    );
  }
}
