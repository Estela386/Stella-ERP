/**
 * Modelo de ProductoInsumo
 * Representa la relación entre un producto y sus insumos necesarios
 */
export interface IProductoInsumo {
  id: number;
  id_producto: number | null;
  id_insumo: number | null;
  cantidad_necesaria: number | null;
  id_opcion_valor?: number | null;

  // Campos opcionales para cuando se hace join con insumos
  insumo?: {
    nombre: string;
    unidad_medida: string;
  };
}

/**
 * DTO para crear una relación producto-insumo
 */
export interface CreateProductoInsumoDTO {
  id_producto: number;
  id_insumo: number;
  cantidad_necesaria: number;
  id_opcion_valor?: number | null;

}

/**
 * Clase ProductoInsumo
 */
export class ProductoInsumo implements IProductoInsumo {
  id: number;
  id_producto: number | null;
  id_insumo: number | null;
  cantidad_necesaria: number | null;
  id_opcion_valor?: number | null;

  insumo?: {
    nombre: string;
    unidad_medida: string;
  };

  constructor(data: IProductoInsumo) {
    this.id = data.id;
    this.id_producto = data.id_producto;
    this.id_insumo = data.id_insumo;
    this.cantidad_necesaria = data.cantidad_necesaria;
    this.id_opcion_valor = data.id_opcion_valor;

    this.insumo = data.insumo;
  }

  toJSON(): IProductoInsumo {
    return {
      id: this.id,
      id_producto: this.id_producto,
      id_insumo: this.id_insumo,
      cantidad_necesaria: this.cantidad_necesaria,
      id_opcion_valor: this.id_opcion_valor,
      insumo: this.insumo,
    };

  }
}
