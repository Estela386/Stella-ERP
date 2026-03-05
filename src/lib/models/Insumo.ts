export interface IInsumo {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number; // 👈 stock actual
  precio: number;
}

export type CreateInsumoDTO = Omit<IInsumo, "id">;
export type UpdateInsumoDTO = Partial<Omit<IInsumo, "id">>;

export class Insumo implements IInsumo {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number;
  precio: number;

  constructor(data: IInsumo) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.tipo = data.tipo;
    this.cantidad = data.cantidad;
    this.precio = data.precio;
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
