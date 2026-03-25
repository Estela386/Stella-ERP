import { SupabaseClient } from "@supabase/supabase-js";
import { ProductoInsumoRepository } from "../repositories/ProductoInsumoRepository";
import {
  ProductoInsumo,
  CreateProductoInsumoDTO,
} from "../models/ProductoInsumo";

/**
 * Servicio para gestionar la relación entre productos e insumos
 */
export class ProductoInsumoService {
  private repository: ProductoInsumoRepository;

  constructor(client: SupabaseClient) {
    this.repository = new ProductoInsumoRepository(client);
  }

  /**
   * Obtiene los insumos asociados a un producto
   */
  async obtenerInsumosPorProducto(idProducto: number) {
    const { data, error } = await this.repository.getByProducto(idProducto);

    if (error || !data) {
      return { insumos: null, error };
    }

    const insumos = data.map(item => new ProductoInsumo(item));
    return { insumos, error: null };
  }

  /**
   * Guarda los insumos asociados a un producto (reemplaza los existentes)
   */
  async guardarInsumosProducto(
    idProducto: number,
    insumos: { 
      id_insumo: number; 
      cantidad_necesaria: number; 
      id_opcion_valor?: number | null;
    }[]
  ) {

    // 1. Eliminar insumos actuales
    const { success, error: errorDelete } =
      await this.repository.deleteByProducto(idProducto);

    if (!success) {
      return { success: false, error: errorDelete };
    }

    if (insumos.length === 0) {
      return { success: true, error: null };
    }

    // 2. Insertar nuevos insumos
    const dataToInsert = insumos.map(item => ({
      id_producto: idProducto,
      id_insumo: item.id_insumo,
      cantidad_necesaria: item.cantidad_necesaria,
      id_opcion_valor: item.id_opcion_valor || null,
    }));

    const { data, error: errorInsert } = await this.repository.createMany(dataToInsert);

    if (errorInsert) {
      return { success: false, error: errorInsert };
    }

    return { success: true, error: null };
  }

  /**

   * Obtiene los productos que utilizan un insumo específico
   */
  async obtenerProductosPorInsumo(idInsumo: number) {
    const { data, error } = await this.repository.getByInsumo(idInsumo);

    if (error || !data) {
      return { productos: null, error };
    }

    return { productos: data, error: null };
  }
}

