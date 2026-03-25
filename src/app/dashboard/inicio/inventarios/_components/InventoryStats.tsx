import { Producto } from "../type";

export default function InventoryStats({
  productos,
  onFilterChange,
}: {
  productos: Producto[];
  onFilterChange: (f: "todos" | "bajo" | "agotados") => void;
}) {
  const totalPiezas = productos.reduce((acc, p) => acc + p.stock_actual, 0);

  const valorInventario = productos.reduce(
    (acc, p) => acc + p.stock_actual * p.costo,
    0
  );

  const valorFormateado = valorInventario.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const bajo = productos.filter(
    p => p.stock_actual <= p.stock_min && p.stock_actual > 0
  ).length;

  const agotados = productos.filter(p => p.stock_actual === 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <Stat
        label="Valor del Inventario"
        value={valorFormateado}
        color="bg-[#708090]"   // ⭐ COLOR DIFERENTE
      />

      <Stat
        label="Total de Piezas"
        value={totalPiezas}
        color="bg-[#B76E79]"
        onClick={() => onFilterChange("todos")}
      />

      <Stat
        label="Stock Bajo"
        value={bajo}
        color="bg-[#708090]"
        onClick={() => onFilterChange("bajo")}
      />

      <Stat
        label="Agotados"
        value={agotados}
        color="bg-[#B76E79]"   // ⭐ COLOR DIFERENTE
        onClick={() => onFilterChange("agotados")}
      />

    </div>
  );
}

function Stat({
  label,
  value,
  onClick,
  color,
}: {
  label: string;
  value: any;
  onClick?: () => void;
  color: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        p-4
        text-[#f6f4ef]
        ${color}
        ${onClick ? "cursor-pointer hover:shadow-lg shadow-[0_4px_12px_rgba(140,151,104,0.15)]" : ""}
        transition-all duration-300
      `}
    >
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}