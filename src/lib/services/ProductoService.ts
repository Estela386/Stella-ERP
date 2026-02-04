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
      return { productos: null, error };
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
    const { data, error } = await this.repository.getByIdWithCategoria(id);

    if (error || !data) {
      return { producto: null, error };
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
      return { productos: null, error };
    }

    const productos = data.map(item => new Producto(item));
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
      return { productos: null, error };
    }

    const productos = data.map(item => new Producto(item));
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
      return { productos: null, error };
    }

    const productos = data.map(item => new Producto(item));
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
      ...data,
    });

    const validacion = productoTemp.validar();
    if (!validacion.valid) {
      return { producto: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.create(data);

    if (error || !result) {
      return { producto: null, error };
    }

    const producto = new Producto(result);
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
    });

    const validacion = productoActualizado.validar();
    if (!validacion.valid) {
      return { producto: null, error: validacion.errors.join(", ") };
    }

    const { data: result, error } = await this.repository.update(id, data);

    if (error || !result) {
      return { producto: null, error };
    }

    const producto = new Producto(result);
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

    const { success, error } = await this.repository.delete(id);
    return { success, error };
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

    const producto = new Producto(result);
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

    const { productos: productosStockBajo, error: errorStockBajo } =
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
}
