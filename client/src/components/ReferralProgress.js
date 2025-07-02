import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReferralProgress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/referrals/status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch referral status');
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div className="text-red-600">{error || 'No data'}</div>;

  const { referralCode, referralCount, polarbearRank, polarbearName, nextTier } = data;
  const progress = nextTier ? Math.min(100, Math.round((referralCount / nextTier.needed) * 100)) : 100;

  return (
    <div className="bg-white p-6 rounded shadow mt-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Referral Progress</h2>
      <div className="mb-2">Your Referral Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{referralCode}</span></div>
      <div className="mb-2">Current Rank: <span className="font-semibold">{polarbearName} (Tier {polarbearRank})</span></div>
      <div className="mb-2">Referrals: <span className="font-semibold">{referralCount}</span></div>
      {nextTier ? (
        <div className="mb-2">
          Next Tier: <span className="font-semibold">{nextTier.name} (Need {nextTier.needed} total)</span>
          <div className="w-full bg-gray-200 rounded h-4 mt-2">
            <div
              className="bg-blue-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">{referralCount} / {nextTier.needed} referrals</div>
        </div>
      ) : (
        <div className="mb-2 text-green-700 font-bold">Max Tier Achieved!</div>
      )}
    </div>
  );
};

export default ReferralProgress; 