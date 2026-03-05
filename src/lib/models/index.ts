/**
 * Archivo de índice para modelos
 * Facilita las importaciones de modelos desde otros archivos
 */

export {
  Producto,
  type IProducto,
  type CreateProductoDTO,
  type UpdateProductoDTO,
} from "./Producto";
export {
  Categoria,
  type ICategoria,
  type CreateCategoriaDTO,
  type UpdateCategoriaDTO,
} from "./Categoria";
export { Usuario, type IUsuario, type UpdateUsuarioDTO } from "./Usuario";
export {
  Cliente,
  type ICliente,
  type CreateClienteDTO,
  type UpdateClienteDTO,
} from "./Cliente";
export {
  Venta,
  type IVenta,
  type CreateVentaDTO,
  type UpdateVentaDTO,
} from "./Venta";
export {
  DetalleVenta,
  type IDetalleVenta,
  type CreateDetalleVentaDTO,
  type UpdateDetalleVentaDTO,
} from "./DetalleVenta";
export {
  CuentasPorCobrar,
  type ICuentasPorCobrar,
  type CreateCuentasPorCobrarDTO,
  type UpdateCuentasPorCobrarDTO,
} from "./CuentasPorCobrar";
