import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import {
  ICliente,
  CreateClienteDTO,
  UpdateClienteDTO,
} from "../models/Cliente";

/**
 * Repositorio de Cliente
 * Maneja todas las operaciones de base de datos relacionadas con clientes
 */
export class ClienteRepository extends BaseRepository<ICliente> {
  constructor(client: SupabaseClient) {
    super(client, "cliente");
  }

  /**
   * Busca clientes por nombre
   */
  async searchByNombre(nombre: string): Promise<{
    data: ICliente[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .ilike("nombre", `%${nombre}%`);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ICliente[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Busca clientes por teléfono
   */
  async searchByTelefono(telefono: string): Promise<{
    data: ICliente[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .ilike("telefono", `%${telefono}%`);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ICliente[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Busca clientes por nombre o teléfono
   */
  async searchByNombreOTelefono(termino: string): Promise<{
    data: ICliente[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .or(`nombre.ilike.%${termino}%,telefono.ilike.%${termino}%`);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ICliente[], error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { data: null, error: errorMessage };
    }
  }
}
