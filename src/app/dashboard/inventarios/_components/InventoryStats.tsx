import { Producto } from "../type";

export default function InventoryStats({
  productos,
}: {
  productos: Producto[];
}) {
  const total = productos.length;
  const valor = productos.reduce((acc, p) => acc + p.stock_actual * p.costo, 0);
  const bajo = productos.filter(
    p => p.stock_actual <= p.stock_min && p.stock_actual > 0
  ).length;
  const agotados = productos.filter(p => p.stock_actual === 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Total Piezas" value={total} />
      <Stat label="Valor Inventario" value={`$${valor}`} />
      <Stat label="Stock Bajo" value={bajo} highlight />
      <Stat label="Agotados" value={agotados} danger />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: any;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-xl font-semibold ${
          highlight ? "text-orange-600" : ""
        } ${danger ? "text-red-600" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
