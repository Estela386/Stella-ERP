"use server";

import { ProductoService } from "@lib/services";
import { createClient } from "@utils/supabase/server";
import { ProductoCard } from "./types";

/**
 * Server Action para cargar productos desde Supabase
 * Esta función se ejecuta en el servidor, no en el cliente
 */
export async function obtenerProductosCatalogo(): Promise<{
  productos: ProductoCard[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos: productosData, error: errorProductos } =
      await productoService.obtenerTodos();

    if (errorProductos || !productosData) {
      return {
        productos: null,
        error: errorProductos || "No se pudieron cargar los productos",
      };
    }

    // Transformar datos para ProductCard
    const productosFormatted: ProductoCard[] = productosData.map(p => ({
      id: p.id,
      name: p.nombre || "Producto",
      price: p.precio || 0,
      image: p.url_imagen || p.nombre || "Producto",
      category: p.nombre?.split(" ")[0] || undefined,
      rating: 5,
      materiales: p.producto_material?.map((pm: any) => pm.materiales?.nombre).filter(Boolean) || [],
      es_personalizable: !!(p as any).es_personalizable,
      created_at: (p as any).created_at as string,
    }));

    return { productos: productosFormatted, error: null };
  } catch (err) {
    console.error("Error al cargar productos:", err);
    return {
      productos: null,
      error: "Error al cargar productos",
    };
  }
}

/**
 * Server Action para buscar productos por nombre
 */
export async function buscarProductosCatalogo(termino: string): Promise<{
  productos: ProductoCard[] | null;
  error: string | null;
}> {
  try {
    if (!termino.trim()) {
      const result = await obtenerProductosCatalogo();
      return result;
    }

    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos: productosData, error: errorProductos } =
      await productoService.buscar(termino);

    if (errorProductos || !productosData) {
      return {
        productos: null,
        error: errorProductos || "No se encontraron productos",
      };
    }

    const productosFormatted: ProductoCard[] = productosData.map(p => ({
      id: p.id,
      name: p.nombre || "Producto",
      price: p.precio || 0,
      image: p.url_imagen || p.nombre || "Producto",
      category: p.nombre?.split(" ")[0] || undefined,
      rating: 5,
      materiales: p.producto_material?.map((pm: any) => pm.materiales?.nombre).filter(Boolean) || [],
      es_personalizable: (p as any).es_personalizable ?? false,
      created_at: (p as any).created_at,
    }));

    return { productos: productosFormatted, error: null };
  } catch (err) {
    console.error("Error al buscar productos:", err);
    return {
      productos: null,
      error: "Error al buscar productos",
    };
  }
}

/**
 * Server Action para obtener productos por categoría
 */
export async function obtenerProductosPorCategoria(
  idCategoria: number
): Promise<{
  productos: ProductoCard[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos: productosData, error: errorProductos } =
      await productoService.obtenerPorCategoria(idCategoria);

    if (errorProductos || !productosData) {
      return {
        productos: null,
        error: errorProductos || "No se encontraron productos",
      };
    }

    const productosFormatted: ProductoCard[] = productosData.map(p => ({
      id: p.id,
      name: p.nombre || "Producto",
      price: p.precio || 0,
      image: p.url_imagen || p.nombre || "Producto",
      category: p.nombre?.split(" ")[0] || undefined,
      rating: 5,
      materiales: p.producto_material?.map((pm: any) => pm.materiales?.nombre).filter(Boolean) || [],
      es_personalizable: !!(p as any).es_personalizable,
      created_at: (p as any).created_at as string,
    }));

    return { productos: productosFormatted, error: null };
  } catch (err) {
    console.error("Error al obtener productos por categoría:", err);
    return {
      productos: null,
      error: "Error al obtener productos",
    };
  }
}

/**
 * Server Action para obtener productos con datos de mayoreo
 */
export async function obtenerProductosMayoreo(): Promise<{
  productos: ProductoCard[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const productoService = new ProductoService(supabase);

    const { productos: productosData, error: errorProductos } =
      await productoService.obtenerTodos();

    if (errorProductos || !productosData) {
      return {
        productos: null,
        error: errorProductos || "No se pudieron cargar los productos",
      };
    }

    const productosFormatted: ProductoCard[] = productosData.map(p => ({
      id: p.id,
      name: p.nombre || "Producto",
      price: p.precio || 0,
      costo: p.costo || 0,
      costo_mayorista: p.costo_mayorista || (p.precio ? p.precio * 0.7 : 0),
      descripcion: p.descripcion || "",
      image: p.url_imagen || "",
      category: p.nombre?.split(" ")[0] || undefined,
      materiales: p.producto_material?.map((pm: any) => pm.materiales?.nombre).filter(Boolean) || [],
      es_personalizable: p.es_personalizable ?? false,
      created_at: (p as any).created_at,
    }));

    return { productos: productosFormatted, error: null };
  } catch (err) {
    console.error("Error al cargar productos para mayoreo:", err);
    return {
      productos: null,
      error: "Error al cargar productos",
    };
  }
}

