export type Categoria = {
  id: number;
  nombre: string;
};

export type Producto = {
  id: number;
  nombre: string | null;
  precio: number | null;
  costo: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  tiempo?: number | null;
  url_imagen?: string | null;
  id_categoria?: number | null;
  categoria: Categoria;
};

export type HistorialProducto = {
  id: number;
  cantidad: number;
  tipo: "entrada" | "salida" | "ajuste";
  fecha: string;
};

export type UbicacionProducto = {
  id: number;
  producto_id: number;
  historial: HistorialProducto;
};
