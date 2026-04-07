import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Team() {
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/team/workload').then(data => {
      setWorkload(data.workload || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse text-gray-400">Loading team...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Workload</h1>
      <div className="grid grid-cols-2 gap-4">
        {workload.map((member, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            {/* BUG 4: TypeError — member.user is null (user_3 is null in DB), accessing .name throws */}
            <div className="font-semibold text-gray-800">{member.user.name}</div>
            <div className="text-sm text-gray-500">{member.user.email}</div>
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-indigo-600 font-medium">{member.task_count} tasks</span>
              <span className="text-gray-500">{member.total_points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
