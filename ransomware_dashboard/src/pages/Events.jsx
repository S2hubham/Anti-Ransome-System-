import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../services/api'
import EventsTable from '../components/EventsTable'

export default function Events(){
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ verdict: '', path_contains: '', min_entropy: '', max_entropy: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchEvents({
        page,
        page_size: pageSize,
        verdict: filters.verdict || undefined,
        path_contains: filters.path_contains || undefined,
        min_entropy: filters.min_entropy ? parseFloat(filters.min_entropy) : undefined,
        max_entropy: filters.max_entropy ? parseFloat(filters.max_entropy) : undefined
      })
      setEvents(res.events || [])
      setTotal(res.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { load() }, [page, pageSize])

  function onApplyFilters() {
    setPage(1)
    load()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Events</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm">Verdict</label>
            <select className="border p-2 rounded" value={filters.verdict} onChange={e=>setFilters({...filters, verdict: e.target.value})}>
              <option value="">Any</option>
              <option value="suspicious">Suspicious</option>
              <option value="benign">Benign</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Path contains</label>
            <input value={filters.path_contains} onChange={e=>setFilters({...filters, path_contains: e.target.value})} className="border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Min entropy</label>
            <input value={filters.min_entropy} onChange={e=>setFilters({...filters, min_entropy: e.target.value})} className="border p-2 rounded w-24" />
          </div>

          <div>
            <label className="block text-sm">Max entropy</label>
            <input value={filters.max_entropy} onChange={e=>setFilters({...filters, max_entropy: e.target.value})} className="border p-2 rounded w-24" />
          </div>

          <div>
            <button onClick={onApplyFilters} className="bg-indigo-600 text-white px-3 py-2 rounded">Apply</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <EventsTable events={events} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Showing page {page} — total {total}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" onClick={()=>setPage(p => Math.max(1, p-1))}>Prev</button>
          <button className="px-3 py-1 border rounded" onClick={()=>setPage(p => p+1)}>Next</button>
          <select value={pageSize} onChange={(e)=>{ setPageSize(parseInt(e.target.value)); setPage(1) }} className="border p-1 rounded">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading && <div className="mt-2 text-sm text-slate-500">Loading…</div>}
    </div>
  )
}
