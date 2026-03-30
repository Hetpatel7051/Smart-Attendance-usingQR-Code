import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ user, onLogout }) => {
  // Simple protection: if not logged in and not on portal, redirect to portal
  if (!user && window.location.pathname !== '/portal') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
