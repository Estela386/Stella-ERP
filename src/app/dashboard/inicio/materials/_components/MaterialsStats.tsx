import { Insumo } from "@lib/models/Insumo";

type Filtro = "TODOS" | "BAJO" | "AGOTADO";

type Props = {
  materiales: Insumo[];
  onFilter: (filtro: Filtro) => void;
};

export default function MaterialsStats({ materiales, onFilter }: Props) {
  const total = materiales.length;
  const stockBajo = materiales.filter(
    m => m.cantidad > 0 && m.cantidad < 5
  ).length;
  const agotados = materiales.filter(m => m.cantidad === 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <StatCard
        title="Total de Materiales"
        value={total}
        onClick={() => onFilter("TODOS")}
      />

      <StatCard
        title="Stock Bajo"
        value={stockBajo}
        onClick={() => onFilter("BAJO")}
        middle
      />

      <StatCard
        title="Agotados"
        value={agotados}
        onClick={() => onFilter("AGOTADO")}
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  onClick: () => void;
  middle?: boolean;
};

function StatCard({ title, value, onClick, middle = false }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        cursor-pointer
        rounded-2xl
        ${middle ? "bg-[#B76E79]" : "bg-[#708090]"}
        text-white
        p-5
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        active:scale-95
        transition-all duration-200
      `}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
