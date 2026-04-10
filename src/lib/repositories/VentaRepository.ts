import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IVenta, CreateVentaDTO, UpdateVentaDTO } from "../models/Venta";

/**
 * Repositorio de Venta
 * Maneja todas las operaciones de base de datos relacionadas con ventas
 */
export class VentaRepository extends BaseRepository<IVenta> {
  constructor(client: SupabaseClient) {
    super(client, "ventas");
  }
  async getVentasConDetallesByUsuarioId(
    usuarioId: number
  ): Promise<{ data: IVenta[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          detalles:detallesventas (
            id,
            cantidad,
            id_producto,
            id_venta,
            producto:producto (
              id,
              nombre,
              precio,
              url_imagen
            )
          )
        `
        )
        .eq("id_usuario", usuarioId)
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error en VentaRepository:", error);
        return { data: null, error: error.message };
      }

      return { data: data as unknown as IVenta[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene todas las ventas con información del usuario
   */
  async getAllWithDetails(): Promise<{
    data: (IVenta & { usuario?: any })[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client.from(this.tableName).select(`
        *,
        usuario:id_usuario(*)
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
   * Obtiene una venta por ID con información del usuario
   */
  async getByIdWithDetails(id: number): Promise<{
    data: (IVenta & { usuario?: any }) | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          usuario:id_usuario(*)
        `
        )
        .eq("id", id)
        .single();

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
   * Obtiene ventas por fecha
   */
  async getByFecha(fecha: string): Promise<{
    data: IVenta[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("fecha", fecha);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IVenta[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene ventas por usuario
   */
  async getByUsuario(idUsuario: string): Promise<{
    data: IVenta[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("id_usuario", idUsuario);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IVenta[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene ventas por estado
   */
  async getByEstado(estado: string): Promise<{
    data: IVenta[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("estado", estado);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IVenta[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }
}
