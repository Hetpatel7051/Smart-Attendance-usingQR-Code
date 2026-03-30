import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Teacher Pages
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Sessions from './pages/Sessions';
import Students from './pages/Students';

// Student Pages
import StudentPortal from './pages/StudentPortal';
import StudentDashboard from './pages/StudentDashboard';
import ScanQR from './pages/ScanQR';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_attend_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('smart_attend_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_attend_user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/portal" element={<StudentPortal onLogin={handleLogin} />} />
        
        {/* Protected Routes enclosed in Layout */}
        <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to={user?.role === 'student' ? "/student-dashboard" : "/dashboard"} replace />} />
          
          {/* Teacher Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes user={user} />} />
          <Route path="/sessions" element={<Sessions user={user} />} />
          <Route path="/students" element={<Students user={user} />} />
          
          {/* Student Routes */}
          <Route path="/student-dashboard" element={<StudentDashboard user={user} />} />
          <Route path="/scan" element={<ScanQR user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}
