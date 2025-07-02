import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/investments/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInvestments(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch investments');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw early? 30% penalty will apply.')) return;
    try {
      await axios.post(`/api/investments/withdraw/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchInvestments();
    } catch (err) {
      alert('Early withdrawal failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">My Investments</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">Amount</th>
            <th className="p-2">Plan</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Status</th>
            <th className="p-2">Penalty</th>
            <th className="p-2">Earnings</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.length === 0 ? (
            <tr><td colSpan="8" className="text-center p-4">No investments found</td></tr>
          ) : (
            investments.map(inv => (
              <tr key={inv._id} className="border-t">
                <td className="p-2">{inv.amount}</td>
                <td className="p-2">{inv.plan}</td>
                <td className="p-2">{new Date(inv.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(inv.endDate).toLocaleDateString()}</td>
                <td className="p-2 capitalize">{inv.status}</td>
                <td className="p-2">{inv.penalty || 0}</td>
                <td className="p-2">{inv.earnings || 0}</td>
                <td className="p-2">
                  {inv.status === 'active' && (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleWithdraw(inv._id)}
                    >Withdraw Early</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserInvestments; 