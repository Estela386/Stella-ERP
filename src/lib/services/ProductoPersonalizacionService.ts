import { SupabaseClient } from "@supabase/supabase-js";
import { ProductoPersonalizacionRepository } from "../repositories/ProductoPersonalizacionRepository";

import { IProductoOpcion, IProductoOpcionValor } from "../models";

interface IOpcionesProductoValores {
  ProductoOpcion: IProductoOpcion;
  valores: IProductoOpcionValor[];
}

export class ProductoPersonalizacionService {
  private repo: ProductoPersonalizacionRepository;

  constructor(client: SupabaseClient) {
    this.repo = new ProductoPersonalizacionRepository(client);
  }

  async obtenerOpcionesPorProducto(productId: string) {
    const { data, error } = await this.repo.getOpciones(productId);

    if (error || !data) {
      return { opciones: null, error };
    }

    return {
      opciones: data,
      error: null,
    };
  }
  async guardarOpcionesProducto(
    productId: number,
    opciones: {
      opcion: Omit<IProductoOpcion, "id" | "producto_id">;
      valores: string[];
    }[]
  ) {
    await this.repo.eliminarPorProducto(productId);

    for (const op of opciones) {
      const { data: opcionCreada } = await this.repo.crearOpcion({
        ...op.opcion,
        producto_id: productId,
      });

      if (opcionCreada && op.valores?.length) {
        const valores = op.valores.map(v => ({
          opcion_id: opcionCreada.id,
          valor: v,
        }));
        await this.repo.crearValores(valores);
      }
    }
  }
}
