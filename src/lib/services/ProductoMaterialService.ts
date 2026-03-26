import { SupabaseClient } from "@supabase/supabase-js";

export class ProductoMaterialService {
  constructor(private client: SupabaseClient) {}

  /**
   * Sincroniza los materiales de un producto (Elimina actuales e inserta nuevos)
   */
  async guardarRelaciones(
    id_producto: number,
    materialesIds: number[]
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // 1. Eliminar relaciones existentes
      const { error: deleteError } = await this.client
        .from("producto_material")
        .delete()
        .eq("id_producto", id_producto);

      if (deleteError) throw deleteError;

      // 2. Insertar las nuevas si existen
      if (materialesIds && materialesIds.length > 0) {
        const inserts = materialesIds.map((id_material) => ({
          id_producto,
          id_material,
        }));

        const { error: insertError } = await this.client
          .from("producto_material")
          .insert(inserts);

        if (insertError) throw insertError;
      }

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error sincronizando materiales";
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Obtiene los IDs de los materiales asociados a un producto
   */
  async obtenerPorProducto(
    id_producto: number
  ): Promise<{ materialesIds: number[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("producto_material")
        .select("id_material")
        .eq("id_producto", id_producto);

      if (error) throw error;

      return { materialesIds: data.map((m) => m.id_material), error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error obteniendo materiales del producto";
      return { materialesIds: null, error: errorMessage };
    }
  }
}
