// src/pages/Dashboard.jsx
import React, { useEffect } from "react"
import SummaryCard from "../components/SummaryCard"
import useStore from "../store/useStore"
import { fetchStats } from "../services/api"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const setStats = useStore((state) => state.setStats)
  const stats = useStore((state) => state.stats)

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {})
  }, [])

  const entropyData = (stats.entropy_trend || []).map((v, i) => ({ x: i, y: v }))

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard title="Total Events" value={stats.total_events ?? "—"} />
        <SummaryCard title="Suspicious" value={stats.suspicious_events ?? "—"} />
        <SummaryCard title="Avg Entropy" value={stats.avg_entropy ?? "—"} />
      </div>

      <div className="card">
        <h3 className="card-title mb-2">Entropy Trend</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={entropyData}>
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#4e9eff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
