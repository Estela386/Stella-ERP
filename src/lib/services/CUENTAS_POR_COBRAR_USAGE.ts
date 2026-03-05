/**
 * ==========================================
 * SISTEMA DE CUENTAS POR COBRAR
 * ==========================================
 *
 * Este sistema permite registrar y gestionar las cuentas por cobrar de los clientes
 * después de realizar una venta en la plataforma.
 *
 * ==========================================
 * FLUJO DE UNA VENTA CON CUENTAS POR COBRAR
 * ==========================================
 *
 * 1. El usuario crea una nueva venta en la página "Nueva Venta"
 * 2. Selecciona un cliente, productos, y confirma la venta
 * 3. El endpoint POST /api/ventas/confirmar realiza:
 *    - Crea un registro en la tabla "ventas"
 *    - Crea registros en la tabla "detallesventas" (uno por cada producto)
 *    - Crea un registro en la tabla "cuentasporcobrar" con:
 *      * id_cliente: El cliente de la venta
 *      * id_venta: El ID de la venta creada
 *      * fecha_registro: Fecha actual
 *      * concepto: "Venta registrada"
 *      * monto_inicial: El total de la venta (incluyendo IVA)
 *      * monto_pagado: 0 (sin pagos iniciales)
 *      * monto_pendiente: Equal al monto_inicial
 *      * estado: "pendiente"
 *
 * ==========================================
 * ESTRUCTURA DE LA TABLA CUENTASPORCOBRAR
 * ==========================================
 *
 * id (integer): Identificador único
 * id_cliente (integer): FK a tabla cliente - Cliente que debe pagar
 * fecha_registro (timestamp): Cuándo se registró la cuenta
 * concepto (varchar): Descripción del concepto (ej: "Venta registrada", "Pago parcial recibido")
 * monto_inicial (numeric): El monto total que debe pagar el cliente
 * monto_pagado (numeric): Cuánto ha pagado hasta ahora
 * monto_pendiente (numeric): Cuánto falta por pagar
 * estado (varchar): "pendiente", "parcial" o "pagada"
 * id_venta (integer): FK a tabla ventas - La venta asociada
 *
 * ==========================================
 * CÓMO USAR EL SERVICIO CUENTASPORCOBRAR
 * ==========================================
 */

import { CuentasPorCobrarService } from "@/lib/services";
import { createClient } from "@/utils/supabase/server";

/**
 * EJEMPLO 1: Obtener todas las cuentas pendientes de un cliente
 */
export async function obtenerCuentasPendientes(idCliente: number) {
  const supabase = await createClient();
  const service = new CuentasPorCobrarService(supabase);

  const cuentasPendientes =
    await service.obtenerPendientesPorCliente(idCliente);

  // cuentasPendientes es un array de objetos CuentasPorCobrar
  console.log("Cuentas pendientes:", cuentasPendientes);

  return cuentasPendientes;
}

/**
 * EJEMPLO 2: Obtener el total pendiente de un cliente
 */
export async function obtenerTotalPendiente(idCliente: number) {
  const supabase = await createClient();
  const service = new CuentasPorCobrarService(supabase);

  const totalPendiente = await service.obtenerTotalPendiente(idCliente);

  console.log("Total pendiente del cliente:", totalPendiente);

  return totalPendiente;
}

/**
 * EJEMPLO 3: Registrar un pago en una cuenta
 */
export async function registrarPago(idCuenta: number, montoPagado: number) {
  const supabase = await createClient();
  const service = new CuentasPorCobrarService(supabase);

  const cuenta = await service.registrarPago(idCuenta, montoPagado);

  console.log("Pago registrado. Nueva cuenta:", cuenta);

  return cuenta;
}

/**
 * EJEMPLO 4: Obtener resumen de todas las cuentas de un cliente
 */
export async function obtenerResumenCliente(idCliente: number) {
  const supabase = await createClient();
  const service = new CuentasPorCobrarService(supabase);

  const resumen = await service.obtenerResumenCliente(idCliente);

  // Resumen incluye:
  // - totalCuentas: Cantidad de cuentas
  // - totalPendiente: Suma total pendiente
  // - totalPagado: Suma total pagado
  // - porcentajePagado: Porcentaje pagado

  console.log("Resumen del cliente:", resumen);

  return resumen;
}

/**
 * EJEMPLO 5: Obtener todas las cuentas de una venta específica
 */
export async function obtenerCuentasDeVenta(idVenta: number) {
  const supabase = await createClient();
  const service = new CuentasPorCobrarService(supabase);

  const cuentas = await service.obtenerPorVenta(idVenta);

  console.log("Cuentas de la venta:", cuentas);

  return cuentas;
}

/**
 * ==========================================
 * FLUJOS RECOMENDADOS
 * ==========================================
 *
 * FLUJO 1: Display de cliente con historial de deuda
 * 1. Obtener cliente
 * 2. Obtener resumen (totalPendiente, porcentajePagado)
 * 3. Mostrar en UI: "Debe $5000 (75% pagado)"
 *
 * FLUJO 2: Panel de cuentas por cobrar
 * 1. Obtener todas las cuentas con estado "pendiente"
 * 2. Agrupar por cliente
 * 3. Mostrar lista ordenada por fecha más antigua primero
 * 4. Permitir registrar pagos desde este panel
 *
 * FLUJO 3: Notificación de vencimiento
 * 1. Obtener cuentas con estado "pendiente"
 * 2. Filtrar por fecha_registro (más de 30 días)
 * 3. Enviar recordatorio al cliente
 *
 * ==========================================
 * INTEGRACIÓN CON VENTA
 * ==========================================
 *
 * Al crear una venta, el VentaService automáticamente:
 * 1. Crea la venta
 * 2. Crea los detalles de venta
 * 3. Llama a CuentasPorCobrarService.crearParaVenta()
 *
 * No necesitas hacer nada adicional - sucede automáticamente.
 *
 */

/**
 * ==========================================
 * MODELOS Y TIPOS
 * ==========================================
 */

interface ICuentasPorCobrar {
  id: number;
  id_cliente: number;
  fecha_registro: string;
  concepto: string | null;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: "pendiente" | "parcial" | "pagada";
  id_venta: number | null;
}

/**
 * Métodos disponibles en CuentasPorCobrar:
 * - calcularPorcentajePagado(): number
 * - estaPagada(): boolean
 * - estaParcialmentePagada(): boolean
 * - validar(): { valid: boolean; errors: string[] }
 * - toJSON(): ICuentasPorCobrar
 */
