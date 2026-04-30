import { SupabaseClient } from "@supabase/supabase-js";
import { CreateReviewDTO, UpdateReviewDTO } from "../models/Review";

export class ReviewRepository {
  private client: SupabaseClient;
  private table = "product_reviews";

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async create(data: CreateReviewDTO) {
    const { data: review, error } = await this.client
      .from(this.table)
      .insert([data])
      .select()
      .single();

    return { data: review, error: error?.message || null };
  }

  async getByProduct(productId: string) {
    const { data, error } = await this.client
      .from(this.table)
      .select("*, usuario:user_id (user_name:nombre)") // Traer el nombre del usuario desde la tabla usuario
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    return { data, error: error?.message || null };
  }
  // Agrégalo dentro de tu clase ReviewRepository
  async haComprado(
    productId: string,
    userId: string
  ): Promise<{ haComprado: boolean; error: string | null }> {
    const { data, error } = await this.client
      .from("detallesventas")
      .select(
        `
        id_venta,
        ventas!inner(id_usuario)
      `
      )
      .eq("id_producto", productId)
      .eq("ventas.id_usuario", userId)
      .limit(1);

    if (error) {
      return { haComprado: false, error: error.message };
    }

    return { haComprado: data && data.length > 0, error: null };
  }
  async yaComento(
    productId: string,
    userId: string
  ): Promise<{
    yaComento: boolean;
    error: string | null;
  }> {
    const { data, error } = await this.client
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { yaComento: false, error: error.message };
    }

    return { yaComento: !!data, error: null };
  }

  async getByUser(userId: string) {
    const { data, error } = await this.client
      .from(this.table)
      .select("*, usuario:user_id (user_name:nombre)") // Traer el nombre del usuario desde la tabla usuario

      .eq("user_id", userId);

    return { data, error: error?.message || null };
  }

  async getById(id: string) {
    const { data, error } = await this.client
      .from(this.table)
      .select("*, usuario:user_id (user_name:nombre)") // Traer el nombre del usuario desde la tabla usuario
      .eq("id", id)
      .single();

    return { data, error: error?.message || null };
  }

  async update(id: string, dataUpdate: UpdateReviewDTO) {
    const { data, error } = await this.client
      .from(this.table)
      .update(dataUpdate)
      .eq("id", id)
      .select()
      .single();

    return { data, error: error?.message || null };
  }

  async delete(id: string) {
    const { error } = await this.client.from(this.table).delete().eq("id", id);

    return { error: error?.message || null };
  }
}
