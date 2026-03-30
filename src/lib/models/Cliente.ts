/**
 * Modelo de Cliente
 * Representa la estructura de datos de un cliente en la base de datos
 */
export interface ICliente {
  id: number;
  nombre: string;
  telefono: string;
  id_usuario?: number; // Relación opcional con usuario
}

/**
 * DTO para crear un nuevo cliente
 * Excluye el id ya que es autogenerado
 */
export type CreateClienteDTO = Omit<ICliente, "id">;

/**
 * DTO para actualizar un cliente
 * Todos los campos son opcionales excepto el id
 */
export type UpdateClienteDTO = Partial<Omit<ICliente, "id">>;

/**
 * Clase Cliente
 * Encapsula la lógica de negocio de un cliente
 */
export class Cliente implements ICliente {
  id: number;
  nombre: string;
  telefono: string;

  constructor(data: ICliente) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.telefono = data.telefono;
  }

  /**
   * Valida que los datos del cliente sean válidos
   * @returns { valid: boolean, errors: string[] }
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errors.push("El nombre del cliente es requerido");
    }

    if (!this.telefono || this.telefono.trim().length === 0) {
      errors.push("El teléfono del cliente es requerido");
    }

    if (this.telefono && this.telefono.length < 10) {
      errors.push("El teléfono debe tener al menos 10 dígitos");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtiene una representación en texto del cliente
   */
  toString(): string {
    return `${this.nombre} (${this.telefono})`;
  }
}
