import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Plus, ArrowRight, X } from 'lucide-react';

const Classes = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ course_name: '', course_code: '' });
  const [loading, setLoading] = useState(false);

  const fetchClasses = () => {
    fetch('http://localhost:3000/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data.data || []));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:3000/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teacher_id: user.id
        })
      });
      setIsModalOpen(false);
      setFormData({ course_name: '', course_code: '' });
      fetchClasses();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['teal', 'blue', 'indigo'];

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">Manage your classes and course enrollments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Create Class
        </button>
      </div>

      <div className="search-container">
        <Search className="icon" />
        <input type="text" className="search-input" placeholder="Search classes..."/>
      </div>

      <div className="grid-3">
        {classes.map((cls, idx) => {
          const color = colors[idx % colors.length];
          return (
            <div key={cls.id} className={`card class-card border-${color}`}>
              <div className="class-card-header">
                <div className="icon-box"><GraduationCap size={20} /></div>
                <span className="badge badge-gray">{cls.course_code}</span>
              </div>
              
              <h3>{cls.course_name}</h3>
              <p className="semester">Active Course</p>
              
              <div className="class-card-footer">
                <div className="prof-info">
                  <div className="avatar" style={{ backgroundColor: color === 'teal' ? '#14b8a6' : color === 'blue' ? '#3b82f6' : '#6366f1' }}>
                    {cls.teacher_name.charAt(cls.teacher_name.toLowerCase().includes('dr') ? 4 : 0)}
                  </div>
                  <span>{cls.teacher_name}</span>
                </div>
                <ArrowRight className="arrow-icon" />
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Create New Class</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input required type="text" className="form-input" placeholder="e.g. Physics 101" value={formData.course_name} onChange={e => setFormData({...formData, course_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Course Code</label>
                <input required type="text" className="form-input" placeholder="e.g. PHY101" value={formData.course_code} onChange={e => setFormData({...formData, course_code: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalCardStyle = {
  background: 'white', padding: '32px', borderRadius: '16px',
  width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
};

export default Classes;
