import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  ISolicitudMayorista,
  CreateSolicitudDTO,
  UpdateSolicitudDTO,
  EstadoSolicitud,
} from "../models/Consignacion";

const SELECT_FULL = `
  *,
  usuario:usuario!fk_usuario(id, nombre, correo, id_rol),
  revisor:usuario!fk_admin(id, nombre)
`;

export class SolicitudMayoristaRepository extends BaseRepository<ISolicitudMayorista> {
  constructor(client: SupabaseClient) {
    super(client, "solicitud_mayorista");
  }

  /** Todas las solicitudes con join de usuario */
  async getAllWithJoins(): Promise<{
    data: ISolicitudMayorista[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .order("fecha_solicitud", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as ISolicitudMayorista[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Solicitudes por estado */
  async getByEstado(estado: EstadoSolicitud): Promise<{
    data: ISolicitudMayorista[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("estado", estado)
        .order("fecha_solicitud", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as ISolicitudMayorista[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Verificar si usuario ya tiene solicitud pendiente */
  async getByUsuario(idUsuario: number): Promise<{
    data: ISolicitudMayorista[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("id_usuario", idUsuario)
        .order("fecha_solicitud", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as ISolicitudMayorista[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Crear solicitud */
  async createSolicitud(dto: CreateSolicitudDTO): Promise<{
    data: ISolicitudMayorista | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert([dto])
        .select(SELECT_FULL)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as ISolicitudMayorista, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Actualizar estado de solicitud (aprobar/rechazar) */
  async updateEstado(
    id: number,
    dto: UpdateSolicitudDTO
  ): Promise<{ data: ISolicitudMayorista | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({
          estado: dto.estado,
          revisado_por: dto.revisado_por,
          fecha_respuesta: dto.fecha_respuesta ?? new Date().toISOString(),
        })
        .eq("id", id)
        .select(SELECT_FULL)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as ISolicitudMayorista, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }
}
