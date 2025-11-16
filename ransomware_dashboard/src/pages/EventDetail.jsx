// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchEvent } from "../services/api"
import XaiBarChart from "../components/XaiBarChart"

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    fetchEvent(id).then(setEvent).catch(() => {})
  }, [id])

  if (!event) return <div className="muted">Loading…</div>

  const shap = event.xai?.shap_values || []
  const labels = event.xai?.top_features || shap.map((_, i) => `Feature ${i}`)

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="card">
        <div className="text-xs muted">{event.timestamp}</div>
        <div className="font-semibold mt-1">{event.path}</div>

        <div className="mt-2 text-sm">
          Entropy: <b>{event.entropy}</b> — Gretel: <b>{event.gretel}</b>
        </div>

        <div className="text-sm mt-1">
          ML Score: <b>{event.ml_score}</b> — Combined: <b>{event.combined}</b>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-2">Explainability (SHAP)</h3>
        <XaiBarChart labels={labels} values={shap} />
      </div>
    </div>
  )
}
