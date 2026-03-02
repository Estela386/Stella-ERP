import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  IDetalleVenta,
  CreateDetalleVentaDTO,
  UpdateDetalleVentaDTO,
} from "../models/DetalleVenta";

/**
 * Repositorio de DetalleVenta
 * Maneja todas las operaciones de base de datos relacionadas con detalles de venta
 */
export class DetalleVentaRepository extends BaseRepository<IDetalleVenta> {
  constructor(client: SupabaseClient) {
    super(client, "detallesventas");
  }

  /**
   * Obtiene todos los detalles con información del producto
   */
  async getAllWithProducto(): Promise<{
    data: (IDetalleVenta & { producto?: any })[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client.from(this.tableName).select(`
        *,
        producto:id_producto(*)
      `);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene detalles de venta por ID de venta
   */
  async getByVentaId(idVenta: number): Promise<{
    data: (IDetalleVenta & { producto?: any })[] | null;
    error: string | null;
  }> {
    try {
      // Obtener todos los detalles que pertenecen a esta venta
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          producto:id_producto(*)
        `
        )
        .eq("id_venta", idVenta);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as any[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene detalles de venta por producto
   */
  async getByProductoId(idProducto: number): Promise<{
    data: IDetalleVenta[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("id_producto", idProducto);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IDetalleVenta[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }
}
