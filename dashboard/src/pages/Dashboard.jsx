import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectWorker } from '../store/workerSlice'
import Navbar from '../components/Navbar'
import StatsBar from '../components/StatsBar'
import MapView from '../components/MapView'
import WorkerList from '../components/WorkerList'
import AlertsPanel from '../components/AlertsPanel'
import WorkerDetail from '../components/WorkerDetail'
import SimFab from '../components/SimFab'
import useSimulation from '../hooks/useSimulation'
import '../App.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const workers = useSelector((s) => s.workers.list)
  const selectedId = useSelector((s) => s.workers.selectedId)
  const selectedWorker = workers.find((w) => w.id === selectedId) || null

  const [activeTab, setActiveTab] = useState('workers')
  const [isSimulating, setIsSimulating] = useState(false)
  const [search, setSearch] = useState('')

  useSimulation(isSimulating)

  const alertCount = workers.filter((w) => w.status === 'alert').length
  const activeCount = workers.filter((w) => w.status === 'active').length
  const inactiveCount = workers.filter((w) => w.status === 'inactive').length

  const handleWorkerClick = (worker) => {
    dispatch(selectWorker(worker.id))
    setActiveTab('workers')
  }

  return (
    <div className="app-layout">
      <Navbar alertCount={alertCount} />
      <StatsBar
        total={workers.length}
        active={activeCount}
        inactive={inactiveCount}
        alerts={alertCount}
      />

      <div className="dashboard-body">
        <MapView
          workers={workers}
          selectedWorker={selectedWorker}
          onWorkerClick={handleWorkerClick}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating((v) => !v)}
        />

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-tabs">
            <div
              className={`sidebar-tab ${activeTab === 'workers' ? 'active' : ''}`}
              onClick={() => setActiveTab('workers')}
            >
              👷 Workers ({activeCount} active)
            </div>
            <div
              className={`sidebar-tab ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              🚨 Alerts {alertCount > 0 && `(${alertCount})`}
            </div>
          </div>

          {activeTab === 'workers' ? (
            <>
              <div className="sidebar-search">
                <input
                  className="search-input"
                  type="text"
                  placeholder="🔍  Search workers or zones…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <WorkerList
                workers={workers}
                search={search}
                onSelectWorker={handleWorkerClick}
                selectedWorker={selectedWorker}
              />
              <WorkerDetail worker={selectedWorker} />
            </>
          ) : (
            <AlertsPanel />
          )}
        </div>
      </div>
    </div>
  )
}