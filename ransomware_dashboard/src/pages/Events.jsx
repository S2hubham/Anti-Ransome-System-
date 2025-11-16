// src/pages/Events.jsx
import React, { useEffect, useState } from "react"
import { fetchEvents } from "../services/api"
import EventsTable from "../components/EventsTable"

export default function Events() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({
    verdict: "",
    path_contains: "",
    min_entropy: "",
    max_entropy: ""
  })

  async function load() {
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, pageSize])

  function applyFilters() {
    setPage(1)
    load()
  }

  return (
    <div className="space-y-5">
      <h2 className="card-title">Events</h2>

      {/* FILTERS */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs muted block mb-1">Verdict</label>
            <select
              className="border p-2 rounded bg-transparent"
              value={filters.verdict}
              onChange={(e) =>
                setFilters({ ...filters, verdict: e.target.value })
              }
            >
              <option value="">Any</option>
              <option value="suspicious">Suspicious</option>
              <option value="benign">Benign</option>
            </select>
          </div>

          <div>
            <label className="text-xs muted block mb-1">Path contains</label>
            <input
              className="border p-2 rounded bg-transparent"
              value={filters.path_contains}
              onChange={(e) =>
                setFilters({ ...filters, path_contains: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs muted block mb-1">Min entropy</label>
            <input
              className="border p-2 rounded bg-transparent w-24"
              value={filters.min_entropy}
              onChange={(e) =>
                setFilters({ ...filters, min_entropy: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs muted block mb-1">Max entropy</label>
            <input
              className="border p-2 rounded bg-transparent w-24"
              value={filters.max_entropy}
              onChange={(e) =>
                setFilters({ ...filters, max_entropy: e.target.value })
              }
            />
          </div>

          <button className="btn btn-primary" onClick={applyFilters}>
            Apply
          </button>
        </div>
      </div>

      {/* TABLE */}
      <EventsTable events={events} isLoading={loading} />

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs muted">
          Page {page} • Total {total}
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="btn btn-ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <button className="btn btn-ghost" onClick={() => setPage(page + 1)}>
            Next
          </button>

          <select
            className="border rounded p-1 bg-transparent"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value))
              setPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  )
}
