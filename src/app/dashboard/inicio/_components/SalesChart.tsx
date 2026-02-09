export default function SalesChart() {
  const data = [
    { day: "Lun", value: 40 },
    { day: "Mar", value: 55 },
    { day: "Mié", value: 30 },
    { day: "Jue", value: 65 },
    { day: "Vie", value: 80 },
    { day: "Sáb", value: 100 },
    { day: "Dom", value: 45 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#8C9796]/25 p-6">
      <h2 className="text-lg font-medium mb-6">
        Ventas de la Semana
      </h2>

      <div className="flex items-end gap-4 h-64">
        {data.map(d => (
          <div key={d.day} className="flex flex-col items-center gap-2">
            <div
              className="w-8 rounded-xl bg-[#F2A23A]"
              style={{ height: `${d.value}%` }}
            />
            <span className="text-xs text-[#708090]">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
