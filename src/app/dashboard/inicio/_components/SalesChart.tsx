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
    <div
      className="
        rounded-2xl
        border border-black/10
        shadow-md shadow-[#8C9796]/30
        overflow-hidden
      "
    >
      {/* Header oscuro elegante */}
      <div className="bg-[#708090] px-6 py-4">
        <h2 className="text-lg font-medium text-[#F6F4EF]">
          Ventas de la Semana
        </h2>
      </div>

      <div className="bg-white p-6">
        <div className="flex items-end justify-between gap-4 h-64">
          {data.map(d => (
            <div
              key={d.day}
              className="flex flex-col items-center gap-3 flex-1"
            >
              {/* Barra */}
              <div
                className="
                  w-10
                  rounded-xl
                  bg-[#B76E79]
                  hover:bg-[#a45f69]
                  transition-all duration-300
                  shadow-md shadow-[#8C9796]/40
                "
                style={{ height: `${d.value}%` }}
              />

              {/* Día */}
              <span className="text-xs font-medium text-[#708090] tracking-wide">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
