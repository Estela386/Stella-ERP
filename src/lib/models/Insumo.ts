export interface IInsumo {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number; // 👈 stock actual
  precio: number;
  unidad_medida?: string;
  stock_minimo?: number;
  id_proveedor?: number;
  fecha_registro?: string;
  activo: boolean;
}

export type CreateInsumoDTO = Omit<IInsumo, "id" | "fecha_registro">;
export type UpdateInsumoDTO = Partial<Omit<IInsumo, "id" | "fecha_registro">>;

export class Insumo implements IInsumo {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number;
  precio: number;
  unidad_medida?: string;
  stock_minimo?: number;
  id_proveedor?: number;
  fecha_registro?: string;
  activo: boolean;

  constructor(data: IInsumo) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.tipo = data.tipo;
    this.cantidad = data.cantidad;
    this.precio = data.precio;
    this.unidad_medida = data.unidad_medida;
    this.stock_minimo = data.stock_minimo;
    this.id_proveedor = data.id_proveedor;
    this.fecha_registro = data.fecha_registro;
    this.activo = data.activo ?? true;
  }

  validar() {
    const errors: string[] = [];

    if (!this.nombre?.trim()) errors.push("El nombre es requerido");
    if (!this.tipo?.trim()) errors.push("El tipo es requerido");
    if (this.cantidad < 0) errors.push("La cantidad no puede ser negativa");
    if (this.precio < 0) errors.push("El precio no puede ser negativo");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
