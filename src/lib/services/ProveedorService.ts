import {
  Proveedor,
  IProveedor,
  CreateProveedorDTO,
  UpdateProveedorDTO,
} from "../models/Proveedor";
import { ProveedorRepository } from "../repositories/ProveedorRepository";
import { SupabaseClient } from "@supabase/supabase-js";

export class ProveedorService {
  private repository: ProveedorRepository;

  constructor(client: SupabaseClient) {
    this.repository = new ProveedorRepository(client);
  }

  async obtenerTodos(): Promise<{
    proveedores: Proveedor[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAll();

    if (error || !data) return { proveedores: null, error };

    const proveedores = data.map((item: IProveedor) => new Proveedor(item));
    return { proveedores, error: null };
  }

  async crear(data: CreateProveedorDTO) {
    const temp = new Proveedor({ id: 0, ...data, activo: true });
    const validacion = temp.validar();

    if (!validacion.valid) {
      return { proveedor: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.create(data);

    if (error || !result) return { proveedor: null, error };

    return { proveedor: new Proveedor(result), error: null };
  }

  async actualizar(id: number, data: UpdateProveedorDTO) {
    const { data: result, error } = await this.repository.update(id, data);

    if (error || !result) return { proveedor: null, error };

    return { proveedor: new Proveedor(result), error: null };
  }

  async eliminar(id: number) {
    return await this.repository.delete(id);
  }
}
