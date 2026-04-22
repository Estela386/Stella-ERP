export type Categoria = {
  id: number;
  nombre: string | null;
};

export type Producto = {
  id: number;
  nombre: string | null;
  precio: number | null;
  costo: number | null;
  costo_mayorista?: number | null;
  stock_actual: number | null;
  stock_min: number | null;
  tiempo?: number | null;
  url_imagen?: string | null;
  id_categoria?: number | null;
  categoria?: Categoria;
  es_personalizable?: boolean | null;
  descripcion?: string | null;
  tipo: "fabricado" | "revendido";
  opciones?: any[];
  ganancia?: number;
  roi_porcentaje?: number;
  url_filtro_tiktok?: string | null;
  iva?: number | null;
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
