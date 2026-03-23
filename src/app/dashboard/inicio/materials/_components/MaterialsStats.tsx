import { Insumo } from "@lib/models";

type Filtro = "TODOS" | "BAJO" | "AGOTADO";

type Props = {
  materiales: Insumo[];
  onFilter: (filtro: Filtro) => void;
};

export default function MaterialsStats({ materiales, onFilter }: Props) {
  const total = materiales.length;
  const stockBajo = materiales.filter(
    m => m.cantidad > 0 && m.cantidad < (m.stock_minimo || 5)
  ).length;
  const agotados = materiales.filter(m => m.cantidad === 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <StatCard
        title="Total de Materiales"
        value={total}
        onClick={() => onFilter("TODOS")}
        color="slate"
      />

      <StatCard
        title="Stock Bajo"
        value={stockBajo}
        onClick={() => onFilter("BAJO")}
        color="slate"
      />

      <StatCard
        title="Agotados"
        value={agotados}
        onClick={() => onFilter("AGOTADO")}
        color="rose"
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  onClick: () => void;
  color: "slate" | "rose";
};

function StatCard({ title, value, onClick, color }: StatCardProps) {
  const bgColor = color === "rose" ? "bg-[#B76E79]" : "bg-[#708090]";
  
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        cursor-pointer
        rounded-2xl
        ${bgColor}
        text-white
        p-5
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        active:scale-95
        transition-all duration-200
      `}
    >
      <p className="text-sm opacity-80 font-sans tracking-wide">{title}</p>
      <p className="text-4xl font-sans font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}
