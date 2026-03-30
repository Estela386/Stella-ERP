import { SupabaseClient } from "@supabase/supabase-js";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { IUsuarioMayorista } from "../models/Consignacion";
import { IUsuario } from "../models/Usuario";

export class UsuarioService {
  private repo: UsuarioRepository;

  constructor(client: SupabaseClient) {
    this.repo = new UsuarioRepository(client);
  }

  /** Listar usuarios mayoristas (rol 3) */
  async listarMayoristas(): Promise<{
    mayoristas: IUsuarioMayorista[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getMayoristas();
    return { mayoristas: data ?? [], error };
  }

  /** Listar usuarios normales (rol 2) — candidatos a mayorista */
  async listarClientesNormales(): Promise<{
    usuarios: IUsuarioMayorista[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getClientesNormales();
    return { usuarios: data ?? [], error };
  }

  /** Promover usuario a mayorista */
  async promoverAMayorista(idUsuario: number): Promise<{
    usuario: IUsuario | null;
    error: string | null;
  }> {
    const { data, error } = await this.repo.promoverAMayorista(idUsuario);
    return { usuario: data, error };
  }

  /** Obtener usuario por id_auth */
  async obtenerPorAuthId(authId: string): Promise<{
    usuario: IUsuario | null;
    error: string | null;
  }> {
    const { data, error } = await this.repo.getByAuthId(authId);
    return { usuario: data, error };
  }
}
