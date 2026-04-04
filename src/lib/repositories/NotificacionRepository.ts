import { SupabaseClient } from "@supabase/supabase-js";
import { INotificacion } from "@lib/models/Notificacion";

// =========================================
// 📦 REPOSITORIO: NOTIFICACIONES
// =========================================

export class NotificacionRepository {
  private client: SupabaseClient;
  private table = "notificaciones";

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  /** Obtiene todas las notificaciones no leídas */
  async getNoLeidas(): Promise<{ data: INotificacion[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select("*")
        .eq("leida", false)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) return { data: null, error: error.message };
      return { data: data as INotificacion[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Obtiene todas las notificaciones (leídas y no leídas) */
  async getTodas(): Promise<{ data: INotificacion[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) return { data: null, error: error.message };
      return { data: data as INotificacion[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Marca una notificación como leída */
  async marcarLeida(id: number): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client
        .from(this.table)
        .update({ leida: true })
        .eq("id", id);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Marca todas las notificaciones como leídas */
  async marcarTodasLeidas(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client
        .from(this.table)
        .update({ leida: true })
        .eq("leida", false);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Elimina una notificación */
  async eliminar(id: number): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client
        .from(this.table)
        .delete()
        .eq("id", id);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Error desconocido" };
    }
  }

  /** Suscripción en tiempo real a nuevas notificaciones */
  suscribirTiempoReal(callback: (notif: INotificacion) => void) {
    return this.client
      .channel("notificaciones_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: this.table },
        (payload) => {
          callback(payload.new as INotificacion);
        }
      )
      .subscribe();
  }
}
