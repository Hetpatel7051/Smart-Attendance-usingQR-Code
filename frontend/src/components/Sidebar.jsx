import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Clock, Users, UserCircle, LogOut, CheckCircle2, QrCode } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/portal');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <CheckCircle2 size={24} color="#3b82f6" />
        </div>
        <div className="sidebar-brand">
          <h2>SmartSync</h2>
          <span>{user?.role === 'student' ? 'Student Portal' : 'Teacher Portal'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user?.role === 'teacher' && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard className="nav-icon" /> Dashboard
            </NavLink>
            <NavLink to="/classes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <GraduationCap className="nav-icon" /> Classes
            </NavLink>
            <NavLink to="/sessions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Clock className="nav-icon" /> Sessions
            </NavLink>
            <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users className="nav-icon" /> Students
            </NavLink>
          </>
        )}

        {user?.role === 'student' && (
          <>
            <NavLink to="/student-dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserCircle className="nav-icon" /> My Profile
            </NavLink>
            <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <QrCode className="nav-icon" /> Scan Attendance
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '16px', padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Logged in as <b>{user?.full_name || 'Guest'}</b>
        </div>
        <button onClick={handleLogoutClick} className="nav-item" style={{width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer'}}>
          <LogOut className="nav-icon" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
