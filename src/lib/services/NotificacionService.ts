import { SupabaseClient } from "@supabase/supabase-js";
import { NotificacionRepository } from "@lib/repositories/NotificacionRepository";
import { INotificacion } from "@lib/models/Notificacion";

// =========================================
// 🔔 SERVICIO: NOTIFICACIONES
// =========================================

export class NotificacionService {
  private repo: NotificacionRepository;

  constructor(client: SupabaseClient) {
    this.repo = new NotificacionRepository(client);
  }

  async obtenerNoLeidas(): Promise<{ notificaciones: INotificacion[]; error: string | null }> {
    const { data, error } = await this.repo.getNoLeidas();
    return { notificaciones: data ?? [], error };
  }

  async obtenerTodas(): Promise<{ notificaciones: INotificacion[]; error: string | null }> {
    const { data, error } = await this.repo.getTodas();
    return { notificaciones: data ?? [], error };
  }

  async marcarLeida(id: number): Promise<{ error: string | null }> {
    return this.repo.marcarLeida(id);
  }

  async marcarTodasLeidas(): Promise<{ error: string | null }> {
    return this.repo.marcarTodasLeidas();
  }

  async eliminar(id: number): Promise<{ error: string | null }> {
    return this.repo.eliminar(id);
  }

  suscribirTiempoReal(callback: (notif: INotificacion) => void) {
    return this.repo.suscribirTiempoReal(callback);
  }
}
