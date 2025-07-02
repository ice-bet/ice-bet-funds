import Investment from '../models/investment.js';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';

// User invests in a plan
export const invest = async (req, res) => {
  try {
    const { amount, plan, days } = req.body;
    if (!amount || amount <= 0 || !plan || !days) return res.status(400).json({ message: 'Invalid input' });
    const user = await User.findById(req.user.id);
    if (!user || user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    user.balance -= amount;
    await user.save();
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const investment = new Investment({
      user: user._id,
      amount,
      plan,
      startDate: now,
      endDate,
      status: 'active',
      penalty: 0,
      earnings: 0
    });
    await investment.save();
    await Transaction.create({ user: user._id, type: 'investment', amount, status: 'completed', notes: `Invested in ${plan}` });
    res.status(201).json({ message: 'Investment started', investment });
  } catch (err) {
    res.status(500).json({ message: 'Investment failed', error: err.message });
  }
};

// User withdraws early (30% penalty)
export const withdrawEarly = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findById(id);
    if (!investment || investment.user.toString() !== req.user.id) return res.status(404).json({ message: 'Investment not found' });
    if (investment.status !== 'active') return res.status(400).json({ message: 'Investment not active' });
    const now = new Date();
    if (now >= investment.endDate) return res.status(400).json({ message: 'Investment already matured' });
    const penalty = Math.round(investment.amount * 0.3 * 100) / 100;
    const refund = investment.amount - penalty;
    investment.status = 'penalized';
    investment.penalty = penalty;
    await investment.save();
    const user = await User.findById(investment.user);
    user.balance += refund;
    await user.save();
    await Transaction.create({ user: user._id, type: 'penalty', amount: penalty, status: 'completed', notes: 'Early investment withdrawal penalty' });
    await Transaction.create({ user: user._id, type: 'withdrawal', amount: refund, status: 'completed', notes: 'Early investment withdrawal refund' });
    res.json({ message: `Withdrawn early with 30% penalty. Refunded: ${refund} coins`, investment });
  } catch (err) {
    res.status(500).json({ message: 'Early withdrawal failed', error: err.message });
  }
};

// Admin marks investment as matured and credits earnings
export const matureInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { earnings } = req.body;
    const investment = await Investment.findById(id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    if (investment.status !== 'active') return res.status(400).json({ message: 'Investment not active' });
    investment.status = 'matured';
    investment.earnings = earnings || 0;
    await investment.save();
    const user = await User.findById(investment.user);
    user.balance += investment.amount + investment.earnings;
    await user.save();
    await Transaction.create({ user: user._id, type: 'bonus', amount: investment.earnings, status: 'completed', notes: 'Investment matured earnings' });
    await Transaction.create({ user: user._id, type: 'withdrawal', amount: investment.amount, status: 'completed', notes: 'Investment matured principal' });
    res.json({ message: 'Investment matured and paid out', investment });
  } catch (err) {
    res.status(500).json({ message: 'Mature failed', error: err.message });
  }
};

// User views own investments
export const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch investments', error: err.message });
  }
};

// Admin views all investments
export const getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all investments', error: err.message });
  }
}; 