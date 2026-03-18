import { ReactNode } from "react";

export interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
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
  telefono: string;
}

export interface UserStats {
  pedidosTotales: number;
  montoPendiente: number;
  puntosLealtad: number;
}
