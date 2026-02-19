"use client"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
} from "recharts"

interface Props {
  data?: any[]
}

export default function SalesChart({ data }: Props) {

  const defaultData = [
    { mes: "Jun", ingresos: 80000, costos: 40000 },
    { mes: "Jul", ingresos: 90000, costos: 45000 },
    { mes: "Ago", ingresos: 87000, costos: 42000 },
    { mes: "Sep", ingresos: 102000, costos: 48000 },
    { mes: "Oct", ingresos: 95000, costos: 46000 },
    { mes: "Nov", ingresos: 110000, costos: 52000 },
  ]

  const chartData = data || defaultData

  return (
    <div
      className="p-6 rounded-2xl mt-6 bg-white"
      style={{
        boxShadow: "0 15px 35px rgba(140,151,150,0.25)",
      }}
    >
      <h3 className="text-lg mb-6 text-[#708090] font-semibold">
        Análisis de Ingresos y Costos
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          
          <CartesianGrid stroke="#EAEAEA" strokeDasharray="3 3" />

          <XAxis
            dataKey="mes"
            stroke="#708090"
            tick={{ fill: "#333333" }}
          />

          <YAxis
            stroke="#708090"
            tick={{ fill: "#333333" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #EAEAEA",
              boxShadow: "0 10px 25px rgba(140,151,150,0.25)",
              color: "#333333",
            }}
            labelStyle={{ color: "#708090", fontWeight: 600 }}
          />

          {/* Ingresos - Color principal */}
          <Bar
            dataKey="ingresos"
            fill="#708090"
            radius={[6, 6, 0, 0]}
          />

          {/* Costos - Acento rosé */}
          <Bar
            dataKey="costos"
            fill="#B76E79"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
