import { Material } from "../type";

type Props = {
  material: Material;
  onClick: () => void;
};

export default function MaterialCard({ material, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-white
        rounded-2xl
        p-5
        border border-[#F6E3C5]   /* borde color arena */
        shadow-[0_10px_25px_rgba(0,0,0,0.2)]  /* sombra más marcada */
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)]  /* hover más profundo */
        transition-shadow
        duration-300
      "
    >
      {/* Nombre */}
      <h3 className="font-semibold text-lg text-[#708090]">
        {material.nombre}
      </h3>

      {/* Tipo */}
      <p className="text-sm text-[#708090] mt-1">{material.tipo}</p>

      {/* Stock y precio */}
      <div className="mt-4 flex justify-between text-sm font-medium">
        <span className="text-[#708090]">Stock: {material.cantidad}</span>
        <span className="text-[#B76E79]">${material.precio}</span> {/* Acento suave */}
      </div>
    </div>
  );
}