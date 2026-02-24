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
    <div className="bg-white rounded-2xl shadow-md shadow-[#8C9796]/20 overflow-hidden border border-[#8C9796]/20">

      {/* HEADER */}
      <div className="bg-[#F6F4EF] px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-[#708090] tracking-wide">
          Productos en la Venta
        </h2>
      </div>

      {/* LISTA */}
      <div className="p-6 space-y-3 max-h-[340px] overflow-y-auto">

        {productos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#8C9796] text-sm">
              Aún no hay productos agregados
            </p>
          </div>
        ) : (
          productos.map(p => (
            <div
              key={p.id}
              className="
                flex items-center justify-between
                bg-[#F6F4EF]
                border border-[#8C9796]/20
                rounded-xl
                px-4 py-3
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              {/* INFO PRODUCTO */}
              <div className="flex flex-col">
                <p className="font-semibold text-[#708090]">
                  {p.nombre}
                </p>

                <p className="text-xs text-[#8C9796]">
                  ${p.precio.toLocaleString()} × {p.cantidad}
                </p>
              </div>

              {/* DERECHA */}
              <div className="flex items-center gap-4">

                {/* SUBTOTAL */}
                <p className="font-semibold text-[#B76E79] text-lg">
                  ${(p.precio * p.cantidad).toLocaleString()}
                </p>

                {/* ELIMINAR */}
                <button
                  onClick={() => onEliminar(p.id)}
                  className="
                    w-8 h-8
                    rounded-full
                    bg-[#B76E79]/15
                    text-[#B76E79]
                    flex items-center justify-center
                    hover:bg-[#B76E79]
                    hover:text-white
                    transition
                  "
                  title="Eliminar producto"
                >
                  ✕
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTONES */}
      <div className="flex gap-4 p-6 border-t bg-[#F6F4EF]">

        {/* ESCANEAR */}
        <button
          className="
            flex-1
            bg-[#708090]
            text-white
            px-5 py-3
            rounded-xl
            font-medium
            shadow-sm
            hover:bg-[#5F6F7F]
            transition
          "
        >
          Escanear {/*TODO Falta escanear*/}
        </button>

        {/* AGREGAR */}
        <button
          onClick={onAgregar}
          className="
            flex-1
            bg-[#B76E79]
            text-white
            px-5 py-3
            rounded-xl
            font-medium
            shadow-sm
            hover:bg-[#A45F69]
            transition
          "
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}