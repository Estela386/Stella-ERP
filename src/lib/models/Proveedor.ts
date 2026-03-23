export interface IProveedor {
  id: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  empresa?: string;
  fecha_registro?: string;
  activo: boolean;
}

export type CreateProveedorDTO = Omit<IProveedor, "id" | "fecha_registro">;
export type UpdateProveedorDTO = Partial<Omit<IProveedor, "id" | "fecha_registro">>;

export class Proveedor implements IProveedor {
  id: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  empresa?: string;
  fecha_registro?: string;
  activo: boolean;

  constructor(data: IProveedor) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.telefono = data.telefono;
    this.correo = data.correo;
    this.direccion = data.direccion;
    this.empresa = data.empresa;
    this.fecha_registro = data.fecha_registro;
    this.activo = data.activo ?? true;
  }

  validar() {
    const errors: string[] = [];

    if (!this.nombre?.trim()) errors.push("El nombre es requerido");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
