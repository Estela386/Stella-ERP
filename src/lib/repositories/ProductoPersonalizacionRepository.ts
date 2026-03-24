import { SupabaseClient } from "@supabase/supabase-js";
import { IProductoOpcion } from "../models";

export class ProductoPersonalizacionRepository {
  constructor(private client: SupabaseClient) {}

  async getOpciones(productId: string) {
    const { data, error } = await this.client
      .from("producto_opciones")
      .select(
        `
        *,
        valores:producto_opcion_valores(*)
      `
      )
      .eq("producto_id", productId)
      .order("orden", { ascending: true });

    return { data, error: error?.message || null };
  }

  async crearOpcion(opcion: Omit<IProductoOpcion, "id">) {
    return await this.client
      .from("producto_opciones")
      .insert(opcion)
      .select()
      .single();
  }

  async crearValores(
    valores: {
      opcion_id: number;
      valor: string;
      extra?: JSON;
    }[]
  ) {
    return await this.client.from("producto_opcion_valores").insert(valores).select();

  }

  async eliminarPorProducto(productId: number) {
    await this.client
      .from("producto_opciones")
      .delete()
      .eq("producto_id", productId);
  }
}
