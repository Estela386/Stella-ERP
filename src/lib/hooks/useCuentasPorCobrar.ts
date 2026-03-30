import { useState, useEffect, useCallback } from "react";
import { createClient } from "@utils/supabase/client";
import { CuentasPorCobrarService } from "@lib/services";
import { ICuentasPorCobrar, IPago } from "@lib/models/CuentasPorCobrar";
import { ICliente } from "@lib/models/Cliente";
export function useCuentasPorCobrar() {
  const [cuentas, setCuentas] = useState<ICuentasPorCobrar[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getService = () => {
    const supabase = createClient();
    return new CuentasPorCobrarService(supabase);
  };

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const service = getService();

      const [
        { cuentas: cuentasData, error: errorCuentas },
        { clientes: clientesData },
      ] = await Promise.all([
        service.obtenerTodas(),
        service.obtenerClientes(),
      ]);

      if (errorCuentas) {
        setError(errorCuentas);
        return;
      }

      setCuentas(cuentasData || []);
      setClientes(clientesData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const crearCuentaConCliente = useCallback(
    async (
      nombreCliente: string,
      telefono: string,
      concepto: string,
      montoInicial: number
    ): Promise<{ error: string | null }> => {
      try {
        const service = getService();

        // Crear cliente
        const { cliente, error: errorCliente } = await service.crearCliente({
          nombre: nombreCliente,
          telefono,
        });
        if (errorCliente || !cliente) return { error: errorCliente };

        // Crear cuenta
        const { cuenta, error: errorCuenta } = await service.crear(
          cliente.id,
          concepto,
          montoInicial
        );
        if (errorCuenta || !cuenta) return { error: errorCuenta };

        // Actualizar estado local
        setCuentas(prev => [cuenta, ...prev]);
        setClientes(prev => [...prev, cliente]);

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    []
  );

  const crearCuenta = useCallback(
    async (
      id_cliente: number,
      concepto: string,
      montoInicial: number
    ): Promise<{ error: string | null }> => {
      try {
        const service = getService();
        const { cuenta, error } = await service.crear(
          id_cliente,
          concepto,
          montoInicial
        );
        if (error || !cuenta) return { error };
        setCuentas(prev => [cuenta, ...prev]);
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    []
  );

  const registrarPago = useCallback(
    async (
      id_cuenta: number,
      monto: number,
      metodo: string,
      observaciones?: string
    ): Promise<{ error: string | null }> => {
      try {
        const service = getService();
        const { cuenta, error } = await service.registrarPago(
          id_cuenta,
          monto,
          metodo,
          observaciones
        );
        if (error || !cuenta) return { error };

        setCuentas(prev =>
          prev.map(c =>
            c.id === id_cuenta
              ? {
                  ...c, // ← mantiene cliente y resto
                  monto_pagado: cuenta.monto_pagado,
                  monto_pendiente: cuenta.monto_pendiente,
                  estado: cuenta.estado,
                }
              : c
          )
        );
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    []
  );

  const obtenerPagos = useCallback(
    async (
      id_cuenta: number
    ): Promise<{ pagos: IPago[] | null; error: string | null }> => {
      const service = getService();
      return await service.obtenerPagos(id_cuenta);
    },
    []
  );

  return {
    cuentas,
    clientes,
    loading,
    error,
    cargarDatos,
    crearCuentaConCliente,
    crearCuenta,
    registrarPago,
    obtenerPagos,
  };
}
