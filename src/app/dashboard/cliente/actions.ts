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
        productos: [] as ProductoCard[],
        error: errorProductos || "No se pudieron cargar los productos",
      };
    }

    // Transformar datos para ProductCard
    const productosFormatted: ProductoCard[] = productosData.map(p => ({
      id: p.id,
      name: p.nombre || "Producto",
      price: p.precio || 0,
      image: p.url_imagen || p.nombre || "Producto",
      category: (p as any).categoria?.nombre || undefined,
      rating: 5,
      materiales:
        p.producto_material
          ?.map((pm: any) => pm.materiales?.nombre)
          .filter(Boolean) || [],
      es_personalizable: !!(p as any).es_personalizable,
      opciones:
        (p as any).opciones?.map((o: any) => ({
          id: o.id,
          nombre: o.nombre,
          tipo: o.tipo,
          valores: (o.valores || []).map((v: any) => ({ valor: v.valor })),
        })) || [],
      created_at: (p as any).created_at as string,
      images: p.imagenes || [],
      stock_actual: p.stock_actual ?? undefined,
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
      category: (p as any).categoria?.nombre || undefined,
      rating: 5,
      materiales:
        p.producto_material
          ?.map((pm: any) => pm.materiales?.nombre)
          .filter(Boolean) || [],
      es_personalizable: !!(p as any).es_personalizable,
      created_at: (p as any).created_at as string,
      stock_actual: p.stock_actual ?? undefined,
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
      materiales:
        p.producto_material
          ?.map((pm: any) => pm.materiales?.nombre)
          .filter(Boolean) || [],
      es_personalizable: !!(p as any).es_personalizable,
      created_at: (p as any).created_at as string,
      stock_actual: p.stock_actual ?? undefined,
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
      category: (p as any).categoria?.nombre || undefined,
      materiales:
        (p as any).producto_material
          ?.map((pm: any) => pm.materiales?.nombre)
          .filter(Boolean) || [],
      es_personalizable: p.es_personalizable ?? false,
      opciones:
        (p as any).opciones?.map((o: any) => ({
          id: o.id,
          nombre: o.nombre,
          tipo: o.tipo,
          valores: (o.valores || []).map((v: any) => ({ valor: v.valor })),
        })) || [],
      stock_actual: p.stock_actual ?? undefined,
      stock_min: p.stock_min ?? undefined,
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

/**
 * Server Action para suscribirse a notificaciones de stock
 */
export async function suscribirStock(idProducto: number): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // 1. Obtener el usuario de la sesión de Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "Sesión no encontrada. Por favor inicia sesión.",
      };
    }

    // 2. Buscar el id del usuario en nuestra tabla 'usuario' usando el id_auth (uuid)
    const { data: userData, error: userDataError } = await supabase
      .from("usuario")
      .select("id")
      .eq("id_auth", user.id)
      .single();

    if (userDataError || !userData) {
      return {
        success: false,
        error: "No se encontró tu perfil en la base de datos.",
      };
    }

    // 3. Insertar o actualizar la suscripción (upsert)
    // Esto evita el error de "duplicate key" si el SELECT previo falló por RLS
    const { error: upsertError } = await supabase
      .from("suscripciones_stock")
      .upsert(
        {
          id_usuario: userData.id,
          id_producto: idProducto,
          notificado: false,
        },
        {
          onConflict: "id_usuario,id_producto,notificado",
          ignoreDuplicates: true,
        }
      );

    if (upsertError) {
      console.error("Error al suscribir stock:", upsertError);
      // Si el error es de RLS, dar un mensaje más claro
      if (upsertError.code === "42501") {
        return {
          success: false,
          error:
            "No tienes permisos para suscribirte. Contacta al administrador para revisar las políticas RLS.",
        };
      }
      return {
        success: false,
        error: `Error de base de datos: ${upsertError.message}`,
      };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error en suscribirStock:", err);
    return {
      success: false,
      error: "Error inesperado al procesar la solicitud",
    };
  }
}

/**
 * Server Action para guardar suscripción a notificaciones push
 */
export async function guardarSuscripcionPush(subscription: any): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "No autenticado" };

    const { data: userData } = await supabase
      .from("usuario")
      .select("id")
      .eq("id_auth", user.id)
      .single();

    if (!userData) return { success: false, error: "Perfil no encontrado" };

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        id_usuario: userData.id,
        subscription: subscription,
      },
      {
        onConflict: "id_usuario,subscription",
      }
    );

    if (error) {
      console.error("Error al guardar suscripción push:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error en guardarSuscripcionPush:", err);
    return { success: false, error: "Error inesperado" };
  }
}
