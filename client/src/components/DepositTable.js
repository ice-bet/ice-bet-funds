import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepositTable = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/transactions/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeposits(res.data.filter(tx => tx.type === 'deposit'));
      setError('');
    } catch (err) {
      setError('Failed to fetch deposits');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`/api/transactions/${action}/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDeposits();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Deposits</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Screenshot</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deposits.length === 0 ? (
            <tr><td colSpan="5" className="text-center p-4">No pending deposits</td></tr>
          ) : (
            deposits.map(d => (
              <tr key={d._id} className="border-t">
                <td className="p-2">{d.user?.username || d.user}</td>
                <td className="p-2">{d.amount}</td>
                <td className="p-2">
                  {d.notes && d.notes.startsWith('http') ? (
                    <a href={d.notes} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                  ) : (
                    d.notes || 'N/A'
                  )}
                </td>
                <td className="p-2">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleAction(d._id, 'approve')}
                  >Approve</button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleAction(d._id, 'decline')}
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

export default DepositTable; 