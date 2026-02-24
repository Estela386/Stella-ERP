import { FC } from "react";
import { Producto, Categoria } from "../type";

type Props = {
  categoria: Categoria & { productos: Producto[] };
  onClose: () => void;
};

const CategoryModal: FC<Props> = ({ categoria, onClose }) => {
  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          p-6
          w-11/12 md:w-2/3 lg:w-1/2
          shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#708090]">
            {categoria.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-[#708090] font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {categoria.productos.length === 0 && (
            <p className="text-[#708090]">No hay productos en esta categoría.</p>
          )}

          {categoria.productos.map((p) => (
            <div
              key={p.id}
              className="
                bg-white
                border border-[#F6E3C5]
                rounded-2xl
                p-4
                shadow-[0_10px_25px_rgba(0,0,0,0.2)]
                flex justify-between items-center
              "
            >
              <div>
                <h3 className="text-lg font-semibold text-[#708090]">{p.nombre}</h3>
                <p className="text-sm text-[#708090] mt-1">Stock: {p.stock_actual}</p>
              </div>
              <span className="text-[#B76E79] font-medium">${p.precio}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;