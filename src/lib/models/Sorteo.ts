export interface ISorteo {
  id: number;
  nombre: string;
  descripcion?: string;
  premio: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  id_banner?: number;
  created_at: string;
}

export interface ISorteoParticipante {
  id: number;
  id_sorteo: number;
  nombre: string;
  correo: string;
  telefono?: string;
  preferencia?: string;
  ip?: string;
  created_at: string;
}

export interface ISorteoGanador {
  id: number;
  id_sorteo: number;
  id_participante: number;
  fecha: string;
  // Join data opcional
  participante?: ISorteoParticipante;
}

export interface CreateParticipanteDTO {
  id_sorteo: number;
  nombre: string;
  correo: string;
  telefono?: string;
  preferencia?: string;
  ip?: string;
}
