import React from 'react'
import { Link } from 'react-router-dom'

export default function EventsTable({events}){
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm">Timestamp</th>
            <th className="px-4 py-2 text-left text-sm">Path</th>
            <th className="px-4 py-2 text-left text-sm">Entropy</th>
            <th className="px-4 py-2 text-left text-sm">Gretel</th>
            <th className="px-4 py-2 text-left text-sm">Score</th>
            <th className="px-4 py-2 text-left text-sm">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id} className="border-t">
              <td className="px-4 py-2 text-sm">{ev.timestamp}</td>
              <td className="px-4 py-2 text-sm"><Link className="text-indigo-600" to={`/events/${ev.id}`}>{ev.path}</Link></td>
              <td className="px-4 py-2 text-sm">{ev.entropy}</td>
              <td className="px-4 py-2 text-sm">{ev.gretel}</td>
              <td className="px-4 py-2 text-sm">{ev.combined}</td>
              <td className="px-4 py-2 text-sm">{ev.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
