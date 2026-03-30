import { SupabaseClient } from "@supabase/supabase-js";
import { ConsignacionRepository } from "../repositories/ConsignacionRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import {
  IConsignacion,
  CreateConsignacionDTO,
  UpdateConsignacionDTO,
  EstadoConsignacion,
  IUsuarioMayorista,
} from "../models/Consignacion";

export class ConsignacionService {
  private repo: ConsignacionRepository;
  private usuarioRepo: UsuarioRepository;

  constructor(client: SupabaseClient) {
    this.repo = new ConsignacionRepository(client);
    this.usuarioRepo = new UsuarioRepository(client);
  }

  /** Lista todas las consignaciones (admin) */
  async listarTodas(): Promise<{
    consignaciones: IConsignacion[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getallWithJoins();
    return { consignaciones: data ?? [], error };
  }

  /** Lista consignaciones de un mayorista */
  async listarPorMayorista(idMayorista: number): Promise<{
    consignaciones: IConsignacion[];
    error: string | null;
  }> {
    const { data, error } = await this.repo.getByMayorista(idMayorista);
    return { consignaciones: data ?? [], error };
  }

  /** Estadísticas rápidas para admin */
  async estadisticas(): Promise<{
    total: number;
    activas: number;
    finalizadas: number;
    canceladas: number;
    error: string | null;
  }> {
    const { data, error } = await this.repo.getallWithJoins();
    if (error || !data) return { total: 0, activas: 0, finalizadas: 0, canceladas: 0, error };
    return {
      total: data.length,
      activas: data.filter(c => c.estado === "activa").length,
      finalizadas: data.filter(c => c.estado === "finalizada").length,
      canceladas: data.filter(c => c.estado === "cancelada").length,
      error: null,
    };
  }

  /** Crear nueva consignación y descontar stock */
  async crear(
    dto: CreateConsignacionDTO,
    supabase: SupabaseClient
  ): Promise<{ consignacion: IConsignacion | null; error: string | null }> {
    // 1. Verificar que vengan productos
    if (!dto.productos || dto.productos.length === 0) {
      return { consignacion: null, error: "Debe agregar al menos un producto" };
    }

    // 2. Verificar stock disponible para todos los productos
    const productoIds = dto.productos.map(p => p.id_producto);
    const { data: productosDb, error: prodErr } = await supabase
      .from("producto")
      .select("id, nombre, precio, stock_actual, stock_consignado")
      .in("id", productoIds);

    if (prodErr || !productosDb) {
      return { consignacion: null, error: prodErr?.message ?? "Error leyendo productos" };
    }

    // Validar existencias
    for (const item of dto.productos) {
      const dbProd = productosDb.find(p => p.id === item.id_producto);
      if (!dbProd) {
        return { consignacion: null, error: `Producto ID ${item.id_producto} no encontrado` };
      }
      if (dbProd.stock_actual < item.cantidad) {
        return {
          consignacion: null,
          error: `Stock insuficiente para ${dbProd.nombre}. Disponible: ${dbProd.stock_actual}`,
        };
      }
    }

    // 3. Crear la consignación (cabecera)
    const consignacionDto = {
      id_mayorista: dto.id_mayorista,
      fecha_inicio: dto.fecha_inicio,
      fecha_fin: dto.fecha_fin,
      notas: dto.notas,
      creado_por: dto.creado_por,
      estado: "activa" as EstadoConsignacion
    };
    
    const { data: cons, error: consErr } = await this.repo.createConsignacion(consignacionDto as Omit<CreateConsignacionDTO, "productos">);
    if (consErr || !cons) return { consignacion: null, error: consErr };

    // 4. Preparar y crear detalles, actualizar stock y registrar movimientos
    const detallesInsert = [];
    const movimientosInsert = [];

    for (const item of dto.productos) {
      const dbProd = productosDb.find(p => p.id === item.id_producto)!;
      // Cálculo del precio mayorista (30% de descuento)
      const precioMayorista = Number((dbProd.precio * 0.70).toFixed(2));

      detallesInsert.push({
        id_consignacion: cons.id,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: dbProd.precio,
        precio_mayorista: precioMayorista,
        precio_venta: dbProd.precio,
        subtotal: Number((precioMayorista * item.cantidad).toFixed(2))
      });

      // Actualizar stock
      await supabase
        .from("producto")
        .update({
          stock_actual: dbProd.stock_actual - item.cantidad,
          stock_consignado: (dbProd.stock_consignado ?? 0) + item.cantidad,
        })
        .eq("id", item.id_producto);

      movimientosInsert.push({
        id_producto: item.id_producto,
        tipo: "salida",
        cantidad: item.cantidad,
        motivo: "consignacion",
        referencia_id: cons.id,
        creado_por: dto.creado_por,
      });
    }

    // Insertar detalles
    const { error: detErr } = await supabase.from("consignacion_detalle").insert(detallesInsert);
    if (detErr) {
      return { consignacion: cons, error: "Consignación creada pero falló al guardar detalles: " + detErr.message };
    }

    // Registrar movimientos
    await supabase.from("movimientos_producto").insert(movimientosInsert);

    return { consignacion: cons, error: null };
  }

  /** Actualizar consignación */
  async actualizar(
    id: number,
    dto: UpdateConsignacionDTO
  ): Promise<{ consignacion: IConsignacion | null; error: string | null }> {
    const { data, error } = await this.repo.updateConsignacion(id, dto);
    return { consignacion: data, error };
  }

  /** Cancelar consignación y devolver stock */
  async cancelar(
    id: number,
    supabase: SupabaseClient,
    adminId?: number
  ): Promise<{ success: boolean; error: string | null }> {
    // Obtener consignación actual con joins
    const { data: cons, error: getErr } = await supabase
      .from("consignacion")
      .select(`
        *,
        detalles:consignacion_detalle(
          id_producto, cantidad, cantidad_devuelta, cantidad_vendida,
          producto:producto!fk_detalle_producto(id, stock_actual, stock_consignado)
        )
      `)
      .eq("id", id)
      .single();

    if (getErr || !cons) return { success: false, error: getErr?.message ?? "No encontrada" };
    if (cons.estado !== "activa") return { success: false, error: "Solo se pueden cancelar consignaciones activas" };

    const movimientosInsert = [];

    // Iterar por cada detalle para devolver el stock
    if (cons.detalles && Array.isArray(cons.detalles)) {
      for (const det of cons.detalles) {
        const cantidadPendiente = det.cantidad - (det.cantidad_devuelta ?? 0) - (det.cantidad_vendida ?? 0);

        if (cantidadPendiente > 0 && det.producto) {
          await supabase
            .from("producto")
            .update({
              stock_actual: det.producto.stock_actual + cantidadPendiente,
              stock_consignado: Math.max(0, (det.producto.stock_consignado ?? 0) - cantidadPendiente),
            })
            .eq("id", det.id_producto);

          movimientosInsert.push({
            id_producto: det.id_producto,
            tipo: "entrada",
            cantidad: cantidadPendiente,
            motivo: "cancelacion_consignacion",
            referencia_id: id,
            creado_por: adminId,
          });
        }
      }
    }

    if (movimientosInsert.length > 0) {
      await supabase.from("movimientos_producto").insert(movimientosInsert);
    }

    // Marcar como cancelada
    const { error } = await this.repo.updateConsignacion(id, { estado: "cancelada" });
    return { success: !error, error };
  }

  /** Reactivar consignación (de cancelada/finalizada) */
  async reactivar(
    id: number,
    supabase: SupabaseClient,
    adminId?: number
  ): Promise<{ success: boolean; error: string | null }> {
    const { data: cons, error: getErr } = await supabase
      .from("consignacion")
      .select(`
        *,
        detalles:consignacion_detalle(
          id_producto, cantidad, cantidad_devuelta, cantidad_vendida,
          producto:producto!fk_detalle_producto(id, stock_actual, stock_consignado, nombre)
        )
      `)
      .eq("id", id)
      .single();

    if (getErr || !cons) return { success: false, error: getErr?.message ?? "No encontrada" };
    if (cons.estado === "activa") return { success: false, error: "La consignación ya está activa" };

    const movimientosInsert = [];

    // Verificar stock primero
    if (cons.detalles && Array.isArray(cons.detalles)) {
      for (const det of cons.detalles) {
        const cantidadPendiente = det.cantidad - (det.cantidad_devuelta ?? 0) - (det.cantidad_vendida ?? 0);
        if (cantidadPendiente > 0 && det.producto) {
          if (det.producto.stock_actual < cantidadPendiente) {
            return {
              success: false,
              error: `Stock insuficiente para ${det.producto.nombre}. Necesita ${cantidadPendiente}, hay ${det.producto.stock_actual}`
            };
          }
        }
      }
    }

    // Efectuar cambios
    if (cons.detalles && Array.isArray(cons.detalles)) {
      for (const det of cons.detalles) {
        const cantidadPendiente = det.cantidad - (det.cantidad_devuelta ?? 0) - (det.cantidad_vendida ?? 0);

        if (cantidadPendiente > 0 && det.producto) {
          await supabase
            .from("producto")
            .update({
              stock_actual: det.producto.stock_actual - cantidadPendiente,
              stock_consignado: (det.producto.stock_consignado ?? 0) + cantidadPendiente,
            })
            .eq("id", det.id_producto);

          movimientosInsert.push({
            id_producto: det.id_producto,
            tipo: "salida",
            cantidad: cantidadPendiente,
            motivo: "reactivacion_consignacion",
            referencia_id: id,
            creado_por: adminId,
          });
        }
      }
    }

    if (movimientosInsert.length > 0) {
      await supabase.from("movimientos_producto").insert(movimientosInsert);
    }

    // Marcar como activa
    const { error } = await this.repo.updateConsignacion(id, { estado: "activa" });
    return { success: !error, error };
  }

  /** Listar mayoristas disponibles */
  async listarMayoristas(): Promise<{
    mayoristas: IUsuarioMayorista[];
    error: string | null;
  }> {
    const { data, error } = await this.usuarioRepo.getMayoristas();
    return { mayoristas: data ?? [], error };
  }
}
