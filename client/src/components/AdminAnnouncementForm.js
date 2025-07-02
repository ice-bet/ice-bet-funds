import React, { useState } from 'react';
import axios from 'axios';

const AdminAnnouncementForm = () => {
  const [message, setMessage] = useState('');
  const [expiry, setExpiry] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await axios.post(
        '/api/announcements',
        { message, expiry: expiry ? new Date(expiry).toISOString() : undefined },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus('Announcement posted!');
      setMessage('');
      setExpiry('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to post announcement.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Post New Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Announcement message..."
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
        <div>
          <label className="block mb-1">Expiry (optional):</label>
          <input
            type="datetime-local"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
      {status && <div className="mt-4 text-center text-blue-700">{status}</div>}
    </div>
  );
};

export default AdminAnnouncementForm; 