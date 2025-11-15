import React, { useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import useStore from '../store/useStore'
import { fetchStats } from '../services/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useWs from '../services/wsClient'

export default function Dashboard(){
  const setStats = useStore(state => state.setStats)
  const stats = useStore(state => state.stats)
  const addAlert = useStore(state => state.addAlert)

  useEffect(()=>{
    fetchStats().then(res => {
      setStats(res)
    }).catch(()=>{})
  }, [])

  useEffect(()=>{
    // connect ws for live alerts (use native ws)
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/alerts`)
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        addAlert(data)
      } catch(e){}
    }
    return ()=> ws.close()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Total Events" value={stats.total_events ?? '—'} />
        <SummaryCard title="Suspicious" value={stats.suspicious_events ?? '—'} />
        <SummaryCard title="Avg Entropy" value={stats.avg_entropy ?? '—'} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">Entropy trend</h3>
        <div style={{height: 280}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={(stats.entropy_trend || []).map((v,i)=>({x:i,y:v}))}>
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
