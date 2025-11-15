import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchEvent } from '../services/api'
import XaiBarChart from '../components/XaiBarChart'

export default function EventDetail(){
  const { id } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(()=>{
    fetchEvent(id).then(res => setEvent(res)).catch(()=>{})
  }, [id])

  if(!event) return <div>Loading...</div>

  const shap = event.xai?.shap_values || []
  const labels = event.xai?.top_features || shap.map((_,i)=>`f${i}`)

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">{event.timestamp}</div>
        <div className="text-lg font-semibold">{event.path}</div>
        <div className="mt-2">Entropy: {event.entropy} — Gretel: {event.gretel}</div>
        <div>ML Score: {event.ml_score} — Combined: {event.combined}</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">XAI (SHAP)</h3>
        <XaiBarChart labels={labels} values={shap} />
      </div>
    </div>
  )
}
