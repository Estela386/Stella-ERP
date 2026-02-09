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
      {stats.map(stat => (
        <div
          key={stat.label}
          className="
            bg-white
            rounded-xl
            p-5
            border border-[#8C9796]/25
          "
        >
          <p className="text-sm text-[#708090]">{stat.label}</p>
          <p className="text-2xl font-semibold text-[#1C1C1C] mt-1">
            {stat.value}
          </p>
          {stat.hint && (
            <p className="text-xs text-[#8C9796] mt-1">
              {stat.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
