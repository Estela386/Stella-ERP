import { Consignacion } from "../type";

export default function InventoryStats({
  consignaciones,
}: {
  consignaciones: Consignacion[];
}) {
  const activas = consignaciones.filter(c => c.estado === "ACTIVA").length;
  const vencidas = consignaciones.filter(c => c.estado === "VENCIDA").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total */}
      <div className="bg-[#708090] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]" style={{ fontFamily: "var(--font-sans)" }}>Total</p>
        <p className="text-2xl font-bold text-[#f6f4ef]" style={{ fontFamily: "var(--font-marcellus)", fontWeight: 400 }}>
          {consignaciones.length}
        </p>
      </div>

      {/* Activas */}
      <div className="bg-[#b76e79] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]" style={{ fontFamily: "var(--font-sans)" }}>Activas</p>
        <p className="text-2xl font-bold text-[#f6f4ef]" style={{ fontFamily: "var(--font-marcellus)", fontWeight: 400 }}>
          {activas}
        </p>
      </div>

      {/* Vencidas */}
      <div className="bg-[#708090] p-4 rounded-xl shadow-md shadow-[#8c8c76]">
        <p className="text-sm text-[#f6f4ef]" style={{ fontFamily: "var(--font-sans)" }}>Vencidas</p>
        <p className="text-2xl font-bold text-[#f6f4ef]" style={{ fontFamily: "var(--font-marcellus)", fontWeight: 400 }}>
          {vencidas}
        </p>
      </div>
    </div>
  );
}
