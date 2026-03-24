import { SupabaseClient } from "@supabase/supabase-js";
  import { BaseRepository } from "./BaseRepository";
  import { IProductoProveedor } from "../models/ProductoProveedor";
  
  /**
   * Repositorio para la tabla producto_proveedor
   */
  export class ProductoProveedorRepository extends BaseRepository<IProductoProveedor> {
    constructor(client: SupabaseClient) {
      super(client, "producto_proveedor");
    }
  
    /**
     * Obtiene el proveedor asociado a un producto
     */
    async getByProducto(idProducto: number) {
      try {
        const { data, error } = await this.client
          .from(this.tableName)
          .select(`
            *,
            proveedores:id_proveedor (
              nombre,
              empresa
            )
          `)
          .eq("id_producto", idProducto)
          .maybeSingle();
  
        if (error) {
          return { data: null, error: error.message };
        }
  
        return { data: data as IProductoProveedor, error: null };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        return { data: null, error: errorMessage };
      }
    }

    /**
     * Elimina la relación de proveedor para un producto
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
  }
  
