export type Categoria = {
  id: number;
  nombre: string;
};

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  costo: number;
  stock_actual: number;
  stock_min: number;
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
