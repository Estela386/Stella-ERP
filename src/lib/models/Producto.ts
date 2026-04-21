/**
 * Modelo de Producto
 * Representa la estructura de datos de un producto en la base de datos
 */
export interface IProducto {
  id: number;
  nombre: string | null;
  costo: number | null;
  costo_mayorista?: number | null;
  precio: number;
  tiempo: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  url_imagen: string | null;
  id_categoria: number | null;
  categoria?: { id: number; nombre: string | null };
  es_personalizable?: boolean | null;
  descripcion?: string | null;
  tipo: "fabricado" | "revendido";
  producto_material?: { materiales?: { nombre: string } }[];
  activo: boolean;
  opciones?: any[];
  url_filtro_tiktok?: string | null; // <-- Nueva propiedad
}

/**
 * DTO para crear un nuevo producto
 * Excluye el id ya que es autogenerado
 */
export interface OpcionDTO {
  id?: number;
  nombre: string;
  tipo: "select" | "multi" | "text" | "color" | "bubbles";
  obligatorio: boolean;
  valores: { valor: string; precio_extra?: number; stock?: number }[];
}

export interface CreateProductoDTO {
  nombre: string;
  precio: number;
  costo?: number;
  costo_mayorista?: number;
  tiempo?: number;
  stock_actual?: number;
  stock_min?: number;
  url_imagen?: string;
  id_categoria?: number;
  descripcion?: string;
  es_personalizable: boolean;
  tipo: "fabricado" | "revendido";
  opciones?: OpcionDTO[];
  url_filtro_tiktok?: string; // <-- Nueva propiedad
}

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
  costo_mayorista?: number | null;
  precio: number;
  tiempo: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  url_imagen: string | null;
  id_categoria: number | null;
  categoria?: { id: number; nombre: string | null };
  es_personalizable?: boolean | null;
  descripcion?: string | null;
  tipo: "fabricado" | "revendido";
  producto_material?: { materiales?: { nombre: string } }[];
  activo: boolean;
  opciones?: any[];
  url_filtro_tiktok?: string | null;

  constructor(data: IProducto) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.costo = data.costo;
    this.costo_mayorista = data.costo_mayorista;
    this.precio = data.precio;
    this.tiempo = data.tiempo;
    this.stock_actual = data.stock_actual;
    this.stock_min = data.stock_min;
    this.url_imagen = data.url_imagen;
    this.id_categoria = data.id_categoria;
    this.categoria = data.categoria;
    this.es_personalizable = data.es_personalizable;
    this.descripcion = data.descripcion;
    this.tipo = data.tipo || "fabricado";
    this.producto_material = data.producto_material;
    this.activo = data.activo ?? true;
    this.opciones = data.opciones;
    this.url_filtro_tiktok = data.url_filtro_tiktok ?? null;
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

    if (this.stock_actual !== null && this.stock_actual < 0) {
      errors.push("El stock actual no puede ser negativo");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Genera una representación JSON del producto
   */
  toJSON(): IProducto {
    return {
      id: this.id,
      nombre: this.nombre,
      costo: this.costo,
      costo_mayorista: this.costo_mayorista,
      precio: this.precio,
      tiempo: this.tiempo,
      stock_actual: this.stock_actual,
      stock_min: this.stock_min,
      url_imagen: this.url_imagen,
      id_categoria: this.id_categoria,
      categoria: this.categoria,
      es_personalizable: this.es_personalizable,
      descripcion: this.descripcion,
      tipo: this.tipo,
      producto_material: this.producto_material,
      activo: this.activo,
      opciones: this.opciones,
    };
  }
}
