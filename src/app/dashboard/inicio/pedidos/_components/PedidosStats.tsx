"use client";
import { Package, Clock, Wrench } from "lucide-react";
import { Pedido } from "../type";

type Props = {
  pedidos: Pedido[];
};

export default function PedidosStats({ pedidos }: Props) {
  const enProduccion = pedidos.filter(
    p => p.estado === "EN_PRODUCCION"
  ).length;

  const pendientes = pedidos.filter(
    p => p.estado === "PENDIENTE"
  ).length;

  const items = [
    { label: "Total Proyectos", value: pedidos.length, bgStart: "#758390", bgEnd: "#657582", icon: Package },
    { label: "En producción", value: enProduccion, bgStart: "#C07E88", bgEnd: "#B76E79", icon: Wrench },
    { label: "Pendientes", value: pendientes, bgStart: "#758390", bgEnd: "#657582", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <style jsx>{`
        .stat-card-hover {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="stat-card-hover group relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between min-h-[160px]"
            style={{
              background: `linear-gradient(135deg, ${item.bgStart}, ${item.bgEnd})`,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{item.label}</p>
                <p className="text-4xl font-black font-mono tracking-tighter" style={{ fontFamily: "var(--font-marcellus)" }}>
                    {item.value.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                <Icon size={24} />
              </div>
            </div>

            {/* Bottom Decoration */}
            <div className="mt-4 flex items-center justify-between relative z-10">
                <div className="w-12 h-1 bg-white/30 rounded-full group-hover:w-20 transition-all duration-700" />
            </div>

            {/* Background Icon Decoration */}
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700">
                <Icon size={140} />
            </div>
          </div>
        );
      })}
    </div>
  );
}