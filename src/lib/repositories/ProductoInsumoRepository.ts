import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IProductoInsumo } from "../models/ProductoInsumo";

/**
 * Repositorio para la tabla productoinsumo
 */
export class ProductoInsumoRepository extends BaseRepository<IProductoInsumo> {
  constructor(client: SupabaseClient) {
    super(client, "productoinsumo");
  }

  /**
   * Obtiene los insumos asociados a un producto
   */
  async getByProducto(idProducto: number) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(`
          *,
          insumos:id_insumo (
            nombre,
            unidad_medida
          ),
          opcion_valor:id_opcion_valor (
            valor,
            opcion:opcion_id (
              nombre
            )
          )
        `)

        .eq("id_producto", idProducto);

      if (error) {
        return { data: null, error: error.message };
      }

      // Mapear para que coincida con la interfaz IProductoInsumo
      const mappedData = data?.map(item => ({
        ...item,
        insumo: item.insumos
      }));

      return { data: mappedData as IProductoInsumo[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Elimina todos los insumos asociados a un producto
   */
  async deleteByProducto(idProducto: number) {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq("id_producto", idProducto);

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

  /**
   * Inserta múltiples relaciones producto-insumo
   */
  async createMany(items: Omit<IProductoInsumo, "id">[]) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(items)
        .select();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as IProductoInsumo[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**

   * Obtiene los productos que consumen un insumo específico
   */
  async getByInsumo(idInsumo: number) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(`
          cantidad_necesaria,
          producto:id_producto (
            id,
            nombre
          ),
          opcion_valor:id_opcion_valor (
            valor,
            opcion:opcion_id (
              nombre
            )
          )
        `)
        .eq("id_insumo", idInsumo);

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
}

