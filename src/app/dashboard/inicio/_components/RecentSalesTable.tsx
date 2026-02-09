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
    <div className="bg-white rounded-xl border border-[#8C9796]/25">
      <h2 className="text-lg font-medium p-5">
        Ventas Recientes
      </h2>

      <table className="min-w-full text-sm">
        <thead className="bg-[#F5F3EF]">
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
                className="px-4 py-3 text-left text-[#708090]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ventas.map(v => (
            <tr key={v.id} className="border-t">
              <td className="px-4 py-3">{v.id}</td>
              <td className="px-4 py-3">{v.fecha}</td>
              <td className="px-4 py-3">{v.cliente}</td>
              <td className="px-4 py-3">{v.items}</td>
              <td className="px-4 py-3 font-medium">{v.total}</td>
              <td className="px-4 py-3">{v.pago}</td>
              <td className="px-4 py-3">{v.vendedor}</td>
              <td className="px-4 py-3 text-[#E28A2D] cursor-pointer">
                Ver
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
