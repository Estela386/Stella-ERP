export default function StockBadge({
  actual,
  minimo,
}: {
  actual: number;
  minimo: number;
}) {
  if (actual === 0) return <Badge text="Agotado" color="agotado" />;
  if (actual <= minimo) return <Badge text="Stock Bajo" color="bajo" />;
  return <Badge text="En Stock" color="stock" />;
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: "agotado" | "bajo" | "stock";
}) {
  const styles = {
    agotado: "bg-[#B76E79] text-white",
    bajo: "bg-[#d1bbaa] text-[#FFFFFF]",
    stock: "bg-[#708090] text-white",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-3 py-1
        rounded-full
        text-xs font-semibold
        whitespace-nowrap
        ${styles[color]}
      `}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {text}
    </span>
  );
}