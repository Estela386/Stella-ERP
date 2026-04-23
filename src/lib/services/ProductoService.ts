import {
  Producto,
  IProducto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../models/Producto";
import { ProductoRepository } from "../repositories/ProductoRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Servicio de Producto
 * Encapsula la lógica de negocio y orquestación de operaciones con productos
 */
export class ProductoService {
  private repository: ProductoRepository;

  constructor(client: SupabaseClient) {
    this.repository = new ProductoRepository(client);
  }

  /**
   * Obtiene todos los productos
   */
  async obtenerTodos(): Promise<{
    productos: Producto[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getAllWithCategoria();

    if (error || !data) {
      return {
        productos: null,
        error: error?.message || "Error desconocido al obtener productos",
      };
    }

    const productos = data.map(item => new Producto(item as IProducto));
    return { productos, error: null };
  }

  /**
   * Obtiene un producto por ID
   */
  async obtenerPorId(id: number): Promise<{
    producto: Producto | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getById(id);
    console.log("Data obtenida por ID:", data);
    if (error || !data) {
      return {
        producto: null,
        error: error || "Error desconocido al obtener el producto",
      };
    }

    const producto = new Producto(data as IProducto);
    return { producto, error: null };
  }

  /**
   * Obtiene productos por categoría
   */
  async obtenerPorCategoria(idCategoria: number): Promise<{
    productos: Producto[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getByCategoria(idCategoria);

    if (error || !data) {
      return {
        productos: null,
        error: error || "Error desconocido al obtener productos por categoría",
      };
    }

    const productos = data.map(item => new Producto(item as IProducto));
    return { productos, error: null };
  }

  /**
   * Busca productos por nombre
   */
  async buscar(nombre: string): Promise<{
    productos: Producto[] | null;
    error: string | null;
  }> {
    if (!nombre || nombre.trim().length === 0) {
      return {
        productos: null,
        error: "El término de búsqueda no puede estar vacío",
      };
    }

    const { data, error } = await this.repository.searchByNombre(nombre);

    if (error || !data) {
      return {
        productos: null,
        error: error || "Error desconocido al buscar productos",
      };
    }

    const productos = data.map(item => new Producto(item as IProducto));
    return { productos, error: null };
  }

  /**
   * Obtiene productos con stock bajo
   */
  async obtenerProductosStockBajo(): Promise<{
    productos: Producto[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.repository.getProductosStockBajo();

    if (error || !data) {
      return {
        productos: null,
        error: error || "Error desconocido al obtener productos con stock bajo",
      };
    }

    const productos = data.map(item => new Producto(item as IProducto));
    return { productos, error: null };
  }

  /**
   * Crea un nuevo producto
   */
  async crear(data: CreateProductoDTO): Promise<{
    producto: Producto | null;
    error: string | null;
  }> {
    // Crear instancia temporal para validar
    const productoTemp = new Producto({
      id: 0, // ID temporal
      nombre: data.nombre,
      precio: data.precio,
      costo: data.costo ?? null,
      costo_mayorista: data.costo_mayorista ?? null,
      tiempo: data.tiempo ?? null,
      stock_actual: data.stock_actual ?? null,
      stock_min: data.stock_min ?? null,
      url_imagen: data.url_imagen ?? null,
      id_categoria: data.id_categoria ?? null,
      descripcion: data.descripcion ?? null,
      es_personalizable: data.es_personalizable,
      tipo: data.tipo,
      producto_material: [],
      activo: true,
    });

    const validacion = productoTemp.validar();
    if (!validacion.valid) {
      return { producto: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.create(data);

    if (error || !result) {
      return { producto: null, error };
    }

    const producto = new Producto(result as IProducto);
    return { producto, error: null };
  }

  /**
   * Actualiza un producto
   */
  async actualizar(
    id: number,
    data: UpdateProductoDTO
  ): Promise<{
    producto: Producto | null;
    error: string | null;
  }> {
    // Verificar que el producto existe
    const { producto: productoExistente, error: errorExistencia } =
      await this.obtenerPorId(id);
    if (errorExistencia || !productoExistente) {
      return { producto: null, error: "Producto no encontrado" };
    }

    // Crear instancia con datos actualizados para validar
    const productoActualizado = new Producto({
      ...productoExistente.toJSON(),
      ...data,
    } as IProducto);

    const validacion = productoActualizado.validar();
    if (!validacion.valid) {
      return { producto: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.update(id, data);

    if (error || !result) {
      return { producto: null, error };
    }

    const producto = new Producto(result as IProducto);
    return { producto, error: null };
  }

  /**
   * Elimina un producto
   */
  async eliminar(
    id: number
  ): Promise<{ success: boolean; error: string | null }> {
    // Verificar que el producto existe
    const { producto, error: errorExistencia } = await this.obtenerPorId(id);
    if (errorExistencia || !producto) {
      return { success: false, error: "Producto no encontrado" };
    }

    const { data: success, error } = await this.repository.update(id, {
      activo: false,
    });
    return { success: !!success, error };
  }

  /**
   * Actualiza el stock de un producto
   */
  async actualizarStock(
    id: number,
    cantidad: number
  ): Promise<{ producto: Producto | null; error: string | null }> {
    if (!Number.isInteger(cantidad)) {
      return { producto: null, error: "La cantidad debe ser un número entero" };
    }

    const { data: result, error } = await this.repository.updateStock(
      id,
      cantidad
    );

    if (error || !result) {
      return { producto: null, error };
    }

    const producto = new Producto(result as IProducto);
    return { producto, error: null };
  }

  /**
   * Calcula estadísticas de productos
   */
  async obtenerEstadisticas(): Promise<{
    estadisticas: {
      totalProductos: number;
      productosStockBajo: number;
      ingresoTotal: number | null;
      costoTotal: number | null;
      gananciaTotal: number | null;
    } | null;
    error: string | null;
  }> {
    const { productos, error } = await this.obtenerTodos();

    if (error || !productos) {
      return { estadisticas: null, error };
    }

    const { productos: productosStockBajo } =
      await this.obtenerProductosStockBajo();

    const totalProductos = productos.length;
    const productosConStockBajo = productosStockBajo
      ? productosStockBajo.length
      : 0;

    let ingresoTotal = 0;
    let costoTotal = 0;

    productos.forEach(producto => {
      if (producto.precio && producto.stock_actual) {
        ingresoTotal += producto.precio * producto.stock_actual;
      }
      if (producto.costo && producto.stock_actual) {
        costoTotal += producto.costo * producto.stock_actual;
      }
    });

    const gananciaTotal = ingresoTotal - costoTotal;

    return {
      estadisticas: {
        totalProductos,
        productosStockBajo: productosConStockBajo,
        ingresoTotal: ingresoTotal > 0 ? ingresoTotal : null,
        costoTotal: costoTotal > 0 ? costoTotal : null,
        gananciaTotal: gananciaTotal > 0 ? gananciaTotal : null,
      },
      error: null,
    };
  }

  // =========================================================================
  // 🔥 NUEVOS MÉTODOS PARA GALERÍA DE IMÁGENES 🔥
  // =========================================================================

  /**
   * Sube múltiples archivos de imagen a Supabase Storage y los asocia al producto.
   */
  async agregarImagenesAProducto(
    productoId: number,
    archivos: File[]
  ): Promise<{ success: boolean; error: string | null }> {
    const urlsPublicas: string[] = [];

    try {
      // 1. Subir cada archivo al bucket
      for (const file of archivos) {
        // Generar un nombre único para evitar colisiones de caché
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${productoId}/${fileName}`;

        // Asumimos que creaste un bucket llamado "imagenes_productos" configurado como "Public"
        const { data: uploadData, error: uploadError } = await this.repository[
          "client"
        ].storage
          .from("imagenes_productos")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error subiendo imagen individual:", uploadError);
          continue; // Si una falla, intentamos seguir con las demás
        }

        if (uploadData) {
          const { data: publicUrlData } = this.repository["client"].storage
            .from("imagenes_productos")
            .getPublicUrl(filePath);

          urlsPublicas.push(publicUrlData.publicUrl);
        }
      }

      // 2. Guardar las URLs en la tabla 'producto_imagenes'
      if (urlsPublicas.length > 0) {
        // Consultamos cuál es el orden actual más alto para agregar las nuevas al final
        const { data: existingImages } = await this.repository["client"]
          .from("producto_imagenes")
          .select("orden")
          .eq("id_producto", productoId)
          .order("orden", { ascending: false })
          .limit(1);

        const startOrder =
          existingImages && existingImages.length > 0
            ? existingImages[0].orden + 1
            : 0;

        const inserts = urlsPublicas.map((url, index) => ({
          id_producto: productoId,
          url_imagen: url,
          orden: startOrder + index,
        }));

        const { error: dbError } = await this.repository["client"]
          .from("producto_imagenes")
          .insert(inserts);

        if (dbError) throw dbError;
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error en agregarImagenesAProducto:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Elimina una imagen tanto de la base de datos como del Storage.
   */
  async eliminarImagenProducto(
    idImagenBd: number,
    urlImagen: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // 1. Eliminar el registro de la tabla relacional
      const { error: dbError } = await this.repository["client"]
        .from("producto_imagenes")
        .delete()
        .eq("id", idImagenBd);

      if (dbError) throw dbError;

      // 2. Extraer la ruta real del archivo para borrarlo del Bucket
      // URL típica: https://[tu-proyecto].supabase.co/storage/v1/object/public/imagenes_productos/123/archivo.jpg
      const urlParts = urlImagen.split("/imagenes_productos/");
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await this.repository["client"].storage
          .from("imagenes_productos")
          .remove([filePath]);
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualiza el orden (drag & drop) de la galería.
   */
  async reordenarImagenes(
    cambiosOrden: { id: number; orden: number }[]
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Supabase permite upsert múltiple si le pasamos la llave primaria
      const { error } = await this.repository["client"]
        .from("producto_imagenes")
        .upsert(cambiosOrden);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
