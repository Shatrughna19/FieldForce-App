import { useDispatch } from 'react-redux'
import { clearSelection } from '../store/workerSlice'

const statusLabel = { active: 'Active', inactive: 'Inactive', alert: 'Alert' }
const statusClass = { active: 'status-active', inactive: 'status-inactive', alert: 'status-alert' }

function BatteryBar({ pct }) {
  const color = pct > 60 ? '#22c55e' : pct > 20 ? '#f59e0b' : '#ef4444'
  return (
    <div className="battery-wrap">
      <div className="battery-track">
        <div
          className="battery-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="battery-pct" style={{ color }}>{pct}%</span>
    </div>
  )
}

export default function WorkerDetail({ worker, onAssignTask }) {
  const dispatch = useDispatch()
  if (!worker) return null

  return (
    <div className="worker-detail">
      <div className="worker-detail-header">
        <div className="worker-avatar" style={{ background: worker.bg, color: worker.color, width: 44, height: 44, fontSize: 16 }}>
          {worker.initials}
        </div>
        <div className="worker-detail-info">
          <div className="worker-name" style={{ fontSize: 14 }}>{worker.name}</div>
          <div className="worker-role">{worker.role}</div>
        </div>
        <span className={`worker-status ${statusClass[worker.status]}`}>{statusLabel[worker.status]}</span>
        <button className="detail-close" onClick={() => dispatch(clearSelection())}>✕</button>
      </div>

      <div className="worker-detail-grid">
        <div className="detail-item">
          <span className="detail-label">📍 Zone</span>
          <span className="detail-value">{worker.zone}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">🕐 Checked In</span>
          <span className="detail-value">{worker.checkedIn}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">👁 Last Seen</span>
          <span className="detail-value">{worker.lastSeen}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">📡 GPS</span>
          <span className="detail-value gps-coords">
            {worker.lat.toFixed(4)}, {worker.lng.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="detail-item" style={{ marginTop: 8 }}>
        <span className="detail-label">🔋 Battery</span>
        <BatteryBar pct={worker.battery} />
      </div>

      <div className="worker-analytics" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span className="detail-label" style={{ marginBottom: 12, display: 'block' }}>📊 Worker Analytics</span>
        <div className="worker-detail-grid" style={{ gap: '12px' }}>
          <div className="detail-item" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <span className="detail-value" style={{ fontSize: '20px', color: 'var(--accent-green)' }}>92%</span>
            <span className="detail-label" style={{ fontSize: '9px' }}>Task Completion</span>
          </div>
          <div className="detail-item" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <span className="detail-value" style={{ fontSize: '20px', color: 'var(--accent-amber)' }}>14</span>
            <span className="detail-label" style={{ fontSize: '9px' }}>Tasks Assigned</span>
          </div>
          <div className="detail-item" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <span className="detail-value" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>4.8</span>
            <span className="detail-label" style={{ fontSize: '9px' }}>Performance Rating</span>
          </div>
          <div className="detail-item" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <span className="detail-value" style={{ fontSize: '20px', color: 'var(--accent-blue)' }}>28</span>
            <span className="detail-label" style={{ fontSize: '9px' }}>Days Active</span>
          </div>
        </div>
      </div>

      <button 
        className="btn-assign-task" 
        onClick={() => onAssignTask(worker.id)}
        style={{ 
          marginTop: 20, width: '100%', padding: '12px', 
          background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', 
          border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', 
          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
      >
        + Assign New Task
      </button>
    </div>
  )
}
