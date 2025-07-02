import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/transactions/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTransactions(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan="5" className="text-center p-4">No transactions found</td></tr>
          ) : (
            transactions.map(tx => (
              <tr key={tx._id} className="border-t">
                <td className="p-2 capitalize">{tx.type}</td>
                <td className="p-2">{tx.amount}</td>
                <td className="p-2">{tx.status}</td>
                <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="p-2">{tx.notes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory; 