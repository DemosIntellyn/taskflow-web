import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Team from './pages/Team'

function Sidebar() {
  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-2">
      <div className="text-xl font-bold text-indigo-400 mb-6">⚡ TaskFlow</div>
      {[
        { to: '/', label: '🏠 Dashboard' },
        { to: '/tasks', label: '✅ Tasks' },
        { to: '/analytics', label: '📊 Analytics' },
        { to: '/team', label: '👥 Team' },
      ].map(({ to, label }) => (
        <Link key={to} to={to} className="px-3 py-2 rounded hover:bg-gray-700 text-sm transition">{label}</Link>
      ))}
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 min-h-screen p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
