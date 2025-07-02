import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdminChatModeration = ({ room = 'global' }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/chat/${room}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch messages');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/chat/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMessages();
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-lg mx-auto flex flex-col h-[500px]">
      <h2 className="text-lg font-bold mb-2">Admin Chat Moderation ({room})</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages yet.</div>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className="mb-2 flex items-center justify-between group">
              <div>
                <span className="font-semibold text-blue-700">{msg.username}</span>
                <span className="text-xs text-gray-500 ml-2">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                <div className="ml-2">{msg.message}</div>
              </div>
              <button
                className="ml-4 text-red-600 font-bold opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDelete(msg._id)}
                title="Delete message"
              >
                Delete
              </button>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AdminChatModeration; 