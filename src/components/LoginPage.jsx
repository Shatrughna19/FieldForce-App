import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Hash, Users, MapPin } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    managerId: '',
    gender: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    localStorage.setItem('user', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-icon-wrapper">
          <MapPin size={32} color="#ffffff" />
        </div>
        <h1 className="login-title" style={{ fontSize: '24px', fontWeight: 'bold' }}>Field Force</h1>
        <p className="login-subtitle" style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>MUNICIPAL WORKFORCE SYSTEM</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              name="name"
              className="form-input" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="john.doe@company.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Employee ID</label>
          <div className="input-wrapper">
            <Hash className="input-icon" size={20} />
            <input 
              type="text" 
              name="employeeId"
              className="form-input" 
              placeholder="EMP-XXXXX"
              value={formData.employeeId}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Manager ID</label>
          <div className="input-wrapper">
            <Briefcase className="input-icon" size={20} />
            <input 
              type="text" 
              name="managerId"
              className="form-input" 
              placeholder="MGR-XXXXX"
              value={formData.managerId}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <div className="input-wrapper select-wrapper">
            <Users className="input-icon" size={20} />
            <select 
              name="gender" 
              className="form-input form-select gender-select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Access Portal
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
