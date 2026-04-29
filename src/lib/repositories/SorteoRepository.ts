import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { ISorteo, ISorteoParticipante, ISorteoGanador, CreateParticipanteDTO } from "@lib/models/Sorteo";

export class SorteoRepository extends BaseRepository<ISorteo> {
  constructor(client: SupabaseClient) {
    super(client, "sorteos");
  }

  /**
   * Obtiene el sorteo activo actual de forma robusta
   */
  async getActive(): Promise<{ data: ISorteo | null; error: string | null }> {
    try {
      const now = new Date().toISOString();
      
      // 1. Obtener el sorteo activo (sin joins para evitar errores de FK)
      const { data: sorteo, error: errorSorteo } = await this.client
        .from("sorteos")
        .select("*")
        .eq("activo", true)
        .lte("fecha_inicio", now)
        .gte("fecha_fin", now)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (errorSorteo) return { data: null, error: errorSorteo.message };
      if (!sorteo) return { data: null, error: null };

      // 2. Obtener el banner vinculado manualmente
      if (sorteo.id_banner) {
        const { data: banner } = await this.client
          .from("campana_banner")
          .select("*")
          .eq("id", sorteo.id_banner)
          .single();
        
        if (banner) {
          sorteo.banner = banner;
        }
      }

      // 3. Obtener ganadores si existen
      const { data: ganadores } = await this.client
        .from("sorteo_ganadores")
        .select(`
          fecha,
          participante:sorteo_participantes(nombre, correo)
        `)
        .eq("id_sorteo", sorteo.id);
      
      if (ganadores) {
        sorteo.ganadores = ganadores;
      }

      return { data: sorteo as ISorteo, error: null };
    } catch (err) {
      console.error("Error en Repository Sorteo:", err);
      return { data: null, error: "Error interno al obtener sorteo" };
    }
  }

  async getByBanner(idBanner: number): Promise<{ data: ISorteo | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("id_banner", idBanner)
        .maybeSingle();

      if (error) return { data: null, error: error.message };
      return { data: data as ISorteo, error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener sorteo por banner" };
    }
  }

  async addParticipante(dto: CreateParticipanteDTO): Promise<{ data: ISorteoParticipante | null; error: string | null; alreadyExists?: boolean }> {
    try {
      const { data, error } = await this.client
        .from("sorteo_participantes")
        .insert([dto])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { data: null, error: "Ya estás registrado en este sorteo", alreadyExists: true };
        }
        return { data: null, error: error.message };
      }

      return { data: data as ISorteoParticipante, error: null };
    } catch (err) {
      return { data: null, error: "Error al registrar participante" };
    }
  }

  async getParticipantes(idSorteo: number): Promise<{ data: ISorteoParticipante[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("sorteo_participantes")
        .select("*")
        .eq("id_sorteo", idSorteo)
        .order("created_at", { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as ISorteoParticipante[], error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener participantes" };
    }
  }

  async addGanador(idSorteo: number, idParticipante: number): Promise<{ data: ISorteoGanador | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("sorteo_ganadores")
        .insert([{ id_sorteo: idSorteo, id_participante: idParticipante }])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as ISorteoGanador, error: null };
    } catch (err) {
      return { data: null, error: "Error al registrar ganador" };
    }
  }

  async getGanadores(idSorteo: number): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await this.client
        .from("sorteo_ganadores")
        .select(`
          *,
          participante:sorteo_participantes(*)
        `)
        .eq("id_sorteo", idSorteo);

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener ganadores" };
    }
  }
}
