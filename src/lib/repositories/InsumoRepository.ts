import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IInsumo } from "../models/Insumo";

export class InsumoRepository extends BaseRepository<IInsumo> {
  constructor(client: SupabaseClient) {
    super(client, "insumos");
  }

  async getAll() {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("activo", true);

    if (error) return { data: null, error: error.message };
    return { data: data as IInsumo[], error: null };
  }

  async getStockBajo() {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("activo", true)
      .lt("cantidad", 5);

    if (error) return { data: null, error: error.message };

    return { data: data as IInsumo[], error: null };
  }
}
