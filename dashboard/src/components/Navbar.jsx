import { useState, useEffect } from 'react'

export default function Navbar({ alertCount }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (n) => String(n).padStart(2, '0')
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">📍</div>
        <div>
          <div className="navbar-title">Field Force</div>
          <div className="navbar-subtitle">Municipal Workforce System</div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="live-dot" />
        <span className="live-label">LIVE</span>
      </div>

      <div className="navbar-right">
        <span className="nav-time">{timeStr}</span>
        {alertCount > 0 && (
          <span className="nav-badge">⚠️ {alertCount} Alerts</span>
        )}
        <div className="nav-avatar" title="Admin">A</div>
      </div>
    </nav>
  )
}
