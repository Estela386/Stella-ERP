export interface IAnalisisInventario {
  id: number;
  nombre: string;
  url_imagen: string | null;
  stock_actual: number;
  stock_min: number;
  precio: number;
  fecha_ultimo_ingreso: string;
  no_resurtir: boolean;
  dias_estancado: number;
  descuento_automatico: number;
  sugerencia_no_resurtir: boolean;
}

export class AnalisisInventario implements IAnalisisInventario {
  id: number;
  nombre: string;
  url_imagen: string | null;
  stock_actual: number;
  stock_min: number;
  precio: number;
  fecha_ultimo_ingreso: string;
  no_resurtir: boolean;
  dias_estancado: number;
  descuento_automatico: number;
  sugerencia_no_resurtir: boolean;

  constructor(data: IAnalisisInventario) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.url_imagen = data.url_imagen;
    this.stock_actual = data.stock_actual;
    this.stock_min = data.stock_min;
    this.precio = data.precio;
    this.fecha_ultimo_ingreso = data.fecha_ultimo_ingreso;
    this.no_resurtir = data.no_resurtir;
    this.dias_estancado = data.dias_estancado;
    this.descuento_automatico = data.descuento_automatico;
    this.sugerencia_no_resurtir = data.sugerencia_no_resurtir;
  }

  // Helper para saber si el precio final con el descuento
  getPrecioFinal(): number {
    if (this.descuento_automatico <= 0) return this.precio;
    return this.precio - this.precio * (this.descuento_automatico / 100);
  }
}
