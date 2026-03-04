import {
  Insumo,
  IInsumo,
  CreateInsumoDTO,
  UpdateInsumoDTO,
} from "../models/Insumo";
import { InsumoRepository } from "../repositories/InsumoRepository";
import { SupabaseClient } from "@supabase/supabase-js";

export class InsumoService {
  private repository: InsumoRepository;

  constructor(client: SupabaseClient) {
    this.repository = new InsumoRepository(client);
  }

  async obtenerTodos(): Promise<{
    insumos: Insumo[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAll();

    if (error || !data) return { insumos: null, error };

    const insumos = data.map((item: IInsumo) => new Insumo(item));
    return { insumos, error: null };
  }

  async crear(data: CreateInsumoDTO) {
    const temp = new Insumo({ id: 0, ...data });
    const validacion = temp.validar();

    if (!validacion.valid) {
      return { insumo: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.create(data);

    if (error || !result) return { insumo: null, error };

    return { insumo: new Insumo(result), error: null };
  }

  async actualizar(id: number, data: UpdateInsumoDTO) {
    const { data: result, error } = await this.repository.update(id, data);

    if (error || !result) return { insumo: null, error };

    return { insumo: new Insumo(result), error: null };
  }

  async eliminar(id: number) {
    return await this.repository.delete(id);
  }
}
