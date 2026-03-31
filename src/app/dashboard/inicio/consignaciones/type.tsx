/**
 * Tipos locales del módulo de Consignaciones
 * Reutilizan los modelos de /lib pero re-exportan para uso interno
 */
export type {
  IConsignacion,
  CreateConsignacionDTO,
  UpdateConsignacionDTO,
  EstadoConsignacion,
  ISolicitudMayorista,
  CreateSolicitudDTO,
  UpdateSolicitudDTO,
  EstadoSolicitud,
  IMovimientoProducto,
  IUsuarioMayorista,
} from "@lib/models";

// Tipos requeridos por componentes InventoryStats, ProductRow y ProductTable
export interface Usuario {
  rol: "admin" | "mayorista" | "cliente";
  nombre?: string;
  id?: number | string;
}

export interface Consignacion {
  id: number | string;
  producto: {
    id?: number;
    nombre: string;
  };
  cliente: {
    id?: number;
    nombre: string;
  };
  mayorista?: {
      id?: number;
      nombre: string;
  };
  cantidad: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  precio_consignado: number;
  estado: "ACTIVA" | "VENCIDA" | "FINALIZADA" | "CANCELADA" | string;
  detalles?: any[]; // Para compatibilidad si se llegara a usar después
}
