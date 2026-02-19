export default function EstadoBadge({ estado }: { estado: string }) {
  const colores: any = {
    "En Producción": "bg-blue-100 text-blue-700",
    "En Taller": "bg-indigo-100 text-indigo-700",
    Diseño: "bg-yellow-100 text-yellow-700",
    Listo: "bg-green-100 text-green-700",
    Pendiente: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colores[estado]}`}>
      {estado}
    </span>
  );
}
