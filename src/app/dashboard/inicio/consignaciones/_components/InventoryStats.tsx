import { IConsignacion } from "../type";

export default function InventoryStats({
  consignaciones,
}: {
  consignaciones: IConsignacion[];
}) {
  const activas = consignaciones.filter(c => c.estado === "activa").length;
  const vencidas = consignaciones.filter(c => c.estado === "finalizada").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total */}
      <div className="bg-[#708090] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]">Total</p>
        <p className="text-2xl font-bold text-[#f6f4ef]">
          {consignaciones.length}
        </p>
      </div>

      {/* Activas */}
      <div className="bg-[#b76e79] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]">Activas</p>
        <p className="text-2xl font-bold text-[#f6f4ef]">{activas}</p>
      </div>

      {/* Vencidas */}
      <div className="bg-[#708090] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]">Vencidas</p>
        <p className="text-2xl font-bold text-[#f6f4ef]">{vencidas}</p>
      </div>
    </div>
  );
}
