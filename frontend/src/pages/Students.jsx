import React from 'react';
import { Search, Plus } from 'lucide-react';

const Students = () => {
  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">Students Directory</h1>
          <p className="page-subtitle">Manage all registered students globally.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Register Student mock action!')}>
          <Plus size={18} />
          Register Student
        </button>
      </div>

      <div className="table-container">
        <div className="search-container" style={{ margin: '16px', marginBottom: '16px', boxShadow: 'none' }}>
          <Search className="icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by name or ID..."
          />
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="student-info">
                  <div className="avatar" style={{ backgroundColor: '#10b981' }}>P</div>
                  <span>patel XYZ</span>
                </div>
              </td>
              <td><span className="student-id-badge">1001</span></td>
              <td className="reg-date">Mar 28, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
