import React, { useState } from 'react';
import axios from 'axios';

const WithdrawalForm = ({ balance }) => {
  const [amount, setAmount] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await axios.post(
        '/api/transactions/withdraw',
        { amount, bankInfo },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus('Withdrawal request submitted and pending admin approval.');
      setAmount('');
      setBankInfo('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Withdrawal failed.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Withdraw Coins</h2>
      <div className="mb-2">Balance: <span className="font-semibold">{balance} Coins</span></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          min="1"
          max={balance}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount to withdraw"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          value={bankInfo}
          onChange={e => setBankInfo(e.target.value)}
          placeholder="Bank details (Name, Account Number, Bank)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Withdrawal'}
        </button>
      </form>
      {status && <div className="mt-4 text-center text-blue-700">{status}</div>}
    </div>
  );
};

export default WithdrawalForm; 