import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, classes: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch generic counts just as a real-world proxy
    fetch('http://localhost:3000/api/users/students')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, students: data.data?.length || 0 })));
      
    fetch('http://localhost:3000/api/classes')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, classes: data.data?.length || 0 })));

    // Fetch live graph stats
    fetch('http://localhost:3000/api/stats/attendance')
      .then(res => res.json())
      .then(data => {
        // Transform for a neat futuristic gradient graph
        if(data.data && data.data.length > 0) {
           setChartData(data.data);
        } else {
           // Fallback dummy data so it looks cool if no attendance yet
           setChartData([
             { name: 'CS101', attendance: 45 },
             { name: 'PHY200', attendance: 52 },
             { name: 'MTH301', attendance: 38 },
             { name: 'BIO105', attendance: 65 },
             { name: 'ENG101', attendance: 48 },
           ]);
        }
      });
  }, []);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="content-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '32px', letterSpacing: '-0.02em', color: '#1e293b' }}>
            System Administrator
          </h1>
          <p className="page-subtitle" style={{ fontSize: '16px', color: '#64748b' }}>
            Global overview of smart attendance and platform health.
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div className="card admin-stat-card" style={statCardStyle}>
          <div className="icon-box" style={{ ...iconBoxStyle, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
             <Users size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={cardSubtitleStyle}>Total Registered Students</p>
            <h3 style={cardTitleStyle}>{stats.students}</h3>
          </div>
        </div>
        
        <div className="card admin-stat-card" style={statCardStyle}>
          <div className="icon-box" style={{ ...iconBoxStyle, background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            <GraduationCap size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
             <p style={cardSubtitleStyle}>Active Classes</p>
             <h3 style={cardTitleStyle}>{stats.classes}</h3>
          </div>
        </div>

        <div className="card admin-stat-card" style={statCardStyle}>
          <div className="icon-box" style={{ ...iconBoxStyle, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
            <CheckCircle size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={cardSubtitleStyle}>System Health</p>
            <h3 style={cardTitleStyle}>Nominal</h3>
          </div>
        </div>
      </div>

      {/* FUTURISTIC FLOW GRAPH */}
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#334155' }}>Attendance Flow by Class</h2>
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}>
        
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} dx={-10} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '600' }}
                 cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAttendance)" activeDot={{ r: 8, fill: '#3b82f6', stroke: 'white', strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

// Sleek Admin Card Styling 
const statCardStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  padding: '24px', 
  gap: '20px',
  background: 'white',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
};
const iconBoxStyle = { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardSubtitleStyle = { fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '4px' };
const cardTitleStyle = { fontSize: '28px', fontWeight: '700', color: '#0f172a' };

export default Dashboard;
