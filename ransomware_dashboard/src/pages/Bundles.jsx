import React, { useEffect, useState } from 'react'
import { fetchBundles, downloadBundle } from '../services/api'

export default function Bundles(){
  const [bundles, setBundles] = useState([])

  useEffect(()=>{
    fetchBundles().then(res => setBundles(res.bundles || []))
  }, [])

  async function handleDownload(id){
    const res = await downloadBundle(id)
    // res.download_url - just navigate
    window.open(res.download_url, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Forensic Bundles</h2>
      <div className="space-y-3">
        {bundles.map(b => (
          <div key={b.id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">Bundle #{b.id}</div>
              <div className="text-sm text-slate-500">{b.timestamp} — Event {b.event_id}</div>
            </div>
            <button onClick={()=>handleDownload(b.id)} className="bg-indigo-600 text-white px-3 py-1 rounded">Download</button>
          </div>
        ))}
      </div>
    </div>
  )
}
