import React, { useEffect, useState } from 'react'
import { fetchConfig, updateConfig } from '../services/api'

export default function Settings(){
  const [cfg, setCfg] = useState({monitored_paths: [], alert_threshold: 0.6, auto_response: false})

  useEffect(()=>{
    fetchConfig().then(res => setCfg(res))
  }, [])

  function onSave(){
    updateConfig(cfg).then(()=> alert('Saved'))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <label className="block text-sm text-slate-600">Alert threshold</label>
        <input type="number" step="0.01" value={cfg.alert_threshold} onChange={(e)=>setCfg({...cfg, alert_threshold: parseFloat(e.target.value)})} className="border p-2 rounded w-40" />

        <label className="block text-sm text-slate-600">Auto response</label>
        <input type="checkbox" checked={cfg.auto_response} onChange={(e)=>setCfg({...cfg, auto_response: e.target.checked})} />

        <label className="block text-sm text-slate-600">Monitored paths (comma separated)</label>
        <input type="text" value={cfg.monitored_paths?.join(',') || ''} onChange={(e)=>setCfg({...cfg, monitored_paths: e.target.value.split(',')})} className="border p-2 rounded w-full" />

        <button onClick={onSave} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  )
}
