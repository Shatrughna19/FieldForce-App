import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Bell, MapPin, User, CheckSquare, Pause, Siren, Search, 
  Map as MapIcon, Clock, Battery, AlertTriangle, Users 
} from 'lucide-react';
import L from 'leaflet';
import './Dashboard.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored map markers based on status
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const activeIcon = createCustomIcon('#10b981');
const inactiveIcon = createCustomIcon('#f59e0b');

const mockWorkers = [
  { id: 1, name: 'Ravi Kumar', role: 'Street Sweeper', status: 'ACTIVE', zone: 'Zone A', lastActive: '2 min ago', battery: '82%', lat: 28.6139, lng: 77.2090 },
  { id: 2, name: 'Sunil Verma', role: 'Waste Collector', status: 'ACTIVE', zone: 'Zone B', lastActive: '1 min ago', battery: '67%', lat: 28.6355, lng: 77.2110 },
  { id: 3, name: 'Priya Sharma', role: 'Supervisor', status: 'ACTIVE', zone: 'Zone C', lastActive: 'Just now', battery: '91%', lat: 28.6039, lng: 77.2290 },
  { id: 4, name: 'Anjali Mehta', role: 'Road Repair', status: 'ACTIVE', zone: 'Zone D', lastActive: '4 min ago', battery: '55%', lat: 28.6239, lng: 77.1990 },
  { id: 5, name: 'Deepak Singh', role: 'Plumber', status: 'INACTIVE', zone: 'Zone E', lastActive: '22 min ago', battery: '34%', lat: 28.5939, lng: 77.1890 },
  { id: 6, name: 'Meena Patel', role: 'Park Maintenance', status: 'INACTIVE', zone: 'Zone F', lastActive: '1 hr ago', battery: '15%', lat: 28.6439, lng: 77.2390 },
  { id: 7, name: 'Karan Joshi', role: 'Electrician', status: 'ACTIVE', zone: 'Zone G', lastActive: '5 min ago', battery: '45%', lat: 28.6539, lng: 77.1990 },
  { id: 8, name: 'Amit Singh', role: 'Water Supply', status: 'INACTIVE', zone: 'Zone H', lastActive: '30 min ago', battery: '20%', lat: 28.6139, lng: 77.2590 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUserData(JSON.parse(storedUser));
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  if (!userData) return null;

  return (
    <div className="map-dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-box">
            <MapPin size={20} color="white" />
          </div>
          <div className="title-group">
            <h1>Field Force</h1>
            <p>MUNICIPAL WORKFORCE SYSTEM</p>
          </div>
          <div className="live-badge">
            <div className="live-dot"></div>
            <span className="live-text">LIVE</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="clock">{currentTime}</div>
          <button className="alerts-btn">
            <AlertTriangle size={14} />
            2 Alerts
          </button>
          <div className="profile-circle" title="Logout" onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }} style={{ cursor: 'pointer' }}>
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon blue"><User size={20} /></div>
          <div className="stat-info">
            <p className="stat-val">8</p>
            <p className="stat-label">TOTAL WORKERS</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckSquare size={20} /></div>
          <div className="stat-info">
            <p className="stat-val">4</p>
            <p className="stat-label">ACTIVE NOW</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Pause size={20} /></div>
          <div className="stat-info">
            <p className="stat-val">3</p>
            <p className="stat-label">INACTIVE</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Siren size={20} /></div>
          <div className="stat-info">
            <p className="stat-val">2</p>
            <p className="stat-label">ALERTS</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><MapPin size={20} /></div>
          <div className="stat-info">
            <p className="stat-val">7</p>
            <p className="stat-label">ZONES COVERED</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Map Area */}
        <div className="map-area">
          <div className="map-overlay">
            <MapIcon size={14} />
            <span>Live Map - Delhi NCR - 8 Workers</span>
          </div>
          <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={12} 
            scrollWheelZoom={true} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {mockWorkers.map(worker => (
              <Marker 
                key={worker.id} 
                position={[worker.lat, worker.lng]}
                icon={worker.status === 'ACTIVE' ? activeIcon : inactiveIcon}
              >
                <Popup>
                  <strong>{worker.name}</strong><br/>
                  {worker.role}<br/>
                  Status: {worker.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-tabs">
            <div className="tab active">
              <Users size={14} /> WORKERS (4 ACTIVE)
            </div>
            <div className="tab">
              <Siren size={14} color="#ef4444" /> ALERTS (2)
            </div>
          </div>

          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search workers or zones..." />
          </div>

          <div className="worker-list">
            {mockWorkers.map((worker) => (
              <div className={`worker-card ${worker.status.toLowerCase()}`} key={worker.id}>
                <div className="worker-card-header">
                  <div style={{ display: 'flex', flex: 1 }}>
                    <div className="worker-avatar">
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="worker-info-main">
                      <h3 className="worker-name">{worker.name}</h3>
                      <p className="worker-role">{worker.role}</p>
                    </div>
                  </div>
                  <div className={`status-badge ${worker.status.toLowerCase()}`}>
                    {worker.status}
                  </div>
                </div>
                <div className="worker-card-footer">
                  <div className="footer-item">
                    <MapPin size={10} color="#ef4444" /> {worker.zone}
                  </div>
                  <div className="footer-item">
                    <Clock size={10} /> {worker.lastActive}
                  </div>
                  <div className="footer-item">
                    <Battery size={10} color={worker.status === 'ACTIVE' ? '#10b981' : '#f59e0b'} /> {worker.battery}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
