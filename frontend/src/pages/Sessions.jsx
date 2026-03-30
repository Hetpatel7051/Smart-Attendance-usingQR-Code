import React, { useState, useEffect } from 'react';
import { Clock, Users, PlayCircle, X, Maximize } from 'lucide-react';
import QRCode from 'react-qr-code';

const Sessions = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  
  const [liveSession, setLiveSession] = useState(null); // When viewing QR

  const fetchActiveSessions = () => {
    fetch('http://localhost:3000/api/sessions/active')
      .then(res => res.json())
      .then(data => setSessions(data.data || []));
  };

  const fetchClasses = () => {
    fetch('http://localhost:3000/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data.data || []));
  };

  useEffect(() => {
    fetchActiveSessions();
    fetchClasses();
    
    // Auto-refresh active sessions
    const interval = setInterval(fetchActiveSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await fetch('http://localhost:3000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: selectedClass })
      });
      setIsModalOpen(false);
      fetchActiveSessions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">Attendance Sessions</h1>
          <p className="page-subtitle">Start and manage live QR attendance events.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlayCircle size={18} />
          Start New Session
        </button>
      </div>

      <div className="grid-3">
        {sessions.map(session => (
          <div key={session.id} className="card session-card">
            <div className="session-card-header">
              <span className="badge badge-success">Active Now</span>
            </div>
            
            <div className="session-card-body">
              <h3>{session.course_name}</h3>
              <p className="course">Started: {new Date(session.start_time).toLocaleTimeString()}</p>
              
              <div className="session-meta">
                <div className="meta-item">
                  <Clock className="icon" size={16} />
                  <span>Session Live</span>
                </div>
              </div>
              
              <button className="btn btn-primary btn-full" onClick={() => setLiveSession(session)}>
                <Maximize size={16} style={{marginRight: '8px'}} /> Focus Live QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
         <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
           No active sessions. Start one to generate a QR Code!
         </div>
      )}

      {/* CREATE SESSION MODAL */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Start Session</h2>
              <button onClick={() => setIsModalOpen(false)} style={closeBtnStyle}><X size={24} /></button>
            </div>
            <form onSubmit={handleStartSession}>
              <div className="form-group">
                <label className="form-label">Select Class</label>
                <select 
                  required 
                  className="form-input" 
                  value={selectedClass} 
                  onChange={e => setSelectedClass(e.target.value)}
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full">Generate QR Session</button>
            </form>
          </div>
        </div>
      )}

      {/* LIVE QR MODAL */}
      {liveSession && (
        <div style={modalOverlayStyle}>
          <div style={{...modalCardStyle, maxWidth: '600px', textAlign: 'center'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Live QR Attendance</h2>
              <button onClick={() => setLiveSession(null)} style={closeBtnStyle}><X size={24} /></button>
            </div>
            <p className="page-subtitle" style={{marginBottom: '24px'}}>{liveSession.course_name}</p>
            
            <div style={{ background: 'white', padding: '32px', display: 'inline-block', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <QRCode 
                value={liveSession.dynamic_qr_token} 
                size={300}
                level="H"
              />
            </div>
            
            <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
              Students should use their SmartSync app to scan this code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
};
const modalCardStyle = {
  background: 'white', padding: '40px', borderRadius: '24px',
  width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
};
const closeBtnStyle = { background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' };

export default Sessions;
