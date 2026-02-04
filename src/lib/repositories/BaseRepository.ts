import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Clase base abstracta para repositorios
 * Proporciona métodos comunes para acceder a la base de datos
 */
export abstract class BaseRepository<T> {
  protected client: SupabaseClient;
  protected tableName: string;

  constructor(client: SupabaseClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  /**
   * Obtiene todos los registros de la tabla
   */
  async getAll(): Promise<{ data: T[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*");

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as T[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene un registro por su ID
   */
  async getById(id: number): Promise<{ data: T | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as T, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Crea un nuevo registro
   */
  async create(
    data: Omit<T, "id">
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .insert([data])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: result as T, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Actualiza un registro existente
   */
  async update(
    id: number,
    data: Partial<Omit<T, "id">>
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: result as T, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Elimina un registro
   */
  async delete(
    id: number
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { success: false, error: errorMessage };
    }
  }
}
