import { SupabaseClient } from "@supabase/supabase-js";
import { SolicitudMayoristaRepository } from "../repositories/SolicitudMayoristaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import {
  ISolicitudMayorista,
  CreateSolicitudDTO,
  EstadoSolicitud,
} from "../models/Consignacion";

export class SolicitudMayoristaService {
  private repo: SolicitudMayoristaRepository;
  private usuarioRepo: UsuarioRepository;

  constructor(client: SupabaseClient) {
    this.repo = new SolicitudMayoristaRepository(client);
    this.usuarioRepo = new UsuarioRepository(client);
  }

  /** Listar todas las solicitudes */
  async listarTodas(): Promise<{
    solicitudes: ISolicitudMayorista[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getAllWithJoins();
    return { solicitudes: data ?? [], error };
  }

  /** Listar solicitudes pendientes */
  async listarPendientes(): Promise<{
    solicitudes: ISolicitudMayorista[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getByEstado("pendiente");
    return { solicitudes: data ?? [], error };
  }

  /** Crear solicitud (desde usuario tipo 2) */
  async crear(dto: CreateSolicitudDTO): Promise<{
    solicitud: ISolicitudMayorista | null;
    error: string | null;
  }> {
    // Verificar si ya tiene solicitud pendiente
    const { data: existentes } = await this.repo.getByUsuario(dto.id_usuario);
    const pendiente = existentes?.find(s => s.estado === "pendiente");
    if (pendiente) {
      return {
        solicitud: null,
        error: "Ya tienes una solicitud pendiente. Espera la respuesta del administrador.",
      };
    }

    const { data, error } = await this.repo.createSolicitud(dto);
    return { solicitud: data, error };
  }

  /** Aprobar solicitud → cambiar rol del usuario a 3 */
  async aprobar(
    idSolicitud: number,
    adminId: number
  ): Promise<{ success: boolean; error: string | null }> {
    // Obtener solicitud
    const { data: sol, error: getErr } = await this.repo.getById(idSolicitud);
    if (getErr || !sol) return { success: false, error: getErr ?? "Solicitud no encontrada" };

    // Cambiar rol del usuario
    const { error: rolErr } = await this.usuarioRepo.promoverAMayorista(
      (sol as any).id_usuario
    );
    if (rolErr) return { success: false, error: rolErr };

    // Actualizar estado de la solicitud
    const { error } = await this.repo.updateEstado(idSolicitud, {
      estado: "aprobada",
      revisado_por: adminId,
      fecha_respuesta: new Date().toISOString(),
    });

    return { success: !error, error };
  }

  /** Rechazar solicitud */
  async rechazar(
    idSolicitud: number,
    adminId: number
  ): Promise<{ success: boolean; error: string | null }> {
    const { error } = await this.repo.updateEstado(idSolicitud, {
      estado: "rechazada",
      revisado_por: adminId,
      fecha_respuesta: new Date().toISOString(),
    });

    return { success: !error, error };
  }
}
