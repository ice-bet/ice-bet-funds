import React from 'react';
import WithdrawalForm from '../components/WithdrawalForm';
import TransactionHistory from '../components/TransactionHistory';
import GlobalChat from '../components/GlobalChat';
import UserHeader from '../components/UserHeader';
import UserInvestments from '../components/UserInvestments';
import InvestmentForm from '../components/InvestmentForm';
import AnnouncementBanner from '../components/AnnouncementBanner';
import Leaderboard from '../components/Leaderboard';
import ReferralProgress from '../components/ReferralProgress';

const UserDashboard = ({ balance }) => (
  <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
    <AnnouncementBanner />
    <UserHeader />
    <h1 className="text-2xl font-bold mb-4">Welcome to IceBet!</h1>
    <div className="mb-4 flex items-center justify-between">
      <span className="text-lg">Balance:</span>
      <span className="text-2xl font-bold text-blue-700">{balance} Coins</span>
    </div>
    <div className="flex space-x-4 mb-6">
      <a href="/deposit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Deposit</a>
      <a href="/withdraw" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Withdraw</a>
    </div>
    <WithdrawalForm balance={balance} />
    <TransactionHistory />
    <GlobalChat />
    <InvestmentForm />
    <UserInvestments />
    <ReferralProgress />
    <Leaderboard />
  </div>
);

export default UserDashboard; 