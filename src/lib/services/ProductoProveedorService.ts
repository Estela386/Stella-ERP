import { SupabaseClient } from "@supabase/supabase-js";
import { ProductoProveedorRepository } from "../repositories/ProductoProveedorRepository";
import { CreateProductoProveedorDTO } from "../models/ProductoProveedor";

export class ProductoProveedorService {
  private repository: ProductoProveedorRepository;

  constructor(client: SupabaseClient) {
    this.repository = new ProductoProveedorRepository(client);
  }

  async obtenerPorProducto(idProducto: number) {
    return await this.repository.getByProducto(idProducto);
  }

  async guardarRelacion(data: CreateProductoProveedorDTO) {
    // Primero eliminar si existe
    await this.repository.deleteByProducto(data.id_producto);
    
    // Luego insertar
    return await this.repository.create({
      ...data,
      tiempo_entrega: data.tiempo_entrega ?? null
    } as any);
  }


  async eliminarPorProducto(idProducto: number) {
    return await this.repository.deleteByProducto(idProducto);
  }
}
