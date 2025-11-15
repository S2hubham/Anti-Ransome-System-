import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function XaiBarChart({labels = [], values = []}){
  const data = labels.map((l,i) => ({ name: l, value: values[i] ?? 0 }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={140} />
        <Tooltip />
        <Bar dataKey="value" label={{ position: 'right' }}>
          {data.map((entry, index) => {
            const val = entry.value
            // green for positive influence, red for negative, gray for near-zero
            const fill = val > 0.0001 ? '#16a34a' : (val < -0.0001 ? '#dc2626' : '#6b7280')
            return <Cell key={`cell-${index}`} fill={fill} />
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
