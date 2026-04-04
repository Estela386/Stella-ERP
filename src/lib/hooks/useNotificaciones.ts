"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@utils/supabase/client";
import { NotificacionService } from "@lib/services/NotificacionService";
import { INotificacion } from "@lib/models/Notificacion";
import type { RealtimeChannel } from "@supabase/supabase-js";

// =========================================
// 🔔 HOOK: useNotificaciones
// =========================================

interface UseNotificacionesResult {
  notificaciones: INotificacion[];
  noLeidas: number;
  loading: boolean;
  error: string | null;
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  reload: () => void;
}

export function useNotificaciones(): UseNotificacionesResult {
  const [notificaciones, setNotificaciones] = useState<INotificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const reload = useCallback(() => setRev((r) => r + 1), []);

  // Carga inicial
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const service = new NotificacionService(supabase);
        const { notificaciones: data, error: err } = await service.obtenerTodas();
        if (err) setError(err);
        else setNotificaciones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [rev]);

  // Suscripción en tiempo real
  useEffect(() => {
    const supabase = createClient();
    const service = new NotificacionService(supabase);

    channelRef.current = service.suscribirTiempoReal((nuevaNotif) => {
      setNotificaciones((prev) => [nuevaNotif, ...prev]);
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const marcarLeida = useCallback(async (id: number) => {
    const supabase = createClient();
    const service = new NotificacionService(supabase);
    await service.marcarLeida(id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    const supabase = createClient();
    const service = new NotificacionService(supabase);
    await service.marcarTodasLeidas();
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }, []);

  const eliminar = useCallback(async (id: number) => {
    const supabase = createClient();
    const service = new NotificacionService(supabase);
    await service.eliminar(id);
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return {
    notificaciones,
    noLeidas,
    loading,
    error,
    marcarLeida,
    marcarTodasLeidas,
    eliminar,
    reload,
  };
}
