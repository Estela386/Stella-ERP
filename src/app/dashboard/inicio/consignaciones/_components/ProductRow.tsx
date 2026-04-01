import { Consignacion, Usuario } from "../type";

export default function ProductRow({
  consignacion,
  usuario,
}: {
  consignacion: Consignacion;
  usuario: Usuario;
}) {
  return (
    <tr className="border-t border-[#e3e0da] hover:bg-[#f8f7f4]">
      {/* Producto */}
      <td className="p-3 text-center font-medium text-[#2f2f2f]" style={{ fontFamily: "var(--font-marcellus)", fontSize: "1rem", fontWeight: 400 }}>
        {consignacion.producto.nombre}
      </td>

      {/* Cliente */}
      {usuario.rol === "admin" && (
        <td className="p-3 text-center text-[#2f2f2f]" style={{ fontFamily: "var(--font-sans)" }}>
          {consignacion.cliente.nombre}
        </td>
      )}

      {/* Cantidad */}
      <td className="p-3 text-center text-[#2f2f2f]" style={{ fontFamily: "var(--font-sans)" }}>
        {consignacion.cantidad}
      </td>

      {/* Periodo */}
      <td className="p-3 text-center text-sm text-[#4a5d6b]" style={{ fontFamily: "var(--font-sans)" }}>
        {consignacion.fecha_inicio} → {consignacion.fecha_fin ?? "-"}
      </td>

      {/* Precio */}
      <td className="p-3">
        <div className="flex justify-center">
          {usuario.rol === "mayorista" ? (
            <input
              className="
                w-24
                px-2
                py-1
                text-center
                rounded-md
                border
                border-[#c7c3bb]
                bg-white
                text-[#2f2f2f]
                focus:outline-none
                focus:ring-2
                focus:ring-[#708090]
              "
              style={{ fontFamily: "var(--font-sans)" }}
              type="number"
              defaultValue={consignacion.precio_consignado}
            />
          ) : (
            <span className="font-medium text-[#2f2f2f]" style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.1rem", fontWeight: 400 }}>
              ${consignacion.precio_consignado}
            </span>
          )}
        </div>
      </td>

      {/* Estado */}
      <td className="p-3">
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              consignacion.estado === "ACTIVA"
                ? "bg-[#708090] text-[#f6f4ef]"
                : "bg-[#b76e79] text-[#f6f4ef]"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {consignacion.estado}
          </span>
        </div>
      </td>
    </tr>
  );
}
