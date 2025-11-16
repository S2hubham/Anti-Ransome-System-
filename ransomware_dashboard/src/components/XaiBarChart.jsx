// src/components/XaiBarChart.jsx
import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

/**
 * XaiBarChart
 * - vertical bar chart for SHAP / feature contributions
 * - labels: [string], values: [number]
 */
export default function XaiBarChart({ labels = [], values = [] }) {
  const data = labels.map((l, i) => ({ name: l, value: values[i] ?? 0 }))

  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 6, right: 10, left: 20, bottom: 8 }}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={160} />
          <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(4) : v)} />
          <Bar dataKey="value" isAnimationActive={false} label={{ position: "right", formatter: (v) => (typeof v === "number" ? v.toFixed(4) : v) }}>
            {data.map((entry, idx) => {
              const val = entry.value
              const fill = val > 0.0001 ? "#16a34a" : val < -0.0001 ? "#dc2626" : "#6b7280"
              return <Cell key={`cell-${idx}`} fill={fill} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
