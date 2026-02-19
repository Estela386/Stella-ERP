export default function VentaInfoForm() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="text-sm text-[#708090] font-medium">Cliente</label>
          <select className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none">
            <option>Seleccionar cliente</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-[#708090] font-medium">Fecha</label>
          <input
            type="date"
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-[#708090] font-medium">Vendedor</label>
          <select className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none">
            <option>Usuario actual</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-[#708090] font-medium">Estado</label>
          <select className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none">
            <option>Completada</option>
            <option>Pendiente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
