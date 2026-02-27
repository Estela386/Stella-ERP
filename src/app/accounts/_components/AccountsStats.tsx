export default function AccountsStats() {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white rounded-2xl p-6 shadow">
        <p className="text-gray-500">Total pendiente</p>
        <h3 className="text-2xl font-bold">$ 12,500</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <p className="text-gray-500">Pagado</p>
        <h3 className="text-2xl font-bold">$ 8,200</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <p className="text-gray-500">Cuentas activas</p>
        <h3 className="text-2xl font-bold">23</h3>
      </div>

    </div>
  );
}