import { useState, useEffect } from 'react'
import { api } from '../api'

const PRIORITY_COLOR = { critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-600' }
const STATUS_COLOR = { done: 'bg-green-100 text-green-700', in_progress: 'bg-yellow-100 text-yellow-700', todo: 'bg-gray-100 text-gray-600' }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/tasks').then(data => {
      setTasks(data.tasks || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // BUG 2: Cannot read properties of undefined — task.tags can be undefined for some tasks
  const tagCounts = tasks.reduce((acc, task) => {
    task.tags.forEach(tag => {  // TypeError if tags is undefined
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  if (loading) return <div className="animate-pulse text-gray-400">Loading tasks...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ New Task</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              {['Title', 'Assignee', 'Priority', 'Status', 'Tags', 'Points'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{task.assignee_name || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLOR[task.priority]}`}>{task.priority}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[task.status]}`}>{task.status}</span></td>
                <td className="px-4 py-3 text-xs text-gray-500">{task.tags?.join(', ')}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{task.story_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
