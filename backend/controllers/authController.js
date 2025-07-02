import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;

function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex');
}

export const register = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    let referredBy = null;
    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (refUser) {
        referredBy = refUser.referralCode;
        // Optionally increment referral count or handle rewards here
      }
    }
    const newUser = new User({
      username,
      email,
      password,
      referralCode: generateReferralCode(),
      referredBy,
      balance: 2 // Welcome bonus
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { username: newUser.username, email: newUser.email, balance: newUser.balance, isAdmin: newUser.isAdmin, referralCode: newUser.referralCode } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: user.username, email: user.email, balance: user.balance, isAdmin: user.isAdmin, referralCode: user.referralCode } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, isAdmin: true });
    if (!user) return res.status(400).json({ message: 'Invalid admin credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid admin credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: user.username, email: user.email, isAdmin: true } });
  } catch (err) {
    res.status(500).json({ message: 'Admin login failed', error: err.message });
  }
}; 