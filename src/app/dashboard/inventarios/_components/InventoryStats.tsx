import { Producto } from "../type";

export default function InventoryStats({
  productos,
}: {
  productos: Producto[];
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
        label="Total de Piezas"
        value={totalPiezas}
        bgColor="bg-[#708090]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Valor del Inventario"
        value={valorFormateado}
        bgColor="bg-[#B76E79]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Stock Bajo"
        value={bajo}
        bgColor="bg-[#708090]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Agotados"
        value={agotados}
        bgColor="bg-[#B76E79]"
        textColor="text-[#F8F6F2]"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  value: any;
  bgColor: string;
  textColor: string;
}) {
  const isDark =
    bgColor.includes("#708090") || bgColor.includes("#B76E79");

  return (
    <div
      className={`
        rounded-xl
        p-4
        transition-all
        duration-200
        ${isDark ? "border border-white/10" : "border border-black/10"}
        ${bgColor}
      `}
    >
      <p
        className={`
          text-xs
          tracking-wide
          ${isDark ? "text-white/70" : "text-[#111111]/70"}
        `}
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          text-2xl
          md:text-3xl
          font-semibold
          ${textColor}
        `}
      >
        {value}
      </p>
    </div>
  );
}
