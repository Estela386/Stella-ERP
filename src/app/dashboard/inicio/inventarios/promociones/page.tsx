"use client";

import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { InventarioService } from "@/lib/services/InventarioService";
import { AnalisisInventario } from "@/lib/models/AnalisisInventario";
import { AlertCircle, TrendingDown, PackageX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SidebarMenu from "@/app/_components/SideBarMenu";

export default function PromocionesPage() {
  const [analisis, setAnalisis] = useState<AnalisisInventario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalisis = async () => {
    setLoading(true);
    const supabase = createClient();
    const service = new InventarioService(supabase);
    const { analisis, error } = await service.obtenerAnalisisPromociones();

    if (error) toast.error("Error al cargar el análisis");
    if (analisis) setAnalisis(analisis);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalisis();
  }, []);

  const handleDescontinuar = async (id: number, nombre: string) => {
    const supabase = createClient();
    const service = new InventarioService(supabase);
    const success = await service.descontinuarProducto(id);

    if (success) {
      toast.success(`${nombre} marcado para NO resurtir.`);
      fetchAnalisis(); // Recargar datos
    } else {
      toast.error("Hubo un problema al actualizar el producto.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#f6f4ef]">
        <Loader2 className="animate-spin text-[#b76e79] h-12 w-12" />
      </div>
    );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--beige)" }}
    >
      <SidebarMenu />
      <div className="flex-1 h-full overflow-y-auto bg-[#f6f4ef] p-10 text-[#4a5568] font-sans">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl mb-2 font-serif">
            Promociones &{" "}
            <span className="text-[#b76e79] italic">Control de Obsoletos</span>
          </h1>
          <p className="text-[#708090] mb-8">
            Análisis automatizado basado en tiempo de estancamiento.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#ede9e3] text-[#708090] text-sm uppercase">
                <tr>
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium text-center">Días en Stock</th>
                  <th className="p-4 font-medium text-center">
                    Descuento Aplicado
                  </th>
                  <th className="p-4 font-medium text-right">Precio Final</th>
                  <th className="p-4 font-medium text-center">
                    Estado Resurtido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analisis.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={item.url_imagen || "/LogoM.svg"}
                        alt={item.nombre}
                        className="w-12 h-12 rounded object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-xs text-slate-400">
                          Stock: {item.stock_actual} | Min: {item.stock_min}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`font-semibold ${item.dias_estancado > 90 ? "text-orange-500" : "text-slate-600"}`}
                      >
                        {item.dias_estancado} días
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {item.descuento_automatico > 0 ? (
                        <span className="bg-[#b76e79]/10 text-[#b76e79] py-1 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1 mx-auto w-fit">
                          <TrendingDown size={14} /> -
                          {item.descuento_automatico}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {item.descuento_automatico > 0 && (
                        <span className="text-xs line-through text-slate-400 mr-2">
                          ${item.precio}
                        </span>
                      )}
                      <span className="font-bold text-[#b76e79]">
                        ${item.getPrecioFinal().toLocaleString()}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {item.no_resurtir ? (
                        <span className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
                          <PackageX size={14} /> Descontinuado
                        </span>
                      ) : item.sugerencia_no_resurtir ? (
                        <button
                          onClick={() =>
                            handleDescontinuar(item.id, item.nombre)
                          }
                          className="text-xs bg-red-50 text-red-600 border border-red-200 py-1.5 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                          <AlertCircle size={14} /> Confirmar baja
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 bg-green-50 py-1 px-3 rounded-full">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {analisis.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No hay productos registrados en el análisis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
