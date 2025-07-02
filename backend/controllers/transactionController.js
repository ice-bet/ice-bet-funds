import Transaction from '../models/transaction.js';
import User from '../models/user.js';

// User submits deposit request
export const depositRequest = async (req, res) => {
  try {
    const { amount, screenshotUrl } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount,
      status: 'pending',
      notes: screenshotUrl
    });
    await transaction.save();
    res.status(201).json({ message: 'Deposit request submitted', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Deposit failed', error: err.message });
  }
};

// User submits withdrawal request
export const withdrawRequest = async (req, res) => {
  try {
    const { amount, bankInfo } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const user = await User.findById(req.user.id);
    if (!user || user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    user.balance -= amount;
    await user.save();
    const transaction = new Transaction({
      user: req.user.id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      notes: bankInfo
    });
    await transaction.save();
    res.status(201).json({ message: 'Withdrawal request submitted', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Withdrawal failed', error: err.message });
  }
};

// Admin views all pending transactions
export const getPending = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' }).populate('user', 'username email');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending transactions', error: err.message });
  }
};

// Admin approves a transaction
export const approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });
    if (transaction.type === 'deposit') {
      const user = await User.findById(transaction.user);
      user.balance += transaction.amount;
      await user.save();
    }
    transaction.status = 'approved';
    transaction.adminAction = 'approved';
    await transaction.save();
    res.json({ message: 'Transaction approved', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

// Admin declines a transaction
export const declineTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });
    if (transaction.type === 'withdrawal') {
      // Refund user
      const user = await User.findById(transaction.user);
      user.balance += transaction.amount;
      await user.save();
    }
    transaction.status = 'declined';
    transaction.adminAction = 'declined';
    await transaction.save();
    res.json({ message: 'Transaction declined', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Decline failed', error: err.message });
  }
};

// Get transaction history for user or admin
export const getHistory = async (req, res) => {
  try {
    let filter = {};
    if (!req.user.isAdmin) {
      filter.user = req.user.id;
    }
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
}; 