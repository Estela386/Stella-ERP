type Props = {
  data: {
    id: number;
    producto: string;
    cantidad: number;
    precio: number;
  };
  onChange: (
    id: number,
    campo: "producto" | "cantidad" | "precio",
    valor: string | number
  ) => void;
  onDelete: (id: number) => void;
  disableDelete?: boolean;
};

export default function ProductoRow({
  data,
  onChange,
  onDelete,
  disableDelete,
}: Props) {
  const inputBase = `
    w-full
    rounded-lg
    px-3 py-2
    bg-white
    border border-[#8c8c76]
    shadow-inner
    focus:outline-none
    focus:ring-2
    focus:ring-[#708090]/40
  `;

  return (
    <div className="bg-[#f6f4ef] rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-[#e5e5e0] shadow-sm">
      <div>
        <label className="block text-xs font-medium text-[#708090] mb-1">
          Producto
        </label>
        <input
          className={inputBase}
          value={data.producto}
          onChange={e => onChange(data.id, "producto", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#708090] mb-1">
          Cantidad
        </label>
        <input
          type="number"
          className={inputBase}
          value={data.cantidad}
          onChange={e => onChange(data.id, "cantidad", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#708090] mb-1">
          Precio consignado
        </label>
        <input
          type="number"
          className={inputBase}
          value={data.precio}
          onChange={e => onChange(data.id, "precio", Number(e.target.value))}
        />
      </div>

      <button
        type="button"
        disabled={disableDelete}
        onClick={() => onDelete(data.id)}
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
      >
        X
      </button>
      
    </div>
  );
}

//TODO Listado de mayoristas
//TODO Listado de productos
//TODO Qué falta en el formulario de productos en consignación?
