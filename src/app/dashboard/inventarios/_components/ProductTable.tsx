import { Producto } from "../type";
import ProductRow from "./ProductRow";

interface Props {
  productos: Producto[];
  search: string;
}

export default function ProductTable({ productos, search }: Props) {
  const productosFiltrados = productos.filter(p => {
    const term = search.toLowerCase();

    return (
      p.nombre.toLowerCase().includes(term) ||
      p.id.toString().includes(term) ||
      p.categoria.nombre.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-xl border overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Código</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Ubicación</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {productosFiltrados.map(p => (
            <ProductRow key={p.id} producto={p} />
          ))}

          {productosFiltrados.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
