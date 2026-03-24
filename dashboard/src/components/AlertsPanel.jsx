const ALERTS = [
  {
    id: 1,
    type: 'critical',
    icon: '🚨',
    title: 'Rahul Gupta left geofence',
    desc: 'Zone G – Dwarka boundary exceeded by 850m',
    time: '18 min ago',
  },
  {
    id: 2,
    type: 'critical',
    icon: '🔴',
    title: 'Kavita Joshi – No movement',
    desc: 'Worker stationary for 41+ minutes',
    time: '41 min ago',
  },
  {
    id: 3,
    type: 'warning',
    icon: '⚠️',
    title: 'Low battery – Meena Patel',
    desc: 'Device battery at 12%, may go offline soon',
    time: '35 min ago',
  },
  {
    id: 4,
    type: 'warning',
    icon: '⏸️',
    title: 'Deepak Singh inactive',
    desc: 'No activity recorded for 22 minutes in Zone E',
    time: '22 min ago',
  },
  {
    id: 5,
    type: 'info',
    icon: '📍',
    title: 'Priya Sharma checked in',
    desc: 'Zone C – Lajpat Nagar, 08:15 AM',
    time: '2 hrs ago',
  },
  {
    id: 6,
    type: 'info',
    icon: '✅',
    title: 'All Zone A tasks complete',
    desc: 'Morning sweep schedule finished ahead of time',
    time: '3 hrs ago',
  },
]

export default function AlertsPanel() {
  return (
    <div className="sidebar-content">
      {ALERTS.map((a, i) => (
        <div
          key={a.id}
          className={`alert-item ${a.type}`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="alert-icon">{a.icon}</div>
          <div className="alert-body">
            <div className="alert-title">{a.title}</div>
            <div className="alert-desc">{a.desc}</div>
            <div className="alert-time">{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
