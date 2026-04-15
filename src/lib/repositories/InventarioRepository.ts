import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IAnalisisInventario } from "../models/AnalisisInventario";

export class InventarioRepository extends BaseRepository<IAnalisisInventario> {
  constructor(client: SupabaseClient) {
    // Apuntamos a la VISTA en lugar de una tabla regular
    super(client, "vw_analisis_inventario");
  }

  async getInventarioConPromociones(): Promise<{
    data: IAnalisisInventario[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .order("dias_estancado", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IAnalisisInventario[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Error desconocido",
      };
    }
  }

  // Método para aplicar oficialmente la restricción a la tabla producto
  async confirmarNoResurtir(idProducto: number): Promise<boolean> {
    const { error } = await this.client
      .from("producto")
      .update({ no_resurtir: true })
      .eq("id", idProducto);

    return !error;
  }
}
