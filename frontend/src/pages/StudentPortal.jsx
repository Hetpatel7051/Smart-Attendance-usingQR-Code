import React, { useState } from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentPortal = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  
  // Auth Mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState('login');
  const [roleMode, setRoleMode] = useState('student');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(roleMode === 'student' ? 'alice@student.edu' : 'alan@university.edu'); 
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';
    const payload = authMode === 'login' 
        ? { email, password } 
        : { full_name: fullName, email, password, role: roleMode };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        onLogin(data.data);
        if(data.data.role === 'teacher') navigate('/dashboard');
        else navigate('/student-dashboard');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const resetEmailDefault = (mode) => {
    if(authMode === 'login') {
       setEmail(mode === 'student' ? 'alice@student.edu' : 'alan@university.edu');
    } else {
       setEmail('');
    }
  }

  const primaryColor = roleMode === 'teacher' ? '#6366f1' : '#0ea5e9';

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-icon-box" style={{ background: primaryColor }}>
          <GraduationCap size={32} />
        </div>
        <h1 className="login-title">{roleMode === 'teacher' ? 'Admin Portal' : 'Student Portal'}</h1>
        <p className="login-subtitle">
          {authMode === 'login' ? 'Sign in to your account' : 'Create a new secure account'}
        </p>
      </div>
      
      <form onSubmit={handleAuth} className="login-card" style={{ borderTopColor: primaryColor }}>
        
        {authMode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            required
            type="email" 
            className="form-input" 
            placeholder="email@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {authMode === 'login' && (
             <span className="form-help">
               Try <b>alice@student.edu</b> (student), or <b>alan@university.edu</b> (teacher) with blank password.
             </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Required for actual login security"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button 
          type="submit"
          className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} 
          style={{ background: !loading ? primaryColor : undefined, marginTop: '24px' }}
          disabled={loading || !email}
        >
          {loading ? (
            <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>↻</span> {authMode === 'login' ? 'Signing in...' : 'Creating...'}</>
          ) : (
             authMode === 'login' ? 'Sign In →' : 'Create Account →'
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
             <button 
               type="button" 
               style={{ background: 'none', border: 'none', color: primaryColor, cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
               onClick={() => {
                 setAuthMode(m => m === 'login' ? 'signup' : 'login');
                 setFullName(''); setPassword('');
                 if(authMode === 'signup') {
                    setEmail(roleMode === 'student' ? 'alice@student.edu' : 'alan@university.edu');
                 } else {
                    setEmail('');
                 }
               }}
             >
               {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
             </button>
        </div>
        
        <div className="secure-notice" style={{ marginTop: '24px' }}>
          <ShieldCheck size={14} color="#3b82f6" />
          <span>Your data is private and secure</span>
        </div>
      </form>
      
      <button 
        type="button"
        onClick={() => {
          const newMode = roleMode === 'student' ? 'teacher' : 'student';
          setRoleMode(newMode);
          resetEmailDefault(newMode);
        }}
        className="login-footer-link" 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        {roleMode === 'student' ? 'Teacher / Admin? Go to Admin Portal' : 'Student? Go to Student Portal'}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudentPortal;
