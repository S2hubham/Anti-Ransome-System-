// src/components/SummaryCard.jsx
import React from "react"

/**
 * SummaryCard
 * props:
 *  - title, value, delta (string or number), icon (node)
 */
export default function SummaryCard({ title, value, delta, icon }) {
  return (
    <div className="card card-sm" role="group" aria-label={title}>
      <div className="card-header">
        <div className="flex items-center">
          {icon && <div style={{ width: 40, height: 40, borderRadius: 8, display: "grid", placeItems: "center" }}>{icon}</div>}

          <div>
            <div className="card-title">{title}</div>
            <div className="muted text-xs">Overview</div>
          </div>
        </div>

        <div className="text-xs muted">{delta !== undefined ? `Δ ${delta}` : null}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="summary-value">{value ?? "—"}</div>
      </div>
    </div>
  )
}
