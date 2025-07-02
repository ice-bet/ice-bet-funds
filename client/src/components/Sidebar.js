import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin-dashboard/withdrawals', label: 'Withdrawals' },
  { to: '/admin-dashboard/deposits', label: 'Deposits' },
  { to: '/admin-dashboard/investments', label: 'Investments' },
  { to: '/admin-dashboard/users', label: 'Users' },
  { to: '/admin-dashboard/chat', label: 'Chat' },
  { to: '/admin-dashboard/announcements', label: 'Announcements' },
];

const Sidebar = () => (
  <aside className="bg-blue-900 text-white w-56 min-h-screen p-6 flex flex-col">
    <div className="text-2xl font-bold mb-8 tracking-wide">IceBet Admin</div>
    <nav className="flex-1 space-y-2">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? 'bg-blue-600 font-semibold' : 'hover:bg-blue-700'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar; 