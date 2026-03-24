import React from 'react';
import { useSelector } from 'react-redux';

export default function AnalyticsDashboard({ onAssignTask }) {
  const workers = useSelector((s) => s.workers.list);
  const totalWorkers = workers.length;
  
  // Deterministic mock generation based on ID to keep data stable on re-renders
  const enrichedWorkers = [...workers].map(w => {
    const seed = w.id * 13; 
    return {
      ...w,
      tasksAssigned: (seed % 15) + 10,
      tasksCompleted: (seed % 10) + 5,
      activeDays: (seed % 40) + 12,
      rating: ((seed % 10) / 10 + 4).toFixed(1),
    }
  }).sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const totalCompleted = enrichedWorkers.reduce((sum, w) => sum + w.tasksCompleted, 0);
  const totalAssigned = enrichedWorkers.reduce((sum, w) => sum + w.tasksAssigned, 0);
  const rate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;
  const avgRating = (enrichedWorkers.reduce((sum, w) => sum + parseFloat(w.rating), 0) / totalWorkers || 0).toFixed(1);

  const handleExportCSV = () => {
    // 1. Create headers
    const headers = ['Worker ID', 'Name', 'Role', 'Zone/Location', 'Tasks Completed', 'Tasks Assigned', 'Completion Rate %', 'Active Days', 'Rating Score'];
    
    // 2. Map data to rows
    const rows = enrichedWorkers.map(w => [
      w.id,
      `"${w.name}"`,
      `"${w.role}"`,
      `"${w.zone}"`,
      w.tasksCompleted,
      w.tasksAssigned,
      w.tasksAssigned > 0 ? Math.round((w.tasksCompleted / w.tasksAssigned) * 100) : 0,
      w.activeDays,
      w.rating
    ]);

    // 3. Combine to CSV string
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    // 4. Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GeoTrack_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Workforce Performance Analytics</h2>
        <p>Comprehensive tracking of individual and collective municipal workforce metrics.</p>
      </div>

      {/* Aggregate Overview */}
      <div className="analytics-overview">
        <div className="overview-card">
          <div className="ov-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>📋</div>
          <div className="ov-info">
            <span className="ov-val">{totalAssigned}</span>
            <span className="ov-label">Total Tasks Out</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="ov-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>✅</div>
          <div className="ov-info">
            <span className="ov-val">{totalCompleted}</span>
            <span className="ov-label">Tasks Completed</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="ov-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>📈</div>
          <div className="ov-info">
            <span className="ov-val">{rate}%</span>
            <span className="ov-label">Completion Rate</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="ov-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⭐</div>
          <div className="ov-info">
            <span className="ov-val">{avgRating}</span>
            <span className="ov-label">Avg Fleet Rating</span>
          </div>
        </div>
      </div>

      {/* Individual Worker Tracking Table */}
      <div className="analytics-table-wrap">
        <div className="table-header-row">
          <h3>Individual Worker Matrix</h3>
          <button className="btn-export" onClick={handleExportCSV}>📥 Export CSV</button>
        </div>
        
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Zone / Assignment</th>
              <th>Tasks Done</th>
              <th>Completion Rate</th>
              <th>Active Days</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrichedWorkers.map(w => (
              <tr key={w.id}>
                <td>
                  <div className="table-worker">
                    <div className="w-avatar" style={{ background: w.bg, color: w.color }}>{w.initials}</div>
                    <div className="w-info">
                      <span className="w-name">{w.name} <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({w.id})</span></span>
                      <span className="w-role">{w.role}</span>
                    </div>
                  </div>
                </td>
                <td className="t-zone">{w.zone}</td>
                <td className="t-metric"><span className="val-hi">{w.tasksCompleted}</span> / {w.tasksAssigned}</td>
                <td>
                  <div className="mini-bar">
                    <div className="bar-fill" style={{ width: `${(w.tasksCompleted/w.tasksAssigned)*100}%` }}></div>
                  </div>
                </td>
                <td className="t-metric">{w.activeDays} days</td>
                <td className="t-metric t-star">⭐ {w.rating}</td>
                <td>
                  <button className="btn-table-assign" onClick={() => onAssignTask(w.id)}>
                    + Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .analytics-dashboard {
          padding: 24px 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .analytics-header h2 { font-size: 24px; color: var(--text-primary); margin: 0 0 6px 0; letter-spacing: -0.5px; }
        .analytics-header p { color: var(--text-secondary); margin: 0; font-size: 14px; }
        
        .analytics-overview { display: flex; gap: 16px; }
        .overview-card {
          flex: 1; background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; gap: 16px;
        }
        .ov-icon { width: 56px; height: 56px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .ov-info { display: flex; flex-direction: column; }
        .ov-val { font-size: 28px; font-weight: 800; color: var(--text-primary); }
        .ov-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        .analytics-table-wrap {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px;
          flex: 1; display: flex; flex-direction: column;
        }
        .table-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .table-header-row h3 { margin: 0; font-size: 18px; color: var(--text-primary); }
        .btn-export { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .btn-export:hover { background: var(--border); }

        .analytics-table { width: 100%; border-collapse: collapse; }
        .analytics-table th { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .analytics-table td { padding: 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .analytics-table tr:hover td { background: rgba(255,255,255,0.02); }

        .table-worker { display: flex; align-items: center; gap: 12px; }
        .w-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
        .w-info { display: flex; flex-direction: column; }
        .w-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .w-role { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .t-zone { font-size: 13px; color: var(--text-secondary); }
        .t-metric { font-size: 14px; font-variant-numeric: tabular-nums; font-weight: 500; color: var(--text-secondary); }
        .val-hi { color: var(--text-primary); font-weight: 700; }
        .t-star { color: var(--accent-amber); font-weight: 700; }

        .mini-bar { width: 100px; height: 6px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
        .bar-fill { height: 100%; background: var(--accent-green); border-radius: 3px; }

        .btn-table-assign {
          background: rgba(59,130,246,0.1); color: var(--accent-blue);
          border: 1px solid rgba(59,130,246,0.3); padding: 8px 12px;
          border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-table-assign:hover { background: rgba(59,130,246,0.2); }
      `}</style>
    </div>
  )
}
