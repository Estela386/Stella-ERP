import {
  Categoria,
  ICategoria,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../models/Categoria";
import { CategoriaRepository } from "../repositories/CategoriaRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Servicio de Categoría
 * Encapsula la lógica de negocio y orquestación de operaciones con categorías
 */
export class CategoriaService {
  private repository: CategoriaRepository;

  constructor(client: SupabaseClient) {
    this.repository = new CategoriaRepository(client);
  }

  /**
   * Obtiene todas las categorías
   */
  async obtenerTodas(): Promise<{
    categorias: Categoria[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAll();

    if (error || !data) {
      return { categorias: null, error };
    }

    const categorias = data.map(item => new Categoria(item));
    return { categorias, error: null };
  }

  /**
   * Obtiene una categoría por ID
   */
  async obtenerPorId(id: number): Promise<{
    categoria: Categoria | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getById(id);

    if (error || !data) {
      return { categoria: null, error };
    }

    const categoria = new Categoria(data);
    return { categoria, error: null };
  }

  /**
   * Obtiene una categoría por nombre
   */
  async obtenerPorNombre(nombre: string): Promise<{
    categoria: Categoria | null;
    error: string | null;
  }> {
    if (!nombre || nombre.trim().length === 0) {
      return { categoria: null, error: "El nombre no puede estar vacío" };
    }

    const { data, error } = await this.repository.getByNombre(nombre);

    if (error || !data) {
      return { categoria: null, error };
    }

    const categoria = new Categoria(data);
    return { categoria, error: null };
  }

  /**
   * Crea una nueva categoría
   */
  async crear(data: CreateCategoriaDTO): Promise<{
    categoria: Categoria | null;
    error: string | null;
  }> {
    // Crear instancia temporal para validar
    const categoriaTemp = new Categoria({
      id: 0, // ID temporal
      ...data,
    });

    const validacion = categoriaTemp.validar();
    if (!validacion.valid) {
      return { categoria: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.create(data);

    if (error || !result) {
      return { categoria: null, error };
    }

    const categoria = new Categoria(result);
    return { categoria, error: null };
  }

  /**
   * Actualiza una categoría
   */
  async actualizar(
    id: number,
    data: UpdateCategoriaDTO
  ): Promise<{
    categoria: Categoria | null;
    error: string | null;
  }> {
    // Verificar que la categoría existe
    const { categoria: categoriaExistente, error: errorExistencia } =
      await this.obtenerPorId(id);
    if (errorExistencia || !categoriaExistente) {
      return { categoria: null, error: "Categoría no encontrada" };
    }

    // Crear instancia con datos actualizados para validar
    const categoriaActualizada = new Categoria({
      ...categoriaExistente.toJSON(),
      ...data,
    });

    const validacion = categoriaActualizada.validar();
    if (!validacion.valid) {
      return { categoria: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.update(id, data);

    if (error || !result) {
      return { categoria: null, error };
    }

    const categoria = new Categoria(result);
    return { categoria, error: null };
  }

  /**
   * Elimina una categoría
   */
  async eliminar(
    id: number
  ): Promise<{ success: boolean; error: string | null }> {
    // Verificar que la categoría existe
    const { categoria, error: errorExistencia } = await this.obtenerPorId(id);
    if (errorExistencia || !categoria) {
      return { success: false, error: "Categoría no encontrada" };
    }

    const { success, error } = await this.repository.delete(id);
    return { success, error };
  }
}
