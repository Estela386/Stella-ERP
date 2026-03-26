"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const SEMANA_DATA = [
  { dia: "Lun",  ventas: 8200  },
  { dia: "Mar",  ventas: 11300 },
  { dia: "Mié",  ventas: 6150  },
  { dia: "Jue",  ventas: 13340 },
  { dia: "Vie",  ventas: 16820 },
  { dia: "Sáb",  ventas: 20500 },
  { dia: "Dom",  ventas: 9230  },
];

const MES_DATA = [
  { dia: "S1",  ventas: 52000  },
  { dia: "S2",  ventas: 68000  },
  { dia: "S3",  ventas: 59000  },
  { dia: "S4",  ventas: 74000  },
];

const HOY_DATA = [
  { dia: "09h", ventas: 1200  },
  { dia: "10h", ventas: 3500  },
  { dia: "11h", ventas: 2800  },
  { dia: "12h", ventas: 5100  },
  { dia: "13h", ventas: 1900  },
  { dia: "14h", ventas: 4200  },
  { dia: "15h", ventas: 6800  },
  { dia: "16h", ventas: 3400  },
];

function fmt(v: number) {
  return `$${(v / 1000).toFixed(0)}k`;
}

interface Props { periodo: string }

export default function SalesLineChart({ periodo }: Props) {
  const data = periodo === "hoy" ? HOY_DATA : periodo === "mes" ? MES_DATA : SEMANA_DATA;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.11)",
      borderTop: "3px solid #3d8c60",
      borderRadius: 14,
      padding: "16px 18px",
      boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
      boxSizing: "border-box",
    }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{
          fontFamily: "var(--font-display, Manrope, sans-serif)",
          fontSize: "0.9rem", fontWeight: 700, color: "#1C1C1C", margin: 0,
        }}>
          Ventas por {periodo === "hoy" ? "hora" : periodo === "mes" ? "semana" : "día"}
        </h3>
        <p style={{
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
        }}>
          Línea de tendencia de ingresos
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#F0EDE8" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 11, fill: "#8C9796", fontFamily: "Inter, sans-serif" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: "#8C9796", fontFamily: "Inter, sans-serif" }}
            axisLine={false} tickLine={false} width={42}
          />
          <Tooltip
            formatter={(v: number) => [`$${v.toLocaleString("es-MX")}`, "Ventas"]}
            contentStyle={{
              background: "#fff", borderRadius: 10,
              border: "1px solid #F0EDE8",
              boxShadow: "0 4px 14px rgba(112,128,144,0.18)",
              fontFamily: "Inter, sans-serif", fontSize: 12,
            }}
            labelStyle={{ color: "#708090", fontWeight: 600 }}
          />
          <Line
            type="monotone" dataKey="ventas"
            stroke="#3d8c60" strokeWidth={2.5}
            dot={{ r: 4, fill: "#3d8c60", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#3d8c60", strokeWidth: 2, stroke: "#EDF5F0" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
