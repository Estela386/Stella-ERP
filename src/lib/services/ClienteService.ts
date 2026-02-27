import {
  Cliente,
  ICliente,
  CreateClienteDTO,
  UpdateClienteDTO,
} from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Servicio de Cliente
 * Encapsula la lógica de negocio y orquestación de operaciones con clientes
 */
export class ClienteService {
  private repository: ClienteRepository;

  constructor(client: SupabaseClient) {
    this.repository = new ClienteRepository(client);
  }

  /**
   * Obtiene todos los clientes
   */
  async obtenerTodos(): Promise<{
    clientes: Cliente[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAll();

    if (error || !data) {
      return { clientes: null, error };
    }

    const clientes = data.map(item => new Cliente(item as ICliente));
    return { clientes, error: null };
  }

  /**
   * Obtiene un cliente por ID
   */
  async obtenerPorId(id: number): Promise<{
    cliente: Cliente | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getById(id);

    if (error || !data) {
      return { cliente: null, error };
    }

    const cliente = new Cliente(data as ICliente);
    return { cliente, error: null };
  }

  /**
   * Busca clientes por nombre
   */
  async buscarPorNombre(nombre: string): Promise<{
    clientes: Cliente[] | null;
    error: string | null;
  }> {
    if (!nombre || nombre.trim().length === 0) {
      return {
        clientes: null,
        error: "El término de búsqueda no puede estar vacío",
      };
    }

    const { data, error } = await this.repository.searchByNombre(nombre);

    if (error || !data) {
      return { clientes: null, error };
    }

    const clientes = data.map(item => new Cliente(item));
    return { clientes, error: null };
  }

  /**
   * Busca clientes por teléfono
   */
  async buscarPorTelefono(telefono: string): Promise<{
    clientes: Cliente[] | null;
    error: string | null;
  }> {
    if (!telefono || telefono.trim().length === 0) {
      return { clientes: null, error: "El teléfono no puede estar vacío" };
    }

    const { data, error } = await this.repository.searchByTelefono(telefono);

    if (error || !data) {
      return { clientes: null, error };
    }

    const clientes = data.map(item => new Cliente(item));
    return { clientes, error: null };
  }

  /**
   * Busca clientes por nombre o teléfono
   */
  async buscar(termino: string): Promise<{
    clientes: Cliente[] | null;
    error: string | null;
  }> {
    if (!termino || termino.trim().length === 0) {
      return {
        clientes: null,
        error: "El término de búsqueda no puede estar vacío",
      };
    }

    const { data, error } =
      await this.repository.searchByNombreOTelefono(termino);

    if (error || !data) {
      return { clientes: null, error };
    }

    const clientes = data.map(item => new Cliente(item));
    return { clientes, error: null };
  }

  /**
   * Crea un nuevo cliente
   */
  async crear(clienteDTO: CreateClienteDTO): Promise<{
    cliente: Cliente | null;
    error: string | null;
  }> {
    // Validar datos
    const clienteTemporal = new Cliente({ id: 0, ...clienteDTO });
    const validacion = clienteTemporal.validar();

    if (!validacion.valid) {
      return {
        cliente: null,
        error: validacion.errors.join(", "),
      };
    }

    const { data, error } = await this.repository.create(clienteDTO);

    if (error || !data) {
      return { cliente: null, error };
    }

    const cliente = new Cliente(data as ICliente);
    return { cliente, error: null };
  }

  /**
   * Actualiza un cliente
   */
  async actualizar(
    id: number,
    clienteDTO: UpdateClienteDTO
  ): Promise<{
    cliente: Cliente | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.update(id, clienteDTO);

    if (error || !data) {
      return { cliente: null, error };
    }

    const cliente = new Cliente(data as ICliente);
    return { cliente, error: null };
  }

  /**
   * Elimina un cliente
   */
  async eliminar(id: number): Promise<{
    success: boolean;
    error: string | null;
  }> {
    const { error } = await this.repository.delete(id);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  }
}
