import { ReactNode } from "react";

export interface UserProfile {
  id: number;
  clienteId: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  avatarUrl?: string;
  fechaRegistro: string;
}

export interface ProfileStat {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export interface ProfileFormData {
  nombre: string;
  correo: string;
}

export interface UserStats {
  pedidosTotales: number;
  montoPendiente: number;
  puntosLealtad: number;
}
