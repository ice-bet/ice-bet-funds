import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [data, setData] = useState({ wins: [], referrals: [], bets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/leaderboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch leaderboard');
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">🏆 Top Wins</h3>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2">User</th>
                <th className="p-2">Wins</th>
              </tr>
            </thead>
            <tbody>
              {data.wins.length === 0 ? (
                <tr><td colSpan="2" className="text-center p-4">No data</td></tr>
              ) : (
                data.wins.map((u, i) => (
                  <tr key={u.username} className="border-t">
                    <td className="p-2">{i + 1}. {u.username}</td>
                    <td className="p-2">{u.wins}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">👥 Top Referrals</h3>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2">User</th>
                <th className="p-2">Referrals</th>
              </tr>
            </thead>
            <tbody>
              {data.referrals.length === 0 ? (
                <tr><td colSpan="2" className="text-center p-4">No data</td></tr>
              ) : (
                data.referrals.map((u, i) => (
                  <tr key={u.username} className="border-t">
                    <td className="p-2">{i + 1}. {u.username}</td>
                    <td className="p-2">{u.referrals}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">💰 Top Bettors</h3>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2">User</th>
                <th className="p-2">Total Bets</th>
              </tr>
            </thead>
            <tbody>
              {data.bets.length === 0 ? (
                <tr><td colSpan="2" className="text-center p-4">No data</td></tr>
              ) : (
                data.bets.map((u, i) => (
                  <tr key={u.username} className="border-t">
                    <td className="p-2">{i + 1}. {u.username}</td>
                    <td className="p-2">{u.bets}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 