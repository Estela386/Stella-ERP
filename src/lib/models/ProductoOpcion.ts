export interface IProductoOpcion {
  id: number;
  producto_id: number;
  nombre: string;
  tipo: "select" | "text" | "number" | "color" | "multi" | "bubbles";
  obligatorio: boolean;
  max_selecciones?: number;
  orden?: number;
}

export class ProductoOpcion {
  constructor(public data: IProductoOpcion) {}
}
