import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  IProducto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../models/Producto";

/**
 * Repositorio de Producto
 * Maneja todas las operaciones de base de datos relacionadas con productos
 */
export class ProductoRepository extends BaseRepository<IProducto> {
  constructor(client: SupabaseClient) {
    super(client, "producto");
  }
  async getById(
    id: number
  ): Promise<{ data: IProducto | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          categoria:id_categoria(id, nombre),
          producto_material:producto_material(id, material:id_material(id, nombre)),
          opciones:producto_opciones(*, valores:producto_opcion_valores(*)),
          imagenes:producto_imagenes(id, url_imagen, orden) 
        `
        )
        .eq("id", id)
        .order("orden", {
          referencedTable: "producto_imagenes",
          ascending: true,
        }) // Ordenar la galería
        .single();

      if (error) throw error;
      return { data: data as unknown as IProducto, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  }

  /**
   * Obtiene todos los productos con su información de categoría
   */
  async getAllWithCategoria() {
    const { data, error } = await this.client
      .from("producto")
      .select(
        `
        *,
        categoria:id_categoria(id, nombre),
        imagenes:producto_imagenes(id, url_imagen, orden)
      `
      )
      .eq("activo", true)
      .order("id", { ascending: false });

    return { data, error };
  }
  /**
   * Obtiene un producto por ID con su información de categoría
   */
  async getByIdWithCategoria(id: number): Promise<{
    data:
      | (IProducto & { categoria?: { id: number; nombre: string | null } })
      | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          categoria:id_categoria(id, nombre),
          producto_material(materiales(nombre))
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
   * Obtiene productos por categoría
   */
  async getByCategoria(idCategoria: number): Promise<{
    data: IProducto[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          categoria:id_categoria(id, nombre),
          producto_material(materiales(nombre))
        `
        )
        .eq("id_categoria", idCategoria)
        .eq("activo", true);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IProducto[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Obtiene productos con stock bajo
   */
  async getProductosStockBajo(): Promise<{
    data: IProducto[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          categoria:id_categoria(id, nombre),
          producto_material(materiales(nombre))
        `
        )
        .eq("activo", true)
        .lt("stock_actual", "stock_min");

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IProducto[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Busca productos por nombre
   */
  async searchByNombre(nombre: string): Promise<{
    data: IProducto[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          categoria:id_categoria(id, nombre),
          producto_material(materiales(nombre))
        `
        )
        .eq("activo", true)
        .ilike("nombre", `%${nombre}%`);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IProducto[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Crea un nuevo producto
   */
  async create(data: CreateProductoDTO | Omit<IProducto, "id">): Promise<{
    data: IProducto | null;
    error: string | null;
  }> {
    return super.create(data as unknown as Omit<IProducto, "id">);
  }

  /**
   * Actualiza un producto existente
   */
  async update(
    id: number,
    data: UpdateProductoDTO
  ): Promise<{ data: IProducto | null; error: string | null }> {
    return super.update(id, data as Partial<Omit<IProducto, "id">>);
  }

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(
    id: number,
    cantidad: number
  ): Promise<{ data: IProducto | null; error: string | null }> {
    try {
      // Primero obtenemos el stock actual
      const { data: producto, error: getError } = await this.getById(id);

      if (getError || !producto) {
        return { data: null, error: getError || "Producto no encontrado" };
      }

      const nuevoStock = (producto.stock_actual || 0) + cantidad;

      if (nuevoStock < 0) {
        return { data: null, error: "No hay suficiente stock" };
      }

      return this.update(id, { stock_actual: nuevoStock });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }
}
