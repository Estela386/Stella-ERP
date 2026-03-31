"use client";

interface KPI {
  label: string;
  value: string | number;
  bgStart: string;
  bgEnd: string;
}

interface ReportKPIsProps {
  valorInventario: number;
  totalPiezas: number;
  stockBajo: number;
  agotados: number;
}

export default function ReportKPIs({
  valorInventario,
  totalPiezas,
  stockBajo,
  agotados,
}: ReportKPIsProps) {
  const kpis: KPI[] = [
    {
      label: "Valor del Inventario",
      value: `$${valorInventario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      bgStart: "#758390", bgEnd: "#6b7a88" // Slate Gray variant
    },
    {
      label: "Total de Piezas",
      value: totalPiezas,
      bgStart: "#C07E88", bgEnd: "#B76E79" // Muted Rose variant
    },
    {
      label: "Stock Bajo",
      value: stockBajo,
      bgStart: "#758390", bgEnd: "#6b7a88" // Slate Gray
    },
    {
      label: "Agotados",
      value: agotados,
      bgStart: "#C07E88", bgEnd: "#B76E79" // Muted Rose
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      width: "100%",
      boxSizing: "border-box",
    }} className="kpi-grid-flat">
      <style>{`
        @media (max-width: 1100px) { .kpi-grid-flat { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .kpi-grid-flat { grid-template-columns: 1fr !important; } }
      `}</style>
      
      {kpis.map(k => (
        <div
          key={k.label}
          style={{
            // Creating a very subtle linear gradient mimicking the flat-but-rich look in the reference
            background: `linear-gradient(to right, ${k.bgStart}, ${k.bgEnd})`,
            borderRadius: 12,
            padding: "20px 24px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#fff",
            minHeight: 110,
          }}
        >
          <p style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.8rem", fontWeight: 600,
            opacity: 0.9, margin: "0 0 6px 0",
          }}>
            {k.label}
          </p>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "2rem", fontWeight: 700,
            margin: 0, lineHeight: 1,
            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}>
            {k.value}
          </p>
        </div>
      ))}
    </div>
  );
}
