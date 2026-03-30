import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IUsuario } from "../models/Usuario";
import { IUsuarioMayorista } from "../models/Consignacion";

export class UsuarioRepository extends BaseRepository<IUsuario> {
  constructor(client: SupabaseClient) {
    super(client, "usuario");
  }

  /** Lista todos los usuarios con rol 3 (mayoristas) */
  async getMayoristas(): Promise<{
    data: IUsuarioMayorista[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("id, nombre, correo, id_rol, activo, es_mayorista")
        .eq("id_rol", 3)
        .eq("activo", true)
        .order("nombre");

      if (error) return { data: null, error: error.message };
      return { data: data as IUsuarioMayorista[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Lista usuarios con rol 2 (candidatos a mayorista) */
  async getClientesNormales(): Promise<{
    data: IUsuarioMayorista[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("id, nombre, correo, id_rol, activo, es_mayorista")
        .eq("id_rol", 2)
        .eq("activo", true)
        .order("nombre");

      if (error) return { data: null, error: error.message };
      return { data: data as IUsuarioMayorista[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Promueve un usuario a rol 3 (mayorista) */
  async promoverAMayorista(idUsuario: number): Promise<{
    data: IUsuario | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({ id_rol: 3, es_mayorista: true })
        .eq("id", idUsuario)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IUsuario, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Obtiene usuario por id_auth (UUID de Supabase) */
  async getByAuthId(authId: string): Promise<{
    data: IUsuario | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("id_auth", authId)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IUsuario, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Registra movimiento de producto (entrada/salida) */
  async registrarMovimientoProducto(payload: {
    id_producto: number;
    tipo: "entrada" | "salida";
    cantidad: number;
    motivo: string;
    referencia_id?: number;
    creado_por?: number;
  }): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.client
        .from("movimientos_producto")
        .insert([payload]);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Error" };
    }
  }
}
