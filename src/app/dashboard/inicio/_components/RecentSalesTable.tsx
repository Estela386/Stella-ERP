interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  items: number;
  total: string;
  pago: string;
  vendedor: string;
}

const ventas: Venta[] = [
  {
    id: "VTA-1234",
    fecha: "2025-11-17",
    cliente: "María García",
    items: 2,
    total: "$5,200",
    pago: "Tarjeta",
    vendedor: "Ana Martínez",
  },
];

export default function RecentSalesTable() {
  return (
    <div
      className="
        rounded-2xl
        border border-black/10
        shadow-md shadow-[#8C9796]/30
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="bg-[#708090] px-6 py-4">
        <h2 style={{ fontFamily: "var(--font-marcellus)" }} className="text-xl font-medium text-[#F6F4EF]">
          Ventas Recientes
        </h2>
      </div>

      <table className="min-w-full text-sm bg-white">
        {/* Head */}
        <thead className="bg-[#F6F4EF] border-b border-black/5">
          <tr>
            {[
              "ID Venta",
              "Fecha",
              "Cliente",
              "Items",
              "Total",
              "Pago",
              "Vendedor",
              "Acciones",
            ].map(h => (
              <th
                key={h}
                className="
                  px-6 py-3
                  text-left
                  text-[#708090]
                  font-semibold
                "
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {ventas.map(v => (
            <tr
              key={v.id}
              className="
                border-t border-black/5
                hover:bg-[#F6F4EF]
                transition
              "
            >
              <td className="px-6 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.id}
              </td>

              <td className="px-6 py-4 text-[#1C1C1C]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.fecha}
              </td>

              <td className="px-6 py-4 text-[#1C1C1C]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.cliente}
              </td>

              <td className="px-6 py-4 text-[#1C1C1C]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.items}
              </td>

              <td className="px-6 py-4 font-normal text-[#B76E79]" style={{ fontFamily: "var(--font-marcellus)", fontSize: "1rem" }}>
                {v.total}
              </td>

              <td className="px-6 py-4 text-[#1C1C1C]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.pago}
              </td>

              <td className="px-6 py-4 text-[#1C1C1C]" style={{ fontFamily: "var(--font-sans)" }}>
                {v.vendedor}
              </td>

              <td className="px-6 py-4">
                <span
                  style={{ fontFamily: "var(--font-sans)" }}
                  className="
                    text-[#B76E79]
                    font-medium
                    cursor-pointer
                    hover:underline
                  "
                >
                  Ver
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
