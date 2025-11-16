// src/pages/Bundles.jsx
import React, { useEffect, useState } from "react"
import { fetchBundles, downloadBundle } from "../services/api"

export default function Bundles() {
  const [bundles, setBundles] = useState([])

  useEffect(() => {
    fetchBundles().then((res) => setBundles(res.bundles || []))
  }, [])

  async function handleDownload(id) {
    const res = await downloadBundle(id)
    window.open(res.download_url, "_blank")
  }

  return (
    <div className="space-y-4">
      <h2 className="card-title">Forensic Bundles</h2>

      <div className="space-y-3">
        {bundles.length === 0 && (
          <div className="card muted">No bundles available.</div>
        )}

        {bundles.map((b) => (
          <div key={b.id} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">Bundle #{b.id}</div>
              <div className="text-xs muted mt-1">
                {b.timestamp} — Event {b.event_id}
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => handleDownload(b.id)}>
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
