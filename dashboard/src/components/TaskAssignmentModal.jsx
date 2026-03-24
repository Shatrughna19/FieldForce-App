import { useState } from 'react';
import { workerService } from '../services/api';

export default function TaskAssignmentModal({ onClose, preselectedWorkerId = '', workers = [] }) {
  const [workerId, setWorkerId] = useState(preselectedWorkerId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workerId || !title || !zone) return;
    
    setSubmitting(true);
    try {
      await workerService.assignTask({
        workerId,
        title,
        description,
        zone,
        deadline,
        status: 'pending'
      });
      alert('Task Successfully Assigned to ' + workerId);
      onClose();
    } catch (err) {
      alert('Failed to assign task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>📝 Assign New Task</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Assignee (Worker ID)</label>
            <select 
              value={workerId} 
              onChange={e => setWorkerId(e.target.value)}
              disabled={!!preselectedWorkerId}
              required
            >
              <option value="">-- Select a Worker --</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.id})</option>
              ))}
              {/* Fallback if no workers passed but preselected exists */}
              {preselectedWorkerId && workers.length === 0 && (
                <option value={preselectedWorkerId}>{preselectedWorkerId}</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              placeholder="e.g. Inspect Pipeline"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Assigned Zone/Area</label>
            <input 
              type="text" 
              placeholder="e.g. Zone A - Connaught Place"
              value={zone}
              onChange={e => setZone(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Deadline / Time</label>
              <input 
                type="datetime-local" 
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Detailed instructions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting || !workerId || !title}>
            {submitting ? 'Assigning...' : 'Dispatch Task'}
          </button>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10,14,26,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); width: 100%; max-width: 480px;
          padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          animation: slide-up 0.3s ease;
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;
        }
        .modal-header h3 { font-size: 18px; margin: 0; color: var(--text-primary); }
        .modal-close { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; }
        .modal-close:hover { color: var(--accent-red); }
        
        .task-form { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: flex; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
        .form-group input, .form-group select, .form-group textarea {
          background: var(--bg-secondary); border: 1px solid var(--border);
          padding: 10px 12px; border-radius: var(--radius-sm); color: var(--text-primary);
          font-family: inherit; font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--accent-blue); outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
        }
        .btn-primary {
          background: var(--accent-blue); color: #fff; border: none;
          padding: 14px; border-radius: var(--radius-sm); font-weight: 700; font-size: 15px;
          cursor: pointer; margin-top: 8px; transition: background 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #2563eb; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
