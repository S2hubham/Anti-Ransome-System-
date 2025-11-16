// src/pages/Settings.jsx
import React, { useEffect, useState } from "react"
import { fetchConfig, updateConfig } from "../services/api"

export default function Settings() {
  const [cfg, setCfg] = useState({
    monitored_paths: [],
    alert_threshold: 0.6,
    auto_response: false
  })

  useEffect(() => {
    fetchConfig().then(setCfg)
  }, [])

  function save() {
    updateConfig(cfg).then(() => alert("Saved"))
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="card-title">Settings</h2>

      <div className="card space-y-4">
        <div>
          <label className="text-xs muted block mb-1">Alert Threshold</label>
          <input
            type="number"
            step="0.01"
            className="border p-2 rounded bg-transparent w-32"
            value={cfg.alert_threshold}
            onChange={(e) =>
              setCfg({ ...cfg, alert_threshold: parseFloat(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-xs muted block mb-1">Auto Response</label>
          <input
            type="checkbox"
            checked={cfg.auto_response}
            onChange={(e) =>
              setCfg({ ...cfg, auto_response: e.target.checked })
            }
          />
        </div>

        <div>
          <label className="text-xs muted block mb-1">Monitored Paths</label>
          <input
            type="text"
            className="border p-2 rounded bg-transparent w-full"
            value={cfg.monitored_paths.join(",")}
            onChange={(e) =>
              setCfg({
                ...cfg,
                monitored_paths: e.target.value.split(",").map((s) => s.trim())
              })
            }
          />
        </div>

        <button className="btn btn-primary" onClick={save}>
          Save
        </button>
      </div>
    </div>
  )
}
