import React, { useEffect, useState } from 'react';
import { getUser, logout } from '../utils/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBalance(res.data.balance);
        setUsername(res.data.username);
      } catch {
        setBalance(0);
        setUsername('');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-blue-900 text-white px-6 py-3 rounded mb-6">
      <div>
        <span className="font-bold">{username}</span>
        <span className="ml-4">Balance: <span className="font-semibold">{balance} Coins</span></span>
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

export default UserHeader; 