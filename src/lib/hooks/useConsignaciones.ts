"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@utils/supabase/client";
import { IConsignacion, IUsuarioMayorista } from "@lib/models";
import { ConsignacionService } from "@lib/services/ConsignacionService";

interface UseConsignacionesResult {
  consignaciones: IConsignacion[];
  mayoristas: IUsuarioMayorista[];
  loading: boolean;
  error: string | null;
  stats: {
    asignados: number;
    vendidos: number;
    devueltos: number;
    ganancia: number;
  };
  reload: () => void;
}

/** Hook para administrador: todas las consignaciones */
export function useConsignaciones(): UseConsignacionesResult {
  const [consignaciones, setConsignaciones] = useState<IConsignacion[]>([]);
  const [mayoristas, setMayoristas] = useState<IUsuarioMayorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);

  const reload = useCallback(() => setRev(r => r + 1), []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const service = new ConsignacionService(supabase);

        const [cResult, mResult] = await Promise.all([
          service.listarTodas(),
          service.listarMayoristas(),
        ]);

        if (cResult.error) setError(cResult.error);
        else setConsignaciones(cResult.consignaciones);

        if (!mResult.error) setMayoristas(mResult.mayoristas);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [rev]);

  let asignados = 0;
  let vendidos = 0;
  let devueltos = 0;
  let ganancia = 0;

  consignaciones.forEach((c) => {
    c.detalles?.forEach((d) => {
      asignados += d.cantidad || 0;
      vendidos += d.cantidad_vendida || 0;
      devueltos += d.cantidad_devuelta || 0;
      ganancia += (d.precio_venta - d.precio_mayorista) * (d.cantidad_vendida || 0);
    });
  });

  const stats = { asignados, vendidos, devueltos, ganancia };

  return { consignaciones, mayoristas, loading, error, stats, reload };
}

/** Hook para mayorista: solo sus consignaciones */
export function useConsignacionesMayorista(idMayorista: number | null) {
  const [consignaciones, setConsignaciones] = useState<IConsignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);

  const reload = useCallback(() => setRev(r => r + 1), []);

  useEffect(() => {
    if (!idMayorista) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const service = new ConsignacionService(supabase);
        const { consignaciones: data, error: err } =
          await service.listarPorMayorista(idMayorista);
        if (err) setError(err);
        else setConsignaciones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [idMayorista, rev]);

  let asignados = 0;
  let vendidos = 0;
  let devueltos = 0;
  let ganancia = 0;

  consignaciones.forEach((c) => {
    c.detalles?.forEach((d) => {
      asignados += d.cantidad || 0;
      vendidos += d.cantidad_vendida || 0;
      devueltos += d.cantidad_devuelta || 0;
      ganancia += (d.precio_venta - d.precio_mayorista) * (d.cantidad_vendida || 0);
    });
  });

  const stats = { asignados, vendidos, devueltos, ganancia };

  return { consignaciones, loading, error, stats, reload };
}
