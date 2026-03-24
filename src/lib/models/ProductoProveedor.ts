import { Proveedor } from "./Proveedor";

export interface IProductoProveedor {
  id: number;
  id_producto: number;
  id_proveedor: number;
  precio_compra: number;
  tiempo_entrega: number | null;
  proveedores?: {
    nombre: string;
    empresa: string | null;
  };
}

export interface CreateProductoProveedorDTO {
  id_producto: number;
  id_proveedor: number;
  precio_compra: number;
  tiempo_entrega?: number | null;
}

export class ProductoProveedor implements IProductoProveedor {
  id: number;
  id_producto: number;
  id_proveedor: number;
  precio_compra: number;
  tiempo_entrega: number | null;
  proveedores?: {
    nombre: string;
    empresa: string | null;
  };

  constructor(data: IProductoProveedor) {
    this.id = data.id;
    this.id_producto = data.id_producto;
    this.id_proveedor = data.id_proveedor;
    this.precio_compra = data.precio_compra;
    this.tiempo_entrega = data.tiempo_entrega;
    this.proveedores = data.proveedores;
  }
}
