// src/pages/Alerts.jsx
import React from "react"
import useStore from "../store/useStore"
import RealtimeToast from "../components/RealtimeToast"

export default function Alerts() {
  const alerts = useStore((state) => state.alerts)

  return (
    <div className="space-y-4">
      <h2 className="card-title">Real-time Alerts</h2>

      <div className="grid gap-3">
        {alerts.length === 0 && (
          <div className="card muted">No alerts yet.</div>
        )}

        {alerts.map((a, i) => (
          <div key={i} className="card">
            <div className="text-xs muted">{a.timestamp}</div>
            <div className="font-semibold mt-1">{a.path}</div>
            <div className="text-sm mt-1">
              Score: {a.combined} —
              <span className="font-bold"> {a.verdict}</span>
            </div>
          </div>
        ))}
      </div>

      <RealtimeToast alerts={alerts} />
    </div>
  )
}
