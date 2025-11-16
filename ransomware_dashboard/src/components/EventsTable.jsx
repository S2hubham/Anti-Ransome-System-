// src/components/EventsTable.jsx
import React from "react"
import { Link } from "react-router-dom"

/**
 * EventsTable
 * - accepts events: Array of event objects
 * - shows an accessible table with compact layout
 */
export default function EventsTable({ events = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="muted">Loading events…</div>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="card">
        <div className="muted">No events found.</div>
      </div>
    )
  }

  return (
    <div className="card" role="region" aria-label="Events table">
      <div style={{ overflowX: "auto" }}>
        <table className="table" role="table" aria-label="Events">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Path</th>
              <th>Entropy</th>
              <th>Gretel</th>
              <th>Score</th>
              <th>Verdict</th>
            </tr>
          </thead>

          <tbody>
            {events.map((ev) => (
              <tr key={ev.id || `${ev.timestamp}-${ev.path}`}>
                <td className="mono text-xs">{ev.timestamp}</td>
                <td>
                  <Link to={`/events/${ev.id}`} className="muted" style={{ fontWeight: 700 }}>
                    {ev.path}
                  </Link>
                </td>
                <td>{typeof ev.entropy === "number" ? ev.entropy.toFixed(3) : ev.entropy}</td>
                <td>{ev.gretel ?? "—"}</td>
                <td>{ev.combined ?? "—"}</td>
                <td>
                  <span
                    className={`badge ${
                      ev.verdict === "suspicious" ? "badge-danger" : ev.verdict === "benign" ? "badge-success" : "badge-warning"
                    }`}
                    aria-label={`Verdict: ${ev.verdict}`}
                  >
                    {ev.verdict ?? "unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
