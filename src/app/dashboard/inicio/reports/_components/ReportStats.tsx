interface ReportData {
  ingresos: number;
  margen: number; // porcentaje
  productosVendidos: number;
  tasaRetorno: number; // porcentaje
}

export default function ReportStats({
  data,
}: {
  data: ReportData;
}) {
  const ingresosFormateados = data.ingresos.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat
        label="Ingresos Totales"
        value={ingresosFormateados}
        bgColor="bg-[#708090]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Margen de Ganancia"
        value={`${data.margen}%`}
        bgColor="bg-[#B76E79]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Productos Vendidos"
        value={data.productosVendidos}
        bgColor="bg-[#708090]"
        textColor="text-[#F8F6F2]"
      />

      <Stat
        label="Tasa de Retorno"
        value={`${data.tasaRetorno}%`}
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
      style={{
        boxShadow: "0 10px 25px rgba(140,151,150,0.4)",
      }}
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
