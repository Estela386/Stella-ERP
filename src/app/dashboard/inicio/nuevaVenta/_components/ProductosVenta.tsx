import { Producto } from "../page";

type Props = {
  productos: Producto[];
  onAgregar: () => void;
  onEliminar: (id: number) => void;
};

export default function ProductosVenta({
  productos,
  onAgregar,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md shadow-[#8C9796]/20 overflow-hidden">
      <div className="bg-[#F6F4EF] px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#708090]">
          Productos en la Venta
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {productos.length === 0 ? (
          <p className="text-[#8C9796] text-sm">
            Aún no hay productos agregados
          </p>
        ) : (
          productos.map(p => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{p.nombre}</p>
                <p className="text-sm text-gray-500">
                  ${p.precio} x {p.cantidad}
                </p>
              </div>

              <button
                onClick={() => onEliminar(p.id)}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4 p-6 border-t bg-[#F6F4EF]">
        <button
          className="bg-[#708090] text-white px-5 py-3 rounded-xl font-medium"
        >
          Escanear
        </button>

        <button
          onClick={onAgregar}
          className="bg-[#B76E79] text-white px-5 py-3 rounded-xl font-medium"
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}
