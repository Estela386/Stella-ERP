/**
 * Modelo de Producto
 * Representa la estructura de datos de un producto en la base de datos
 */
export interface IProducto {
  id: number;
  nombre: string | null;
  costo: number | null;
  precio: number | null;
  tiempo: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  url_imagen: string | null;
  id_categoria: number | null;
}

/**
 * DTO para crear un nuevo producto
 * Excluye el id ya que es autogenerado
 */
export type CreateProductoDTO = Omit<IProducto, "id">;

/**
 * DTO para actualizar un producto
 * Todos los campos son opcionales excepto el id
 */
export type UpdateProductoDTO = Partial<Omit<IProducto, "id">>;

/**
 * Clase Producto
 * Encapsula la lógica de negocio de un producto
 */
export class Producto implements IProducto {
  id: number;
  nombre: string | null;
  costo: number | null;
  precio: number | null;
  tiempo: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  url_imagen: string | null;
  id_categoria: number | null;

  constructor(data: IProducto) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.costo = data.costo;
    this.precio = data.precio;
    this.tiempo = data.tiempo;
    this.stock_actual = data.stock_actual;
    this.stock_min = data.stock_min;
    this.url_imagen = data.url_imagen;
    this.id_categoria = data.id_categoria;
  }

  /**
   * Calcula el margen de ganancia del producto
   * @returns Margen en porcentaje o null si falta información
   */
  calcularMargen(): number | null {
    if (!this.costo || !this.precio) return null;
    return ((this.precio - this.costo) / this.costo) * 100;
  }

  /**
   * Verifica si el stock actual está por debajo del mínimo
   * @returns true si el stock está bajo, false en caso contrario
   */
  esStockBajo(): boolean {
    if (this.stock_actual === null || this.stock_min === null) return false;
    return this.stock_actual < this.stock_min;
  }

  /**
   * Valida que los datos del producto sean válidos
   * @returns { valid: boolean, errors: string[] }
   */
  validar(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errors.push("El nombre del producto es requerido");
    }

    if (this.costo !== null && this.costo < 0) {
      errors.push("El costo no puede ser negativo");
    }

    if (this.precio !== null && this.precio < 0) {
      errors.push("El precio no puede ser negativo");
    }

    if (
      this.costo !== null &&
      this.precio !== null &&
      this.precio < this.costo
    ) {
      errors.push("El precio no puede ser menor al costo");
    }

    if (this.stock_actual !== null && this.stock_actual < 0) {
      errors.push("El stock actual no puede ser negativo");
    }

    if (this.stock_min !== null && this.stock_min < 0) {
      errors.push("El stock mínimo no puede ser negativo");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convierte el objeto Producto a un formato JSON
   */
  toJSON(): IProducto {
    return {
      id: this.id,
      nombre: this.nombre,
      costo: this.costo,
      precio: this.precio,
      tiempo: this.tiempo,
      stock_actual: this.stock_actual,
      stock_min: this.stock_min,
      url_imagen: this.url_imagen,
      id_categoria: this.id_categoria,
    };
  }
}
