export interface IUserLevel {
  id: number;
  name: string;
  min_points: number;
  discount_percent: number;
}

export interface ILoyaltyProfile {
  id_usuario: number;
  points: number;
  lifetime_points: number;
  nivel_actual?: IUserLevel;
  proximo_nivel?: IUserLevel;
}

export interface ILoyaltyTransaction {
  id: number;
  points: number;
  type: string;
  description: string;
  created_at: string;
}
