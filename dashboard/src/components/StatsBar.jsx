export default function StatsBar({ total, active, inactive, alerts }) {
  const stats = [
    { icon: '👷', value: total ?? 24, label: 'Total Workers', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { icon: '✅', value: active ?? 18, label: 'Active Now', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { icon: '⏸️', value: inactive ?? 4, label: 'Inactive', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: '🚨', value: alerts ?? 2, label: 'Alerts', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { icon: '📍', value: 7, label: 'Zones Covered', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  ]

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
            {s.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
