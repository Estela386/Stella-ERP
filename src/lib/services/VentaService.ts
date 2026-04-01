import { SupabaseClient } from "@supabase/supabase-js";
import { Venta, IVenta, CreateVentaDTO, UpdateVentaDTO } from "../models/Venta";
import { VentaRepository } from "../repositories/VentaRepository";
import { DetalleVentaRepository } from "../repositories/DetalleVentaRepository";
import { ProductoRepository } from "../repositories/ProductoRepository";
import { CuentasPorCobrarService } from "./CuentasPorCobrarService";

export interface ProductoEnVenta {
  id_producto: number;
  cantidad: number;
  descuento_aplicado?: number | null;
  personalizacion?: any | null;
  id_consignacion_detalle?: number;
}

/**
 * Servicio de Venta
 * Encapsula la lógica de negocio y orquestación de operaciones con ventas
 */
export class VentaService {
  private ventaRepository: VentaRepository;
  private detalleRepository: DetalleVentaRepository;
  private productoRepository: ProductoRepository;
  private cuentasPorCobrarService: CuentasPorCobrarService;
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.ventaRepository = new VentaRepository(client);
    this.detalleRepository = new DetalleVentaRepository(client);
    this.productoRepository = new ProductoRepository(client);
    this.cuentasPorCobrarService = new CuentasPorCobrarService(client);
    this.client = client;
  }

  /**
   * Obtiene todas las ventas
   */
  async obtenerTodas(): Promise<{
    ventas: Venta[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.ventaRepository.getAllWithDetails();

    if (error || !data) {
      return { ventas: null, error };
    }

    const ventas = data.map(item => new Venta(item as IVenta));
    return { ventas, error: null };
  }

  /**
   * Obtiene una venta por ID
   */
  async obtenerPorId(id: number): Promise<{
    venta: Venta | null;
    error: string | null;
  }> {
    const { data, error } = await this.ventaRepository.getByIdWithDetails(id);

    if (error || !data) {
      return { venta: null, error };
    }

    const venta = new Venta(data as IVenta);
    return { venta, error: null };
  }

  /**
   * Obtiene ventas por usuario
   */
  async obtenerPorUsuario(idUsuario: string): Promise<{
    ventas: Venta[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.ventaRepository.getByUsuario(idUsuario);

    if (error || !data) {
      return { ventas: null, error };
    }

    const ventas = data.map(item => new Venta(item));
    return { ventas, error: null };
  }

  /**
   * Crea una nueva venta con sus detalles
   */
  async crear(
    clienteId: number,
    idUsuario: string,
    productos: ProductoEnVenta[],
    fecha: string,
    totalConIva?: number,
    montoPagado: number = 0
  ): Promise<{
    venta: Venta | null;
    ventaId?: number;
    error: string | null;
  }> {
    try {
      if (productos.length === 0) {
        return {
          venta: null,
          error: "La venta debe tener al menos un producto",
        };
      }

      // Calcular total y obtener información de productos
      let totalVenta = 0;
      const detallesData = [];

      for (const prod of productos) {
        const { data: productoData, error: prodError } =
          await this.productoRepository.getById(prod.id_producto);

        if (prodError || !productoData) {
          return {
            venta: null,
            error: `Producto no encontrado: ${prod.id_producto}`,
          };
        }

        const subtotal = (productoData as any).precio * prod.cantidad;
        totalVenta += subtotal;

        detallesData.push({
          cantidad: prod.cantidad,
          id_producto: prod.id_producto,
          personalizacion: prod.personalizacion || null,
          id_consignacion_detalle: prod.id_consignacion_detalle || null,
        });
      }

      // 1. Crear una venta en estado "pendiente" primero
      const ventaDTOTemp: CreateVentaDTO = {
        total: 0, // Se actualizará después
        fecha: fecha,
        id_usuario: idUsuario,
        estado: "pendiente",
        id_pedido: null,
      };

      const { data: ventaDataTemp, error: ventaErrorTemp } =
        await this.ventaRepository.create(ventaDTOTemp);

      if (ventaErrorTemp || !ventaDataTemp) {
        return {
          venta: null,
          error: ventaErrorTemp || "Error al crear la venta",
        };
      }

      const ventaId = (ventaDataTemp as any).id;

      // 2. Agregar id_venta a cada detalle
      const detalleConVenta = detallesData.map(d => ({
        ...d,
        id_venta: ventaId,
      }));

      // 3. Crear los detalles de venta
      const { data: detalleVentaData, error: detalleError } = await this.client
        .from("detallesventas")
        .insert(detalleConVenta)
        .select();

      if (detalleError || !detalleVentaData || detalleVentaData.length === 0) {
        return {
          venta: null,
          error: detalleError?.message || "Error al crear detalles de venta",
        };
      }

      const idDetalles = detalleVentaData[0].id;

      // 4. Actualizar la venta con el total (incluyendo IVA) y estado
      const totalFinal = totalConIva || totalVenta * 1.16;
      const ventaDTO: UpdateVentaDTO = {
        total: totalFinal,
        estado: "aprobada",
      };

      const { data: ventaDataFinal, error: ventaErrorFinal } =
        await this.ventaRepository.update(ventaId, ventaDTO);

      if (ventaErrorFinal || !ventaDataFinal) {
        return {
          venta: null,
          error: ventaErrorFinal || "Error al actualizar la venta",
        };
      }

      // 5. Crear un registro en cuentas por cobrar
      try {
        await this.cuentasPorCobrarService.crearParaVenta(
          clienteId,
          ventaId,
          totalFinal,
          montoPagado,
          "Venta registrada"
        );

        // 6. Si hay productos en consignación, actualizar el detalle de consignación y stock consignado
        for (const prod of productos) {
          if (prod.id_consignacion_detalle) {
            // Obtener el detalle de consignación actual
            const { data: detail, error: detailErr } = await this.client
              .from("consignacion_detalle")
              .select("cantidad_vendida, id_producto")
              .eq("id", prod.id_consignacion_detalle)
              .single();

            if (!detailErr && detail) {
              // Incrementar cantidad vendida en consignación
              const nuevaCantidadVendida = (detail.cantidad_vendida || 0) + prod.cantidad;
              await this.client
                .from("consignacion_detalle")
                .update({ cantidad_vendida: nuevaCantidadVendida })
                .eq("id", prod.id_consignacion_detalle);

              // Decrementar stock_consignado en el producto
              const { data: prodData } = await this.client
                .from("producto")
                .select("stock_consignado")
                .eq("id", prod.id_producto)
                .single();

              if (prodData) {
                const nuevoStockConsignado = Math.max(0, (prodData.stock_consignado || 0) - prod.cantidad);
                await this.client
                  .from("producto")
                  .update({ stock_consignado: nuevoStockConsignado })
                  .eq("id", prod.id_producto);
              }
            }
          } else {
            // Venta normal: opcionalmente descontar stock_actual si no hay triggers
            const { data: prodData } = await this.client
              .from("producto")
              .select("stock_actual")
              .eq("id", prod.id_producto)
              .single();
              
            if (prodData) {
              const nuevoStock = Math.max(0, (prodData.stock_actual || 0) - prod.cantidad);
              await this.client
                .from("producto")
                .update({ stock_actual: nuevoStock })
                .eq("id", prod.id_producto);
            }
          }
        }
      } catch (cuentaError) {
        console.error("Error al procesar inventario/cuentas:", cuentaError);
      }

      const venta = new Venta(ventaDataFinal as IVenta);
      return { venta, ventaId: (ventaDataFinal as any).id, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { venta: null, error: errorMessage };
    }
  }

  /**
   * Actualiza el estado de una venta
   */
  async actualizarEstado(
    id: number,
    estado: "aprobada" | "denegada" | "pendiente" | "cancelada"
  ): Promise<{
    venta: Venta | null;
    error: string | null;
  }> {
    const { data, error } = await this.ventaRepository.update(id, { estado });

    if (error || !data) {
      return { venta: null, error };
    }

    const venta = new Venta(data as IVenta);
    return { venta, error: null };
  }

  /**
   * Cancela una venta
   */
  async cancelar(id: number): Promise<{
    success: boolean;
    error: string | null;
  }> {
    const { venta, error } = await this.actualizarEstado(id, "cancelada");

    if (error || !venta) {
      return { success: false, error };
    }

    return { success: true, error: null };
  }
}
