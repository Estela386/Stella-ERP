export default function StockBadge({
  actual,
  minimo,
}: {
  actual: number;
  minimo: number;
}) {
  if (actual === 0) return <Badge text="Agotado" color="red" />;
  if (actual <= minimo) return <Badge text="Stock Bajo" color="orange" />;
  return <Badge text="En Stock" color="green" />;
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: "red" | "orange" | "green";
}) {
  const styles = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[color]}`}>
      {text}
    </span>
  );
}
