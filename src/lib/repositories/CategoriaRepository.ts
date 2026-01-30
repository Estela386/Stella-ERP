import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  ICategoria,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../models/Categoria";

/**
 * Repositorio de Categoría
 * Maneja todas las operaciones de base de datos relacionadas con categorías
 */
export class CategoriaRepository extends BaseRepository<ICategoria> {
  constructor(client: SupabaseClient) {
    super(client, "categoria");
  }

  /**
   * Busca una categoría por nombre
   */
  async getByNombre(nombre: string): Promise<{
    data: ICategoria | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("nombre", nombre)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ICategoria, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Crea una nueva categoría
   */
  async create(data: CreateCategoriaDTO): Promise<{
    data: ICategoria | null;
    error: string | null;
  }> {
    return super.create(data as Omit<ICategoria, "id">);
  }

  /**
   * Actualiza una categoría existente
   */
  async update(
    id: number,
    data: UpdateCategoriaDTO
  ): Promise<{ data: ICategoria | null; error: string | null }> {
    return super.update(id, data as Partial<Omit<ICategoria, "id">>);
  }
}
