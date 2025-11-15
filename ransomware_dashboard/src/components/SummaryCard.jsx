import React from 'react'

export default function SummaryCard({title, value, delta}) {
  return (
    <div className="bg-white rounded p-4 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {delta !== undefined && <div className="text-xs text-slate-400">Δ {delta}</div>}
    </div>
  )
}
