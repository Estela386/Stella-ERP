"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SidebarMenu from "@/app/_components/SideBarMenu";
import {
  BarChart2,
  Gift,
  Dices,
  Package,
  Calendar,
  DollarSign,
  Ticket,
  CheckCircle2,
  PlusCircle,
  Loader2,
  Settings,
  Info,
  TrendingDown
} from "lucide-react";
import styles from "./styles.module.css";

interface Metricas {
  giros_hoy: number;
  giros_mes: number;
  presupuesto_usado: number;
  presupuesto_mensual: number;
  premios_entregados: Record<string, number>;
}

interface MetricasCodigos {
  codigos_activos: number;
  codigos_usados_hoy: number;
  codigos_usados_mes: number;
  top_codigos: { codigo: string; usos: number }[];
}

interface Reporte {
  total_en_oferta: number;
  dias_promedio: number;
  valor_stock_en_oferta: number;
  distribucion: { rango: string; cantidad: number }[];
}

interface Regla {
  id: number;
  nombre: string;
  dias_sin_venta: number;
  descuento_pct: number;
  margen_minimo_pct: number;
  activo: boolean;
}

export default function AdminFidelizacionPage() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState<"metricas" | "promociones" | "ruleta" | "inventario">("metricas");
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [metricasCodigos, setMetricasCodigos] = useState<MetricasCodigos | null>(null);
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ejecutandoDescuentos, setEjecutandoDescuentos] = useState(false);
  const [resultado, setResultado] = useState<{ msj: string; error?: boolean } | null>(null);

  // Formulario nuevo código promo
  const [nuevoCodigo, setNuevoCodigo] = useState({ codigo: "", tipo_descuento: "porcentaje", valor: 10, descripcion: "" });
  const [creandoCodigo, setCreandoCodigo] = useState(false);

  const getToken = useCallback(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, []);

  useEffect(() => {
    if (!loading && usuario?.id_rol !== 1) router.push("/dashboard/inicio");
  }, [loading, usuario, router]);

  const cargarDatos = useCallback(async () => {
    const token = await getToken();
    const h = { Authorization: `Bearer ${token}` };

    try {
      const [metRuletaRes, metCodigosRes, reporteRes, reglasRes] = await Promise.all([
        fetch("/api/ruleta?vista=metricas", { headers: h }).then((r) => r.json()),
        fetch("/api/promociones?vista=metricas", { headers: h }).then((r) => r.json()),
        fetch("/api/inventario-inteligente?vista=reporte", { headers: h }).then((r) => r.json()),
        fetch("/api/inventario-inteligente?vista=reglas", { headers: h }).then((r) => r.json()),
      ]);

      setMetricas(metRuletaRes.metricas ?? null);
      setMetricasCodigos(metCodigosRes.metricas ?? null);
      setReporte(reporteRes.reporte ?? null);
      setReglas(reglasRes.reglas ?? []);
    } finally {
      setCargando(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (!loading && usuario?.id_rol === 1) cargarDatos();
  }, [loading, usuario, cargarDatos]);

  const mostrarMensaje = (msj: string, error = false) => {
    setResultado({ msj, error });
    setTimeout(() => setResultado(null), 4000);
  };

  const ejecutarDescuentosAuto = async () => {
    setEjecutandoDescuentos(true);
    const token = await getToken();
    try {
      const res = await fetch("/api/inventario-inteligente", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accion: "ejecutar_descuentos" }),
      }).then((r) => r.json());
      mostrarMensaje(`Se han actualizado ${res.resultado?.productos_procesados ?? 0} productos`);
      cargarDatos();
    } catch {
      mostrarMensaje("Error al ejecutar descuentos", true);
    } finally {
      setEjecutandoDescuentos(false);
    }
  };

  const crearCodigo = async () => {
    if (!nuevoCodigo.codigo.trim()) return;
    setCreandoCodigo(true);
    const token = await getToken();
    try {
      const res = await fetch("/api/promociones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accion: "crear_codigo", codigo: nuevoCodigo }),
      }).then((r) => r.json());

      if (res.codigo) {
        mostrarMensaje(`Código ${res.codigo.codigo} creado exitosamente`);
        setNuevoCodigo({ codigo: "", tipo_descuento: "porcentaje", valor: 10, descripcion: "" });
        cargarDatos();
      } else {
        mostrarMensaje(res.error ?? "Error al crear código", true);
      }
    } catch {
      mostrarMensaje("Error al crear código", true);
    } finally {
      setCreandoCodigo(false);
    }
  };

  if (loading || cargando) {
    return (
      <div className={styles.pageContainer}>
        <SidebarMenu />
        <main className={styles.mainContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={32} color="#6a7c8f" />
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "metricas" as const,    label: "Métricas",    icon: BarChart2 },
    { id: "promociones" as const, label: "Promociones", icon: Gift },
    { id: "ruleta" as const,      label: "Ruleta",      icon: Dices },
    { id: "inventario" as const,  label: "Inventario",  icon: Package },
  ];

  const statCard = (
    Icon: React.ElementType,
    label: string,
    value: string | number,
    colorMode: "blue" | "rose" = "blue",
    sub?: string
  ) => (
    <div className={`${styles.metricCard} ${colorMode === "blue" ? styles.cardBlue : styles.cardRose}`}>
      <div className={styles.metricCardHeader}>
        <p className={styles.metricCardLabel}>{label}</p>
        <div className={styles.metricCardIconBox}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p className={styles.metricCardValue}>{value}</p>
      {sub && <p className={styles.metricCardSub}>{sub}</p>}
      <Icon className={styles.watermark} size={48} />
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <SidebarMenu />

      <main className={styles.mainContent}>
        {resultado && (
          <div className={`${styles.toaster} ${resultado.error ? styles.toasterError : ""}`}>
            {resultado.error ? <Info size={20} color="#f87171" /> : <CheckCircle2 size={20} color="#4ade80" />}
            {resultado.msj}
          </div>
        )}

        <div className={styles.header}>
          <p className={styles.subtitle}>Administración</p>
          <h1 className={styles.title}>Control de Fidelización</h1>
        </div>

        <div className={styles.tabsContainer}>
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTabActiva(t.id)}
                className={`${styles.tabBtn} ${tabActiva === t.id ? styles.tabBtnActive : ""}`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tabActiva === "metricas" && (
          <div>
            <div className={styles.statsGrid}>
              {statCard(Dices, "Giros de Ruleta hoy", metricas?.giros_hoy ?? 0, "blue")}
              {statCard(Calendar, "Giros este mes", metricas?.giros_mes ?? 0, "rose")}
              {statCard(DollarSign, "Presupuesto Ruleta", `$${(metricas?.presupuesto_usado ?? 0).toLocaleString()}`, "blue", `de $${(metricas?.presupuesto_mensual ?? 5000).toLocaleString()}`)}
              {statCard(Ticket, "Códigos Activos", metricasCodigos?.codigos_activos ?? 0, "blue")}
              {statCard(CheckCircle2, "Usos de código (Hoy)", metricasCodigos?.codigos_usados_hoy ?? 0, "rose")}
              {statCard(TrendingDown, "Productos en Oferta", reporte?.total_en_oferta ?? 0, "blue", `~${Math.round(reporte?.dias_promedio ?? 0)} días sin venta`)}
            </div>

            {metricas?.premios_entregados && Object.keys(metricas.premios_entregados).length > 0 && (
              <div className={styles.whitePanel}>
                <h3 className={styles.panelTitle}><Gift size={20} color="#ca7c85" /> Premios de Ruleta Entregados (Mes)</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {Object.entries(metricas.premios_entregados).map(([nombre, cantidad]) => (
                    <div key={nombre} className={styles.listItem}>
                      <span className={styles.listColName}>{nombre}</span>
                      <span className={styles.listColValue}>{cantidad} entregados</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tabActiva === "promociones" && (
          <div className={styles.whitePanel}>
            <h3 className={styles.panelTitle}><PlusCircle size={20} color="#6a7c8f" /> Crear Código Promocional</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>CÓDIGO (EJ: BIENVENIDA10) *</label>
                <input
                  className={styles.inputControl}
                  value={nuevoCodigo.codigo}
                  onChange={(e) => setNuevoCodigo(p => ({ ...p, codigo: e.target.value.toUpperCase() }))}
                  placeholder="Escribe el código..."
                />
              </div>
              <div className={styles.inputGroup}>
                <label>TIPO DE BENEFICIO</label>
                <select
                  className={styles.inputControl}
                  value={nuevoCodigo.tipo_descuento}
                  onChange={(e) => setNuevoCodigo(p => ({ ...p, tipo_descuento: e.target.value }))}
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="monto_fijo">Monto fijo ($)</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>VALOR ({nuevoCodigo.tipo_descuento === "porcentaje" ? "%" : "$"})</label>
                <input
                  type="number"
                  className={styles.inputControl}
                  value={nuevoCodigo.valor}
                  onChange={(e) => setNuevoCodigo(p => ({ ...p, valor: parseFloat(e.target.value) }))}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>DESCRIPCIÓN (Opcional)</label>
                <input
                  className={styles.inputControl}
                  value={nuevoCodigo.descripcion}
                  onChange={(e) => setNuevoCodigo(p => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Breve propósito del código"
                />
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <button
                className={styles.primaryBtn}
                onClick={crearCodigo}
                disabled={creandoCodigo || !nuevoCodigo.codigo.trim()}
              >
                {creandoCodigo ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {creandoCodigo ? "Creando código..." : "Guardar Código Promocional"}
              </button>
            </div>
          </div>
        )}

        {tabActiva === "ruleta" && (
          <div className={styles.whitePanel}>
            <h3 className={styles.panelTitle}><Settings size={20} color="#6a7c8f" /> Configuración de Recompensas</h3>
            <p style={{ fontSize: "0.9rem", color: "#6a7c8f", lineHeight: 1.5, marginBottom: "1rem" }}>
              Los premios y probabilidades de la ruleta se configuran dinámicamente mediante la tabla <code>roulette_rewards</code> en Supabase.
            </p>
            <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#4a5568" }}>
                <strong>Integra con API:</strong> POST <code>/api/ruleta</code> con la acción <code>toggle_reward</code> o <code>update_config</code> para ajustar el presupuesto.
              </p>
            </div>
          </div>
        )}

        {tabActiva === "inventario" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h3 className={styles.panelTitle} style={{ margin: 0 }}><Package size={20} color="#6a7c8f" /> Resumen de Inventario Inteligente</h3>
              <button
                className={styles.primaryBtn}
                onClick={ejecutarDescuentosAuto}
                disabled={ejecutandoDescuentos}
              >
                {ejecutandoDescuentos ? <Loader2 className="animate-spin" size={16} /> : <Settings size={16} />}
                {ejecutandoDescuentos ? "Analizando rotación..." : "Forzar ejecución de Reglas"}
              </button>
            </div>

            {reporte && (
               <div className={styles.statsGrid}>
                 {statCard(TrendingDown, "SKUs en Oferta", reporte.total_en_oferta, "rose")}
                 {statCard(Calendar, "Promedio sin ventas", `${Math.round(reporte.dias_promedio)} días`, "blue")}
                 {statCard(DollarSign, "Valor de mercancía estancada", `$${reporte.valor_stock_en_oferta.toLocaleString()}`, "blue")}
               </div>
            )}

            <div className={styles.formGrid}>
              {/* Distribución */}
              {reporte?.distribucion && (
                <div className={styles.whitePanel}>
                  <h4 className={styles.panelTitle} style={{ fontSize: "0.95rem" }}><BarChart2 size={16} /> Distribución (Días inactivos)</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                    {reporte.distribucion.map((d) => (
                      <div key={d.rango} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "#4a5568", width: "80px" }}>{d.rango}</span>
                        <div style={{ flex: 1, background: "#f1f5f9", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "#ca7c85", width: `${Math.min((d.cantidad / Math.max(reporte.total_en_oferta, 1)) * 100, 100)}%` }} />
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, width: "30px", textAlign: "right", color: "#6a7c8f" }}>{d.cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reglas configuradas */}
              <div className={styles.whitePanel}>
                <h4 className={styles.panelTitle} style={{ fontSize: "0.95rem" }}><Info size={16} /> Niveles de Descuento (Reglas)</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                  {reglas.map((r) => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#1a1a2e" }}>{r.nombre}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#708090" }}>
                          &gt; {r.dias_sin_venta} días = {r.descuento_pct}% dcto.
                        </p>
                      </div>
                      <span className={`${styles.badge} ${r.activo ? styles.badgeActive : styles.badgeInactive}`}>
                        {r.activo ? "ACTIVA" : "INACTIVA"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

