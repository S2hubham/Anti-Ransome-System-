// src/App.jsx
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Alerts from "./pages/Alerts"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import Bundles from "./pages/Bundles"
import Settings from "./pages/Settings"

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <header
          className="flex items-center justify-between"
          style={{ marginBottom: 18 }}
        >
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Operational Dashboard</h2>
            <div className="muted text-xs">
              Live telemetry · forensic bundles · alerts
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost">Create Bundle</button>
            <button className="btn btn-primary">Run Scan</button>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
