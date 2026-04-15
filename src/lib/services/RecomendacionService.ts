import { SupabaseClient } from "@supabase/supabase-js";
import { Producto } from "../models/Producto"; // Asumiendo tu modelo actual

export class RecomendacionService {
  constructor(private client: SupabaseClient) {}

  // 1. Clientes también compraron
  async obtenerTambienCompraron(productoId: number): Promise<Producto[]> {
    // Llamamos a la función SQL que creamos en el paso 1
    const { data, error } = await this.client.rpc("obtener_tambien_compraron", {
      producto_target_id: productoId,
    });

    if (error || !data) return [];

    return data;
  }

  // 2. Basado en carrito abandonado / Comportamiento
  async obtenerRecomendacionesPush(usuarioId: number): Promise<Producto[]> {
    // Buscar si tiene un carrito activo sin concretar
    const { data: carrito } = await this.client
      .from("carrito_personalizacion") // O tu tabla de carrito actual
      .select("id_producto")
      .eq("id_usuario", usuarioId)
      .limit(3);

    // Si tiene cosas en el carrito, se las regresas como "No olvides llevarte esto"
    if (carrito && carrito.length > 0) {
      // Lógica para retornar los productos del carrito
    }

    // Si no tiene carrito, buscas su historial_vistas y recomiendas
    return this.generarRecomendacionesPorVistas(usuarioId);
  }
  async generarRecomendacionesPorVistas(
    usuarioId: number
  ): Promise<Producto[]> {
    // 1. Obtenemos los últimos 10 productos vistos (10 da una mejor muestra que 5)
    const { data: vistas } = await this.client
      .from("historial_vistas")
      .select("id_producto")
      .eq("id_usuario", usuarioId)
      .order("fecha_vista", { ascending: false }) // Aseguramos que sean los más recientes
      .limit(10);

    if (!vistas || vistas.length === 0) {
      // Opcional: Aquí podrías llamar a una función de fallback
      // como "obtenerMasVendidos()" para usuarios nuevos.
      return [];
    }

    // Extraemos solo los IDs para trabajar más fácil
    const viewedProductIds = vistas.map(v => v.id_producto);

    // 2. Consultamos de qué categoría son esos productos que estuvo viendo
    const { data: productosVistos } = await this.client
      .from("producto")
      .select("id_categoria")
      .in("id", viewedProductIds);

    if (!productosVistos || productosVistos.length === 0) return [];

    // 3. HEURÍSTICA: Encontramos la categoría predominante (lo que más le interesa)
    const categoryCounts = productosVistos.reduce(
      (acc, curr) => {
        if (curr.id_categoria) {
          acc[curr.id_categoria] = (acc[curr.id_categoria] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>
    );

    // Obtenemos el ID de la categoría con más vistas
    const dominantCategoryId = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[Number(a)] > categoryCounts[Number(b)] ? a : b
    );

    // 4. Buscamos las recomendaciones: Misma categoría predominante,
    // PERO excluimos los que ya vio para mostrarle cosas nuevas.
    const { data: recomendaciones, error } = await this.client
      .from("producto")
      .select("*")
      .eq("id_categoria", dominantCategoryId)
      .not("id", "in", `(${viewedProductIds.join(",")})`) // Filtro mágico de exclusión
      .gt("stock_actual", 0) // Solo recomendar lo que sí hay en inventario
      .limit(4);

    if (error || !recomendaciones) {
      console.error("Error generando recomendaciones:", error);
      return [];
    }

    // 5. Mapeamos los resultados a tu modelo de dominio
    return recomendaciones.map(p => new Producto(p));
  }

  // 3. También te puede gustar
  async obtenerSimilares(
    productoId: number,
    categoriaId: number,
    precio: number
  ): Promise<Producto[]> {
    const { data, error } = await this.client
      .from("producto")
      .select("*")
      .eq("id_categoria", categoriaId)
      .neq("id", productoId)
      .gte("precio", precio * 0.7) // Rango de precio
      .lte("precio", precio * 1.3)
      .limit(4);

    return data ? data.map(p => new Producto(p)) : [];
  }
}
