import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const GameChat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axios.post('/api/chat/send', { message, room }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-lg mx-auto flex flex-col h-[400px]">
      <h2 className="text-lg font-bold mb-2">🗨️ {room.charAt(0).toUpperCase() + room.slice(1)} Chat</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages yet.</div>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className="mb-2">
              <span className="font-semibold text-blue-700">{msg.username}</span>
              <span className="text-xs text-gray-500 ml-2">{new Date(msg.createdAt).toLocaleTimeString()}</span>
              <div className="ml-2">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={`Type your message in ${room}...`}
          className="flex-1 border rounded-l px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >Send</button>
      </form>
    </div>
  );
};

export default GameChat; 