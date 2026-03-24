import { useState, useEffect } from 'react'

export default function Navbar({ alertCount, activeMainTab, onTabChange }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (n) => String(n).padStart(2, '0')
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ flex: 1 }}>
        <div className="navbar-logo">📍</div>
        <div>
          <div className="navbar-title">Field Force</div>
          <div className="navbar-subtitle">Municipal Workforce System</div>
        </div>
      </div>

      <div className="navbar-center" style={{ background: 'transparent', border: 'none', padding: 0, gap: '8px' }}>
        <button 
          className={`nav-mode-btn ${activeMainTab === 'map' ? 'active' : ''}`}
          onClick={() => onTabChange && onTabChange('map')}
        >
          🗺️ Map Tracking
        </button>
        <button 
          className={`nav-mode-btn ${activeMainTab === 'analytics' ? 'active' : ''}`}
          onClick={() => onTabChange && onTabChange('analytics')}
        >
          📊 Deep Analytics
        </button>
      </div>

      <div className="navbar-right" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <span className="nav-time">{timeStr}</span>
        {alertCount > 0 && (
          <span className="nav-badge">⚠️ {alertCount} Alerts</span>
        )}
        <div className="nav-avatar" title="Admin">A</div>
      </div>
    </nav>
  )
}
