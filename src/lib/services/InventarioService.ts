import { SupabaseClient } from "@supabase/supabase-js";
import { InventarioRepository } from "../repositories/InventarioRepository";
import { AnalisisInventario } from "../models/AnalisisInventario";

export class InventarioService {
  private repository: InventarioRepository;

  constructor(client: SupabaseClient) {
    this.repository = new InventarioRepository(client);
  }

  async obtenerAnalisisPromociones(): Promise<{
    analisis: AnalisisInventario[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getInventarioConPromociones();

    if (error || !data) return { analisis: null, error };

    const analisis = data.map(item => new AnalisisInventario(item));
    return { analisis, error: null };
  }

  async descontinuarProducto(id: number): Promise<boolean> {
    return await this.repository.confirmarNoResurtir(id);
  }
}
