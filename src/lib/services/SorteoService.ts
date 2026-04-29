import { SupabaseClient } from "@supabase/supabase-js";
import { SorteoRepository } from "@lib/repositories/SorteoRepository";
import { CreateParticipanteDTO, ISorteo, ISorteoParticipante } from "@lib/models/Sorteo";

export class SorteoService {
  private repository: SorteoRepository;

  constructor(client: SupabaseClient) {
    this.repository = new SorteoRepository(client);
  }

  async obtenerSorteoActivo() {
    return await this.repository.getActive();
  }

  async obtenerPorBanner(idBanner: number) {
    return await this.repository.getByBanner(idBanner);
  }

  async participar(dto: CreateParticipanteDTO) {
    return await this.repository.addParticipante(dto);
  }

  async obtenerParticipantes(idSorteo: number) {
    return await this.repository.getParticipantes(idSorteo);
  }

  async obtenerTodosLosSorteos() {
    return await this.repository.getAll();
  }

  async elegirGanadorAlAzar(idSorteo: number): Promise<{ data: ISorteoParticipante | null; error: string | null }> {
    const { data: participantes, error } = await this.repository.getParticipantes(idSorteo);
    
    if (error) return { data: null, error };
    if (!participantes || participantes.length === 0) return { data: null, error: "No hay participantes en este sorteo" };

    const randomIndex = Math.floor(Math.random() * participantes.length);
    const ganador = participantes[randomIndex];

    // Registrar ganador en la tabla histórica
    const { error: errorReg } = await this.repository.addGanador(idSorteo, ganador.id);
    if (errorReg) return { data: null, error: errorReg };

    return { data: ganador, error: null };
  }

  async obtenerGanadores(idSorteo: number) {
    return await this.repository.getGanadores(idSorteo);
  }
}
