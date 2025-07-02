import React, { useState } from 'react';
import axios from 'axios';

const plans = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
];

const InvestmentForm = () => {
  const [amount, setAmount] = useState('');
  const [plan, setPlan] = useState(plans[0].value);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await axios.post(
        '/api/investments/invest',
        { amount, plan: `${plan} days`, days: plan },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus('Investment started!');
      setAmount('');
      setPlan(plans[0].value);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Investment failed.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Start New Investment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount to invest"
          className="w-full border rounded px-3 py-2"
          required
        />
        <select
          value={plan}
          onChange={e => setPlan(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          {plans.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Investing...' : 'Invest'}
        </button>
      </form>
      {status && <div className="mt-4 text-center text-blue-700">{status}</div>}
    </div>
  );
};

export default InvestmentForm; 