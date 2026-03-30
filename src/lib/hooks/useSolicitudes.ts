"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@utils/supabase/client";
import { ISolicitudMayorista, IUsuarioMayorista } from "@lib/models";
import { SolicitudMayoristaService } from "@lib/services/SolicitudMayoristaService";
import { UsuarioService } from "@lib/services/UsuarioService";

interface UseSolicitudesResult {
  solicitudes: ISolicitudMayorista[];
  usuariosNormales: IUsuarioMayorista[];
  loading: boolean;
  error: string | null;
  pendientes: number;
  reload: () => void;
}

export function useSolicitudes(): UseSolicitudesResult {
  const [solicitudes, setSolicitudes] = useState<ISolicitudMayorista[]>([]);
  const [usuariosNormales, setUsuariosNormales] = useState<IUsuarioMayorista[]>([]);
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
        const solService = new SolicitudMayoristaService(supabase);
        const userService = new UsuarioService(supabase);

        const [sResult, uResult] = await Promise.all([
          solService.listarTodas(),
          userService.listarClientesNormales(),
        ]);

        if (sResult.error) setError(sResult.error);
        else setSolicitudes(sResult.solicitudes);

        if (!uResult.error) setUsuariosNormales(uResult.usuarios);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [rev]);

  const pendientes = solicitudes.filter(s => s.estado === "pendiente").length;

  return { solicitudes, usuariosNormales, loading, error, pendientes, reload };
}
