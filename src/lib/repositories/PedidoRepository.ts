import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IPedido, CreatePedidoDTO } from "../models/Pedido";

const SELECT_FULL = `
  *,
  usuario:usuario(id, nombre, correo, id_rol),
  detalles:pedido_detalle(
    id, id_pedido, id_producto, cantidad, precio_unitario, subtotal, personalizacion,
    producto:producto(id, nombre, url_imagen)
  )
`;

export class PedidoRepository extends BaseRepository<IPedido> {
  constructor(client: SupabaseClient) {
    super(client, "pedidos");
  }

  /** Obtener todos los pedidos con sus detalles y productos */
  async getAllWithDetails(): Promise<{
    data: IPedido[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .order("fecha_pedido", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IPedido[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Obtener un pedido por ID con detalles */
  async getById(id: number): Promise<{
    data: IPedido | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("id", id)
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IPedido, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Obtener pedidos por usuario (Historial del mayorista) */
  async getByUsuario(idUsuario: number): Promise<{
    data: IPedido[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(SELECT_FULL)
        .eq("id_usuario", idUsuario)
        .order("fecha_pedido", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as IPedido[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Crear maestro de pedido */
  async createPedido(dto: Omit<IPedido, "id" | "id_detalles">): Promise<{
    data: IPedido | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert([dto])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as IPedido, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error" };
    }
  }

  /** Insertar detalles de pedido */
  async createDetalles(detalles: any[]): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client
        .from("pedido_detalle")
        .insert(detalles);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Error" };
    }
  }
}
