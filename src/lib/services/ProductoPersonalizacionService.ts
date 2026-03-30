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
      valores: { valor: string; stock: number }[];
    }[]
  ) {
    const { error: errorEliminar } = await this.repo.eliminarPorProducto(productId);
    
    if (errorEliminar) {
      console.error("Error eliminando opciones previas:", errorEliminar);
      throw new Error(`No se pudieron limpiar las opciones anteriores: ${errorEliminar}`);
    }

    const resultado = [];

    for (const op of opciones) {
      const { data: opcionCreada } = await this.repo.crearOpcion({
        ...op.opcion,
        producto_id: productId,
      });

      if (opcionCreada && op.valores?.length) {
        const valoresParaInsertar = op.valores.map((v) => ({
          opcion_id: opcionCreada.id,
          valor: v.valor,
          stock: v.stock || 0
        }));

        const { data: valoresCreados } = await this.repo.crearValores(
          valoresParaInsertar
        );

        resultado.push({
          nombre: op.opcion.nombre,
          id: opcionCreada.id,
          valores: (valoresCreados || []).map((v: any) => ({
            valor: v.valor,
            stock: v.stock,
            id: v.id,
          })),
        });
      }
    }

    return resultado;
  }
  async eliminarOpcionesDeProducto(productId: number) {
    return await this.repo.eliminarPorProducto(productId);
  }

}
