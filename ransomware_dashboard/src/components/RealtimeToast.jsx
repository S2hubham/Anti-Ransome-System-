import React from 'react'

export default function RealtimeToast({alerts}){
  return (
    <div className="fixed right-4 bottom-4 space-y-2 z-50">
      {alerts.slice(0,5).map((a,i) => (
        <div key={i} className="bg-white p-3 shadow rounded w-80">
          <div className="text-xs text-slate-500">{a.timestamp}</div>
          <div className="font-semibold">{a.path}</div>
          <div className="text-sm text-red-600">{a.verdict}</div>
        </div>
      ))}
    </div>
  )
}
