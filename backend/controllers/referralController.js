import User from '../models/user.js';

const POLARBEAR_TIERS = [
  { rank: 1, name: 'Ant Polarbear', needed: 1, reward: 0.5 },
  { rank: 2, name: 'Squirrel Polarbear', needed: 5, reward: 1 },
  { rank: 3, name: 'Beaver Polarbear', needed: 15, reward: 2 },
  { rank: 4, name: 'Otter Polarbear', needed: 35, reward: 3 },
  { rank: 5, name: 'Fox Polarbear', needed: 70, reward: 5 },
  { rank: 6, name: 'Lynx Polarbear', needed: 120, reward: 12 },
  { rank: 7, name: 'Owl Polarbear', needed: 200, reward: 20 },
  { rank: 8, name: 'Leopard Polarbear', needed: 350, reward: 35 },
  { rank: 9, name: 'Eagle Polarbear', needed: 500, reward: 60 },
  { rank: 10, name: 'Dragon Polarbear', needed: 700, reward: 100 }
];

// Get user's referral status, code, rank, and progress
export const getReferralStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const referrals = await User.find({ referredBy: user.referralCode });
    const referralCount = referrals.length;
    let currentTier = POLARBEAR_TIERS[0];
    for (const tier of POLARBEAR_TIERS) {
      if (referralCount >= tier.needed) currentTier = tier;
    }
    res.json({
      referralCode: user.referralCode,
      referralCount,
      polarbearRank: currentTier.rank,
      polarbearName: currentTier.name,
      nextTier: POLARBEAR_TIERS.find(t => t.rank === currentTier.rank + 1) || null,
      referrals: referrals.map(r => ({ username: r.username, email: r.email }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch referral status', error: err.message });
  }
};

// Admin views all users and their referral stats
export const getAllReferrals = async (req, res) => {
  try {
    const users = await User.find();
    const data = await Promise.all(users.map(async user => {
      const referrals = await User.find({ referredBy: user.referralCode });
      let currentTier = POLARBEAR_TIERS[0];
      for (const tier of POLARBEAR_TIERS) {
        if (referrals.length >= tier.needed) currentTier = tier;
      }
      return {
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        referralCount: referrals.length,
        polarbearRank: currentTier.rank,
        polarbearName: currentTier.name
      };
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all referrals', error: err.message });
  }
}; 