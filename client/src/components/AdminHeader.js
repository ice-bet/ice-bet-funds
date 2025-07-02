import React from 'react';
import { getUser, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-blue-900 text-white px-6 py-3 rounded mb-6">
      <div>
        <span className="font-bold">Admin: {user?.username || 'Admin'}</span>
        <a href="/dashboard" className="ml-6 underline text-blue-200 hover:text-white">Go to User Site</a>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 font-semibold"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader; 