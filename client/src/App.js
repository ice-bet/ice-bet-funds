import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import WithdrawalTable from './components/WithdrawalTable';
import DepositTable from './components/DepositTable';
import Login from './pages/Login';
import Register from './pages/Register';

// Simple auth helpers
const getToken = () => localStorage.getItem('token');
const getIsAdmin = () => {
  // For demo: decode JWT and check isAdmin, or store a flag on login
  // Here, just check a flag in localStorage (set in Login.js for admin)
  return localStorage.getItem('isAdmin') === 'true';
};

const RequireAuth = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
};

const RequireAdmin = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  if (!getIsAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User dashboard */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <UserDashboard balance={0} />
          </RequireAuth>
        }
      />

      {/* Admin dashboard with nested routes */}
      <Route
        path="/admin-dashboard/*"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App; 