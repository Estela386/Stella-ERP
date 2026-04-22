import { SupabaseClient } from "@supabase/supabase-js";

export interface IMaterial {
  id: number;
  nombre: string;
}

export class MaterialService {
  constructor(private client: SupabaseClient) {}

  async obtenerTodos(): Promise<{ materiales: IMaterial[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("materiales")
        .select("*")
        .order("nombre");

      if (error) throw error;
      return { materiales: data as IMaterial[], error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error buscando materiales";
      return { materiales: null, error: errorMessage };
    }
  }

  async crear(nombre: string): Promise<{ material: IMaterial | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("materiales")
        .insert([{ nombre }])
        .select()
        .single();

      if (error) throw error;
      return { material: data as IMaterial, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creando material";
      return { material: null, error: errorMessage };
    }
  }
}
