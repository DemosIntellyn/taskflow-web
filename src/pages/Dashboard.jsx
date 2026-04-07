import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Dashboard() {
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/tasks').then(data => {
      setTasks(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // BUG 1: TypeError — tasks is null on first render, .tasks.length throws
  const doneCount = tasks.tasks.filter(t => t.status === 'done').length
  const inProgressCount = tasks.tasks.filter(t => t.status === 'in_progress').length

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Tasks" value={tasks?.tasks?.length} color="indigo" />
        <StatCard label="Completed" value={doneCount} color="green" />
        <StatCard label="In Progress" value={inProgressCount} color="yellow" />
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = { indigo: 'bg-indigo-50 text-indigo-700', green: 'bg-green-50 text-green-700', yellow: 'bg-yellow-50 text-yellow-700' }
  return (
    <div className={`rounded-xl p-6 ${colors[color]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1 opacity-75">{label}</div>
    </div>
  )
}
