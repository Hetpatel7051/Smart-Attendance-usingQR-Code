import React, { useState, useEffect } from 'react';
import { UserCircle, QrCode, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.full_name}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Profile Card */}
        <div className="card" style={{ flex: '1', minWidth: '300px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <UserCircle size={80} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{user?.full_name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{user?.email}</p>
          <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: '14px' }}>Active Student</span>
        </div>

        {/* Action Card */}
        <div className="card" style={{ flex: '2', minWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', background: 'var(--primary-light)', border: '2px dashed var(--primary-color)' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--primary-color)', marginBottom: '16px' }}>Mark Attendance</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
            Is your professor projecting a QR code? Scan it to register your presence securely.
          </p>
          <button 
            className="btn btn-primary btn-large" 
            style={{ width: 'fit-content' }}
            onClick={() => navigate('/scan')}
          >
            <QrCode size={24} style={{ marginRight: '12px' }} />
            Open QR Scanner
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
