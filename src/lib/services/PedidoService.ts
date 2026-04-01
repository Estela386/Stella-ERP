import { SupabaseClient } from "@supabase/supabase-js";
import { PedidoRepository } from "../repositories/PedidoRepository";
import { IPedido, CreatePedidoDTO, EstadoPedido } from "../models/Pedido";

export class PedidoService {
  private repository: PedidoRepository;
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.repository = new PedidoRepository(client);
    this.client = client;
  }

  /** Obtener historial de pedidos */
  async obtenerHistorial(idUsuario?: number): Promise<{
    pedidos: IPedido[] | null;
    error: string | null;
  }> {
    if (idUsuario) {
      const { data, error } = await this.repository.getByUsuario(idUsuario);
      return { pedidos: data, error };
    }
    const { data, error } = await this.repository.getAllWithDetails();
    return { pedidos: data, error };
  }

  /** Obtener pedido especifico */
  async obtenerPorId(id: number): Promise<{
    pedido: IPedido | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getById(id);
    return { pedido: data, error };
  }


  /** Levantar un nuevo pedido */
  async levantarPedido(dto: CreatePedidoDTO): Promise<{
    pedido: IPedido | null;
    error: string | null;
  }> {
    try {
      // 1. Crear el maestro (Pedido)
      const pedidoMaestro: any = {
        id_usuario: dto.id_usuario,
        total_estimado: dto.total_estimado,
        observaciones: dto.observaciones || "Pedido de mayorista",
        estado: dto.estado || "PENDIENTE",
        fecha_pedido: new Date().toISOString(),
      };

      const { data: pedido, error: pedidoError } = await this.repository.createPedido(pedidoMaestro);

      if (pedidoError || !pedido) {
        return { pedido: null, error: pedidoError };
      }

      const pedidoId = (pedido as any).id;

      // 2. Crear los detalles vinculados
      const detallesFinales = dto.detalles.map(d => ({
        id_pedido: pedidoId,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal,
      }));

      const { error: detallesError } = await this.repository.createDetalles(detallesFinales);

      if (detallesError) {
        // Opcional: Podríamos borrar el pedido si fallan los detalles (Rollback manual)
        await this.client.from("pedidos").delete().eq("id", pedidoId);
        return { pedido: null, error: detallesError };
      }

      return { pedido, error: null };
    } catch (err) {
      return { pedido: null, error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Cambiar estado del pedido (Admin) */
  async actualizarEstado(id: number, nuevoEstado: EstadoPedido): Promise<{
    success: boolean;
    error: string | null;
  }> {
      // Si se pasa a producción, descontar del inventario general
      if (nuevoEstado === "EN_PRODUCCION") {
        try {
          // Verificar estado actual para no descontar doble
          const { data: pedidoActual } = await this.client
            .from("pedidos")
            .select("estado")
            .eq("id", id)
            .single();

          if (pedidoActual && pedidoActual.estado !== "EN_PRODUCCION" && pedidoActual.estado !== "ENTREGADO" && pedidoActual.estado !== "EN_TALLER") {

            const { data: detalles } = await this.client
              .from("pedido_detalle")
              .select("id_producto, cantidad")
              .eq("id_pedido", id);
            
            if (detalles && detalles.length > 0) {
              for (const det of detalles) {
                // Leer stock actual
                const { data: prod } = await this.client
                  .from("producto")
                  .select("stock_actual")
                  .eq("id", det.id_producto)
                  .single();
                
                if (prod) {
                  // Descontar asegurando que no baje de 0
                  await this.client
                    .from("producto")
                    .update({ stock_actual: Math.max(0, prod.stock_actual - det.cantidad) })
                    .eq("id", det.id_producto);
                }
              }
            }
          }
        } catch (err) {
          console.error("Error al procesar inventario durante la aprobación:", err);
        }
      }

      const { error } = await this.client
        .from("pedidos")
        .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
  }
}
