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
      stock?: number;
      extra?: JSON;
    }[]
  ) {
    return await this.client.from("producto_opcion_valores").insert(valores).select();
  }

  async eliminarPorProducto(productId: number) {
    // 1. Primero intentamos eliminar los valores de las opciones asociadas al producto
    // Esto es por si el borrado en cascada no está configurado en la base de datos
    const { data: opciones } = await this.client
      .from("producto_opciones")
      .select("id")
      .eq("producto_id", productId);

    if (opciones && opciones.length > 0) {
      const ids = opciones.map(o => o.id);
      await this.client
        .from("producto_opcion_valores")
        .delete()
        .in("opcion_id", ids);
    }

    // 2. Ahora eliminamos las opciones
    return await this.client
      .from("producto_opciones")
      .delete()
      .eq("producto_id", productId);
  }
}
