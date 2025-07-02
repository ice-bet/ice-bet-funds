import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, Routes, Route } from 'react-router-dom';
import WithdrawalTable from '../components/WithdrawalTable';
import DepositTable from '../components/DepositTable';
import AdminChatModeration from '../components/AdminChatModeration';
import AdminHeader from '../components/AdminHeader';
import InvestmentTable from '../components/InvestmentTable';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AdminAnnouncementForm from '../components/AdminAnnouncementForm';

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-100">
    <AnnouncementBanner />
    <AdminHeader />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="withdrawals" element={<WithdrawalTable />} />
          <Route path="deposits" element={<DepositTable />} />
          <Route path="chat" element={<AdminChatModeration />} />
          <Route path="investments" element={<InvestmentTable />} />
          <Route path="announcements" element={<AdminAnnouncementForm />} />
          <Route path="*" element={<Outlet />} />
        </Routes>
      </main>
    </div>
  </div>
);

export default AdminDashboard; 