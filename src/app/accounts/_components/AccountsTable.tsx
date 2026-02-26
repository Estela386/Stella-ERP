export default function AccountsTable() {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <table className="w-full text-left">

        <thead className="bg-[#F6F3EF]">
          <tr>
            <th className="p-4">Cliente</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Pagado</th>
            <th>Pendiente</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t">
            <td className="p-4">María López</td>
            <td>Venta de productos</td>
            <td>$ 3,000</td>
            <td>$ 1,000</td>
            <td>$ 2,000</td>
            <td className="text-red-500 font-medium">Pendiente</td>
          </tr>
        </tbody>

      </table>

    </div>
  );
}