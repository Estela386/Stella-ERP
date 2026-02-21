interface Stat {
  label: string;
  value: string | number;
  hint?: string;
}

const stats: Stat[] = [
  { label: "Ventas Hoy", value: "$14,100", hint: "6 transacciones" },
  { label: "Esta Semana", value: "$118,000", hint: "+15.3% vs anterior" },
  { label: "Ticket Promedio", value: "$4,716", hint: "25 ventas" },
  { label: "Top Vendedor", value: "Ana Martínez", hint: "$42,500 este mes" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat: Stat, index: number) => {
        const bgColor = index % 2 !== 0 ? "bg-[#B76E79]" : "bg-[#708090]";

        return (
          <div
            key={stat.label}
            className={`p-4 rounded-xl shadow-md shadow-[#8c8c76] ${bgColor}`}
          >
            <p className="text-sm text-[#f6f4ef]">{stat.label}</p>

            <p className="text-2xl font-bold text-[#f6f4ef]">{stat.value}</p>

            {stat.hint && (
              <p className="text-xs text-[#f6f4ef]/80 mt-1">{stat.hint}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
