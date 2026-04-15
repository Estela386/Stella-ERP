import { SupabaseClient } from "@supabase/supabase-js";
import {
  ILoyaltyProfile,
  IUserLevel,
  ILoyaltyTransaction,
} from "../models/Loyalty";

export class LoyaltyService {
  constructor(private client: SupabaseClient) {}

  /**
   * Obtiene el perfil completo del usuario, su nivel actual y cuánto le falta para el siguiente.
   */
  async obtenerPerfilLealtad(
    usuarioId: number
  ): Promise<{ perfil: ILoyaltyProfile | null; error: string | null }> {
    try {
      // 1. Obtener puntos actuales
      const { data: pointsData } = await this.client
        .from("loyalty_points")
        .select("*")
        .eq("id_usuario", usuarioId)
        .single();

      const lifetimePoints = pointsData?.lifetime_points || 0;
      const currentPoints = pointsData?.points || 0;

      // 2. Obtener todos los niveles ordenados
      const { data: levels } = await this.client
        .from("user_levels")
        .select("*")
        .order("min_points", { ascending: true });

      if (!levels) throw new Error("No se encontraron niveles de lealtad");

      // 3. Calcular nivel actual y próximo
      let nivelActual = levels[0];
      let proximoNivel = null;

      for (let i = 0; i < levels.length; i++) {
        if (lifetimePoints >= levels[i].min_points) {
          nivelActual = levels[i];
          proximoNivel = levels[i + 1] || null; // Si no hay siguiente, ya es el nivel máximo
        }
      }

      return {
        perfil: {
          id_usuario: usuarioId,
          points: currentPoints,
          lifetime_points: lifetimePoints,
          nivel_actual: nivelActual,
          proximo_nivel: proximoNivel,
        },
        error: null,
      };
    } catch (error: any) {
      return { perfil: null, error: error.message };
    }
  }

  /**
   * Obtiene el historial de puntos (sumas y restas)
   */
  async obtenerHistorial(usuarioId: number): Promise<ILoyaltyTransaction[]> {
    const { data } = await this.client
      .from("loyalty_transactions")
      .select("*")
      .eq("id_usuario", usuarioId)
      .order("created_at", { ascending: false })
      .limit(10);

    return data || [];
  }

  /**
   * Llama a la función SQL para otorgar puntos por una compra
   * (Llama a esta función cuando una venta cambie a estado 'pagado')
   */
  async otorgarPuntosPorCompra(
    usuarioId: number,
    totalVenta: number,
    ventaId: number
  ): Promise<boolean> {
    // Regla de negocio: 1 punto por cada $10 MXN gastados
    const puntosGanados = Math.floor(totalVenta / 10);

    if (puntosGanados <= 0) return true;

    const { error } = await this.client.rpc("procesar_puntos_lealtad", {
      p_id_usuario: usuarioId,
      p_puntos: puntosGanados,
      p_tipo: "compra",
      p_descripcion: `Puntos por pedido #${ventaId}`,
      p_reference_id: ventaId,
    });

    return !error;
  }
}
