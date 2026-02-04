/**
 * Modelo de Categoría
 * Representa la estructura de datos de una categoría en la base de datos
 */
export interface ICategoria {
  id: number;
  nombre: string | null;
}

/**
 * DTO para crear una nueva categoría
 */
export type CreateCategoriaDTO = Omit<ICategoria, "id">;

/**
 * DTO para actualizar una categoría
 */
export type UpdateCategoriaDTO = Partial<Omit<ICategoria, "id">>;

/**
 * Clase Categoría
 * Encapsula la lógica de negocio de una categoría
 */
export class Categoria implements ICategoria {
  id: number;
  nombre: string | null;

  constructor(data: ICategoria) {
    this.id = data.id;
    this.nombre = data.nombre;
  }

  /**
   * Valida que los datos de la categoría sean válidos
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errors.push("El nombre de la categoría es requerido");
    }

    if (this.nombre && this.nombre.length > 100) {
      errors.push("El nombre de la categoría no debe exceder 100 caracteres");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convierte el objeto Categoría a un formato JSON
   */
  toJSON(): ICategoria {
    return {
      id: this.id,
      nombre: this.nombre,
    };
  }
}
