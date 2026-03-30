import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  IConsignacion,
  CreateConsignacionDTO,
  UpdateConsignacionDTO,
  EstadoConsignacion,
} from "../models/Consignacion";

const SELECT_FULL = `
  *,
  mayorista:usuario!fk_mayorista(id, nombre, correo),
  detalles:consignacion_detalle(
    id, id_consignacion, id_producto, cantidad, cantidad_vendida, cantidad_devuelta, precio_mayorista, precio_venta,
    producto:producto!fk_detalle_producto(id, nombre, precio, stock_actual, url_imagen)
  )
`;

export class ConsignacionRepository extends BaseRepository<IConsignacion> {
  constructor(client: SupabaseClient) {
    super(client, "consignacion");
  }

  /** Todas las consignaciones con joins */
  async getallWithJoins(): Promise<{
    data: IConsignacion[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .order("created_at", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IConsignacion[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Consignaciones de un mayorista específico */
  async getByMayorista(idMayorista: number): Promise<{
    data: IConsignacion[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("id_mayorista", idMayorista)
        .order("created_at", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IConsignacion[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Consignaciones por estado */
  async getByEstado(estado: EstadoConsignacion): Promise<{
    data: IConsignacion[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("estado", estado)
        .order("created_at", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IConsignacion[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Crear consignación */
  async createConsignacion(dto: Omit<CreateConsignacionDTO, "productos">): Promise<{
    data: IConsignacion | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert([dto])
        .select(SELECT_FULL)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IConsignacion, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Actualizar consignación */
  async updateConsignacion(
    id: number,
    dto: UpdateConsignacionDTO
  ): Promise<{ data: IConsignacion | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(SELECT_FULL)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IConsignacion, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }
}
