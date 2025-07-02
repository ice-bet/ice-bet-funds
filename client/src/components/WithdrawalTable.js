import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WithdrawalTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/transactions/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWithdrawals(res.data.filter(tx => tx.type === 'withdrawal'));
      setError('');
    } catch (err) {
      setError('Failed to fetch withdrawals');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`/api/transactions/${action}/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchWithdrawals();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Withdrawals</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Bank Info</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr><td colSpan="5" className="text-center p-4">No pending withdrawals</td></tr>
          ) : (
            withdrawals.map(w => (
              <tr key={w._id} className="border-t">
                <td className="p-2">{w.user?.username || w.user}</td>
                <td className="p-2">{w.amount}</td>
                <td className="p-2">{w.notes}</td>
                <td className="p-2">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleAction(w._id, 'approve')}
                  >Approve</button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleAction(w._id, 'decline')}
                  >Decline</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalTable; 