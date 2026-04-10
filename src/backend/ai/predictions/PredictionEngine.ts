import { SupabaseClient } from "@supabase/supabase-js";

export interface PredictionInsight {
  trending_products: Array<{ id: number; nombre: string; score: number }>;
  low_rotation_products: Array<{ id: number; nombre: string; dias_sin_venta: number }>;
  demand_predictions: Array<{ id: number; nombre: string; predicted_demand_next_30_days: number }>;
}

export class PredictionEngine {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Genera insights básicos analizando las tablas relacionadas a ventas e histórico.
   */
  async generateInsights(): Promise<PredictionInsight> {
    try {
      // 1. Fetch products
      const { data: productos, error: prodErr } = await this.supabase
        .from('producto')
        .select('id, nombre, stock_actual')
        .eq('activo', true);

      if (prodErr || !productos) throw new Error("Error obteniendo productos: " + prodErr?.message);

      // 2. Fetch last 90 days of sales to detect trending and low rotation
      const noventaDiasAtras = new Date();
      noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
      
      const { data: ventasQuery, error: ventasErr } = await this.supabase
        .from('ventas')
        .select(`
          id, 
          fecha, 
          detallesventas(cantidad, id_producto)
        `)
        .gte('fecha', noventaDiasAtras.toISOString());

      if (ventasErr) throw new Error("Error obteniendo ventas: " + ventasErr.message);

      // Calcular mapa de ventas recientes
      const salesMap = new Map<number, { lastSaleDate: Date, totalQty: number, recentQty: number }>();
      
      const treintaDiasAtras = new Date();
      treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

      ventasQuery?.forEach((venta: any) => {
        const ventaDate = new Date(venta.fecha);
        const isRecent = ventaDate >= treintaDiasAtras;

        venta.detallesventas?.forEach((d: any) => {
          const pid = d.id_producto;
          if (!salesMap.has(pid)) {
             salesMap.set(pid, { lastSaleDate: ventaDate, totalQty: 0, recentQty: 0 });
          }
          
          const current = salesMap.get(pid)!;
          if (ventaDate > current.lastSaleDate) current.lastSaleDate = ventaDate;
          current.totalQty += d.cantidad;
          if (isRecent) current.recentQty += d.cantidad;
        });
      });

      // 3. Optional: Intentar consultar product_sales_history si existe
      let historyMap = new Map<number, number>();
      try {
        const { data: historyData, error: histErr } = await this.supabase
          .from('product_sales_history')
          .select('*')
          .limit(1000);
          
        if (!histErr && historyData) {
            // Suponiendo formato: id_producto, historial_mensual, etc.
            // Para mantener robustez, mapeamos si existe.
            historyData.forEach((h: any) => {
                historyMap.set(h.id_producto || h.product_id, h.monthly_average || 0);
            });
        }
      } catch (e) {
         // Silencio: si no existe o falla, pasamos a usar logica derivada
      }

      const trending_products: any[] = [];
      const low_rotation_products: any[] = [];
      const demand_predictions: any[] = [];

      const HOY = new Date();

      productos.forEach(p => {
        const pSales = salesMap.get(p.id);

        if (pSales) {
           // Si se vendió en los últimos 30 días con alto volumen, es trending
           if (pSales.recentQty > 0) {
             trending_products.push({
               id: p.id,
               nombre: p.nombre,
               score: pSales.recentQty * 1.5 // Multiplicador de tracción
             });
           }

           // Dias sin venta
           const diasSinVenta = Math.floor((HOY.getTime() - pSales.lastSaleDate.getTime()) / (1000 * 3600 * 24));
           if (diasSinVenta > 45) {
             low_rotation_products.push({ id: p.id, nombre: p.nombre, dias_sin_venta: diasSinVenta });
           }

           // Predecir demanda para próximos 30 días
           let predicted = historyMap.get(p.id) || (pSales.totalQty / 3); // prom 3 meses
           
           // Evitar proyecciones locas
           predicted = Math.round(predicted * 1.1); // Proyectar 10% crecimiento orgánico
           
           if (predicted > 0) {
             demand_predictions.push({ id: p.id, nombre: p.nombre, predicted_demand_next_30_days: predicted });
           }
        } else {
           // Nunca se vendió en 90 días -> Sin rotación crítica
           low_rotation_products.push({ id: p.id, nombre: p.nombre, dias_sin_venta: 90 });
           demand_predictions.push({ id: p.id, nombre: p.nombre, predicted_demand_next_30_days: 0 });
        }
      });

      // Ordenar insights
      trending_products.sort((a,b) => b.score - a.score);
      low_rotation_products.sort((a,b) => b.dias_sin_venta - a.dias_sin_venta);
      demand_predictions.sort((a,b) => b.predicted_demand_next_30_days - a.predicted_demand_next_30_days);

      return {
        trending_products: trending_products.slice(0, 10),
        low_rotation_products: low_rotation_products.slice(0, 15),
        demand_predictions: demand_predictions.slice(0, 20)
      };

    } catch (err) {
      console.error("[PredictionEngine] Error:", err);
      throw err;
    }
  }
}
