import React, { useEffect } from 'react'
import useStore from '../store/useStore'
import RealtimeToast from '../components/RealtimeToast'

export default function Alerts(){
  const alerts = useStore(state => state.alerts)
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Real-time Alerts</h2>
      <div className="grid gap-3">
        {alerts.map((a,i) => (
          <div key={i} className="bg-white p-3 rounded shadow">
            <div className="text-sm text-slate-500">{a.timestamp}</div>
            <div className="font-semibold">{a.path}</div>
            <div className="text-sm">Score: {a.combined} — {a.verdict}</div>
          </div>
        ))}
      </div>
      <RealtimeToast alerts={alerts} />
    </div>
  )
}
