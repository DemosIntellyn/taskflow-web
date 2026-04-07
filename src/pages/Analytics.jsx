import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [burndown, setBurndown] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/analytics/summary'),
      api.get('/api/analytics/burndown'),
    ]).then(([s, b]) => {
      setSummary(s)
      setBurndown(b)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse text-gray-400">Loading analytics...</div>

  // BUG 3: TypeError — summary.velocity is undefined (API crashed), toFixed throws
  const velocityDisplay = summary.velocity.toFixed(1)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Sprint Velocity</h2>
          <div className="text-4xl font-bold text-indigo-600">{velocityDisplay}</div>
          <div className="text-sm text-gray-400 mt-1">points/sprint</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Completion Rate</h2>
          <div className="text-4xl font-bold text-green-600">
            {summary ? Math.round((summary.done / summary.total) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  )
}
