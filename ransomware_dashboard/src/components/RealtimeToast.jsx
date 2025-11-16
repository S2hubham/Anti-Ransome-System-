// src/components/RealtimeToast.jsx
import React from "react"

/**
 * Lightweight toast list for incoming alerts.
 * - alerts: [{ timestamp, path, verdict, combined }]
 */
export default function RealtimeToast({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="fixed" style={{ right: 16, bottom: 16, zIndex: 60 }}>
      <div style={{ display: "grid", gap: 8 }}>
        {alerts.slice(0, 5).map((a, i) => (
          <div key={i} className="card" style={{ width: 320 }}>
            <div className="text-xs muted">{a.timestamp}</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{a.path}</div>
            <div className="text-sm" style={{ marginTop: 6 }}>
              <span className="mono">{a.combined ?? "—"}</span> —{" "}
              <span className={a.verdict === "suspicious" ? "badge-danger" : a.verdict === "benign" ? "badge-success" : "badge-warning"}>
                {a.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
